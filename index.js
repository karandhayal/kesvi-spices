require('dotenv').config({ quiet: true });

// Global crash handlers for clearer runtime diagnostics
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION:', err && (err.stack || err));
});

process.on('unhandledRejection', (reason) => {
  console.error('UNHANDLED REJECTION:', reason);
});

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const { connectDB } = require("./db");
const { protect, adminOnly } = require('./middleware/authMiddleware');
const MembershipRequest = require('./models/MembershipRequest');
const withMongoId = require('./utils/withMongoId');

const app = express();
const storeRoute = require('./routes/store');

/* ================================
   1. CORS CONFIG (VERY IMPORTANT)
================================ */

const allowedOrigins = [
  "https://parosa.co.in",
  "https://www.parosa.co.in",
  "https://darkseagreen-lemur-822131.hostingersite.com",
  "http://localhost:3000",
  "http://localhost:5173"
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error('Blocked by CORS:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// Use a safe preflight handler for all routes (Express 5 compatible)
app.options(/.*/, cors(corsOptions));

// Startup environment diagnostics (do NOT print secrets)
console.log('Starting Parosa backend...');
console.log('NODE_ENV:', process.env.NODE_ENV || 'not set');
console.log('PORT:', process.env.PORT || 'not set, using fallback');
console.log('DB_HOST configured:', Boolean(process.env.DB_HOST));
console.log('DB_NAME configured:', Boolean(process.env.DB_NAME));
console.log('DB_USER configured:', Boolean(process.env.DB_USER));
console.log('JWT_SECRET configured:', Boolean(process.env.JWT_SECRET));
console.log('RAZORPAY_KEY_ID configured:', Boolean(process.env.RAZORPAY_KEY_ID));
console.log('SHIPROCKET_EMAIL configured:', Boolean(process.env.SHIPROCKET_EMAIL));

/* ================================
   2. SECURITY + BODY PARSING
================================ */

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

app.use(express.json());

/* ================================
   3. DATABASE CONNECTION
================================ */

// Attempt to connect to MySQL; do not exit process here so Hostinger can keep the app running.
connectDB();

/* ================================
   4. HEALTH CHECK & WELCOME ROUTES
================================ */

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Parosa API is running",
    env: process.env.NODE_ENV || "development",
  });
});

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API healthy",
    mysqlConfigured: Boolean(process.env.DB_HOST && process.env.DB_NAME),
    jwtConfigured: Boolean(process.env.JWT_SECRET),
  });
});

/* ================================
   5. DEBUG ROUTE (TEMPORARY)
================================ */

app.get("/debug/products", async (req, res) => {
  try {
    const Product = require("./models/Product");
    const withMongoId = require('./utils/withMongoId');
    const products = await Product.findAll();
    res.json({ count: products.length, products: products.map(withMongoId) });
  } catch (err) {
    console.error("Debug products error:", err);
    res.status(500).json({ message: "Debug failed", error: err.message });
  }
});

/* ================================
   6. API ROUTES
================================ */

app.use("/api/auth", require("./routes/auth"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/cart", require("./routes/cart"));
app.use("/api/orders", require("./routes/order"));
app.use("/api/payment", require("./routes/payment"));
app.use("/api/shipping", require("./routes/shipping"));
app.use('/api/stores', storeRoute);
app.use('/api/admin/seed', require('./routes/adminSeed'));

/* ==========================================
   ✅ NEW: MEMBERSHIP REQUEST ROUTES
========================================== */

// 1. POST: Create a new request (For the User Form)
app.post('/api/membership-requests', async (req, res) => {
  try {
    const {
      fullName,
      phone,
      address,
      quantityPerMonthKg,
      locationLatitude,
      locationLongitude,
      locationAccuracy,
      locationCapturedAt,
    } = req.body;
    
    const parsedQuantity = Number(quantityPerMonthKg);

    if (!fullName || !phone || !address) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (!Number.isFinite(parsedQuantity) || parsedQuantity <= 0) {
      return res.status(400).json({ message: 'Quantity per month must be greater than 0.' });
    }

    const existingPending = await MembershipRequest.findOne({ where: { phone, status: 'pending' } });
    if (existingPending) {
      return res.status(409).json({
        message: 'A pending membership request already exists for this phone number.',
      });
    }

    const savedRequest = await MembershipRequest.create({
      fullName,
      phone,
      address,
      quantityPerMonthKg: parsedQuantity,
      locationLatitude: locationLatitude !== undefined && locationLatitude !== null && locationLatitude !== '' ? Number(locationLatitude) : null,
      locationLongitude: locationLongitude !== undefined && locationLongitude !== null && locationLongitude !== '' ? Number(locationLongitude) : null,
      locationAccuracy: locationAccuracy !== undefined && locationAccuracy !== null && locationAccuracy !== '' ? Number(locationAccuracy) : null,
      locationCapturedAt: locationCapturedAt || null,
    });

    res.status(201).json(withMongoId(savedRequest));
  } catch (error) {
    console.error("Error creating membership request:", error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// 2. GET: Public stats (For Organic page slots)
app.get('/api/membership-requests/stats', async (req, res) => {
  try {
    const totalSlots = Number(process.env.MEMBERSHIP_TOTAL_SLOTS || 100);

    const [acceptedCount, pendingCount] = await Promise.all([
      MembershipRequest.count({ where: { status: 'accepted' } }),
      MembershipRequest.count({ where: { status: 'pending' } }),
    ]);

    const slotsLeft = Math.max(totalSlots - acceptedCount, 0);

    res.json({
      totalSlots,
      acceptedCount,
      pendingCount,
      slotsLeft,
    });
  } catch (error) {
    console.error("Error fetching membership stats:", error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// 3. GET: Fetch all requests (For the Admin Dashboard)
app.get('/api/membership-requests', protect, adminOnly, async (req, res) => {
  try {
    // Sort by newest first
    const requests = await MembershipRequest.findAll({ order: [['createdAt', 'DESC']] });
    res.json(requests.map(withMongoId));
  } catch (error) {
    console.error("Error fetching requests:", error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// 4. PUT: Update request status (Admin Only)
app.put('/api/membership-requests/:id/status', protect, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;
    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value.' });
    }

    const request = await MembershipRequest.findByPk(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Membership request not found.' });
    }

    if (status === 'accepted') {
      request.status = 'accepted';
      request.acceptedAt = new Date();
      request.rejectedAt = null;
    }

    if (status === 'rejected') {
      request.status = 'rejected';
      request.rejectedAt = new Date();
      request.acceptedAt = null;
    }

    await request.save();
    res.json(withMongoId(request));
  } catch (error) {
    console.error("Error updating membership request status:", error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

/* ================================
   7. GLOBAL ERROR HANDLER
================================ */

app.use((err, req, res, next) => {
  console.error("Unhandled Server Error:", err);
  res.status(500).json({
    message: "Internal Server Error",
    error: err.message,
  });
});

/* ================================
   8. START SERVER
================================ */

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
