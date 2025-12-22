import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios'; // Import Axios

// 1. Import Components
import Navbar from './components/Navbar';

// 2. Import Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Cart from './pages/Cart';
import Shop from './pages/Shop'; 
import Distributor from './pages/Distributor';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';

// 3. Import Context Providers
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext'; 

// --- GLOBAL API CONFIGURATION ---
// STEP A: Uncomment "localhost" when working on your computer
// axios.defaults.baseURL = "http://localhost:5000"; 

// STEP B: Uncomment "Render URL" when pushing to GitHub/Vercel
axios.defaults.baseURL = "https://kesvi-spices-backend.onrender.com"; 

axios.defaults.withCredentials = true; // Important for secure cookies

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="min-h-screen bg-kesvi-bg font-sans selection:bg-kesvi-accent selection:text-white">
            
            <Navbar />

            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/distributor" element={<Distributor />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/order-success" element={<OrderSuccess />} />
              </Routes>
            </main>

          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;