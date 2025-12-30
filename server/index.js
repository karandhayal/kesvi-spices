require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./db');

const app = express();

// --- 1. CORS CONFIGURATION (MUST BE TOP) ---
// We explicitly handle the Preflight (OPTIONS) check
const allowedOrigins = [
  'https://parosa.co.in',
  'https://www.parosa.co.in',
  'http://localhost:3000',
  'https://kesvi-spices.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    } else {
      console.log("Blocked by CORS:", origin); // Logs to Cloud Run
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"]
}));

// --- 2. SECURITY MIDDLEWARE (HELMET FIX) ---
app.use(helmet({
  crossOriginResourcePolicy: false, // <--- CRITICAL FIX: Allows images/data to be loaded cross-origin
}));

app.use(express.json());

// --- 3. CONNECT DATABASE ---
connectDB(); 

// --- 4. ROUTES ---
// Simple Health Check (Put this before other routes)
app.get('/', (req, res) => {
  res.status(200).send('API is running...');
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/productRoutes')); 
app.use('/api/cart', require('./routes/cart')); 
app.use('/api/orders', require('./routes/order'));
app.use('/api/payment', require('./routes/payment'));
app.use('/api/shipping', require('./routes/shipping'));

// --- 5. ERROR HANDLING (To prevent crashes from hiding errors) ---
app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  res.status(500).json({ message: "Internal Server Error", error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));