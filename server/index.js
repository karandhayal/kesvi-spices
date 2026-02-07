require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const mongoose = require("mongoose"); // ✅ Added mongoose requirement
const connectDB = require("./db");

const app = express();
const storeRoute = require('./routes/store');

/* ================================
   1. CORS CONFIG (VERY IMPORTANT)
================================ */

const allowedOrigins = [
  "https://parosa.co.in",
  "https://www.parosa.co.in",
  "http://localhost:3000",
  "https://kesvi-spices.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log("Blocked by CORS:", origin);
        callback(null, false);
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
    ],
  })
);

// ✅ FIX: Use Regex (/.*/) instead of string "*" to prevent Cloud Run crash
app.options(/.*/, cors());

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

/* ==========================================
   ✅ NEW: MEMBERSHIP REQUEST MODEL & SCHEMA
   (Defined here for quick integration)
========================================== */
const membershipRequestSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  isApproved: { type: Boolean, default: false },
}, { 
  timestamps: true 
});

// Check if model exists to prevent overwrite error during hot reloads
const MembershipRequest = mongoose.models.MembershipRequest || mongoose.model('MembershipRequest', membershipRequestSchema);

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

    const newRequest = new MembershipRequest({
      fullName,
      phone,
      address
    });

    const savedRequest = await newRequest.save();
    res.status(201).json(savedRequest);
  } catch (error) {
    console.error("Error creating membership request:", error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// 2. GET: Fetch all requests (For the Admin Dashboard)
app.get('/api/membership-requests', async (req, res) => {
  try {
    // Sort by newest first
    const requests = await MembershipRequest.find({}).sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    console.error("Error fetching requests:", error);
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