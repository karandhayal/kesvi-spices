import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ShoppingBag, ShieldCheck, Truck, Award, Check } from 'lucide-react'; // Changed Icon imports
import { useCart } from '../context/CartContext';

const ProductDetails = () => {
  const { slug } = useParams();
  const { addToCart } = useCart();

  // Data State
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // UI State
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [qty, setQty] = useState(1);
  const [showToast, setShowToast] = useState(false); // For the custom popup

  // 1. Fetch Data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
        const { data } = await axios.get(`${apiUrl}/api/products/${slug}`);
        
        setProduct(data);
        
        // Auto-select first variant
        if (data.variants && data.variants.length > 0) {
          setSelectedVariant(data.variants[0]);
        }
        setLoading(false);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Product not found");
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  // 2. Handle Add to Cart
  const handleAddToCart = () => {
    if (!product) return;

    const priceToUse = selectedVariant ? selectedVariant.price : product.price;
    const weightToUse = selectedVariant ? selectedVariant.weight : (product.variants?.[0]?.weight || "Standard");

    addToCart({
      id: product._id,
      name: product.name,
      price: priceToUse,
      image: product.image,
      variant: weightToUse,
      quantity: qty
    });

    // Show Custom Toast Notification
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000); // Hide after 3 seconds
  };

  // 3. Loading & Error States
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-parosa-bg">
      <div className="animate-pulse text-parosa-dark font-serif text-xl">Loading...</div>
    </div>
  );

  if (error || !product) return (
    <div className="min-h-screen flex items-center justify-center bg-parosa-bg">
      <div className="text-center">
        <h2 className="text-2xl font-serif text-parosa-dark mb-4">Product Not Found</h2>
        <Link to="/shop" className="text-sm underline">Return to Shop</Link>
      </div>
    </div>
  );

  // Calculate Prices for Display
  const currentPrice = selectedVariant ? selectedVariant.price : product.price;
  const originalPrice = selectedVariant ? selectedVariant.originalPrice : product.originalPrice;

  return (
    <div className="bg-parosa-bg min-h-screen pb-20 pt-20 md:pt-32">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        
        {/* Breadcrumbs (Hidden on very small screens) */}
        <nav className="hidden md:flex flex-wrap gap-2 text-[10px] uppercase tracking-widest text-gray-500 mb-8 font-medium">
          <Link to="/" className="hover:text-parosa-dark">Home</Link> / 
          <Link to="/shop" className="hover:text-parosa-dark">{product.category || 'Shop'}</Link> / 
          <span className="text-parosa-dark font-bold">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
          
          {/* IMAGE SECTION */}
          <div className="relative">
            <div className="aspect-square bg-white border border-gray-200 p-6 md:p-10 flex items-center justify-center relative overflow-hidden rounded-sm">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-contain hover:scale-105 transition-transform duration-500" 
              />
              {product.tag && (
                <div className="absolute top-3 left-3 bg-red-700 text-white text-[9px] px-2 py-1 font-bold uppercase tracking-widest">
                  {product.tag}
                </div>
              )}
            </div>
          </div>

          {/* INFO SECTION */}
          <div className="flex flex-col">
            
            {/* Title & Price */}
            <div className="mb-4 md:mb-6 border-b border-gray-200 pb-4 md:pb-6">
              <h1 className="text-3xl md:text-5xl font-serif text-parosa-dark mb-2 md:mb-4 leading-tight">
                {product.name}
              </h1>
              
              <div className="flex items-end gap-3">
                <span className="text-2xl md:text-3xl font-serif text-parosa-dark font-medium">
                  ₹{currentPrice}
                </span>
                {originalPrice > currentPrice && (
                  <span className="text-base md:text-lg text-gray-400 line-through mb-1">
                    ₹{originalPrice}
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-600 leading-relaxed mb-6 text-sm md:text-base">
              {product.description || "Sourced directly from partner farms and processed using traditional stone-grinding methods to retain maximum nutrition."}
            </p>

            {/* Variant Selector */}
            {product.variants && product.variants.length > 0 && (
              <div className="mb-6">
                <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400 block mb-2">
                  Pack Size
                </span>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v) => (
                    <button 
                      key={v.weight}
                      onClick={() => setSelectedVariant(v)}
                      className={`px-4 py-2 text-xs font-bold border rounded-sm uppercase tracking-wide transition-all ${
                        selectedVariant && selectedVariant.weight === v.weight 
                          ? 'bg-parosa-dark text-white border-parosa-dark' 
                          : 'bg-white border-gray-200 text-gray-500 hover:border-parosa-dark'
                      }`}
                    >
                      {v.weight}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ACTION AREA (Qty + Button) */}
            <div className="flex gap-3 mb-8 sticky bottom-0 bg-parosa-bg pb-4 md:static md:pb-0 z-10">
              
              {/* Qty Selector */}
              <div className="flex items-center border border-gray-300 bg-white h-12 w-24 md:w-32 md:h-14 shrink-0 rounded-sm">
                  <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-8 md:w-10 h-full hover:bg-gray-50 text-gray-600 font-bold text-lg">-</button>
                  <span className="flex-1 text-center font-bold text-parosa-dark text-sm">{qty}</span>
                  <button onClick={() => setQty(qty + 1)} className="w-8 md:w-10 h-full hover:bg-gray-50 text-gray-600 font-bold text-lg">+</button>
              </div>

              {/* Add Button */}
              <button 
                onClick={handleAddToCart}
                disabled={product.countInStock === 0}
                className="flex-1 bg-parosa-dark text-white h-12 md:h-14 rounded-sm uppercase tracking-widest font-bold text-xs flex items-center justify-center gap-2 hover:bg-gray-900 transition-all active:scale-[0.98] shadow-lg"
              >
                <ShoppingBag size={18} /> 
                {product.countInStock === 0 ? "Out of Stock" : (
                  <>
                    <span className="md:hidden">Add to Cart</span>
                    <span className="hidden md:inline">Add to Shopping Bag</span>
                  </>
                )}
              </button>
            </div>

            {/* Trust Badges - UPDATED */}
            <div className="grid grid-cols-3 gap-2 pt-6 border-t border-gray-200">
              <TrustBadge icon={ShieldCheck} text="100% Pure" color="text-green-700" />
              <TrustBadge icon={Truck} text="Fast Delivery" color="text-blue-700" />
              {/* Removed Easy Returns, Added Authentic Taste */}
              <TrustBadge icon={Award} text="Authentic Taste" color="text-amber-600" />
            </div>

          </div>
        </div>
      </div>

      {/* CUSTOM TOAST NOTIFICATION */}
      <div className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded shadow-2xl flex items-center gap-3 transition-all duration-300 z-50 ${showToast ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
        <div className="bg-green-500 rounded-full p-0.5">
          <Check size={14} className="text-white" />
        </div>
        <span className="text-sm font-medium">Added to Cart successfully!</span>
      </div>

    </div>
  );
};

// Helper Component for Trust Icons
const TrustBadge = ({ icon: Icon, text, color }) => (
  <div className="flex flex-col items-center text-center gap-1">
    <Icon size={18} className={color} />
    <span className="text-[8px] md:text-[9px] uppercase font-bold tracking-widest text-gray-500">{text}</span>
  </div>
);

export default ProductDetails;