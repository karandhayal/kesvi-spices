require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./db');

const app = express();

// Connect Database
connectDB();

// --- MIDDLEWARE ---
app.use(express.json());
app.use(helmet());

// CORS Configuration
// This allows your Frontend (Localhost OR Vercel) to talk to this Backend
app.use(cors({
  origin: [
    'http://localhost:3000',               // Local React
    'https://kesvi-spices.vercel.app',     // Your Future Vercel Domain (Update this later if different)
    'https://kesvi-brand.vercel.app'
    'https://parosa.co.in'
    'https://www.parosa.co.in'       // Alternative common name
  ],
  credentials: true
}));

// --- ROUTES ---
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/productRoutes')); 
app.use('/api/cart', require('./routes/cart')); 
app.use('/api/orders', require('./routes/order'));
app.use('/api/payment', require('./routes/payment'));
app.use('/api/shipping', require('./routes/shipping'));
// Base Route (Health Check)
app.get('/', (req, res) => {
  res.send('Kesvi API is live.');
});

// Start Server (Dynamic Port for Render)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));