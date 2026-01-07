const router = require('express').Router();
const Order = require('../models/Order');
const Coupon = require('../models/Coupon');
const Cart = require('../models/Cart');

// ==========================================
// 1. ADMIN ROUTE (MUST BE AT THE TOP!)
// ==========================================
// Fetches all orders for the Admin Dashboard
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
// 3. CREATE ORDER (FIXED & UPDATED)
// ==========================================
router.post('/create', async (req, res) => {
  // Destructure incoming data from Frontend
  const { 
    userId, 
    orderItems, 
    shippingAddress, // <--- Incoming variable name
    paymentMethod, 
    couponCode, 
    upiDiscount 
  } = req.body;

  try {
    // ------------------------------------------
    // A. IDENTIFY PRODUCTS (Payload vs DB)
    // ------------------------------------------
    let finalProducts = orderItems;

    // Fallback: If no items in payload, check DB (only for logged-in users)
    if ((!finalProducts || finalProducts.length === 0) && userId) {
      const cart = await Cart.findOne({ userId });
      if (cart) finalProducts = cart.products;
    }

    // If still no products, stop here.
    if (!finalProducts || finalProducts.length === 0) {
      return res.status(400).json({ success: false, message: "No items in order" });
    }

    // ------------------------------------------
    // B. RECALCULATE TOTALS (Server-Side Security)
    // ------------------------------------------
    let subtotal = 0;
    finalProducts.forEach(item => {
      const price = Number(item.price) || 0;     
      const qty = Number(item.quantity) || 1;    
      subtotal += (price * qty);
    });

    const safeSubtotal = Number(subtotal) || 0;
    
    // Shipping Logic: Free if > 499, else 50
    let shippingFee = safeSubtotal > 499 ? 0 : 50; 
    let discount = 0;

    // ------------------------------------------
    // C. APPLY COUPON
    // ------------------------------------------
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

    // ------------------------------------------
    // D. APPLY UPI DISCOUNT
    // ------------------------------------------
    if (paymentMethod === 'UPI' && upiDiscount) {
       const extraOff = (safeSubtotal * 0.05); 
       discount += extraOff;
    }

    // ------------------------------------------
    // E. FINAL CALCULATION
    // ------------------------------------------
    const finalAmount = Math.floor(Math.max(0, safeSubtotal + shippingFee - discount));

    // ------------------------------------------
    // F. CREATE ORDER OBJECT
    // ------------------------------------------
    const newOrder = new Order({
      userId: userId || null, // Allow NULL for Guest Checkout
      
      // ✅ VITAL FIX: Map 'shippingAddress' (frontend) to 'address' (database schema)
      address: shippingAddress, 
      
      orderItems: finalProducts,
      amount: finalAmount,      
      subtotal: safeSubtotal,
      discount: Math.floor(discount),
      shippingFee,
      
      couponCode,
      paymentMethod,
      paymentStatus: paymentMethod === 'COD' ? 'Pending' : 'Processing'
    });

    const savedOrder = await newOrder.save();

    // ------------------------------------------
    // G. CLEANUP (Clear Cart if User Logged In)
    // ------------------------------------------
    if (userId) {
        await Cart.findOneAndDelete({ userId }); 
    }

    res.status(200).json({ success: true, order: savedOrder });

  } catch (err) {
    console.error("Order Creation Error:", err); 
    res.status(500).json({ success: false, message: err.message });
  }
});

// ==========================================
// 4. UPDATE ORDER (Admin: Status Change)
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
// 5. GET USER ORDERS (MUST BE LAST ROUTE)
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