import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MapPin, CreditCard, Banknote, Tag, ArrowRight, Loader } from 'lucide-react';

const Checkout = () => {
  const { cartItems, cartTotal, loading: cartLoading } = useCart();
  const { user } = useAuth(); 
  const navigate = useNavigate();

  // --- STATE ---
  const [formData, setFormData] = useState({
    fullName: '', phone: '', email: '', 
    street: '', city: '', state: '', pincode: ''
  });

  // Payment/Order State
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [couponMessage, setCouponMessage] = useState('');

  // --- 1. AUTO-FILL USER DATA ---
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: user.name || '',
        email: user.email || '',
        phone: user.phone || '' // Auto-fill if available, but not mandatory to verify
      }));
    }
  }, [user]);

  // --- 2. ORDER HANDLERS ---
  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    setCouponMessage("Checking...");
    try {
      const res = await axios.post('/api/orders/validate-coupon', { code: couponCode, cartTotal });
      if (res.data.success) {
        setDiscount(res.data.discount);
        setAppliedCoupon(res.data.code);
        setCouponMessage(`✅ ${res.data.message}`);
      }
    } catch (err) {
      setDiscount(0);
      setAppliedCoupon(null);
      setCouponMessage(`❌ ${err.response?.data?.message || "Invalid Coupon"}`);
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    
    // Basic Validation (Optional)
    if (!formData.phone || formData.phone.length < 10) {
      return alert("Please enter a valid phone number.");
    }
    
    setIsSubmitting(true);
    
    // Recalculate totals for backend safety
    const SHIPPING_FEE = cartTotal > 499 ? 0 : 50;
    const UPI_DISCOUNT = paymentMethod === 'UPI' ? Math.floor(cartTotal * 0.05) : 0;
    const finalTotal = cartTotal + SHIPPING_FEE - discount - UPI_DISCOUNT;

    try {
      const payload = {
        userId: user?._id || null, // Allow guest checkout if user is null
        address: formData,
        paymentMethod,
        couponCode: appliedCoupon,
        upiDiscount: paymentMethod === 'UPI'
      };

      const res = await axios.post('/api/orders/create', payload);

      if (res.data.success) {
        if (paymentMethod === 'COD') {
          navigate('/order-success', { state: { orderId: res.data.order._id } });
        } else {
            // ... Payment Gateway Logic ...
            const payRes = await axios.post('/api/payment/initiate', {
                orderId: res.data.order._id,
                amount: finalTotal,
                userId: user?._id
            });
            if(payRes.data.success) window.location.href = payRes.data.url;
        }
      }
    } catch (err) {
      console.error(err);
      alert("Order Failed: " + (err.response?.data?.message || "Server Error"));
      setIsSubmitting(false);
    }
  };

  // CALCULATION VARS
  const SHIPPING_FEE = cartTotal > 499 ? 0 : 50; 
  const UPI_DISCOUNT = paymentMethod === 'UPI' ? Math.floor(cartTotal * 0.05) : 0;
  const finalTotal = cartTotal + SHIPPING_FEE - discount - UPI_DISCOUNT;

  if (cartLoading) return <div className="p-10 text-center">Loading...</div>;
  if (cartItems.length === 0) return <div className="p-10 text-center">Your cart is empty.</div>;

  return (
    <div className="min-h-screen bg-kesvi-bg pt-24 pb-12 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* LEFT: DETAILS */}
        <div>
          <h2 className="text-2xl font-serif text-parosa-dark mb-6 flex items-center gap-2">
            <MapPin className="text-parosa-accent" /> Shipping Details
          </h2>
          
          <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-4">
            
            {/* PERSONAL INFO */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleInputChange} className="border p-3 rounded w-full" required />
              <input name="email" type="email" placeholder="Email (Optional)" value={formData.email} onChange={handleInputChange} className="border p-3 rounded w-full" />
            </div>

            {/* --- SIMPLIFIED PHONE INPUT (NO OTP) --- */}
            <div>
               <input 
                 name="phone" 
                 type="tel"
                 placeholder="Phone Number" 
                 value={formData.phone} 
                 onChange={handleInputChange} 
                 className="border p-3 rounded w-full" 
                 required 
               />
               <p className="text-[10px] text-gray-400 mt-1">We will use this to contact you for delivery.</p>
            </div>

            {/* ADDRESS */}
            <input name="street" placeholder="Address (House No, Street)" value={formData.street} onChange={handleInputChange} className="border p-3 rounded w-full" required />
            <div className="grid grid-cols-2 gap-4">
              <input name="city" placeholder="City" value={formData.city} onChange={handleInputChange} className="border p-3 rounded w-full" required />
              <input name="state" placeholder="State" value={formData.state} onChange={handleInputChange} className="border p-3 rounded w-full" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <input name="pincode" placeholder="Pincode" value={formData.pincode} onChange={handleInputChange} className="border p-3 rounded w-full" required />
              <input name="country" value="India" disabled className="border p-3 rounded w-full bg-gray-100" />
            </div>
          </form>

          {/* PAYMENT METHOD */}
          <h2 className="text-2xl font-serif text-parosa-dark mt-10 mb-6 flex items-center gap-2">
            <CreditCard className="text-parosa-accent" /> Payment Method
          </h2>
          <div className="space-y-4">
            <label className={`flex items-center justify-between p-4 border rounded cursor-pointer ${paymentMethod === 'UPI' ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}>
              <div className="flex items-center gap-3">
                <input type="radio" name="payment" value="UPI" checked={paymentMethod === 'UPI'} onChange={() => setPaymentMethod('UPI')} />
                <span className="font-medium">UPI / Online</span>
              </div>
              <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded font-bold">Save 5%</span>
            </label>
            <label className={`flex items-center justify-between p-4 border rounded cursor-pointer ${paymentMethod === 'COD' ? 'border-slate-500 bg-gray-50' : 'border-gray-200'}`}>
              <div className="flex items-center gap-3">
                <input type="radio" name="payment" value="COD" checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')} />
                <span className="font-medium">Cash on Delivery</span>
              </div>
              <Banknote size={20} className="text-gray-500"/>
            </label>
          </div>
        </div>

        {/* RIGHT: SUMMARY */}
        <div className="bg-white p-8 shadow-md border border-gray-100 h-fit sticky top-24">
          <h3 className="text-xl font-serif text-parosa-dark mb-6 border-b pb-4">Order Summary</h3>
          
          <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
            {cartItems.map(item => (
              <div key={item.productId} className="flex justify-between text-sm">
                <span>{item.title} x {item.quantity}</span>
                <span className="font-medium">₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>

          <div className="flex gap-2 mb-6">
              <div className="relative flex-1">
                <Tag className="absolute left-3 top-3 text-gray-400" size={16} />
                <input type="text" placeholder="Coupon Code" className="border pl-10 p-2 w-full rounded text-sm uppercase" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} />
              </div>
              <button type="button" onClick={handleApplyCoupon} className="bg-gray-800 text-white px-4 py-2 text-xs uppercase font-bold">Apply</button>
          </div>
          {couponMessage && <p className="text-xs text-center mb-4 font-medium">{couponMessage}</p>}

          <div className="space-y-2 border-t pt-4 text-sm text-gray-600">
            <div className="flex justify-between"><span>Subtotal</span><span>₹{cartTotal}</span></div>
            <div className="flex justify-between"><span>Shipping</span>{SHIPPING_FEE === 0 ? <span className="text-green-600">Free</span> : <span>₹{SHIPPING_FEE}</span>}</div>
            {discount > 0 && <div className="flex justify-between text-green-600"><span>Coupon</span><span>- ₹{discount}</span></div>}
            {UPI_DISCOUNT > 0 && <div className="flex justify-between text-green-600"><span>Online Discount</span><span>- ₹{UPI_DISCOUNT}</span></div>}
            <div className="flex justify-between text-xl font-serif text-parosa-dark border-t mt-4 pt-4"><span>Total</span><span>₹{finalTotal}</span></div>
          </div>

          <button 
            type="submit" 
            form="checkout-form"
            disabled={isSubmitting} 
            className={`w-full py-4 mt-8 flex items-center justify-center gap-2 uppercase tracking-widest text-xs font-bold transition-colors bg-parosa-dark text-white hover:bg-parosa-accent`}
          >
            {isSubmitting ? <Loader className="animate-spin" /> : (
              <>
                {paymentMethod === 'COD' ? 'Place COD Order' : 'Proceed to Pay'} 
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;