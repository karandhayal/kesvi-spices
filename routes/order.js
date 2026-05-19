const router = require('express').Router();
const Order = require('../models/Order');
const Coupon = require('../models/Coupon');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const crypto = require('crypto');
const withMongoId = require('../utils/withMongoId');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const resolveProductFromItem = async (item) => {
  const productId = item.productId || item.product || item._id || item.id;
  const slug = item.slug;
  const parsedId = Number(productId);

  let product = null;
  if (Number.isInteger(parsedId) && parsedId > 0) {
    product = await Product.findByPk(parsedId);
  }

  if (!product && slug) {
    product = await Product.findOne({ where: { slug } });
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
    const resolvedProductId = productId || product.id;

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
    const orders = await Order.findAll({ order: [['createdAt', 'DESC']] });
    res.status(200).json(orders.map(withMongoId));
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
    const coupon = await Coupon.findOne({ where: { code: code.toUpperCase(), isActive: true } });

    if (!coupon) return res.status(404).json({ success: false, message: 'Invalid Coupon Code' });

    const minOrderValue = Number(coupon.minOrderValue || 0);
    if (cartTotal < minOrderValue) {
      return res.status(400).json({ success: false, message: `Minimum order of ₹${minOrderValue} required` });
    }

    let discountAmount = coupon.discountType === 'percent'
      ? (cartTotal * Number(coupon.discountValue)) / 100
      : Number(coupon.discountValue);

    if (discountAmount > cartTotal) discountAmount = cartTotal;

    res.status(200).json({
      success: true,
      discount: Math.floor(discountAmount),
      code: coupon.code,
      message: 'Coupon Applied!'
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
    let finalProducts = orderItems;

    if ((!finalProducts || finalProducts.length === 0) && userId) {
      const cart = await Cart.findOne({ where: { userId } });
      if (cart) finalProducts = cart.items || [];
    }

    if (!finalProducts || finalProducts.length === 0) {
      return res.status(400).json({ success: false, message: 'No items in order' });
    }

    const { normalizedItems, subtotal } = await buildOrderItemsFromRequest(finalProducts);
    const safeSubtotal = Number(subtotal) || 0;

    let shippingFee = safeSubtotal > 399 ? 0 : 60;
    let codFee = paymentMethod === 'COD' ? 50 : 0;
    let discount = 0;

    if (couponCode) {
      const coupon = await Coupon.findOne({ where: { code: couponCode.toUpperCase(), isActive: true } });
      const minOrderValue = Number(coupon?.minOrderValue || 0);
      if (coupon && safeSubtotal >= minOrderValue) {
        discount = coupon.discountType === 'percent'
          ? (safeSubtotal * Number(coupon.discountValue)) / 100
          : Number(coupon.discountValue);
      }
    }

    const finalAmount = Math.floor(Math.max(0, safeSubtotal + shippingFee + codFee - discount));

    let initialStatus = 'Processing';
    if (paymentMethod === 'UPI_MANUAL') {
      initialStatus = 'Pending Verification';
    }

    const newOrder = Order.build({
      userId: userId || null,
      address: shippingAddress,
      orderItems: normalizedItems,
      subtotal: safeSubtotal,
      amount: finalAmount,
      shippingFee,
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

      const duplicatePayment = await Order.findOne({ where: { razorpayPaymentId: razorpay_payment_id } });
      if (duplicatePayment) {
        return res.status(409).json({ success: false, message: 'Duplicate payment detected', order: withMongoId(duplicatePayment) });
      }

      if (!process.env.RAZORPAY_KEY_SECRET) {
        console.error('Razorpay secret not configured for order verification');
        return res.status(500).json({ success: false, message: 'Payment service is not configured' });
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

    if (userId) {
      await Cart.destroy({ where: { userId } });
    }

    res.status(200).json({ success: true, order: withMongoId(savedOrder) });
  } catch (err) {
    console.error('Order Creation Error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ==========================================
// 4. UPDATE ORDER
// ==========================================
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const allowedStatuses = ['Pending Verification', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
    const updates = { ...req.body };

    if (updates.status && !allowedStatuses.includes(updates.status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    if (updates.status === 'Delivered') {
      updates.deliveredAt = new Date();
      updates.shippingStatus = 'Delivered';
    }

    if (updates.status === 'Cancelled') {
      updates.cancelledAt = new Date();
      updates.shippingStatus = 'Cancelled';
    }

    if (updates.status === 'Shipped') {
      updates.shippedAt = updates.shippedAt || new Date();
      updates.shippingStatus = updates.shippingStatus || 'Shipped';
    }

    const updatedOrder = await Order.findByPk(req.params.id);
    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    await updatedOrder.update(updates);
    res.status(200).json(withMongoId(updatedOrder));
  } catch (err) {
    res.status(500).json(err);
  }
});

// ==========================================
// 5. GET LOGGED-IN USER ORDERS (Protected)
// ==========================================
router.get('/myorders', protect, async (req, res) => {
  try {
    const userId = req.user?.id ? String(req.user.id) : req.user?._id ? String(req.user._id) : null;
    if (!userId) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const orders = await Order.findAll({ where: { userId }, order: [['createdAt', 'DESC']] });

    const safeOrders = orders.map(order => ({
      _id: String(order.id),
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
      expectedDeliveryDate: order.expectedDeliveryDate,
      shippedAt: order.shippedAt,
      deliveredAt: order.deliveredAt
    }));

    res.status(200).json(safeOrders);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
});

// ==========================================
// 6. GET USER ORDERS BY USER ID (Legacy)
// ==========================================
router.get('/:userId', async (req, res) => {
  try {
    const orders = await Order.findAll({ where: { userId: req.params.userId }, order: [['createdAt', 'DESC']] });
    res.status(200).json(orders.map(withMongoId));
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

    if (!orderId || !phone) {
      return res.status(400).json({ success: false, message: 'Order ID and Phone are required' });
    }

    const order = await Order.findByPk(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const orderPhone = order.address?.phone || '';
    if (String(orderPhone) !== String(phone)) {
      return res.status(401).json({ success: false, message: 'Phone number does not match this order' });
    }

    res.status(200).json({
      _id: String(order.id),
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
      expectedDeliveryDate: order.expectedDeliveryDate,
      shippedAt: order.shippedAt,
      deliveredAt: order.deliveredAt
    });
  } catch (err) {
    console.error('Tracking Error:', err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

module.exports = router;
