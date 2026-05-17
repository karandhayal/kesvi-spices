require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const connectDB = require("./db");
const { protect, adminOnly } = require('./middleware/authMiddleware');
const MembershipRequest = require('./models/MembershipRequest');

const app = express();
const storeRoute = require('./routes/store');

/* ================================
   1. CORS CONFIG (VERY IMPORTANT)
================================ */

const allowedOrigins = [
  'https://parosa.co.in',
  'https://www.parosa.co.in',
  'http://localhost:3000',
  'http://localhost:5173'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.options('*', cors());

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

connectDB();

/* ================================
   4. HEALTH CHECK
================================ */

app.get("/", (req, res) => {
  res.status(200).send("API is running...");
});

/* ================================
   5. DEBUG ROUTE (TEMPORARY)
================================ */

app.get("/debug/products", async (req, res) => {
  try {
    const Product = require("./models/Product");
    const products = await Product.find({});
    res.json({ count: products.length, products });
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

/* ==========================================
   ✅ NEW: MEMBERSHIP REQUEST ROUTES
========================================== */

// 1. POST: Create a new request (For the User Form)
app.post('/api/membership-requests', async (req, res) => {
  try {
    const { fullName, phone, address } = req.body;
    
    if (!fullName || !phone || !address) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingPending = await MembershipRequest.findOne({
      phone,
      status: 'pending',
    });
    if (existingPending) {
      return res.status(409).json({
        message: 'A pending membership request already exists for this phone number.',
      });
    }

    const newRequest = new MembershipRequest({
      fullName,
      phone,
      address,
    });

    const savedRequest = await newRequest.save();
    res.status(201).json(savedRequest);
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
      MembershipRequest.countDocuments({ status: 'accepted' }),
      MembershipRequest.countDocuments({ status: 'pending' }),
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
    const requests = await MembershipRequest.find({}).sort({ createdAt: -1 });
    res.json(requests);
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

    const request = await MembershipRequest.findById(req.params.id);
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

    const updatedRequest = await request.save();
    res.json(updatedRequest);
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
   8. START SERVER (CLOUD RUN FIX)
================================ */

// 🔥 MUST be 8080 for Cloud Run
const PORT = process.env.PORT || 8080;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
