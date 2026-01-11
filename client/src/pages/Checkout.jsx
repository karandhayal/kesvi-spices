import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext'; 
import { CreditCard, Truck, ArrowRight, ShieldCheck, Lock } from 'lucide-react';

const Checkout = () => {
  const navigate = useNavigate();
  
  // --- GET DATA FROM CONTEXT ---
  const { cartItems, cartTotal } = useCart(); 

  // --- STATE ---
  const [shippingFee, setShippingFee] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [couponCode, setCouponCode] = useState('');
  const [couponInput, setCouponInput] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('COD'); // Default to COD
  const [loading, setLoading] = useState(false);
  
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

  // --- 1. LOAD RAZORPAY SCRIPT ---
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // --- 2. CALCULATE FEES ---
  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
      return;
    }
    // Shipping: Free if > 399, else 60
    const total = Number(cartTotal) || 0;
    setShippingFee(total > 399 ? 0 : 60);
  }, [cartItems, cartTotal, navigate]);

  // COD Fee: 50 if COD
  const codFee = paymentMethod === 'COD' ? 50 : 0;

  // Final Total
  const finalTotal = Math.max(0, (Number(cartTotal) || 0) + shippingFee + codFee - discount);

  // --- 3. COUPON HANDLER ---
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

  // ==========================================
  // 4. CORE ORDER CREATION (DB)
  // ==========================================
  const createOrderInDatabase = async (paymentDetails = {}) => {
    try {
      const orderPayload = {
        userId: localStorage.getItem('userId') || null, 
        orderItems: cartItems,
        shippingAddress: formData,
        paymentMethod: paymentMethod === 'COD' ? 'COD' : 'ONLINE',
        // Pass Razorpay details to backend to save in DB
        paymentResult: paymentDetails, 
        amount: finalTotal, // Matches schema
        subtotal: cartTotal, // Matches schema
        shippingFee: shippingFee,
        couponCode,
        isPaid: paymentMethod === 'ONLINE'
      };

      const res = await axios.post('/api/orders/create', orderPayload);
      
      if (res.data.success) {
        navigate(`/order-success?id=${res.data.order._id}`);
      }
    } catch (err) {
      console.error(err);
      alert("Order Creation Failed: " + (err.response?.data?.message || "Server Error"));
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // 5. RAZORPAY HANDLER
  // ==========================================
  const handleRazorpayPayment = async () => {
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      alert('Razorpay SDK failed to load. Check your internet connection.');
      setLoading(false);
      return;
    }

    try {
      // A. Create Order on Server (Razorpay API)
      // Ensure you have created this route in backend/routes/payment.js
      const { data: orderData } = await axios.post('/api/payment/create-order', { 
        amount: finalTotal 
      });

      if (!orderData.success) {
        alert("Server error. Could not initiate payment.");
        setLoading(false);
        return;
      }

      // B. Configure Options
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID, // FROM FRONTEND ENV
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Dhayal Industries",
        description: "Payment for Order",
        order_id: orderData.id, // The Order ID from Razorpay
        
        // C. Handler: What happens on Success
        handler: async function (response) {
          try {
            // Verify Payment Signature on Backend
            const verifyRes = await axios.post('/api/payment/verify-payment', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });

            if (verifyRes.data.success) {
              // Payment Verified! Now create order in DB
              await createOrderInDatabase({
                id: response.razorpay_payment_id,
                status: "Success",
                email_address: formData.email,
                update_time: new Date().toISOString()
              });
            } else {
              alert("Payment verification failed. Please contact support.");
              setLoading(false);
            }
          } catch (err) {
            alert("Payment verification error.");
            setLoading(false);
          }
        },
        prefill: {
          name: formData.fullName,
          email: formData.email,
          contact: formData.phone
        },
        theme: {
          color: "#B45309" // Matches your parosa-dark color
        }
      };

      // D. Open Razorpay
      const rzp1 = new window.Razorpay(options);
      
      rzp1.on('payment.failed', function (response){
        alert(`Payment Failed: ${response.error.description}`);
        setLoading(false);
      });

      rzp1.open();

    } catch (err) {
      console.error(err);
      alert("Something went wrong initializing payment.");
      setLoading(false);
    }
  };

  // --- 6. SUBMIT FORM ---
  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    
    // Basic Validation
    if(!formData.fullName || !formData.phone || !formData.street || !formData.pincode || !formData.city || !formData.state) {
        alert("Please fill in all shipping details.");
        return;
    }

    setLoading(true);

    if (paymentMethod === 'ONLINE') {
      await handleRazorpayPayment();
    } else {
      // COD Flow
      await createOrderInDatabase({});
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
                    <input required type="text" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-sm focus:border-parosa-dark outline-none"
                      value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} />
                 </div>
                 <div className="space-y-1">
                    <label className="text-xs uppercase font-bold text-gray-500 tracking-wider">Phone</label>
                    <input required type="text" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-sm focus:border-parosa-dark outline-none"
                      value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                 </div>
              </div>

              <div className="space-y-1">
                  <label className="text-xs uppercase font-bold text-gray-500 tracking-wider">Email (Optional)</label>
                  <input type="email" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-sm focus:border-parosa-dark outline-none"
                    value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>

              <div className="space-y-1">
                  <label className="text-xs uppercase font-bold text-gray-500 tracking-wider">Address</label>
                  <textarea required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-sm focus:border-parosa-dark outline-none h-24 resize-none"
                    value={formData.street} onChange={e => setFormData({...formData, street: e.target.value})} />
              </div>

              <div className="grid grid-cols-2 gap-5">
                 <div className="space-y-1">
                    <label className="text-xs uppercase font-bold text-gray-500 tracking-wider">City</label>
                    <input required type="text" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-sm focus:border-parosa-dark outline-none"
                      value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
                 </div>
                 <div className="space-y-1">
                    <label className="text-xs uppercase font-bold text-gray-500 tracking-wider">Pincode</label>
                    <input required type="text" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-sm focus:border-parosa-dark outline-none"
                      value={formData.pincode} onChange={e => setFormData({...formData, pincode: e.target.value})} />
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-5">
                 <div className="space-y-1">
                    <label className="text-xs uppercase font-bold text-gray-500 tracking-wider">State</label>
                    <input required type="text" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-sm focus:border-parosa-dark outline-none"
                      value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} />
                 </div>
                 <div className="space-y-1">
                    <label className="text-xs uppercase font-bold text-gray-500 tracking-wider">Country</label>
                    <input disabled type="text" value="India" className="w-full p-3 bg-gray-100 border border-gray-200 text-gray-400 rounded-sm cursor-not-allowed" />
                 </div>
              </div>
            </form>
          </div>
        </div>

        {/* RIGHT COLUMN: ORDER SUMMARY */}
        <div className="space-y-8">
          
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
               <input type="text" placeholder="COUPON CODE" className="flex-1 p-3 border border-gray-200 rounded-sm text-sm uppercase tracking-wide outline-none focus:border-parosa-dark"
                 value={couponInput} onChange={(e) => setCouponInput(e.target.value)} />
               <button type="button" onClick={handleApplyCoupon} className="bg-gray-800 text-white px-6 py-2 rounded-sm text-xs font-bold uppercase tracking-widest hover:bg-gray-700 transition">Apply</button>
            </div>

            {/* Price Breakdown */}
            <div className="space-y-3 border-t border-gray-100 pt-4 text-sm text-gray-600">
               <div className="flex justify-between"><span>Subtotal</span><span>₹{cartTotal}</span></div>
               <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className={shippingFee === 0 ? "text-green-600 font-bold" : ""}>
                    {shippingFee === 0 ? "FREE" : `₹${shippingFee}`}
                  </span>
               </div>
               
               {codFee > 0 && (
                 <div className="flex justify-between"><span>COD Charges</span><span>₹{codFee}</span></div>
               )}

               {discount > 0 && (
                 <div className="flex justify-between text-green-600"><span>Discount</span><span>- ₹{discount}</span></div>
               )}
               <div className="flex justify-between text-xl font-serif text-parosa-dark border-t border-gray-100 pt-4 mt-2">
                  <span>Total</span><span>₹{finalTotal}</span>
               </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white p-6 md:p-8 rounded-sm shadow-sm border border-gray-100">
            <h3 className="text-xl font-serif text-parosa-dark mb-6 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5" /> Payment
            </h3>
            
            <div className="space-y-3">
               
               {/* ONLINE (Razorpay) Option */}
               <label className={`flex items-center gap-4 p-4 border rounded-sm cursor-pointer transition-all ${paymentMethod === 'ONLINE' ? 'border-parosa-dark bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`}>
                  <input type="radio" name="payment" value="ONLINE" checked={paymentMethod === 'ONLINE'} onChange={() => setPaymentMethod('ONLINE')} className="w-4 h-4 text-parosa-dark focus:ring-parosa-dark" />
                  <div className="flex items-center gap-3">
                    <CreditCard size={20} className="text-gray-600"/>
                    <div className="flex flex-col">
                        <span className="font-medium text-parosa-dark text-sm uppercase tracking-wide">Pay Online</span>
                        <span className="text-[10px] text-gray-400 font-bold flex items-center gap-1"><Lock size={8}/> Secure (Razorpay)</span>
                    </div>
                  </div>
               </label>

               {/* COD Option */}
               <label className={`flex items-center gap-4 p-4 border rounded-sm cursor-pointer transition-all ${paymentMethod === 'COD' ? 'border-parosa-dark bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`}>
                  <input type="radio" name="payment" value="COD" checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')} className="w-4 h-4 text-parosa-dark focus:ring-parosa-dark" />
                  <div className="flex items-center gap-3">
                    <Truck size={20} className="text-gray-600"/>
                    <div>
                      <span className="font-medium text-parosa-dark text-sm uppercase tracking-wide block">Cash on Delivery</span>
                      <span className="text-[10px] text-gray-400 font-bold">+ ₹50 Charges Apply</span>
                    </div>
                  </div>
               </label>

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