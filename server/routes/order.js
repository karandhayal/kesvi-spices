const router = require('express').Router();
const Order = require('../models/Order');
const Coupon = require('../models/Coupon');
const Cart = require('../models/Cart');

// ==========================================
// 1. ADMIN ROUTE (Fetches all orders)
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

    if (!coupon) return res.status(404).json({ success: false, message: "Invalid Coupon Code" });

    if (cartTotal < coupon.minOrder) {
      return res.status(400).json({ success: false, message: `Minimum order of ₹${coupon.minOrder} required` });
    }

    let discountAmount = coupon.type === 'percent' 
      ? (cartTotal * coupon.value) / 100 
      : coupon.value;

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
// 3. CREATE ORDER
// ==========================================
router.post('/create', async (req, res) => {
  const { 
    userId, 
    orderItems, 
    shippingAddress, 
    paymentMethod, 
    paymentResult, 
    couponCode,
    isPaid // ✅ NEW: Receive payment status from Frontend
  } = req.body;

  try {
    // ------------------------------------------
    // A. PRODUCT VERIFICATION
    // ------------------------------------------
    let finalProducts = orderItems;
    
    // If no items sent but userID exists, try fetching from DB Cart (Safety fallback)
    if ((!finalProducts || finalProducts.length === 0) && userId) {
      const cart = await Cart.findOne({ userId });
      if (cart) finalProducts = cart.products;
    }

    if (!finalProducts || finalProducts.length === 0) {
      return res.status(400).json({ success: false, message: "No items in order" });
    }

    // ------------------------------------------
    // B. RECALCULATE TOTALS (Security)
    // ------------------------------------------
    let subtotal = 0;
    finalProducts.forEach(item => {
      const price = Number(item.price) || 0;     
      const qty = Number(item.quantity) || 1;    
      subtotal += (price * qty);
    });

    const safeSubtotal = Number(subtotal) || 0;

    // ✅ SHIPPING LOGIC: Free > 399, else 60
    let shippingFee = safeSubtotal > 399 ? 0 : 60; 
    
    // ✅ COD FEE LOGIC
    let codFee = 0;
    if (paymentMethod === 'COD') {
        codFee = 50;
    }

    let discount = 0;

    // ------------------------------------------
    // C. APPLY COUPON
    // ------------------------------------------
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode, isActive: true });
      if (coupon && safeSubtotal >= coupon.minOrder) {
        discount = coupon.type === 'percent' 
          ? (safeSubtotal * coupon.value) / 100 
          : coupon.value;
      }
    }

    // ✅ FINAL CALCULATION (Includes COD Fee)
    const finalAmount = Math.floor(Math.max(0, safeSubtotal + shippingFee + codFee - discount));

    // ------------------------------------------
    // D. DETERMINE STATUS
    // ------------------------------------------
    let initialStatus = 'Processing';
    if (paymentMethod === 'UPI_MANUAL') {
        initialStatus = 'Pending Verification';
    }

    // ------------------------------------------
    // E. CREATE & SAVE ORDER
    // ------------------------------------------
    const newOrder = new Order({
      userId: userId || null, 
      
      // Map 'shippingAddress' to 'address'
      address: shippingAddress, 
      
      orderItems: finalProducts,
      
      // Map 'safeSubtotal' to 'subtotal'
      subtotal: safeSubtotal,    
      
      // Map 'finalAmount' to 'amount'
      amount: finalAmount,     
      
      shippingPrice: shippingFee,  
      
      discount: Math.floor(discount),
      couponCode,
      
      paymentMethod,
      paymentResult: paymentResult || {}, 
      
      status: initialStatus,
      
      // ✅ FIX: Use the 'isPaid' flag sent from frontend (for Razorpay) or default to false
      isPaid: isPaid || false 
    });

    const savedOrder = await newOrder.save();

    // ------------------------------------------
    // F. CLEANUP
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
// 4. UPDATE ORDER
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
// 5. GET USER ORDERS
// ==========================================
router.get('/:userId', async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json(err);
  }
});
// ==========================================
// 6. GUEST TRACK ORDER (Public)
// ==========================================
router.post('/track', async (req, res) => {
  try {
    const { orderId, phone } = req.body;

    // 1. Basic Validation
    if (!orderId || !phone) {
      return res.status(400).json({ success: false, message: "Order ID and Phone are required" });
    }

    // 2. Find Order
    // We use try/catch inside here specifically because if 'orderId' 
    // is not a valid MongoDB ObjectId (e.g. user typed "123"), Mongoose will crash.
    let order;
    try {
       order = await Order.findById(orderId);
    } catch (err) {
       // If ID format is wrong, just return not found
       return res.status(404).json({ success: false, message: "Order not found" });
    }

    // 3. Check if order exists
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // 4. Verify Phone Number (Security)
    // We compare the phone stored in the order address vs the one entered
    // We use String() to ensure we don't fail on number vs string types
    const orderPhone = order.address?.phone || "";
    
    if (String(orderPhone) !== String(phone)) {
      return res.status(401).json({ success: false, message: "Phone number does not match this order" });
    }

    // 5. Return Success
    res.status(200).json(order);

  } catch (err) {
    console.error("Tracking Error:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});
module.exports = router;