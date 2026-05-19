const router = require('express').Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');

// Helper to lazily create Razorpay instance and fail fast if env vars missing
const getRazorpayInstance = () => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error('Razorpay environment variables are not configured');
  }

  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  });
};

const resolveProduct = async (item) => {
  const productId = item.productId || item.product || item._id || item.id;
  const parsedId = Number(productId);
  let product = null;

  if (Number.isInteger(parsedId) && parsedId > 0) {
    product = await Product.findByPk(parsedId);
  }

  if (!product && item.slug) {
    product = await Product.findOne({ where: { slug: item.slug } });
  }

  return product;
};

// ==========================================
// 1. CREATE ORDER (Initiate Payment)
// ==========================================
router.post('/create-order', async (req, res) => {
  try {
    const { orderItems, couponCode, paymentMethod } = req.body;

    if (!orderItems || !Array.isArray(orderItems) || orderItems.length === 0) {
      return res.status(400).json({ success: false, message: "Order items are required" });
    }

    let subtotal = 0;
    for (const item of orderItems) {
      const quantity = Number(item.quantity) || 0;
      if (quantity <= 0) {
        return res.status(400).json({ success: false, message: "Invalid quantity" });
      }

      const product = await resolveProduct(item);

      if (!product) {
        return res.status(400).json({ success: false, message: "Product not found" });
      }

      let unitPrice = Number(product.price) || 0;
      if (item.variant && Array.isArray(product.variants) && product.variants.length > 0) {
        const matchedVariant = product.variants.find(v => v.weight === item.variant);
        if (matchedVariant) {
          if (matchedVariant.inStock === false) {
            return res.status(400).json({ success: false, message: "Selected variant is out of stock" });
          }
          unitPrice = Number(matchedVariant.price) || unitPrice;
        }
      }

      if (Number.isFinite(product.countInStock) && product.countInStock < quantity) {
        return res.status(400).json({ success: false, message: "Insufficient stock" });
      }

      subtotal += unitPrice * quantity;
    }

    const safeSubtotal = Number(subtotal) || 0;
    const shippingFee = safeSubtotal > 399 ? 0 : 60;
    const codFee = paymentMethod === 'COD' ? 50 : 0;

    let discount = 0;
    if (couponCode) {
      const coupon = await Coupon.findOne({
        where: { code: couponCode.toUpperCase(), isActive: true }
      });
      if (coupon && safeSubtotal >= Number(coupon.minOrderValue || 0)) {
        discount = coupon.discountType === 'percent'
          ? (safeSubtotal * Number(coupon.discountValue)) / 100
          : Number(coupon.discountValue);
      }
    }

    const finalAmount = Math.floor(Math.max(0, safeSubtotal + shippingFee + codFee - discount));

    // Razorpay expects amount in "Paise" (1 INR = 100 Paise)
    // We round it to handle decimal issues
    const options = {
      amount: Math.round(finalAmount * 100), 
      currency: "INR",
      receipt: "receipt_" + Date.now(),
      payment_capture: 1 // Auto capture payment
    };

    let razorpay;
    try {
      razorpay = getRazorpayInstance();
    } catch (e) {
      console.error('Razorpay not configured:', e.message);
      return res.status(500).json({ success: false, message: 'Payment service is not configured' });
    }

    const order = await razorpay.orders.create(options);

    // Send order details to frontend
    res.json({
      success: true,
      id: order.id,
      currency: order.currency,
      amount: order.amount,
      amountInRupees: finalAmount
    });

  } catch (error) {
    console.error("Razorpay Create Order Error:", error);
    res.status(500).json({ success: false, message: "Could not initiate payment" });
  }
});

// ==========================================
// 2. VERIFY PAYMENT (Security Check)
// ==========================================
router.post('/verify-payment', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // 1. Construct the expected signature
    // Formula: order_id + "|" + payment_id
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    // 2. Generate HMAC SHA256 signature using your Secret Key
    if (!process.env.RAZORPAY_KEY_SECRET) {
      console.error('Razorpay secret not configured for verify-payment');
      return res.status(500).json({ success: false, message: 'Payment service is not configured' });
    }

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    // 3. Compare signatures
    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      // Payment is Valid
      res.json({ 
        success: true, 
        message: "Payment verified successfully" 
      });
    } else {
      // Signature mismatch - Potential Fraud
      res.status(400).json({ 
        success: false, 
        message: "Invalid Payment Signature" 
      });
    }

  } catch (error) {
    console.error("Razorpay Verify Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

module.exports = router;