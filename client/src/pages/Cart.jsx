import React from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, loading } = useCart();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-kesvi-bg">
        <p className="text-parosa-dark text-xl font-serif">Loading Cart...</p>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-kesvi-bg px-4">
        <h2 className="text-3xl font-serif text-parosa-dark mb-4">Your Cart is Empty</h2>
        <p className="text-gray-500 mb-8">Looks like you haven't added any spices yet.</p>
        <Link to="/shop" className="bg-parosa-dark text-white px-8 py-3 uppercase tracking-widest text-xs hover:bg-parosa-accent transition-colors">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-kesvi-bg pt-24 pb-12 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-serif text-parosa-dark mb-12 text-center">Your Shopping Cart</h1>

        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* --- CART ITEMS LIST --- */}
          <div className="flex-1 space-y-6">
            {cartItems.map((item) => (
              // UPDATED: Key now includes variant to prevent duplicates
              <div key={`${item.productId}-${item.variant || 'def'}`} className="flex flex-col md:flex-row items-center bg-white p-6 shadow-sm border border-gray-100 relative">
                
                {/* Product Image */}
                <div className="w-24 h-24 flex-shrink-0 bg-gray-50 mb-4 md:mb-0 md:mr-6">
                  <img 
                    src={item.image || "https://via.placeholder.com/150"} 
                    alt={item.name || item.title} 
                    className="w-full h-full object-cover" 
                  />
                </div>

                {/* Product Details */}
                <div className="flex-1 text-center md:text-left mb-4 md:mb-0">
                  {/* Handle both 'name' and 'title' properties */}
                  <h3 className="text-lg font-serif text-parosa-dark">{item.name || item.title}</h3>
                  
                  {/* UPDATED: Only show variant if it exists */}
                  {item.variant && (
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full mt-1 inline-block">
                       Size: {item.variant}
                    </span>
                  )}
                  
                  <p className="text-parosa-accent font-medium mt-2">
                    ₹{Number(item.price) || 0}
                  </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-4 md:mr-8">
                  <button 
                    onClick={() => updateQuantity(item.productId, (Number(item.quantity) || 1) - 1)}
                    className="p-1 hover:text-parosa-accent transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-8 text-center font-medium">
                    {Number(item.quantity) || 1}
                  </span>
                  <button 
                    onClick={() => updateQuantity(item.productId, (Number(item.quantity) || 1) + 1)}
                    className="p-1 hover:text-parosa-accent transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                {/* Total Price for this item */}
                <div className="font-serif text-lg md:mr-8 w-20 text-right">
                  ₹{(Number(item.price) || 0) * (Number(item.quantity) || 0)}
                </div>

                {/* Remove Button */}
                <button 
                  onClick={() => removeFromCart(item.productId)}
                  className="text-gray-400 hover:text-red-500 transition-colors absolute top-4 right-4 md:static"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>

          {/* --- CHECKOUT SIDEBAR --- */}
          <div className="lg:w-96">
            <div className="bg-white p-8 shadow-sm border border-gray-100 sticky top-24">
              <h3 className="text-lg font-serif text-parosa-dark mb-6 border-b border-gray-100 pb-4">Order Summary</h3>
              
              <div className="flex justify-between mb-4 text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">₹{Number(cartTotal) || 0}</span>
              </div>
              
              <div className="flex justify-between mb-6 text-sm">
                <span className="text-gray-600">Shipping</span>
                <span className="text-green-600">Free</span>
              </div>

              <div className="flex justify-between mb-8 text-lg font-serif border-t border-gray-100 pt-4">
                <span>Total</span>
                <span>₹{Number(cartTotal) || 0}</span>
              </div>

              {/* --- LINK TO CHECKOUT PAGE --- */}
              <Link 
                to="/checkout"
                className="w-full bg-parosa-dark text-white py-4 flex items-center justify-center gap-2 uppercase tracking-widest text-xs font-bold hover:bg-parosa-accent transition-colors"
              >
                Checkout <ArrowRight size={16} />
              </Link>
              
              <p className="text-xs text-gray-400 text-center mt-4">
                Secure Checkout powered by PhonePe
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Cart;