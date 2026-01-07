const router = require('express').Router();
const Order = require('../models/Order');
const Coupon = require('../models/Coupon');
const Cart = require('../models/Cart');

// ==========================================
// 1. ADMIN ROUTE (MUST BE AT THE TOP!)
// ==========================================
router.get('/all', async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json(err);
    }
});

// ==========================================
// 2. COUPON VALIDATION
// ==========================================
router.post('/validate-coupon', async (req, res) => {
  try {
    const { code, cartTotal } = req.body;
    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });

    if (!coupon) {
      return res.status(404).json({ success: false, message: "Invalid Coupon Code" });
    }

    if (cartTotal < coupon.minOrder) {
      return res.status(400).json({ success: false, message: `Minimum order of ₹${coupon.minOrder} required` });
    }

    let discountAmount = 0;
    if (coupon.type === 'percent') {
      discountAmount = (cartTotal * coupon.value) / 100;
    } else {
      discountAmount = coupon.value;
    }

    if (discountAmount > cartTotal) discountAmount = cartTotal;

    res.status(200).json({ 
      success: true, 
      discount: Math.floor(discountAmount), 
      code: coupon.code,
      message: "Coupon Applied!" 
    });

  } catch (err) {
    res.status(500).json(err);
  }
});

// ==========================================
// 3. CREATE ORDER (FIXED FOR GUEST & FRONTEND)
// ==========================================
router.post('/create', async (req, res) => {
  const { userId, orderItems, shippingAddress, paymentMethod, couponCode, upiDiscount } = req.body;

  try {
    // A. Identify Products (Payload first, then DB)
    let finalProducts = orderItems;

    if ((!finalProducts || finalProducts.length === 0) && userId) {
      const cart = await Cart.findOne({ userId });
      if (cart) finalProducts = cart.products;
    }

    if (!finalProducts || finalProducts.length === 0) {
      return res.status(400).json({ success: false, message: "No items in order" });
    }

    // B. Recalculate Subtotal
    let subtotal = 0;
    finalProducts.forEach(item => {
      const price = Number(item.price) || 0;     
      const qty = Number(item.quantity) || 1;    
      subtotal += (price * qty);
    });

    // C. Calculate Shipping
    const safeSubtotal = Number(subtotal) || 0;
    let shippingFee = safeSubtotal > 499 ? 0 : 50; 
    let discount = 0;

    // D. Apply Coupon
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode, isActive: true });
      if (coupon && safeSubtotal >= coupon.minOrder) {
        if (coupon.type === 'percent') {
          discount = (safeSubtotal * coupon.value) / 100;
        } else {
          discount = coupon.value;
        }
      }
    }

    // E. Apply UPI Discount
    if (paymentMethod === 'UPI' && upiDiscount) {
       const extraOff = (safeSubtotal * 0.05); 
       discount += extraOff;
    }

    // F. Final Amount
    const finalAmount = Math.floor(Math.max(0, safeSubtotal + shippingFee - discount));

    // G. Create Order Object
    // Ensure your Order Model uses 'shippingAddress' and 'orderItems'
    const newOrder = new Order({
      userId: userId || null, 
      orderItems: finalProducts, 
      shippingAddress: shippingAddress,
      
      amount: finalAmount,      
      subtotal: safeSubtotal,
      discount: Math.floor(discount),
      shippingFee,
      
      couponCode,
      paymentMethod,
      paymentStatus: 'Pending'
    });

    const savedOrder = await newOrder.save();

    // H. Clear Cart (Only if logged in)
    if (userId) {
        await Cart.findOneAndDelete({ userId }); 
    }

    res.status(200).json({ success: true, order: savedOrder });

  } catch (err) {
    console.error("Order Error:", err); 
    res.status(500).json({ success: false, message: err.message });
  }
});

// ==========================================
// 4. UPDATE ORDER (Admin)
// ==========================================
router.put("/:id", async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedOrder);
  } catch (err) {
    res.status(500).json(err);
  }
});

// ==========================================
// 5. GET USER ORDERS (MUST BE LAST)
// ==========================================
router.get('/:userId', async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;