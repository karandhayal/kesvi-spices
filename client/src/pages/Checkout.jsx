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

  // --- STATE MANAGEMENT ---
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    phone: '',
    street: '',
    city: '',
    state: '',
    pincode: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('UPI'); // Default to UPI
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [couponMessage, setCouponMessage] = useState('');

  // --- SETTINGS ---
  const SHIPPING_FEE = cartTotal > 499 ? 0 : 50; 
  const UPI_DISCOUNT_PERCENT = 5; 

  const upiDiscountAmount = paymentMethod === 'UPI' 
    ? Math.floor(cartTotal * (UPI_DISCOUNT_PERCENT / 100)) 
    : 0;

  const finalTotal = cartTotal + SHIPPING_FEE - discount - upiDiscountAmount;

  // --- HANDLERS ---
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    setCouponMessage("Checking...");
    try {
      // CHANGED: Removed localhost
      const res = await axios.post('/api/orders/validate-coupon', {
        code: couponCode,
        cartTotal
      });
      
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
    setIsSubmitting(true);

    if (!formData.street || !formData.phone || !formData.pincode) {
      alert("Please fill in all address fields.");
      setIsSubmitting(false);
      return;
    }

    try {
      const payload = {
        userId: user?._id || localStorage.getItem("parosa_guest_id"),
        address: formData,
        paymentMethod,
        couponCode: appliedCoupon,
        upiDiscount: paymentMethod === 'UPI'
      };

      // CHANGED: Removed localhost
      const res = await axios.post('/api/orders/create', payload);

      if (res.data.success) {
        const order = res.data.order;

        if (paymentMethod === 'COD') {
          navigate('/order-success', { state: { orderId: order._id } });
        } else {
          try {
            // CHANGED: Removed localhost
            const paymentRes = await axios.post('/api/payment/initiate', {
              orderId: order._id,
              amount: finalTotal, 
              userId: user?._id || "guest"
            });
        
            if (paymentRes.data.success) {
              window.location.href = paymentRes.data.url;
            } else {
              alert("Payment initiation failed. Please try COD.");
              setIsSubmitting(false);
            }
          } catch (payErr) {
            console.error("Payment Gateway Error", payErr);
            alert("Could not connect to Payment Gateway.");
            setIsSubmitting(false);
          }
        }
      }
    } catch (err) {
      console.error("Order Error:", err);
      alert("Something went wrong placing the order.");
      setIsSubmitting(false);
    }
  };

  if (cartLoading) return <div className="p-10 text-center">Loading Checkout...</div>;
  if (cartItems.length === 0) return <div className="p-10 text-center">Your cart is empty.</div>;

  return (
    <div className="min-h-screen bg-kesvi-bg pt-24 pb-12 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* LEFT COLUMN: FORMS */}
        <div>
          <h2 className="text-2xl font-serif text-parosa-dark mb-6 flex items-center gap-2">
            <MapPin className="text-parosa-accent" /> Shipping Details
          </h2>
          
          <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleInputChange} className="border p-3 rounded w-full" required />
              <input name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleInputChange} className="border p-3 rounded w-full" required />
            </div>
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

          <h2 className="text-2xl font-serif text-parosa-dark mt-10 mb-6 flex items-center gap-2">
            <CreditCard className="text-parosa-accent" /> Payment Method
          </h2>

          <div className="space-y-4">
            <label className={`flex items-center justify-between p-4 border rounded cursor-pointer transition-all ${paymentMethod === 'UPI' ? 'border-parosa-accent bg-green-50' : 'border-gray-200'}`}>
              <div className="flex items-center gap-3">
                <input type="radio" name="payment" value="UPI" checked={paymentMethod === 'UPI'} onChange={() => setPaymentMethod('UPI')} />
                <span className="font-medium">Pay via UPI / Cards</span>
              </div>
              <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded font-bold">Save 5%</span>
            </label>

            <label className={`flex items-center justify-between p-4 border rounded cursor-pointer transition-all ${paymentMethod === 'COD' ? 'border-parosa-accent bg-gray-50' : 'border-gray-200'}`}>
              <div className="flex items-center gap-3">
                <input type="radio" name="payment" value="COD" checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')} />
                <span className="font-medium">Cash on Delivery</span>
              </div>
              <Banknote size={20} className="text-gray-500"/>
            </label>
          </div>
        </div>

        {/* RIGHT COLUMN: SUMMARY */}
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
               <input 
                 type="text" 
                 placeholder="Coupon Code" 
                 className="border pl-10 p-2 w-full rounded text-sm uppercase"
                 value={couponCode}
                 onChange={(e) => setCouponCode(e.target.value)}
               />
             </div>
             <button 
               type="button"
               onClick={handleApplyCoupon}
               className="bg-gray-800 text-white px-4 py-2 text-xs uppercase font-bold hover:bg-black"
             >
               Apply
             </button>
          </div>
          {couponMessage && <p className="text-xs text-center mb-4 font-medium">{couponMessage}</p>}

          <div className="space-y-2 border-t pt-4 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{cartTotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              {SHIPPING_FEE === 0 ? <span className="text-green-600">Free</span> : <span>₹{SHIPPING_FEE}</span>}
            </div>
            
            {discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Coupon Discount</span>
                <span>- ₹{discount}</span>
              </div>
            )}
            
            {upiDiscountAmount > 0 && (
               <div className="flex justify-between text-green-600 font-medium">
                 <span>Online Payment Discount (5%)</span>
                 <span>- ₹{upiDiscountAmount}</span>
               </div>
            )}

            <div className="flex justify-between text-xl font-serif text-parosa-dark border-t mt-4 pt-4">
              <span>Total to Pay</span>
              <span>₹{finalTotal}</span>
            </div>
          </div>

          <button 
            type="submit" 
            form="checkout-form"
            disabled={isSubmitting}
            className="w-full bg-parosa-dark text-white py-4 mt-8 flex items-center justify-center gap-2 uppercase tracking-widest text-xs font-bold hover:bg-parosa-accent transition-colors disabled:bg-gray-400"
          >
            {isSubmitting ? <Loader className="animate-spin" /> : (
              <>
                {paymentMethod === 'COD' ? 'Place COD Order' : 'Proceed to Pay'} <ArrowRight size={16} />
              </>
            )}
          </button>
          
          <div className="mt-4 flex justify-center gap-2 opacity-50">
             <span className="text-xs text-gray-400">Secure Payments via PhonePe</span>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Checkout;