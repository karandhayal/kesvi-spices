import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { QRCodeCanvas } from 'qrcode.react'; // <--- IMPORT THIS

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // --- STATE ---
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [shippingFee, setShippingFee] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [couponCode, setCouponCode] = useState('');
  const [couponInput, setCouponInput] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [utrNumber, setUtrNumber] = useState(''); // Store UTR
  const [loading, setLoading] = useState(false);
  
  // --- MERCHANT UPI DETAILS (CHANGE THESE) ---
  const MERCHANT_UPI_ID = "dhaya95877@barodampay"; // <--- PUT YOUR UPI ID HERE
  const MERCHANT_NAME = "DHAYAL INDUSTIRES";       // <--- PUT YOUR NAME HERE

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

  // Load Cart Data
  useEffect(() => {
    if (location.state?.products) {
      const items = location.state.products;
      setCartItems(items);
      
      const total = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
      setSubtotal(total);
      
      // Logic: Free shipping if > 499
      setShippingFee(total > 499 ? 0 : 50);
    } else {
      navigate('/cart'); 
    }
  }, [location.state, navigate]);

  // --- COUPON HANDLER ---
  const handleApplyCoupon = async () => {
    if(!couponInput) return;
    try {
      const res = await axios.post('https://parosa-755646660410.asia-south2.run.app/api/orders/validate-coupon', {
        code: couponInput,
        cartTotal: subtotal
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
  const finalTotal = Math.max(0, subtotal + shippingFee - discount);

  // --- GENERATE UPI LINK ---
  // Format: upi://pay?pa=[UPI_ID]&pn=[NAME]&am=[AMOUNT]&cu=INR
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
      userId: localStorage.getItem('userId') || null, // Guest or User
      orderItems: cartItems,
      shippingAddress: formData,
      paymentMethod,
      paymentResult: paymentMethod === 'UPI_MANUAL' ? { id: utrNumber, status: "Pending Verification" } : {},
      itemsPrice: subtotal,
      shippingPrice: shippingFee,
      totalPrice: finalTotal,
      couponCode
    };

    try {
      const res = await axios.post('https://parosa-755646660410.asia-south2.run.app/api/orders/create', orderPayload);
      if (res.data.success) {
        alert("Order Placed Successfully!");
        navigate('/order-success', { state: { order: res.data.order } }); // Redirect to success page
      }
    } catch (err) {
      console.error(err);
      alert("Order Failed: " + (err.response?.data?.message || "Server Error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 font-sans">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* LEFT COLUMN: FORM */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-bold mb-6 text-gray-800">Shipping Details</h2>
          <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
               <input 
                 required
                 type="text" placeholder="Full Name" 
                 className="p-3 border rounded focus:ring-2 ring-blue-500 outline-none"
                 value={formData.fullName}
                 onChange={e => setFormData({...formData, fullName: e.target.value})}
               />
               <input 
                 required
                 type="text" placeholder="Phone Number" 
                 className="p-3 border rounded focus:ring-2 ring-blue-500 outline-none"
                 value={formData.phone}
                 onChange={e => setFormData({...formData, phone: e.target.value})}
               />
            </div>
            <input 
               type="email" placeholder="Email Address (Optional)" 
               className="w-full p-3 border rounded focus:ring-2 ring-blue-500 outline-none"
               value={formData.email}
               onChange={e => setFormData({...formData, email: e.target.value})}
            />
            <textarea 
               required
               placeholder="Street Address / Flat No." 
               className="w-full p-3 border rounded focus:ring-2 ring-blue-500 outline-none h-24 resize-none"
               value={formData.street}
               onChange={e => setFormData({...formData, street: e.target.value})}
            />
            <div className="grid grid-cols-2 gap-4">
               <input 
                 required
                 type="text" placeholder="City" 
                 className="p-3 border rounded focus:ring-2 ring-blue-500 outline-none"
                 value={formData.city}
                 onChange={e => setFormData({...formData, city: e.target.value})}
               />
               <input 
                 required
                 type="text" placeholder="Pincode" 
                 className="p-3 border rounded focus:ring-2 ring-blue-500 outline-none"
                 value={formData.pincode}
                 onChange={e => setFormData({...formData, pincode: e.target.value})}
               />
            </div>
            <div className="grid grid-cols-2 gap-4">
               <input 
                 required
                 type="text" placeholder="State" 
                 className="p-3 border rounded focus:ring-2 ring-blue-500 outline-none"
                 value={formData.state}
                 onChange={e => setFormData({...formData, state: e.target.value})}
               />
               <input 
                 disabled
                 type="text" value="India"
                 className="p-3 border rounded bg-gray-100 text-gray-500 cursor-not-allowed"
               />
            </div>
          </form>
        </div>

        {/* RIGHT COLUMN: ORDER SUMMARY */}
        <div className="space-y-6">
          
          {/* Cart Summary */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-bold mb-4 text-gray-800">Order Summary</h3>
            <div className="max-h-60 overflow-y-auto space-y-3 mb-4 custom-scrollbar">
               {cartItems.map((item, idx) => (
                 <div key={idx} className="flex justify-between items-center text-sm border-b pb-2">
                    <div className="flex items-center gap-3">
                       <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden">
                          {item.image && <img src={item.image} alt="" className="w-full h-full object-cover"/>}
                       </div>
                       <div>
                          <p className="font-medium text-gray-700">{item.title}</p>
                          <p className="text-gray-500">Qty: {item.quantity}</p>
                       </div>
                    </div>
                    <p className="font-semibold">₹{item.price * item.quantity}</p>
                 </div>
               ))}
            </div>
            
            {/* Coupon Input */}
            <div className="flex gap-2 mb-4">
               <input 
                 type="text" 
                 placeholder="Coupon Code" 
                 className="flex-1 p-2 border rounded uppercase text-sm"
                 value={couponInput}
                 onChange={(e) => setCouponInput(e.target.value)}
               />
               <button 
                 type="button"
                 onClick={handleApplyCoupon}
                 className="bg-gray-800 text-white px-4 py-2 rounded text-sm hover:bg-gray-700 transition"
               >
                 Apply
               </button>
            </div>

            {/* Price Breakdown */}
            <div className="space-y-2 border-t pt-4 text-sm text-gray-600">
               <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
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
               <div className="flex justify-between text-xl font-bold text-gray-900 border-t pt-2 mt-2">
                  <span>Total</span>
                  <span>₹{finalTotal}</span>
               </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-bold mb-4 text-gray-800">Payment Method</h3>
            
            <div className="space-y-3">
               {/* COD Option */}
               <label className={`flex items-center gap-3 p-4 border rounded cursor-pointer transition ${paymentMethod === 'COD' ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'}`}>
                  <input 
                    type="radio" 
                    name="payment" 
                    value="COD" 
                    checked={paymentMethod === 'COD'}
                    onChange={() => setPaymentMethod('COD')}
                    className="w-5 h-5 text-blue-600"
                  />
                  <span className="font-medium">Cash on Delivery (COD)</span>
               </label>

               {/* Manual UPI Option */}
               <label className={`flex items-center gap-3 p-4 border rounded cursor-pointer transition ${paymentMethod === 'UPI_MANUAL' ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'}`}>
                  <input 
                    type="radio" 
                    name="payment" 
                    value="UPI_MANUAL" 
                    checked={paymentMethod === 'UPI_MANUAL'}
                    onChange={() => setPaymentMethod('UPI_MANUAL')}
                    className="w-5 h-5 text-blue-600"
                  />
                  <span className="font-medium">UPI / QR Code</span>
               </label>

               {/* UPI QR Display Section */}
               {paymentMethod === 'UPI_MANUAL' && (
                 <div className="mt-4 p-4 bg-white border-2 border-dashed border-blue-200 rounded-lg flex flex-col items-center animate-in fade-in slide-in-from-top-2">
                    <p className="text-sm text-gray-500 mb-3 text-center">Scan to pay <strong>₹{finalTotal}</strong></p>
                    
                    {/* --- THE QR CODE --- */}
                    <div className="p-2 bg-white shadow-md rounded-lg mb-4">
                        <QRCodeCanvas 
                          value={upiLink} 
                          size={180} 
                          level={"H"} // High error correction
                          includeMargin={true}
                        />
                    </div>
                    
                    <p className="text-xs text-gray-400 mb-4">Accepts GPay, PhonePe, Paytm, etc.</p>

                    {/* UTR Input */}
                    <div className="w-full">
                       <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Enter Transaction ID / UTR (Required)</label>
                       <input 
                         type="text" 
                         placeholder="e.g. 321456789012"
                         className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 outline-none text-center font-mono tracking-widest"
                         value={utrNumber}
                         onChange={(e) => setUtrNumber(e.target.value)}
                         required={paymentMethod === 'UPI_MANUAL'}
                       />
                       <p className="text-[10px] text-gray-500 mt-1 text-center">Found in your payment app under "Transaction Details"</p>
                    </div>
                 </div>
               )}
            </div>

            <button 
               form="checkout-form"
               type="submit"
               disabled={loading}
               className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg font-bold text-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex justify-center items-center"
            >
               {loading ? (
                 <>
                   <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                   Processing...
                 </>
               ) : (
                 `Pay ₹${finalTotal}`
               )}
            </button>

          </div>

        </div>
      </div>
    </div>
  );
};

export default Checkout;