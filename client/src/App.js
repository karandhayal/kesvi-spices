import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import axios from 'axios';

// 1. Import Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// 2. Import Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Cart from './pages/Cart';
import Shop from './pages/shop'; 
import Distributor from './pages/Distributor';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import AdminDashboard from './pages/AdminDashboard';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Terms from './pages/Terms';
import ProductDetails from './pages/ProductDetails';

// 3. Import Context Providers
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext'; 

// --- GLOBAL API CONFIGURATION ---
// STEP A: Uncomment "localhost" when working on your computer
// axios.defaults.baseURL = "http://localhost:5000"; 

// STEP B: Uncomment "Render URL" when pushing to GitHub/Vercel
axios.defaults.baseURL = "https://kesvi-spices.onrender.com"; 

axios.defaults.withCredentials = true; 

// --- HELPER COMPONENT FOR LAYOUT LOGIC ---
// This component sits inside the Router, so useLocation works here
const AppContent = () => {
  const location = useLocation();

  // Check if the current route is the admin panel
  // used .startsWith in case you have /admin/products, /admin/orders etc.
  const isAdminRoute = location.pathname.startsWith('/admin'); 

  return (
    <div className="min-h-screen bg-kesvi-bg font-sans selection:bg-kesvi-accent selection:text-white">
      {/* Only show Navbar if NOT on admin page */}
      {!isAdminRoute && <Navbar />}

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/distributor" element={<Distributor />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/privacypolicy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/product/:slug" element={<ProductDetails />} />
        </Routes>
      </main>

      {/* Only show Footer if NOT on admin page */}
      {!isAdminRoute && <Footer />}
    </div>
  );
};

// --- MAIN APP COMPONENT ---
function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <AppContent />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;