import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ShoppingBag, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { useCart } from '../context/CartContext'; // Import Cart Context

const ProductDetails = () => {
  const { slug } = useParams();
  const { addToCart } = useCart(); // Use the context hook

  // State
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Selection State
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [qty, setQty] = useState(1);

  // 1. Fetch Data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
        const { data } = await axios.get(`${apiUrl}/api/products/${slug}`);
        
        setProduct(data);
        
        // Auto-select the first variant
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

  // 2. Handle Add to Cart (Fixed)
  const handleAddToCart = () => {
    if (!product) return;

    // Determine correct price/weight based on selection
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
    
    // Optional: You could add a toast notification here
    // alert("Added to cart!"); 
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-parosa-bg">
      <div className="animate-pulse text-parosa-dark font-serif text-xl">Loading pure goodness...</div>
    </div>
  );

  if (error || !product) return (
    <div className="min-h-screen flex items-center justify-center bg-parosa-bg">
      <div className="text-center">
        <h2 className="text-2xl font-serif text-parosa-dark mb-4">Product Not Found</h2>
        <Link to="/shop" className="text-sm underline hover:text-parosa-accent">Return to Shop</Link>
      </div>
    </div>
  );

  // Calculate Display Values
  const currentPrice = selectedVariant ? selectedVariant.price : product.price;
  const originalPrice = selectedVariant ? selectedVariant.originalPrice : product.originalPrice;

  return (
    <div className="bg-parosa-bg min-h-screen pb-20 pt-24 md:pt-32">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Breadcrumbs */}
        <nav className="flex flex-wrap gap-2 text-[10px] uppercase tracking-widest text-gray-500 mb-10 font-medium">
          <Link to="/" className="hover:text-parosa-dark transition-colors">Home</Link> / 
          <Link to="/shop" className="hover:text-parosa-dark transition-colors">{product.category || 'Shop'}</Link> / 
          <span className="text-parosa-dark font-bold">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20">
          
          {/* LEFT: Image */}
          <div className="relative group">
            <div className="aspect-square bg-white border border-gray-200 p-8 flex items-center justify-center relative overflow-hidden rounded-sm shadow-sm">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-contain hover:scale-105 transition-transform duration-700 ease-out" 
              />
              {product.tag && (
                <div className="absolute top-4 left-4 bg-red-700 text-white text-[10px] px-3 py-1.5 font-bold uppercase tracking-widest shadow-md">
                  {product.tag}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: Info */}
          <div className="flex flex-col justify-center">
            
            <div className="mb-6 border-b border-gray-200 pb-6">
              <h1 className="text-4xl md:text-5xl font-serif text-parosa-dark mb-4 leading-tight">
                {product.name}
              </h1>
              
              <div className="flex items-end gap-3">
                <span className="text-3xl font-serif text-parosa-dark font-medium">
                  ₹{currentPrice}
                </span>
                {originalPrice > currentPrice && (
                  <span className="text-lg text-gray-400 line-through mb-1 decoration-1">
                    ₹{originalPrice}
                  </span>
                )}
              </div>
            </div>

            <p className="text-gray-600 leading-relaxed mb-8 text-sm md:text-base">
              {product.description || "Experience the authentic taste of tradition. Sourced directly from our partner farms and processed using traditional methods."}
            </p>

            {/* Variant Selector */}
            {product.variants && product.variants.length > 0 && (
              <div className="mb-8">
                <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400 block mb-3">
                  Select Pack Size
                </span>
                <div className="flex flex-wrap gap-3">
                  {product.variants.map((v) => (
                    <button 
                      key={v.weight}
                      onClick={() => setSelectedVariant(v)}
                      className={`px-6 py-3 text-xs font-bold border transition-all rounded-sm uppercase tracking-wide ${
                        selectedVariant && selectedVariant.weight === v.weight 
                          ? 'bg-parosa-dark text-white border-parosa-dark shadow-md transform scale-105' 
                          : 'bg-white border-gray-200 text-gray-500 hover:border-parosa-dark hover:text-parosa-dark'
                      }`}
                    >
                      {v.weight}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <div className="flex items-center border border-gray-300 bg-white w-32 h-14">
                  <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-10 h-full hover:bg-gray-100 text-gray-600 font-bold text-lg">-</button>
                  <span className="flex-1 text-center font-bold text-parosa-dark">{qty}</span>
                  <button onClick={() => setQty(qty + 1)} className="w-10 h-full hover:bg-gray-100 text-gray-600 font-bold text-lg">+</button>
              </div>

              <button 
                onClick={handleAddToCart}
                disabled={product.countInStock === 0}
                className="flex-1 bg-parosa-dark text-white h-14 uppercase tracking-widest font-bold text-xs flex items-center justify-center gap-3 hover:bg-gray-900 transition-all active:scale-[0.98] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingBag size={18} /> 
                {product.countInStock === 0 ? "Out of Stock" : "Add to Shopping Bag"}
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-gray-200">
              <div className="flex flex-col items-center text-center gap-2 group">
                <ShieldCheck size={20} className="text-green-700" />
                <span className="text-[9px] uppercase font-bold tracking-widest text-gray-500">100% Pure</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2 group">
                <Truck size={20} className="text-blue-700" />
                <span className="text-[9px] uppercase font-bold tracking-widest text-gray-500">Fast Delivery</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2 group">
                <RotateCcw size={20} className="text-orange-700" />
                <span className="text-[9px] uppercase font-bold tracking-widest text-gray-500">Easy Returns</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;