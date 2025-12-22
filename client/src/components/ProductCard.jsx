import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Star } from 'lucide-react';
import { useCart } from '../context/CartContext'; // <--- Import Context

const ProductCard = ({ _id, slug, name, price, originalPrice, tag, image, category }) => {
  
  const { addToCart } = useCart(); // <--- Get the magic function
  
  // Calculate discount percentage
  const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  // --- ADD TO CART LOGIC ---
  const handleAddToCart = (e) => {
    e.preventDefault(); // Prevent opening the product page
    e.stopPropagation(); // Stop event bubbling

    // We simply pass the data to Context. 
    // The Context handles the Guest ID, the API call, and the instant Badge update.
    addToCart({
      id: _id, // Make sure this matches your MongoDB _id
      name: name,
      price: price,
      image: image
    });

    // Optional: Small alert or toast can go here, 
    // but the Red Badge update is usually enough feedback!
  };

  return (
    <div className="group relative bg-white border border-gray-100 transition-all duration-300 hover:shadow-xl hover:border-gray-200 flex flex-col h-full">
      
      {/* Image Area */}
      <div className="relative aspect-[4/5] overflow-hidden bg-gray-50">
        {tag && (
          <span className="absolute top-3 left-3 bg-parosa-dark text-white text-[9px] font-bold px-3 py-1 uppercase tracking-widest z-10">
            {tag}
          </span>
        )}
        
        {/* Link uses SLUG now */}
        <Link to={`/product/${slug}`}>
          <img 
            src={image} 
            alt={name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </Link>

        {/* Quick Add Button (With Click Handler) */}
        <button 
          onClick={handleAddToCart}
          className="absolute bottom-4 right-4 bg-white text-parosa-dark p-3 rounded-full shadow-lg translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:bg-parosa-accent hover:text-white cursor-pointer z-20"
        >
          <ShoppingBag size={18} />
        </button>
      </div>

      {/* Content Area */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="text-[10px] uppercase tracking-widest text-gray-400 mb-2 font-bold">
          {category}
        </div>
        
        <Link to={`/product/${slug}`}>
          <h3 className="font-serif text-lg text-parosa-dark mb-2 leading-tight group-hover:text-parosa-accent transition-colors">
            {name}
          </h3>
        </Link>

        {/* Rating Mockup */}
        <div className="flex items-center gap-1 mb-3">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={12} className="fill-parosa-accent text-parosa-accent" />
          ))}
          <span className="text-[10px] text-gray-400 ml-2">(42)</span>
        </div>

        {/* Price Section */}
        <div className="mt-auto flex items-center gap-3 border-t border-gray-50 pt-4">
          <span className="text-lg font-bold text-parosa-dark">₹{price}</span>
          {originalPrice && (
            <>
              <span className="text-sm text-gray-400 line-through">₹{originalPrice}</span>
              <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
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