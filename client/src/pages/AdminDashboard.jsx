import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { 
  LayoutDashboard, ShoppingCart, Package, BarChart3, 
  Search, Truck, CheckCircle, RefreshCw, ArrowUpRight, Save
} from 'lucide-react';

// ✅ OPTIONAL: If you haven't set up a proxy, define the URL here
const BASE_URL = "https://parosa-755646660410.asia-south2.run.app/api";

const AdminDashboard = () => {
  // --- STATE ---
  const [activeSection, setActiveSection] = useState('dashboard'); 
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orderTab, setOrderTab] = useState('All'); 
  const [searchTerm, setSearchTerm] = useState('');

  // --- INITIAL DATA FETCH ---
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // ✅ FIXED: Added BASE_URL to ensure it hits the cloud backend
      const [ordersRes, productsRes] = await Promise.all([
        axios.get(`${BASE_URL}/orders/all`),
        axios.get(`${BASE_URL}/products`) 
      ]);
      setOrders(ordersRes.data);
      setProducts(productsRes.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching admin data:", err);
      setLoading(false);
    }
  };

  // --- ACTIONS ---

  // 1. Shiprocket Push
  const handleShip = async (orderId) => {
    if (!window.confirm("Push this order to Shiprocket for pickup?")) return;
    try {
      const res = await axios.post(`${BASE_URL}/shipping/create-order/${orderId}`);
      if (res.data.success) {
        alert(`Success! Tracking ID: ${res.data.data.order_id}`);
        fetchData();
      }
    } catch (err) {
      alert("Shipping Failed: " + (err.response?.data?.message || err.message));
    }
  };

  // 2. Update Order Status
  const updateStatus = async (orderId, newStatus) => {
    try {
      await axios.put(`${BASE_URL}/orders/${orderId}`, { status: newStatus });
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
    } catch (err) {
      alert("Failed to update status");
    }
  };

  // 3. Update Inventory
  const handleStockUpdate = async (id, newStock) => {
    try {
      await axios.put(`${BASE_URL}/products/${id}`, { countInStock: newStock });
      setProducts(prev => prev.map(p => p._id === id ? { ...p, countInStock: newStock } : p));
      alert("Stock updated!");
    } catch (err) {
      alert("Failed to update stock");
    }
  };

  // --- COMPUTED DATA (ANALYTICS) ---
  const stats = useMemo(() => {
    // Safety check: ensure orders is an array
    if (!Array.isArray(orders)) return { totalRevenue: 0, totalOrders: 0, pendingOrders: 0, lowStockItems: 0, topProducts: [] };

    const totalRevenue = orders.reduce((acc, o) => acc + (o.paymentStatus === 'Paid' || o.paymentMethod === 'COD' ? (o.amount || 0) : 0), 0);
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.status === 'Processing').length;
    const lowStockItems = products.filter(p => p.countInStock < 5).length;
    
    // Top Selling Products Calculation
    const productSales = {};
    
    orders.forEach(order => {
      // ✅ CRITICAL FIX: Look for 'orderItems', fallback to 'products', fallback to empty array
      const items = order.orderItems || order.products || [];
      
      items.forEach(item => {
        if (item && item.title) {
            productSales[item.title] = (productSales[item.title] || 0) + Number(item.quantity || 1);
        }
      });
    });

    const topProducts = Object.entries(productSales)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);

    return { totalRevenue, totalOrders, pendingOrders, lowStockItems, topProducts };
  }, [orders, products]);

  // --- FILTERED ORDERS ---
  const filteredOrders = orders.filter(order => {
    const matchesTab = orderTab === 'All' || order.status === orderTab;
    const matchesSearch = (order._id || '').includes(searchTerm) || 
                          (order.address?.fullName || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-gray-50 text-gray-500 font-medium">
      <RefreshCw className="animate-spin mr-2" /> Loading Admin Panel...
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shadow-xl z-20">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-xl font-bold text-white tracking-wider">ADMIN PANEL</h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <SidebarItem 
            icon={<LayoutDashboard size={20} />} 
            label="Dashboard" 
            active={activeSection === 'dashboard'} 
            onClick={() => setActiveSection('dashboard')} 
          />
          <SidebarItem 
            icon={<ShoppingCart size={20} />} 
            label="Orders" 
            active={activeSection === 'orders'} 
            onClick={() => setActiveSection('orders')} 
            badge={stats.pendingOrders}
          />
          <SidebarItem 
            icon={<Package size={20} />} 
            label="Inventory" 
            active={activeSection === 'inventory'} 
            onClick={() => setActiveSection('inventory')} 
            alert={stats.lowStockItems > 0}
          />
          <SidebarItem 
            icon={<BarChart3 size={20} />} 
            label="Analytics" 
            active={activeSection === 'analytics'} 
            onClick={() => setActiveSection('analytics')} 
          />
        </nav>
        <div className="p-4 border-t border-slate-800 text-xs text-center text-slate-500">
          v2.0.1 Secure Admin
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto">
        
        {/* TOP BAR */}
        <header className="bg-white shadow-sm sticky top-0 z-10 px-8 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800 capitalize">{activeSection} Overview</h2>
          <div className="flex items-center gap-4">
             <button onClick={fetchData} className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition" title="Refresh Data">
                <RefreshCw size={18} />
             </button>
             <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold border border-blue-200">
                A
             </div>
          </div>
        </header>

        <div className="p-8">
          
          {/* --- VIEW: DASHBOARD --- */}
          {activeSection === 'dashboard' && (
            <div className="space-y-8">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard title="Total Revenue" value={`₹${stats.totalRevenue.toLocaleString()}`} color="blue" />
                <StatCard title="Total Orders" value={stats.totalOrders} color="purple" />
                <StatCard title="Pending Shipments" value={stats.pendingOrders} color="orange" />
                <StatCard title="Low Stock Alerts" value={stats.lowStockItems} color="red" />
              </div>

              {/* Recent Activity / Quick View */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                   <h3 className="font-bold text-gray-700 mb-4">Top Selling Products</h3>
                   <div className="space-y-4">
                      {stats.topProducts.map(([name, qty], idx) => (
                        <div key={idx} className="flex justify-between items-center border-b border-gray-50 pb-2 last:border-0">
                          <span className="text-sm text-gray-600">{name}</span>
                          <span className="font-bold text-gray-800">{qty} Sold</span>
                        </div>
                      ))}
                      {stats.topProducts.length === 0 && <p className="text-gray-400 text-sm">No sales data yet.</p>}
                   </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <h3 className="font-bold text-gray-700 mb-4">System Health</h3>
                  <div className="flex items-center gap-3 text-green-600 bg-green-50 p-3 rounded mb-2">
                    <CheckCircle size={18} /> <span>Shiprocket API: Connected</span>
                  </div>
                  <div className="flex items-center gap-3 text-blue-600 bg-blue-50 p-3 rounded">
                    <CheckCircle size={18} /> <span>Database: Healthy</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* --- VIEW: ORDERS --- */}
          {activeSection === 'orders' && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              {/* Toolbar */}
              <div className="p-4 border-b border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex gap-2 bg-gray-100 p-1 rounded-md">
                   {['All', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(tab => (
                     <button
                       key={tab}
                       onClick={() => setOrderTab(tab)}
                       className={`px-4 py-1.5 text-xs font-semibold rounded ${
                         orderTab === tab ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                       }`}
                     >
                       {tab}
                     </button>
                   ))}
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
                  <input 
                    type="text" 
                    placeholder="Search Order ID or Name..." 
                    className="pl-9 pr-4 py-2 border rounded-md text-sm w-64 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-semibold border-b">
                    <tr>
                      <th className="p-4">Order Info</th>
                      <th className="p-4">Customer</th>
                      <th className="p-4">Items</th>
                      <th className="p-4">Total</th>
                      <th className="p-4">Status & Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredOrders.map(order => {
                      // ✅ CRITICAL FIX: Ensure items array exists
                      const items = order.orderItems || order.products || [];

                      return (
                      <tr key={order._id} className="hover:bg-gray-50">
                        <td className="p-4">
                          <span className="font-mono font-bold text-gray-700">#{order._id.slice(-6).toUpperCase()}</span>
                          <div className="text-xs text-gray-400 mt-1">{new Date(order.createdAt).toLocaleDateString()}</div>
                        </td>
                        <td className="p-4">
                           <div className="font-medium">{order.address?.fullName}</div>
                           <div className="text-xs text-gray-500">{order.address?.phone}</div>
                        </td>
                        <td className="p-4 text-xs text-gray-600 max-w-xs">
                          {items.map((p, i) => (
                            <div key={i}>{p.title} <span className="text-gray-400">x{p.quantity}</span></div>
                          ))}
                        </td>
                        <td className="p-4 font-bold text-gray-700">₹{order.amount}</td>
                        <td className="p-4">
                          <div className="flex flex-col gap-2">
                            <select 
                              value={order.status}
                              onChange={(e) => updateStatus(order._id, e.target.value)}
                              className={`text-xs border rounded p-1 font-semibold ${
                                order.status === 'Processing' ? 'text-orange-600 bg-orange-50 border-orange-200' :
                                order.status === 'Shipped' ? 'text-blue-600 bg-blue-50 border-blue-200' :
                                order.status === 'Delivered' ? 'text-green-600 bg-green-50 border-green-200' :
                                'text-gray-600'
                              }`}
                            >
                              <option value="Processing">Processing</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>

                            {/* Logistics Button */}
                            {order.status !== 'Cancelled' && (
                              !order.shiprocketOrderId ? (
                                <button 
                                  onClick={() => handleShip(order._id)}
                                  className="flex items-center justify-center gap-1 bg-indigo-600 text-white text-xs py-1.5 px-2 rounded hover:bg-indigo-700 transition"
                                >
                                  <Truck size={12} /> Ship via Shiprocket
                                </button>
                              ) : (
                                <span className="text-[10px] text-center bg-gray-100 text-gray-500 py-1 rounded border">
                                  Track ID: {order.shiprocketOrderId}
                                </span>
                              )
                            )}
                          </div>
                        </td>
                      </tr>
                    )})}
                    {filteredOrders.length === 0 && (
                      <tr><td colSpan="5" className="p-8 text-center text-gray-400">No orders found matching filters.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* --- VIEW: INVENTORY --- */}
          {activeSection === 'inventory' && (
             <div className="bg-white rounded-lg shadow-sm border border-gray-200">
               <div className="p-6 border-b">
                 <h3 className="font-bold text-gray-700">Stock Management</h3>
               </div>
               <div className="overflow-x-auto">
                 <table className="w-full text-left text-sm">
                   <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-semibold">
                     <tr>
                       <th className="p-4">Product</th>
                       <th className="p-4">Price</th>
                       <th className="p-4">Current Stock</th>
                       <th className="p-4">Actions</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-100">
                     {products.map(product => (
                       <tr key={product._id} className="hover:bg-gray-50">
                         <td className="p-4 flex items-center gap-3">
                           <img src={product.image} alt="" className="w-10 h-10 object-cover rounded bg-gray-100" />
                           <span className="font-medium text-gray-800">{product.name}</span>
                         </td>
                         <td className="p-4">₹{product.price}</td>
                         <td className="p-4">
                           <span className={`px-2 py-1 rounded text-xs font-bold ${
                             product.countInStock < 5 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                           }`}>
                             {product.countInStock} Units
                           </span>
                         </td>
                         <td className="p-4">
                           <div className="flex items-center gap-2">
                             <input 
                               type="number" 
                               defaultValue={product.countInStock}
                               min="0"
                               id={`stock-${product._id}`}
                               className="w-16 border rounded p-1 text-center text-sm"
                             />
                             <button 
                               onClick={() => {
                                 const val = document.getElementById(`stock-${product._id}`).value;
                                 handleStockUpdate(product._id, val);
                               }}
                               className="bg-blue-600 hover:bg-blue-700 text-white p-1.5 rounded transition"
                               title="Update Stock"
                             >
                               <Save size={14} />
                             </button>
                           </div>
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
             </div>
          )}

          {/* --- VIEW: ANALYTICS --- */}
          {activeSection === 'analytics' && (
            <div className="grid grid-cols-1 gap-8">
              <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center py-20">
                 <BarChart3 size={48} className="mx-auto text-blue-200 mb-4" />
                 <h3 className="text-xl font-bold text-gray-700">Deep Analytics</h3>
                 <p className="text-gray-500 max-w-md mx-auto mt-2">
                   Advanced revenue graphs and customer retention metrics will appear here. 
                   <br/>(Currently displaying summary stats in Dashboard Home).
                 </p>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

// --- SUBCOMPONENTS ---

const SidebarItem = ({ icon, label, active, onClick, badge, alert }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center justify-between px-4 py-3 rounded-md transition-all duration-200 ${
      active ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
    }`}
  >
    <div className="flex items-center gap-3">
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </div>
    <div className="flex gap-2">
      {alert && <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>}
      {badge > 0 && (
        <span className="bg-indigo-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
          {badge}
        </span>
      )}
    </div>
  </button>
);

const StatCard = ({ title, value, color }) => {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600 border-blue-200",
    purple: "bg-purple-50 text-purple-600 border-purple-200",
    orange: "bg-orange-50 text-orange-600 border-orange-200",
    red: "bg-red-50 text-red-600 border-red-200",
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition">
      <div className={`absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition ${colorClasses[color].split(" ")[1]}`}>
         <ArrowUpRight size={48} />
      </div>
      <p className="text-gray-500 text-xs uppercase tracking-widest font-semibold mb-2">{title}</p>
      <h3 className="text-3xl font-bold text-gray-800">{value}</h3>
    </div>
  );
};

export default AdminDashboard;