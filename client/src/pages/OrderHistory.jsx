import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Package, Search, Truck, Calendar, MapPin, 
  ChevronRight, ArrowRight, ShoppingBag, X, Loader2
} from 'lucide-react';

const BASE_URL = "https://parosa-755646660410.asia-south2.run.app/api";

const OrderHistory = () => {
  // --- STATE ---
  const [user, setUser] = useState(null); // Stores logged-in user info
  const [activeTab, setActiveTab] = useState('guest'); // 'history' | 'guest'
  
  // Data State
  const [myOrders, setMyOrders] = useState([]);
  const [trackedOrder, setTrackedOrder] = useState(null);
  
  // UI State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null); // For Modal

  // Form State (for Guest Tracking)
  const [trackId, setTrackId] = useState('');
  const [trackPhone, setTrackPhone] = useState('');

  // --- INIT ---
  useEffect(() => {
    // 1. Check if user is logged in (Adjust key based on how you save auth)
    const storedUser = localStorage.getItem('userInfo'); 
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setActiveTab('history');
      fetchMyOrders(parsedUser.token);
    }
  }, []);

  // --- API CALLS ---

  // 1. Fetch Logged-in User's History
  const fetchMyOrders = async (token) => {
    try {
      setLoading(true);
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.get(`${BASE_URL}/orders/myorders`, config);
      setMyOrders(data);
    } catch (err) {
      console.error("Failed to load history", err);
      // Fallback: If token invalid, stay on guest tab
    } finally {
      setLoading(false);
    }
  };

  // 2. Guest Track Order
  const handleTrackOrder = async (e) => {
    e.preventDefault();
    setError('');
    setTrackedOrder(null);
    setLoading(true);

    try {
      // NOTE: Ensure your backend has a route like POST /api/orders/track
      // Body: { orderId, phone }
      const { data } = await axios.post(`${BASE_URL}/orders/track`, {
        orderId: trackId.trim(),
        phone: trackPhone.trim()
      });
      setTrackedOrder(data);
    } catch (err) {
      setError(err.response?.data?.message || "Order not found. Please check details.");
    } finally {
      setLoading(false);
    }
  };

  // --- RENDER HELPERS ---
  const getStatusColor = (status) => {
    switch (status) {
      case 'Processing': return 'bg-orange-100 text-orange-700';
      case 'Shipped': return 'bg-blue-100 text-blue-700';
      case 'Delivered': return 'bg-green-100 text-green-700';
      case 'Cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800 p-4 md:p-8">
      
      <div className="max-w-4xl mx-auto">
        
        {/* HEADER */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Your Orders</h1>
          <p className="text-gray-500 mt-2">Track, return, or buy things again.</p>
        </div>

        {/* TABS (Only visible if user is logged in to toggle views) */}
        {user && (
          <div className="flex justify-center mb-8">
            <div className="bg-white p-1 rounded-lg shadow-sm border border-gray-200 inline-flex">
              <button
                onClick={() => setActiveTab('history')}
                className={`px-6 py-2 rounded-md text-sm font-semibold transition ${
                  activeTab === 'history' ? 'bg-slate-900 text-white shadow' : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                Order History
              </button>
              <button
                onClick={() => setActiveTab('guest')}
                className={`px-6 py-2 rounded-md text-sm font-semibold transition ${
                  activeTab === 'guest' ? 'bg-slate-900 text-white shadow' : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                Track an Order
              </button>
            </div>
          </div>
        )}

        {/* --- VIEW 1: LOGGED IN HISTORY --- */}
        {activeTab === 'history' && (
          <div className="space-y-4">
            {loading && <div className="text-center py-10"><Loader2 className="animate-spin mx-auto text-blue-600" /></div>}
            
            {!loading && myOrders.length === 0 && (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm border">
                <ShoppingBag size={48} className="mx-auto text-gray-300 mb-3" />
                <h3 className="text-lg font-medium text-gray-900">No orders yet</h3>
                <p className="text-gray-500">You haven't placed any orders yet.</p>
              </div>
            )}

            {myOrders.map(order => (
              <div key={order._id} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition">
                <div className="p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-50/50 border-b border-gray-100">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-bold text-gray-900">#{order._id.slice(-6).toUpperCase()}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 flex items-center gap-2">
                       <Calendar size={12} /> {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="block font-bold text-lg text-gray-900">₹{order.amount}</span>
                    <button 
                      onClick={() => setSelectedOrder(order)}
                      className="text-sm text-blue-600 font-medium hover:underline flex items-center justify-end gap-1"
                    >
                      View Details <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
                {/* Preview Items */}
                <div className="p-4 flex gap-4 overflow-x-auto">
                  {(order.orderItems || order.products || []).map((item, idx) => (
                    <div key={idx} className="flex-shrink-0 w-16 h-16 border rounded-md overflow-hidden bg-gray-100 relative">
                       {item.image ? (
                         <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                       ) : (
                         <Package className="w-full h-full p-4 text-gray-300" />
                       )}
                       <span className="absolute bottom-0 right-0 bg-black/60 text-white text-[10px] px-1">x{item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* --- VIEW 2: GUEST TRACKING FORM --- */}
        {activeTab === 'guest' && (
          <div className="max-w-md mx-auto">
            {!trackedOrder ? (
              <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
                <div className="flex justify-center mb-6">
                  <div className="h-12 w-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                    <Search size={24} />
                  </div>
                </div>
                <h2 className="text-xl font-bold text-center mb-6 text-gray-800">Track Your Order</h2>
                
                <form onSubmit={handleTrackOrder} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Order ID</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 64a7f..." 
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      value={trackId}
                      onChange={(e) => setTrackId(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Phone Number (used at checkout)</label>
                    <input 
                      type="tel" 
                      placeholder="e.g. 9876543210" 
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      value={trackPhone}
                      onChange={(e) => setTrackPhone(e.target.value)}
                      required
                    />
                  </div>
                  
                  {error && <p className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">{error}</p>}
                  
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full py-3 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 transition shadow-lg shadow-blue-900/10 flex items-center justify-center gap-2"
                  >
                    {loading ? <Loader2 className="animate-spin" /> : 'Find Order'}
                  </button>
                </form>
              </div>
            ) : (
              // TRACKED ORDER RESULT CARD
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden relative animate-in fade-in slide-in-from-bottom-4">
                 <button 
                    onClick={() => setTrackedOrder(null)} 
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                 >
                   <X size={20} />
                 </button>
                 
                 <div className="bg-green-50 p-6 text-center border-b border-green-100">
                    <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-3">
                       <Truck size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-green-800">Order Found!</h3>
                    <p className="text-green-600 font-medium">{trackedOrder.status}</p>
                 </div>

                 <div className="p-6">
                    <div className="flex justify-between items-center mb-4 border-b pb-4">
                       <div>
                          <p className="text-xs text-gray-500 uppercase">Order ID</p>
                          <p className="font-mono font-bold">#{trackedOrder._id.slice(-6).toUpperCase()}</p>
                       </div>
                       <div className="text-right">
                          <p className="text-xs text-gray-500 uppercase">Total</p>
                          <p className="font-bold text-lg">₹{trackedOrder.amount}</p>
                       </div>
                    </div>
                    
                    <button 
                       onClick={() => setSelectedOrder(trackedOrder)}
                       className="w-full py-3 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition"
                    >
                       View Full Receipt
                    </button>
                 </div>
              </div>
            )}
          </div>
        )}

      </div>

      {/* --- MODAL: ORDER DETAILS --- */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="p-5 bg-slate-900 text-white flex justify-between items-center shrink-0">
               <div>
                 <h2 className="text-lg font-bold">Order Details</h2>
                 <p className="text-slate-400 text-xs">#{selectedOrder._id}</p>
               </div>
               <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-white/10 rounded-full transition">
                 <X size={20} />
               </button>
            </div>

            {/* Modal Body (Scrollable) */}
            <div className="p-6 overflow-y-auto">
               
               {/* Tracking Info (If exists) */}
               {selectedOrder.shiprocketOrderId && (
                 <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg mb-6 flex items-start gap-3">
                    <Truck className="text-blue-600 mt-1" size={20} />
                    <div>
                       <p className="text-blue-800 font-bold text-sm">Shipped</p>
                       <p className="text-blue-600 text-xs mt-1">Tracking ID: {selectedOrder.shiprocketOrderId}</p>
                    </div>
                 </div>
               )}

               {/* Items List */}
               <h3 className="font-bold text-gray-800 mb-3 text-sm uppercase tracking-wide">Items</h3>
               <div className="space-y-3 mb-6">
                 {(selectedOrder.orderItems || selectedOrder.products || []).map((item, i) => (
                   <div key={i} className="flex gap-4">
                      <div className="w-16 h-16 bg-gray-100 rounded-md border overflow-hidden shrink-0">
                         {item.image && <img src={item.image} className="w-full h-full object-cover" alt="" />}
                      </div>
                      <div className="flex-1">
                         <p className="font-medium text-gray-800 text-sm">{item.title}</p>
                         <p className="text-xs text-gray-500 mt-1">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-gray-800 text-sm">₹{item.price * item.quantity}</p>
                   </div>
                 ))}
               </div>

               <div className="border-t border-dashed border-gray-200 my-4"></div>

               {/* Address & Payment */}
               <div className="grid grid-cols-2 gap-6 mb-2">
                 <div>
                    <h3 className="font-bold text-gray-800 text-xs uppercase mb-2">Shipping To</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {selectedOrder.address?.fullName}<br/>
                      {selectedOrder.address?.street}<br/>
                      {selectedOrder.address?.city}, {selectedOrder.address?.pincode}
                    </p>
                 </div>
                 <div>
                    <h3 className="font-bold text-gray-800 text-xs uppercase mb-2">Payment</h3>
                    <p className="text-sm text-gray-600">
                      Method: {selectedOrder.paymentMethod}<br/>
                      Status: <span className={selectedOrder.paymentStatus === 'Paid' ? 'text-green-600 font-bold' : 'text-orange-600 font-bold'}>{selectedOrder.paymentStatus || 'Pending'}</span>
                    </p>
                 </div>
               </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-gray-50 border-t flex justify-between items-center shrink-0">
               <span className="text-gray-500 text-sm">Total Paid</span>
               <span className="text-xl font-bold text-slate-900">₹{selectedOrder.amount}</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default OrderHistory;