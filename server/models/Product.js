const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true }, // Crucial for SEO URLs
  tag: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number, required: true },
  benefits: { type: String, required: true },
  description: { type: String }, // Extra field for product details page
  countInStock: { type: Number, required: true, default: 100 },
  image: { type: String, default: '/images/placeholder.jpg' } 
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);