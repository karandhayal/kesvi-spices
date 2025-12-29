import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { _id, slug, name, image, tag, category, variants } = product;
  const { addToCart } = useCart();

  // 1. Determine Display Data (Default to first variant)
  const currentVariant = variants && variants.length > 0 ? variants[0] : null;
  const displayPrice = currentVariant ? currentVariant.price : product.price;
  const displayOriginalPrice = currentVariant ? currentVariant.originalPrice : product.originalPrice;
  const displayWeight = currentVariant ? currentVariant.weight : "";

  // 2. Calculate Discount
  const discount = displayOriginalPrice 
    ? Math.round(((displayOriginalPrice - displayPrice) / displayOriginalPrice) * 100) 
    : 0;

  // 3. Handle Add to Cart
  const handleAddToCart = (e) => {
    e.preventDefault(); // Stop Link from opening
    e.stopPropagation();

    addToCart({
      id: _id,
      name: name,
      price: displayPrice,
      image: image,
      variant: displayWeight,
      quantity: 1
    });
  };

  return (
    <div className="group flex flex-col h-full bg-white border border-gray-100 rounded-sm overflow-hidden hover:shadow-xl transition-all duration-300">
      
      {/* Clickable Image Area */}
      <Link to={`/product/${slug}`} className="relative aspect-[4/5] overflow-hidden bg-gray-50 block">
        {tag && (
          <span className="absolute top-3 left-3 bg-red-700 text-white text-[9px] font-bold px-3 py-1 uppercase tracking-widest z-10 shadow-sm">
            {tag}
          </span>
        )}
        
        <img 
          src={image} 
          alt={name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </Link>

      {/* Content Area */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Category */}
        <div className="text-[10px] uppercase tracking-widest text-gray-400 mb-1 font-bold">
          {category}
        </div>
        
        {/* Title */}
        <Link to={`/product/${slug}`}>
          <h3 className="font-serif text-lg text-parosa-dark mb-2 leading-tight hover:text-parosa-accent transition-colors line-clamp-2">
            {name}
          </h3>
        </Link>

        {/* Variant Badge */}
        {displayWeight && (
          <div className="text-xs text-gray-500 mb-3 bg-gray-50 w-fit px-2 py-0.5 rounded border border-gray-100">
            {displayWeight}
          </div>
        )}

        {/* Price Section */}
        <div className="mt-auto mb-4 flex items-end gap-2">
          <span className="text-lg font-bold text-parosa-dark">₹{displayPrice}</span>
          {displayOriginalPrice > displayPrice && (
            <>
              <span className="text-sm text-gray-400 line-through mb-1">₹{displayOriginalPrice}</span>
              <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded ml-auto">
                {discount}% OFF
              </span>
            </>
          )}
        </div>

        {/* ALWAYS VISIBLE ADD TO CART BUTTON */}
        <button 
          onClick={handleAddToCart}
          className="w-full bg-parosa-dark text-white py-3 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-parosa-accent transition-colors active:scale-[0.98]"
        >
          <ShoppingBag size={16} />
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;