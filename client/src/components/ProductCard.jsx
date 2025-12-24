import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  // We destructure 'product' prop to get data safely
  const { _id, slug, name, image, tag, category, variants } = product;
  const { addToCart } = useCart();

  // 1. DETERMINE DISPLAY DATA
  // If variants exist, use the first one (Default Size). Otherwise use fallback top-level data.
  const currentVariant = variants && variants.length > 0 ? variants[0] : null;
  
  const displayPrice = currentVariant ? currentVariant.price : product.price;
  const displayOriginalPrice = currentVariant ? currentVariant.originalPrice : product.originalPrice;
  const displayWeight = currentVariant ? currentVariant.weight : "";

  // 2. CALCULATE DISCOUNT
  const discount = displayOriginalPrice 
    ? Math.round(((displayOriginalPrice - displayPrice) / displayOriginalPrice) * 100) 
    : 0;

  // 3. HANDLE ADD TO CART
  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    addToCart({
      id: _id,
      name: name,
      price: displayPrice,
      image: image,
      variant: displayWeight, // <--- CRITICAL: Passing the size (e.g. "100g") to Cart
      quantity: 1
    });
  };

  return (
    <div className="group relative bg-white border border-gray-100 transition-all duration-300 hover:shadow-xl hover:border-gray-200 flex flex-col h-full rounded-sm overflow-hidden">
      
      {/* IMAGE AREA */}
      <div className="relative aspect-[4/5] overflow-hidden bg-gray-50">
        {tag && (
          <span className="absolute top-3 left-3 bg-parosa-dark text-white text-[9px] font-bold px-3 py-1 uppercase tracking-widest z-10 shadow-sm">
            {tag}
          </span>
        )}
        
        <Link to={`/product/${slug}`}>
          <img 
            src={image} 
            alt={name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </Link>

        {/* QUICK ADD BUTTON */}
        <button 
          onClick={handleAddToCart}
          className="absolute bottom-4 right-4 bg-white text-parosa-dark p-3 rounded-full shadow-lg translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:bg-parosa-accent hover:text-white cursor-pointer z-20"
          title="Add default size to cart"
        >
          <ShoppingBag size={18} />
        </button>
      </div>

      {/* CONTENT AREA */}
      <div className="p-4 flex flex-col flex-grow">
        <div className="text-[10px] uppercase tracking-widest text-gray-400 mb-1 font-bold">
          {category}
        </div>
        
        <Link to={`/product/${slug}`}>
          <h3 className="font-serif text-lg text-parosa-dark mb-1 leading-tight group-hover:text-parosa-accent transition-colors">
            {name}
          </h3>
        </Link>

        {/* Variant Badge (e.g., 100g) */}
        {displayWeight && (
          <div className="text-xs text-gray-500 mb-2 bg-gray-100 w-fit px-2 py-0.5 rounded">
            {displayWeight}
          </div>
        )}

        {/* PRICE SECTION */}
        <div className="mt-auto flex items-end gap-2 border-t border-gray-50 pt-3">
          <span className="text-lg font-bold text-parosa-dark">₹{displayPrice}</span>
          
          {displayOriginalPrice > displayPrice && (
            <>
              <span className="text-sm text-gray-400 line-through mb-1">₹{displayOriginalPrice}</span>
              <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full mb-1 ml-auto">
                {discount}% OFF
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;