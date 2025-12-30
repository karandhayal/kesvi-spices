require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./db');

const app = express();

// --- 1. CONNECT DATABASE ---
connectDB();

// --- 2. CORS CONFIGURATION (MUST BE FIRST) ---
// We define the allowed origins in a variable for clarity
const allowedOrigins = [
  'http://localhost:3000',             // Local React Development
  'http://localhost:5173',             // Local Vite Development (just in case)
  'https://kesvi-spices.vercel.app',   // Vercel deployment
  'https://kesvi-brand.vercel.app',
  'https://parosa.co.in',              // Your Main Domain
  'https://www.parosa.co.in'           // Your Main Domain (www version)
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, or Postman)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      // If the origin is in our list, allow it
      callback(null, true);
    } else {
      // If not, block it
      console.log("Blocked by CORS:", origin); // Helpful for debugging in Cloud Run logs
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Important for cookies/sessions
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Handle "Preflight" requests (OPTIONS) for all routes
app.options('*', cors(corsOptions));

// --- 3. SECURITY & PARSING MIDDLEWARE ---
app.use(helmet());
app.use(express.json());

// --- 4. ROUTES ---
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/productRoutes')); 
app.use('/api/cart', require('./routes/cart')); 
app.use('/api/orders', require('./routes/order'));
app.use('/api/payment', require('./routes/payment'));
app.use('/api/shipping', require('./routes/shipping'));

// Base Route (Health Check)
app.get('/', (req, res) => {
  res.status(200).send('Kesvi API is live on Cloud Run.');
});

// --- 5. START SERVER ---
// Cloud Run provides the PORT via process.env.PORT (usually 8080)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));