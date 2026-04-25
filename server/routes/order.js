const router = require('express').Router();
const Order = require('../models/Order');
const Coupon = require('../models/Coupon');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const crypto = require('crypto');
const mongoose = require('mongoose');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const resolveProductFromItem = async (item) => {
  const productId = item.productId || item.product || item._id || item.id;
  const slug = item.slug;

  let product = null;
  if (productId && mongoose.isValidObjectId(productId)) {
    product = await Product.findById(productId);
  }

  if (!product && slug) {
    product = await Product.findOne({ slug });
  }

  if (!product && productId && !mongoose.isValidObjectId(productId)) {
    product = await Product.findOne({ _id: productId }).catch(() => null);
  }

  return { product, productId };
};

const buildOrderItemsFromRequest = async (items) => {
  const normalizedItems = [];
  let subtotal = 0;

  for (const item of items) {
    const quantity = Number(item.quantity) || 0;
    if (quantity <= 0) {
      throw new Error('Invalid quantity for order item');
    }

    const { product, productId } = await resolveProductFromItem(item);
    if (!product) {
      throw new Error('Product not found for one or more items');
    }

    let unitPrice = Number(product.price) || 0;
    if (item.variant && Array.isArray(product.variants) && product.variants.length > 0) {
      const matchedVariant = product.variants.find(v => v.weight === item.variant);
      if (matchedVariant) {
        if (matchedVariant.inStock === false) {
          throw new Error('Selected variant is out of stock');
        }
        unitPrice = Number(matchedVariant.price) || unitPrice;
      }
    }

    if (Number.isFinite(product.countInStock) && product.countInStock < quantity) {
      throw new Error(`Insufficient stock for ${product.name}`);
    }

    const resolvedName = item.name || item.title || product.name || 'Product';
    const resolvedTitle = item.title || item.name || product.name || 'Product';
    const resolvedProductId = productId || product._id;

    normalizedItems.push({
      productId: resolvedProductId ? String(resolvedProductId) : undefined,
      product: resolvedProductId ? String(resolvedProductId) : undefined,
      name: resolvedName,
      title: resolvedTitle,
      quantity,
      price: unitPrice,
      variant: item.variant,
      image: item.image || product.image
    });

    subtotal += unitPrice * quantity;
  }

  return { normalizedItems, subtotal: Number(subtotal) || 0 };
};

// ==========================================
// 1. ADMIN ROUTE (Fetches all orders)
// ==========================================
router.get('/all', protect, adminOnly, async (req, res) => {
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
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature
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

    const { normalizedItems, subtotal } = await buildOrderItemsFromRequest(finalProducts);

    // ------------------------------------------
    // B. RECALCULATE TOTALS (Security)
    // ------------------------------------------
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
      
      orderItems: normalizedItems,
      
      // Map 'safeSubtotal' to 'subtotal'
      subtotal: safeSubtotal,    
      
      // Map 'finalAmount' to 'amount'
      amount: finalAmount,     
      
      shippingFee: shippingFee,  
      
      discount: Math.floor(discount),
      couponCode,
      
      paymentMethod,
      paymentResult: paymentResult || {}, 
      
      status: initialStatus,
      
      isPaid: false,
      paymentStatus: paymentMethod === 'COD' ? 'Pending' : 'Pending',
      paymentProvider: paymentMethod === 'COD' ? 'cod' : undefined
    });

    if (paymentMethod === 'ONLINE') {
      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return res.status(400).json({ success: false, message: 'Missing Razorpay verification data' });
      }

      const duplicatePayment = await Order.findOne({ razorpayPaymentId: razorpay_payment_id });
      if (duplicatePayment) {
        return res.status(409).json({ success: false, message: 'Duplicate payment detected', order: duplicatePayment });
      }

      const body = `${razorpay_order_id}|${razorpay_payment_id}`;
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest('hex');

      if (expectedSignature !== razorpay_signature) {
        return res.status(400).json({ success: false, message: 'Invalid Razorpay signature' });
      }

      newOrder.isPaid = true;
      newOrder.paymentStatus = 'Paid';
      newOrder.paymentProvider = 'razorpay';
      newOrder.razorpayOrderId = razorpay_order_id;
      newOrder.razorpayPaymentId = razorpay_payment_id;
      newOrder.paidAt = new Date();
    }

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
router.put("/:id", protect, adminOnly, async (req, res) => {
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
// 5. GET LOGGED-IN USER ORDERS (Protected)
// ==========================================
router.get('/myorders', protect, async (req, res) => {
  try {
    const userId = req.user?._id ? String(req.user._id) : null;
    if (!userId) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const orders = await Order.find({ userId }).sort({ createdAt: -1 });

    const safeOrders = orders.map(order => ({
      _id: order._id,
      orderItems: order.orderItems,
      amount: order.amount,
      status: order.status,
      paymentMethod: order.paymentMethod,
      isPaid: order.isPaid,
      createdAt: order.createdAt,
      address: order.address,
      shiprocketOrderId: order.shiprocketOrderId,
      awbCode: order.awbCode,
      courierName: order.courierName,
      trackingUrl: order.trackingUrl,
      shippingStatus: order.shippingStatus,
      shippedAt: order.shippedAt,
      deliveredAt: order.deliveredAt
    }));

    res.status(200).json(safeOrders);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

// ==========================================
// 6. GET USER ORDERS BY USER ID (Legacy)
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
// 7. GUEST TRACK ORDER (Public)
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

    // 5. Return Customer-Safe Data Only
    res.status(200).json({
      _id: order._id,
      orderItems: order.orderItems,
      amount: order.amount,
      status: order.status,
      paymentMethod: order.paymentMethod,
      isPaid: order.isPaid,
      createdAt: order.createdAt,
      awbCode: order.awbCode,
      courierName: order.courierName,
      trackingUrl: order.trackingUrl,
      shippingStatus: order.shippingStatus,
      shippedAt: order.shippedAt,
      deliveredAt: order.deliveredAt
    });

  } catch (err) {
    console.error("Tracking Error:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});
module.exports = router;
