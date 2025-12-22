import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingBag, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { useCart } from '../context/CartContext';

const ProductDetail = ({ products }) => {
  const { slug } = useParams();
  const { addToCart } = useCart();
  
  const product = products.find(p => p.slug === slug);

  const getVariants = () => {
    if (product?.name.includes("Oil")) return ['500ml', '1L', '2L', '5L', '15L'];
    if (product?.name.includes("Atta") || product?.category === "Graded Wheat") return ['5kg', '10kg', '20kg', '50kg'];
    if (product?.category === "Spices") return ['100g', '250g', '500g'];
    return null;
  };

  const variants = getVariants();
  const [selectedVariant, setSelectedVariant] = useState(variants ? variants[0] : null);

  if (!product) return <div className="py-20 text-center font-serif">Product Not Found</div>;

  return (
    <div className="bg-parosa-bg min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-6 pt-10">
        {/* Breadcrumbs for SEO */}
        <nav className="flex gap-2 text-[10px] uppercase tracking-widest text-gray-400 mb-10">
          <Link to="/" className="hover:text-parosa-dark">Home</Link> / 
          <Link to="/shop" className="hover:text-parosa-dark">{product.category}</Link> / 
          <span className="text-parosa-dark font-bold">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Image Section */}
          <div className="aspect-square bg-white border border-gray-100 flex items-center justify-center relative">
            <span className="text-parosa-dark/5 font-serif text-6xl italic">Parosa</span>
            <div className="absolute top-4 left-4 bg-parosa-red text-white text-[10px] px-3 py-1 font-bold uppercase tracking-widest">
              Farm Fresh
            </div>
          </div>

          {/* Info Section */}
          <div className="flex flex-col">
            <p className="text-parosa-accent font-bold uppercase tracking-[0.3em] text-xs mb-2">{product.tag}</p>
            <h1 className="text-4xl md:text-5xl font-serif text-parosa-dark mb-4">{product.name}</h1>
            
            <div className="flex items-end gap-3 mb-8">
              <span className="text-3xl font-serif text-parosa-dark">₹{product.price}</span>
              <span className="text-lg text-gray-400 line-through mb-1">₹{product.originalPrice}</span>
            </div>

            <p className="text-gray-600 leading-relaxed mb-8 border-l-2 border-parosa-muted pl-4">
              {product.benefits}. Sourced directly from our partner farms and processed using traditional stone-grinding to retain 100% nutrition.
            </p>

            {/* Variant Selector */}
            {variants && (
              <div className="mb-10">
                <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400 block mb-4">Select Quantity</span>
                <div className="flex flex-wrap gap-3">
                  {variants.map(v => (
                    <button 
                      key={v}
                      onClick={() => setSelectedVariant(v)}
                      className={`px-6 py-2 text-xs font-bold border transition-all ${selectedVariant === v ? 'bg-parosa-dark text-white border-parosa-dark' : 'border-gray-200 text-gray-500 hover:border-parosa-dark'}`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button 
              onClick={() => addToCart({ ...product, variant: selectedVariant })}
              className="bg-parosa-dark text-white w-full py-5 uppercase tracking-widest font-bold text-xs flex items-center justify-center gap-3 hover:bg-parosa-accent transition-all active:scale-[0.98]"
            >
              <ShoppingBag size={18} /> Add to Shopping Bag
            </button>

            {/* Trust Icons */}
            <div className="grid grid-cols-3 gap-4 mt-12 pt-8 border-t border-gray-100">
              <div className="flex flex-col items-center text-center gap-2">
                <ShieldCheck size={20} className="text-parosa-accent" />
                <span className="text-[9px] uppercase font-bold tracking-widest">100% Pure</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <Truck size={20} className="text-parosa-accent" />
                <span className="text-[9px] uppercase font-bold tracking-widest">Fast Delivery</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <RotateCcw size={20} className="text-parosa-accent" />
                <span className="text-[9px] uppercase font-bold tracking-widest">Easy Returns</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;