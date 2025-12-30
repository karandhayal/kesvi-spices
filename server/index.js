require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const connectDB = require("./db");

const app = express();

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
        callback(null, false); // ❗ never throw error here
      }
    },
    credentials: true, // remove later if not using cookies
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
    ],
  })
);

// ✅ REQUIRED for browsers + Cloud Run
app.options("*", cors());

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

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
