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
    couponCode 
  } = req.body;

  try {
    // ------------------------------------------
    // A. PRODUCT VERIFICATION
    // ------------------------------------------
    let finalProducts = orderItems;
    
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
    let shippingFee = safeSubtotal > 499 ? 0 : 50; 
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

    const finalAmount = Math.floor(Math.max(0, safeSubtotal + shippingFee - discount));

    // ------------------------------------------
    // D. DETERMINE STATUS
    // ------------------------------------------
    let initialStatus = 'Processing';
    if (paymentMethod === 'UPI_MANUAL') {
        initialStatus = 'Pending Verification';
    }

    // ------------------------------------------
    // E. CREATE & SAVE ORDER (FIXED MAPPING)
    // ------------------------------------------
    const newOrder = new Order({
      userId: userId || null, 
      
      // ✅ FIX 1: Map 'shippingAddress' to 'address' (Required by Schema)
      address: shippingAddress, 
      
      orderItems: finalProducts,
      
      // ✅ FIX 2: Map 'safeSubtotal' to 'subtotal' (Required by Schema)
      subtotal: safeSubtotal,    
      
      // ✅ FIX 3: Map 'finalAmount' to 'amount' (Required by Schema)
      amount: finalAmount,     
      
      // Keeping these just in case your schema uses them too, 
      // but 'subtotal' and 'amount' are the critical ones.
      shippingPrice: shippingFee,  
      
      discount: Math.floor(discount),
      couponCode,
      
      paymentMethod,
      paymentResult: paymentResult || {}, 
      
      status: initialStatus,
      isPaid: false 
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
    // Return the specific error message from Mongoose
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

module.exports = router;