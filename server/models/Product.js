const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true }, // e.g. "turmeric-powder"
  tag: { type: String }, // e.g. "Best Seller"
  category: { type: String, required: true },
  
  // DESCRIPTION
  benefits: { type: String, required: true }, // Short text for cards
  description: { type: String }, // Long HTML/Text for product page
  
  // IMAGE (Stores path like "/products/turmeric.jpg")
  image: { type: String, required: true, default: '/products/placeholder.jpg' },

  // --- VARIANTS (New! For 100g vs 500g) ---
  variants: [
    {
      weight: { type: String, required: true }, // e.g., "100g"
      price: { type: Number, required: true },  // Price for this specific weight
      originalPrice: { type: Number },          // MRP for this specific weight
      inStock: { type: Boolean, default: true }
    }
  ],

  // --- FALLBACKS (For sorting/filtering simplified views) ---
  price: { type: Number, required: true }, // Base price (usually smallest size)
  originalPrice: { type: Number },
  countInStock: { type: Number, default: 100 },
  
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);