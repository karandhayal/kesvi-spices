import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Package, Users, Truck, DollarSign, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({ totalRevenue: 0, totalOrders: 0, pendingShipments: 0 });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 1. Fetch Orders on Load
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/orders/all'); // Ensure this route exists in server/routes/order.js
      setOrders(data);
      calculateStats(data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setLoading(false);
    }
  };

  // 2. Calculate Dashboard Stats
  const calculateStats = (data) => {
    const revenue = data.reduce((acc, order) => acc + (order.paymentStatus === 'Paid' || order.paymentMethod === 'COD' ? order.amount : 0), 0);
    const pending = data.filter(o => o.status === 'Processing').length;
    setStats({
      totalRevenue: revenue,
      totalOrders: data.length,
      pendingShipments: pending
    });
  };

  // 3. ACTION: Push to Shiprocket
  const handleShip = async (orderId) => {
    if (!window.confirm("Confirm: Push this order to Shiprocket for pickup?")) return;
    
    try {
      // Show temporary loading state if needed
      const res = await axios.post(`/api/shipping/create-order/${orderId}`);
      if (res.data.success) {
        alert(`Success! Shiprocket Order ID: ${res.data.data.order_id}`);
        fetchOrders(); // Refresh to show the 'Track' button
      }
    } catch (err) {
      alert("Shipping Failed: " + (err.response?.data?.message || err.message));
    }
  };

  // 4. ACTION: Track Order
  const handleTrack = async (orderId) => {
    try {
      const res = await axios.get(`/api/shipping/track/${orderId}`);
      // Shiprocket response structure varies, we try to grab the status
      const status = res.data.tracking_data?.track_status || res.data.status || "Status info pending";
      alert(`Current Location/Status: ${status}`);
    } catch (err) {
      alert("Tracking details not available yet. Try again later.");
    }
  };

  // 5. ACTION: Manual Status Update (Fallback)
  const updateStatus = async (orderId, newStatus) => {
    try {
      await axios.put(`/api/orders/${orderId}`, { status: newStatus });
      fetchOrders();
    } catch (err) {
      alert("Failed to update status");
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center">Loading Admin Panel...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <button onClick={fetchOrders} className="flex items-center gap-2 bg-white px-4 py-2 rounded shadow text-sm hover:bg-gray-100">
            <RefreshCw size={16} /> Refresh
          </button>
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-500 flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-full text-blue-600"><DollarSign /></div>
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-wider">Total Revenue</p>
              <h3 className="text-2xl font-bold">₹{stats.totalRevenue.toLocaleString()}</h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-purple-500 flex items-center gap-4">
            <div className="bg-purple-100 p-3 rounded-full text-purple-600"><Users /></div>
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-wider">Total Orders</p>
              <h3 className="text-2xl font-bold">{stats.totalOrders}</h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-orange-500 flex items-center gap-4">
            <div className="bg-orange-100 p-3 rounded-full text-orange-600"><Package /></div>
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-wider">To Ship</p>
              <h3 className="text-2xl font-bold">{stats.pendingShipments}</h3>
            </div>
          </div>
        </div>

        {/* ORDERS TABLE */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden border">
          <div className="p-6 border-b bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-700">Recent Orders</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-100 uppercase text-gray-500 text-xs font-semibold">
                <tr>
                  <th className="p-4">Order Details</th>
                  <th className="p-4">Items (Pack This)</th>
                  <th className="p-4">Customer Info</th>
                  <th className="p-4">Payment</th>
                  <th className="p-4">Logistics</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50 transition">
                    
                    {/* 1. ORDER ID & DATE */}
                    <td className="p-4 align-top">
                      <div className="font-mono font-bold text-gray-700">#{order._id.slice(-6).toUpperCase()}</div>
                      <div className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</div>
                      <div className="mt-2">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                          order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 
                          order.status === 'Cancelled' ? 'bg-red-100 text-red-700' : 
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </td>

                    {/* 2. ITEMS TO PACK */}
                    <td className="p-4 align-top max-w-xs">
                      {order.products.map((p, idx) => (
                        <div key={idx} className="flex justify-between border-b border-gray-100 last:border-0 py-1">
                          <span className="text-gray-800">
                            {p.title} 
                            {p.variant && <span className="text-gray-500 text-xs ml-1">({p.variant})</span>}
                          </span>
                          <span className="font-bold ml-2">x{p.quantity}</span>
                        </div>
                      ))}
                      <div className="mt-2 text-xs text-gray-400 font-mono">
                         Total: ₹{order.amount}
                      </div>
                    </td>

                    {/* 3. CUSTOMER INFO */}
                    <td className="p-4 align-top">
                      <div className="font-bold text-gray-800">{order.address?.fullName}</div>
                      <div className="text-xs text-gray-600">{order.address?.phone}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {order.address?.city}, {order.address?.state} - {order.address?.pincode}
                      </div>
                    </td>

                    {/* 4. PAYMENT */}
                    <td className="p-4 align-top">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                          order.paymentStatus === 'Paid' ? 'bg-green-100 text-green-700' : 
                          order.paymentMethod === 'COD' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {order.paymentMethod}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {order.paymentStatus}
                      </div>
                    </td>

                    {/* 5. LOGISTICS ACTIONS */}
                    <td className="p-4 align-top">
                      <div className="flex flex-col gap-2">
                        
                        {/* SHIPROCKET BUTTONS */}
                        {!order.shiprocketOrderId ? (
                          <button 
                            onClick={() => handleShip(order._id)}
                            className="text-xs bg-indigo-600 text-white px-3 py-2 rounded shadow hover:bg-indigo-700 flex items-center justify-center gap-2 transition"
                          >
                            <Truck size={14} /> Ship Now
                          </button>
                        ) : (
                          <div className="text-center">
                             <button 
                              onClick={() => handleTrack(order._id)}
                              className="w-full text-xs bg-white border border-gray-300 text-gray-700 px-3 py-1 rounded hover:bg-gray-50 mb-1"
                            >
                              Track Pkg
                            </button>
                            <div className="text-[10px] text-gray-400 font-mono">ID: {order.shiprocketOrderId}</div>
                          </div>
                        )}

                        {/* MANUAL STATUS OVERRIDE */}
                        <select 
                          className="border rounded text-xs p-1 bg-gray-50 text-gray-600"
                          value={order.status} // Controlled input
                          onChange={(e) => updateStatus(order._id, e.target.value)}
                        >
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>
                    </td>

                  </tr>
                ))}
                
                {orders.length === 0 && (
                   <tr>
                     <td colSpan="5" className="p-10 text-center text-gray-400">
                       No orders found. Waiting for sales!
                     </td>
                   </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;