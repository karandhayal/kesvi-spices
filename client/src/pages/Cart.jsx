import React from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, loading } = useCart();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-parosa-bg">
        <p className="text-parosa-dark text-xl font-serif animate-pulse">Loading Cart...</p>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-parosa-bg px-6 text-center">
        <div className="bg-white p-6 rounded-full mb-6 shadow-sm">
          <ShoppingBag size={48} className="text-gray-300" />
        </div>
        <h2 className="text-2xl md:text-3xl font-serif text-parosa-dark mb-3">Your Cart is Empty</h2>
        <p className="text-gray-500 mb-8 max-w-xs mx-auto text-sm">Looks like you haven't added any authentic flavors yet.</p>
        <Link to="/shop" className="bg-parosa-dark text-white px-8 py-3.5 uppercase tracking-widest text-xs font-bold hover:bg-parosa-accent transition-colors shadow-lg">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-parosa-bg pt-20 pb-32 md:pb-12 md:pt-32">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        
        {/* Page Title */}
        <div className="flex items-end justify-between mb-8 border-b border-gray-200 pb-4">
          <h1 className="text-2xl md:text-4xl font-serif text-parosa-dark">Shopping Bag</h1>
          <span className="text-xs font-bold uppercase tracking-widest text-gray-500">{cartItems.length} Items</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
          
          {/* --- CART ITEMS LIST --- */}
          <div className="flex-1 space-y-4">
            {cartItems.map((item) => (
              <div 
                key={`${item.productId}-${item.variant || 'def'}`} 
                className="bg-white p-4 md:p-6 shadow-sm border border-gray-100 flex gap-4 md:gap-6 relative group rounded-sm"
              >
                
                {/* Product Image */}
                <div className="w-20 h-20 md:w-32 md:h-32 flex-shrink-0 bg-gray-50 border border-gray-100">
                  <img 
                    src={item.image || "https://via.placeholder.com/150"} 
                    alt={item.name} 
                    className="w-full h-full object-contain p-2" 
                  />
                </div>

                {/* Product Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start pr-6">
                      <h3 className="text-base md:text-lg font-serif text-parosa-dark leading-tight line-clamp-2">
                        {item.name || item.title}
                      </h3>
                      
                      {/* Desktop Remove Button (Hidden on Mobile) */}
                      <button 
                        onClick={() => removeFromCart(item.productId)}
                        className="hidden md:block text-gray-300 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                    
                    {/* Variant Badge */}
                    {item.variant && (
                      <span className="text-[10px] md:text-xs font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-sm mt-1 inline-block uppercase tracking-wide">
                        {item.variant}
                      </span>
                    )}
                  </div>

                  {/* Price & Controls Row */}
                  <div className="flex items-end justify-between mt-3">
                    
                    {/* Price */}
                    <div className="font-medium text-parosa-dark text-sm md:text-base">
                      ₹{Number(item.price) || 0}
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center border border-gray-200 rounded-sm">
                      <button 
                        onClick={() => updateQuantity(item.productId, (Number(item.quantity) || 1) - 1)}
                        className="p-1.5 hover:bg-gray-100 text-gray-600 transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-6 text-center text-xs font-bold text-parosa-dark">
                        {Number(item.quantity) || 1}
                      </span>
                      <button 
                        onClick={() => updateQuantity(item.productId, (Number(item.quantity) || 1) + 1)}
                        className="p-1.5 hover:bg-gray-100 text-gray-600 transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Mobile Remove Button (Absolute Position) */}
                <button 
                  onClick={() => removeFromCart(item.productId)}
                  className="absolute top-3 right-3 md:hidden text-gray-300 hover:text-red-500 p-1"
                >
                  <Trash2 size={16} />
                </button>

              </div>
            ))}
          </div>

          {/* --- DESKTOP SIDEBAR SUMMARY (Hidden on Mobile) --- */}
          <div className="hidden lg:block w-80 xl:w-96 shrink-0">
            <div className="bg-white p-8 shadow-sm border border-gray-100 sticky top-32">
              <h3 className="text-lg font-serif text-parosa-dark mb-6 border-b border-gray-100 pb-4">Order Summary</h3>
              
              <div className="flex justify-between mb-4 text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">₹{Number(cartTotal) || 0}</span>
              </div>
              
              <div className="flex justify-between mb-6 text-sm">
                <span className="text-gray-600">Shipping</span>
                <span className="text-green-600 font-bold text-xs uppercase tracking-wider">Free</span>
              </div>

              <div className="flex justify-between mb-8 text-xl font-serif border-t border-gray-100 pt-4 text-parosa-dark">
                <span>Total</span>
                <span>₹{Number(cartTotal) || 0}</span>
              </div>

              <Link 
                to="/checkout"
                className="w-full bg-parosa-dark text-white py-4 flex items-center justify-center gap-2 uppercase tracking-widest text-xs font-bold hover:bg-gray-900 transition-all shadow-lg active:scale-[0.98]"
              >
                Proceed to Checkout <ArrowRight size={16} />
              </Link>
              
              <div className="mt-6 flex justify-center gap-2 opacity-50 grayscale">
                 {/* Placeholder for payment icons if needed */}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* --- MOBILE STICKY CHECKOUT BAR (Visible only on Mobile) --- */}
      <div className="lg:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-40">
        <div className="flex gap-4 max-w-6xl mx-auto">
          <div className="flex flex-col justify-center w-1/3">
            <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Total</span>
            <span className="text-xl font-serif text-parosa-dark font-medium">₹{Number(cartTotal) || 0}</span>
          </div>
          <Link 
            to="/checkout"
            className="flex-1 bg-parosa-dark text-white flex items-center justify-center gap-2 uppercase tracking-widest text-xs font-bold rounded-sm shadow-md active:scale-[0.98] transition-transform"
          >
            Checkout <ArrowRight size={16} />
          </Link>
        </div>
      </div>

    </div>
  );
};

export default Cart;