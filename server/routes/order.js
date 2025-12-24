const router = require('express').Router();
const Order = require('../models/Order');
const Coupon = require('../models/Coupon');
const Cart = require('../models/Cart');

// ==========================================
// 1. ADMIN ROUTE (MUST BE AT THE TOP!)
// ==========================================
// If this is below /:userId, it will break.
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

    // Calculate Discount
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
// 3. CREATE ORDER (With Calculations)
// ==========================================
router.post('/create', async (req, res) => {
  const { userId, address, paymentMethod, couponCode, upiDiscount } = req.body;

  try {
    // A. Get Cart
    const cart = await Cart.findOne({ userId });
    if (!cart || !cart.products || cart.products.length === 0) {
      return res.status(400).send("Cart is empty");
    }

    // B. Calculate Subtotal
    let subtotal = 0;
    cart.products.forEach(item => {
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

    // G. Create Order
    const newOrder = new Order({
      userId,
      products: cart.products,
      amount: finalAmount,      
      subtotal: safeSubtotal,
      discount: Math.floor(discount),
      couponCode,
      shippingFee,
      address,
      paymentMethod,
      paymentStatus: 'Pending' // Use proper case
    });

    const savedOrder = await newOrder.save();

    // H. Clear Cart (Uncomment when ready)
    // await Cart.findOneAndDelete({ userId }); 

    res.status(200).json({ success: true, order: savedOrder });

  } catch (err) {
    console.error("Order Creation Error:", err); 
    res.status(500).send("Order creation failed: " + err.message);
  }
});

// ==========================================
// 4. UPDATE ORDER (Required for Admin)
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
// 5. GET USER ORDERS (Must be LAST)
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