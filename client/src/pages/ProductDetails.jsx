import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, ShoppingBag, Truck, ShieldCheck, Tag } from 'lucide-react';

const ProductDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for user selections
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [qty, setQty] = useState(1);

  // Fetch Product Data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        // Note: Make sure port matches your server
        const { data } = await axios.get(`http://localhost:5000/api/products/${slug}`);
        setProduct(data);
        
        // Auto-select the first variant (smallest size)
        if (data.variants && data.variants.length > 0) {
          setSelectedVariant(data.variants[0]);
        }
        setLoading(false);
      } catch (err) {
        setError(err.response && err.response.data.message ? err.response.data.message : err.message);
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  const addToCartHandler = () => {
    // Navigate to Cart with Query Params
    navigate(`/cart/${product._id}?qty=${qty}&variant=${selectedVariant.weight}`);
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen text-parosa-dark font-serif text-xl">
      Loading Product...
    </div>
  );

  if (error) return (
    <div className="flex justify-center items-center h-screen text-red-600">
      Product Not Found
    </div>
  );

  if (!product) return null;

  // Calculate Discount %
  const discount = selectedVariant 
    ? Math.round(((selectedVariant.originalPrice - selectedVariant.price) / selectedVariant.originalPrice) * 100)
    : 0;

  return (
    <div className="bg-white min-h-screen pb-20 pt-20"> {/* pt-20 added for Navbar spacing */}
      
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-6 pb-4">
        <Link to="/shop" className="inline-flex items-center text-gray-500 hover:text-parosa-dark transition-colors text-sm font-medium">
          <ArrowLeft size={16} className="mr-2" /> Back to Shop
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
        
        {/* LEFT COLUMN: Product Image */}
        <div className="relative group">
          <div className="aspect-[4/5] bg-gray-100 overflow-hidden rounded-sm relative shadow-sm border border-gray-100">
             <img 
               src={product.image} 
               alt={product.name} 
               className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
             />
             {/* Tag Overlay */}
             {product.tag && (
               <div className="absolute top-4 left-4 bg-parosa-accent text-white text-xs font-bold px-3 py-1 uppercase tracking-wider shadow-md">
                 {product.tag}
               </div>
             )}
          </div>
        </div>

        {/* RIGHT COLUMN: Product Details */}
        <div className="flex flex-col justify-center">
          
          {/* Header Info */}
          <div className="mb-6">
            <span className="text-sm text-gray-500 uppercase tracking-widest font-bold">{product.category}</span>
            <h1 className="text-3xl md:text-5xl font-serif text-parosa-dark mt-3 mb-4 leading-tight">
              {product.name}
            </h1>
            
            {/* Price Block */}
            <div className="flex items-end gap-3 mt-4">
              <span className="text-4xl font-bold text-gray-900 font-serif">
                ₹{selectedVariant ? selectedVariant.price : product.price}
              </span>
              {selectedVariant && selectedVariant.originalPrice > selectedVariant.price && (
                <>
                  <span className="text-xl text-gray-400 line-through decoration-1 mb-1">
                    ₹{selectedVariant.originalPrice}
                  </span>
                  <span className="text-green-700 text-sm font-bold bg-green-100 px-2 py-1 rounded mb-2">
                    {discount}% OFF
                  </span>
                </>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">Inclusive of all taxes</p>
          </div>

          {/* Description */}
          <p className="text-gray-600 leading-relaxed mb-6 border-b border-gray-100 pb-6 text-base">
            {product.description}
          </p>

          {/* Benefits Bullet Points */}
          <div className="flex flex-wrap gap-3 mb-8 text-sm text-gray-700">
            {product.benefits && product.benefits.split('•').map((benefit, index) => (
               <div key={index} className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-sm border border-gray-200">
                 <ShieldCheck size={16} className="text-parosa-accent" />
                 <span className="font-medium">{benefit.trim()}</span>
               </div>
            ))}
          </div>

          {/* Controls: Variants & Quantity */}
          <div className="space-y-6 mb-8 bg-gray-50 p-6 rounded-sm border border-gray-100">
            
            {/* Variant Selector */}
            {product.variants && product.variants.length > 0 && (
              <div>
                <span className="block text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">Select Size (Net Weight)</span>
                <div className="flex flex-wrap gap-3">
                  {product.variants.map((variant) => (
                    <button
                      key={variant.weight}
                      onClick={() => setSelectedVariant(variant)}
                      className={`px-6 py-3 border text-sm font-bold transition-all rounded-sm ${
                        selectedVariant.weight === variant.weight
                          ? 'border-parosa-dark bg-parosa-dark text-white shadow-lg transform scale-105'
                          : 'border-gray-300 text-gray-600 hover:border-gray-500 bg-white'
                      }`}
                    >
                      {variant.weight}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            {product.countInStock > 0 ? (
              <div>
                 <span className="block text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">Quantity</span>
                 <div className="flex items-center w-36 border border-gray-300 bg-white rounded-sm">
                   <button 
                     onClick={() => setQty(Math.max(1, qty - 1))}
                     className="px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-black transition-colors w-12 text-lg"
                   >-</button>
                   <span className="flex-1 text-center font-bold text-gray-900">{qty}</span>
                   <button 
                     onClick={() => setQty(Math.min(product.countInStock, qty + 1))}
                     className="px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-black transition-colors w-12 text-lg"
                   >+</button>
                 </div>
              </div>
            ) : (
              <div className="text-red-600 font-bold bg-red-50 p-3 border border-red-100 rounded text-center">
                Currently Out of Stock
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={addToCartHandler}
              disabled={product.countInStock === 0}
              className="flex-1 bg-parosa-accent hover:bg-orange-700 text-white py-4 px-8 font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-xl rounded-sm text-sm md:text-base"
            >
              <ShoppingBag size={20} />
              Add to Cart
            </button>
          </div>

          {/* Trust Badges */}
          <div className="mt-8 pt-6 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-gray-500 font-medium uppercase tracking-wide">
             <div className="flex items-center gap-3">
               <Truck size={20} className="text-parosa-dark" />
               <span>Fast Delivery across Punjab & Rajasthan</span>
             </div>
             <div className="flex items-center gap-3">
               <Tag size={20} className="text-parosa-dark" />
               <span>100% Authentic & Natural</span>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductDetails;