const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  products: [
    {
      productId: { type: String }, // Changed from ObjectId to String to prevent crash
      title: { type: String },
      image: { type: String },
      price: { type: Number },
      quantity: { type: Number, default: 1 },
      variant: { type: String }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Cart', CartSchema);