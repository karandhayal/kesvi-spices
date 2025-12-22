import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Package, Users, Truck, CheckCircle, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({ totalSales: 0, orderCount: 0 });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Basic Security Check (Improve this later with backend middleware)
  useEffect(() => {
    const checkAdmin = async () => {
       const user = JSON.parse(localStorage.getItem('user') || '{}');
       // In real app, check isAdmin flag from DB. For now, we trust the UI (Risky but okay for starting)
       if(!user) navigate('/login');
    };
    checkAdmin();
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get('/api/orders/all'); // We need to create this route!
      setOrders(data);
      
      // Calculate Stats
      const total = data.reduce((acc, order) => acc + order.amount, 0);
      setStats({ totalSales: total, orderCount: data.length });
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, status) => {
    try {
      await axios.put(`/api/orders/${orderId}`, { status });
      fetchOrders(); // Refresh UI
    } catch (err) {
      alert("Failed to update status");
    }
  };

  if (loading) return <div className="p-10 text-center">Loading Dashboard...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-serif text-gray-800 mb-8">Kesvi Admin Portal</h1>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded shadow-sm flex items-center gap-4">
            <div className="bg-green-100 p-3 rounded-full text-green-600"><Users /></div>
            <div>
              <p className="text-gray-500 text-sm uppercase">Total Orders</p>
              <h3 className="text-2xl font-bold">{stats.orderCount}</h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded shadow-sm flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-full text-blue-600"><Package /></div>
            <div>
              <p className="text-gray-500 text-sm uppercase">Revenue</p>
              <h3 className="text-2xl font-bold">₹{stats.totalSales.toLocaleString()}</h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded shadow-sm flex items-center gap-4">
            <div className="bg-orange-100 p-3 rounded-full text-orange-600"><Truck /></div>
            <div>
              <p className="text-gray-500 text-sm uppercase">Pending Shipments</p>
              <h3 className="text-2xl font-bold">{orders.filter(o => o.status === 'Processing').length}</h3>
            </div>
          </div>
        </div>

        {/* ORDERS TABLE */}
        <div className="bg-white rounded shadow-sm overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold">Recent Orders</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-100 uppercase text-gray-600">
                <tr>
                  <th className="p-4">Order ID</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Payment</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="p-4 font-mono text-xs">{order._id.slice(-6)}</td>
                    <td className="p-4">
                      <div className="font-bold">{order.address?.fullName || "Guest"}</div>
                      <div className="text-xs text-gray-500">{order.address?.city}</div>
                    </td>
                    <td className="p-4">₹{order.amount}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${order.paymentStatus === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {order.paymentMethod} ({order.paymentStatus || 'Pending'})
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold border ${
                        order.status === 'Delivered' ? 'border-green-500 text-green-600' : 
                        order.status === 'Cancelled' ? 'border-red-500 text-red-600' : 
                        'border-blue-500 text-blue-600'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4 flex gap-2">
                       {/* SHIPROCKET BUTTON - COMING SOON */}
                       <button className="text-xs bg-gray-800 text-white px-3 py-1 rounded hover:bg-black">
                         Ship
                       </button>
                       <select 
                         className="border rounded text-xs p-1"
                         onChange={(e) => updateStatus(order._id, e.target.value)}
                         defaultValue=""
                       >
                         <option value="" disabled>Update Status</option>
                         <option value="Processing">Processing</option>
                         <option value="Shipped">Shipped</option>
                         <option value="Delivered">Delivered</option>
                         <option value="Cancelled">Cancelled</option>
                       </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;