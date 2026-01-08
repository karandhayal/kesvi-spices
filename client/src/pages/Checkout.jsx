import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { QRCodeCanvas } from 'qrcode.react'; 
import { useCart } from '../context/CartContext'; 
import { CreditCard, Truck, Smartphone, ArrowRight, ShieldCheck } from 'lucide-react';

const Checkout = () => {
  const navigate = useNavigate();
  
  // --- GET DATA FROM CONTEXT ---
  const { cartItems, cartTotal, clearCart } = useCart(); 

  // --- STATE ---
  const [shippingFee, setShippingFee] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [couponCode, setCouponCode] = useState('');
  const [couponInput, setCouponInput] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [utrNumber, setUtrNumber] = useState(''); 
  const [loading, setLoading] = useState(false);
  
  // --- MERCHANT UPI DETAILS ---
  const MERCHANT_UPI_ID = "dhaya95877@barodampay"; 
  const MERCHANT_NAME = "DHAYAL INDUSTRIES";       

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India'
  });

  // --- CALCULATE SHIPPING (UPDATED) ---
  useEffect(() => {
    // If cart is empty, redirect back to shop
    if (cartItems.length === 0) {
      navigate('/cart');
      return;
    }

    // Logic: Free shipping if > 399, else 60
    const total = Number(cartTotal) || 0;
    setShippingFee(total > 399 ? 0 : 60); 
  }, [cartItems, cartTotal, navigate]);

  // --- COUPON HANDLER ---
  const handleApplyCoupon = async () => {
    if(!couponInput) return;
    try {
      const res = await axios.post('/api/orders/validate-coupon', {
        code: couponInput,
        cartTotal: cartTotal
      });
      if(res.data.success) {
        setDiscount(res.data.discount);
        setCouponCode(res.data.code);
        alert(res.data.message);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Invalid Coupon");
      setDiscount(0);
      setCouponCode('');
    }
  };

  // --- FINAL TOTAL CALCULATION ---
  const finalTotal = Math.max(0, (Number(cartTotal) || 0) + shippingFee - discount);

  // --- GENERATE UPI LINK ---
  const upiLink = `upi://pay?pa=${MERCHANT_UPI_ID}&pn=${MERCHANT_NAME}&am=${finalTotal}&cu=INR`;

  // --- SUBMIT ORDER ---
  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate Manual UPI
    if (paymentMethod === 'UPI_MANUAL' && !utrNumber) {
        alert("Please enter the UTR / Transaction ID after payment.");
        setLoading(false);
        return;
    }

    const orderPayload = {
      userId: localStorage.getItem('userId') || null, 
      orderItems: cartItems,
      shippingAddress: formData,
      paymentMethod,
      paymentResult: paymentMethod === 'UPI_MANUAL' ? { id: utrNumber, status: "Pending Verification" } : {},
      itemsPrice: cartTotal,
      shippingPrice: shippingFee,
      totalPrice: finalTotal,
      couponCode,
      upiDiscount: paymentMethod === 'UPI_MANUAL' 
    };

    try {
      const res = await axios.post('/api/orders/create', orderPayload);
      
      if (res.data.success) {
        // Optional: Clear cart logic here if not handled by backend/context
        // clearCart(); 

        // ✅ Navigate with URL Params so Success Page can read them
        let successUrl = `/order-success?id=${res.data.order._id}`;
        
        if(paymentMethod === 'UPI_MANUAL' && utrNumber) {
            successUrl += `&ref=${utrNumber}`;
        }
        
        navigate(successUrl); 
      }
    } catch (err) {
      console.error(err);
      alert("Order Failed: " + (err.response?.data?.message || "Server Error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-parosa-bg py-10 px-4 pt-28 md:pt-32 pb-24"> 
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
        
        {/* LEFT COLUMN: FORM */}
        <div>
          <h2 className="text-2xl font-serif text-parosa-dark mb-6 flex items-center gap-2">
            <Truck className="w-6 h-6" /> Shipping Details
          </h2>
          
          <div className="bg-white p-6 md:p-8 rounded-sm shadow-sm border border-gray-100">
            <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-5">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                 <div className="space-y-1">
                    <label className="text-xs uppercase font-bold text-gray-500 tracking-wider">Full Name</label>
                    <input 
                      required
                      type="text" 
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-sm focus:border-parosa-dark outline-none transition-colors"
                      value={formData.fullName}
                      onChange={e => setFormData({...formData, fullName: e.target.value})}
                    />
                 </div>
                 <div className="space-y-1">
                    <label className="text-xs uppercase font-bold text-gray-500 tracking-wider">Phone</label>
                    <input 
                      required
                      type="text" 
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-sm focus:border-parosa-dark outline-none transition-colors"
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                    />
                 </div>
              </div>

              <div className="space-y-1">
                  <label className="text-xs uppercase font-bold text-gray-500 tracking-wider">Email (Optional)</label>
                  <input 
                    type="email" 
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-sm focus:border-parosa-dark outline-none transition-colors"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                  />
              </div>

              <div className="space-y-1">
                  <label className="text-xs uppercase font-bold text-gray-500 tracking-wider">Address</label>
                  <textarea 
                    required
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-sm focus:border-parosa-dark outline-none h-24 resize-none transition-colors"
                    value={formData.street}
                    onChange={e => setFormData({...formData, street: e.target.value})}
                  />
              </div>

              <div className="grid grid-cols-2 gap-5">
                 <div className="space-y-1">
                    <label className="text-xs uppercase font-bold text-gray-500 tracking-wider">City</label>
                    <input 
                      required
                      type="text" 
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-sm focus:border-parosa-dark outline-none transition-colors"
                      value={formData.city}
                      onChange={e => setFormData({...formData, city: e.target.value})}
                    />
                 </div>
                 <div className="space-y-1">
                    <label className="text-xs uppercase font-bold text-gray-500 tracking-wider">Pincode</label>
                    <input 
                      required
                      type="text" 
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-sm focus:border-parosa-dark outline-none transition-colors"
                      value={formData.pincode}
                      onChange={e => setFormData({...formData, pincode: e.target.value})}
                    />
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-5">
                 <div className="space-y-1">
                    <label className="text-xs uppercase font-bold text-gray-500 tracking-wider">State</label>
                    <input 
                      required
                      type="text" 
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-sm focus:border-parosa-dark outline-none transition-colors"
                      value={formData.state}
                      onChange={e => setFormData({...formData, state: e.target.value})}
                    />
                 </div>
                 <div className="space-y-1">
                    <label className="text-xs uppercase font-bold text-gray-500 tracking-wider">Country</label>
                    <input 
                      disabled
                      type="text" 
                      value="India"
                      className="w-full p-3 bg-gray-100 border border-gray-200 text-gray-400 rounded-sm cursor-not-allowed"
                    />
                 </div>
              </div>
            </form>
          </div>
        </div>

        {/* RIGHT COLUMN: ORDER SUMMARY */}
        <div className="space-y-8">
          
          {/* Cart Summary */}
          <div className="bg-white p-6 md:p-8 rounded-sm shadow-sm border border-gray-100">
            <h3 className="text-xl font-serif text-parosa-dark mb-6 border-b border-gray-100 pb-4">Your Order</h3>
            
            <div className="max-h-60 overflow-y-auto space-y-4 mb-6 pr-2 custom-scrollbar">
               {cartItems.map((item, idx) => (
                 <div key={idx} className="flex justify-between items-start text-sm">
                    <div className="flex items-start gap-4">
                       <div className="w-14 h-14 bg-gray-50 border border-gray-100 flex-shrink-0">
                          {item.image && <img src={item.image} alt="" className="w-full h-full object-contain p-1"/>}
                       </div>
                       <div>
                          <p className="font-serif text-parosa-dark text-base leading-tight mb-1">{item.name || item.title}</p>
                          <p className="text-gray-500 text-xs uppercase tracking-wide">
                            {item.variant ? `${item.variant} x ` : 'Qty: '} {item.quantity}
                          </p>
                       </div>
                    </div>
                    <p className="font-medium text-parosa-dark">₹{item.price * item.quantity}</p>
                 </div>
               ))}
            </div>
            
            {/* Coupon Input */}
            <div className="flex gap-2 mb-6">
               <input 
                 type="text" 
                 placeholder="COUPON CODE" 
                 className="flex-1 p-3 border border-gray-200 rounded-sm text-sm uppercase tracking-wide outline-none focus:border-parosa-dark"
                 value={couponInput}
                 onChange={(e) => setCouponInput(e.target.value)}
               />
               <button 
                 type="button"
                 onClick={handleApplyCoupon}
                 className="bg-gray-800 text-white px-6 py-2 rounded-sm text-xs font-bold uppercase tracking-widest hover:bg-gray-700 transition"
               >
                 Apply
               </button>
            </div>

            {/* Price Breakdown */}
            <div className="space-y-3 border-t border-gray-100 pt-4 text-sm text-gray-600">
               <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{cartTotal}</span>
               </div>
               <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className={shippingFee === 0 ? "text-green-600 font-bold" : ""}>
                    {shippingFee === 0 ? "FREE" : `₹${shippingFee}`}
                  </span>
               </div>
               {discount > 0 && (
                 <div className="flex justify-between text-green-600">
                   <span>Discount</span>
                   <span>- ₹{discount}</span>
                 </div>
               )}
               <div className="flex justify-between text-xl font-serif text-parosa-dark border-t border-gray-100 pt-4 mt-2">
                  <span>Total</span>
                  <span>₹{finalTotal}</span>
               </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white p-6 md:p-8 rounded-sm shadow-sm border border-gray-100">
            <h3 className="text-xl font-serif text-parosa-dark mb-6 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5" /> Payment
            </h3>
            
            <div className="space-y-3">
               {/* COD Option */}
               <label className={`flex items-center gap-4 p-4 border rounded-sm cursor-pointer transition-all ${paymentMethod === 'COD' ? 'border-parosa-dark bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`}>
                  <input 
                    type="radio" 
                    name="payment" 
                    value="COD" 
                    checked={paymentMethod === 'COD'}
                    onChange={() => setPaymentMethod('COD')}
                    className="w-4 h-4 text-parosa-dark focus:ring-parosa-dark"
                  />
                  <div className="flex items-center gap-3">
                    <Truck size={20} className="text-gray-600"/>
                    <span className="font-medium text-parosa-dark text-sm uppercase tracking-wide">Cash on Delivery</span>
                  </div>
               </label>

               {/* Manual UPI Option */}
               <label className={`flex items-center gap-4 p-4 border rounded-sm cursor-pointer transition-all ${paymentMethod === 'UPI_MANUAL' ? 'border-parosa-dark bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`}>
                  <input 
                    type="radio" 
                    name="payment" 
                    value="UPI_MANUAL" 
                    checked={paymentMethod === 'UPI_MANUAL'}
                    onChange={() => setPaymentMethod('UPI_MANUAL')}
                    className="w-4 h-4 text-parosa-dark focus:ring-parosa-dark"
                  />
                  <div className="flex items-center gap-3">
                    <Smartphone size={20} className="text-gray-600"/>
                    <span className="font-medium text-parosa-dark text-sm uppercase tracking-wide">UPI / QR Code</span>
                  </div>
               </label>

               {/* UPI QR Display Section */}
               {paymentMethod === 'UPI_MANUAL' && (
                 <div className="mt-4 p-6 bg-white border border-gray-200 rounded-sm flex flex-col items-center animate-in fade-in slide-in-from-top-2">
                    <p className="text-sm text-gray-500 mb-4 text-center">Scan with GPay / PhonePe / Paytm to pay <strong>₹{finalTotal}</strong></p>
                    
                    {/* --- THE QR CODE --- */}
                    <div className="p-3 bg-white shadow-lg rounded-lg mb-6 border border-gray-100">
                        <QRCodeCanvas 
                          value={upiLink} 
                          size={160} 
                          level={"H"} 
                          includeMargin={true}
                        />
                    </div>
                    
                    {/* UTR Input */}
                    <div className="w-full">
                       <label className="block text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-widest text-center">Enter Transaction ID / UTR (Required)</label>
                       <input 
                         type="text" 
                         placeholder="e.g. 321456789012"
                         className="w-full p-3 border border-gray-300 rounded-sm focus:border-parosa-dark outline-none text-center font-mono tracking-widest text-parosa-dark placeholder-gray-300"
                         value={utrNumber}
                         onChange={(e) => setUtrNumber(e.target.value)}
                         required={paymentMethod === 'UPI_MANUAL'}
                       />
                       <p className="text-[10px] text-gray-400 mt-2 text-center">You can find this 12-digit number in your payment app under "Transaction Details"</p>
                    </div>
                 </div>
               )}
            </div>

            <button 
               form="checkout-form"
               type="submit"
               disabled={loading}
               className="w-full mt-8 bg-parosa-dark text-white py-4 rounded-sm font-bold text-xs uppercase tracking-widest hover:bg-parosa-accent transition-all shadow-lg active:scale-[0.98] disabled:bg-gray-300 disabled:cursor-not-allowed flex justify-center items-center gap-2"
            >
               {loading ? (
                 <>
                   <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                   Processing...
                 </>
               ) : (
                 <>
                   Pay ₹{finalTotal} <ArrowRight size={16} />
                 </>
               )}
            </button>

          </div>

        </div>
      </div>
    </div>
  );
};

export default Checkout;