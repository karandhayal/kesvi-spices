const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  products: [
    {
      productId: { type: String },
      title: String,
      quantity: { type: Number, default: 1 },
      price: Number,
      variant: String,
      image: String
    }
  ],
  amount: { type: Number, required: true }, // Final amount user pays
  subtotal: { type: Number, required: true }, // Total before discount
  discount: { type: Number, default: 0 }, // Discount applied
  couponCode: { type: String }, 
  
  address: { 
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    country: { type: String, default: "India" }
  },
  
  status: { type: String, default: "processing" }, // processing, shipped, delivered, cancelled
  
  paymentMethod: { type: String, enum: ['UPI', 'COD'], required: true },
  paymentStatus: { type: String, default: "pending" }, // pending, success, failed
  transactionId: { type: String }, // PhonePe Transaction ID
  
  shippingFee: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);