const router = require('express').Router();
const Order = require('../models/Order');
const Coupon = require('../models/Coupon');
const Cart = require('../models/Cart');
const sendOrderConfirmation = require('../utils/sendEmail'); // Import Email Utility

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
// 3. CREATE ORDER (Aligned with New Schema)
// ==========================================
router.post('/create', async (req, res) => {
  const { 
    userId, 
    orderItems, 
    shippingAddress, 
    paymentMethod, 
    paymentResult, // <--- Receive UTR/Transaction ID
    couponCode, 
    upiDiscount 
  } = req.body;

  try {
    // ------------------------------------------
    // A. PRODUCT VERIFICATION
    // ------------------------------------------
    let finalProducts = orderItems;
    
    // Fallback to DB Cart if payload empty (for logged-in users)
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
    
    // Shipping: Free if > 499, else 50
    let shippingFee = safeSubtotal > 499 ? 0 : 50; 
    let discount = 0;

    // ------------------------------------------
    // C. APPLY COUPON & DISCOUNTS
    // ------------------------------------------
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode, isActive: true });
      if (coupon && safeSubtotal >= coupon.minOrder) {
        discount = coupon.type === 'percent' 
          ? (safeSubtotal * coupon.value) / 100 
          : coupon.value;
      }
    }

    // UPI Discount Logic (Only if method is UPI)
    if ((paymentMethod === 'UPI' || paymentMethod === 'UPI_MANUAL') && upiDiscount) {
       // Optional: Add logic here if you want to enforce the 5% discount server-side
       // const extraOff = (safeSubtotal * 0.05);
       // discount += extraOff;
    }

    // Final Math
    const finalAmount = Math.floor(Math.max(0, safeSubtotal + shippingFee - discount));

    // ------------------------------------------
    // D. DETERMINE STATUS
    // ------------------------------------------
    let initialStatus = 'Processing';
    let initialPayStatus = 'Pending';

    // If Manual UPI, we mark it as 'Pending Verification' so Admin knows to check UTR
    if (paymentMethod === 'UPI_MANUAL') {
        initialStatus = 'Pending Verification';
    }

    // ------------------------------------------
    // E. CREATE & SAVE ORDER
    // ------------------------------------------
    const newOrder = new Order({
      userId: userId || null, 
      
      // ✅ FIX: Map to new Schema names
      shippingAddress: shippingAddress, 
      orderItems: finalProducts,
      
      // ✅ FIX: Map numeric values to new Schema names
      itemsPrice: safeSubtotal,    // was 'subtotal'
      shippingPrice: shippingFee,  // was 'shippingFee'
      totalPrice: finalAmount,     // was 'amount'
      
      discount: Math.floor(discount),
      couponCode,
      
      paymentMethod,
      
      // ✅ FIX: Save the UTR / Transaction ID
      paymentResult: paymentResult || {}, 
      
      status: initialStatus,
      isPaid: false // Always false initially for COD/Manual UPI
    });

    const savedOrder = await newOrder.save();

    // ------------------------------------------
    // F. CLEANUP & NOTIFY
    // ------------------------------------------
    
    // 1. Clear Cart
    if (userId) {
        await Cart.findOneAndDelete({ userId }); 
    }

    // 2. Send Email (Non-blocking)
    sendOrderConfirmation(savedOrder); 

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