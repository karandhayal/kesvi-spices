const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  // 1. FIX: Set required to false (allows Guest Checkout)
  userId: { type: String, required: false },
  
  // 2. FIX: Rename 'products' to 'orderItems' (Matches your Route code)
  orderItems: [
    {
      productId: { type: String },
      title: String,
      quantity: { type: Number, default: 1 },
      price: Number,
      variant: String,
      image: String
    }
  ],

  // --- Payment & Costs ---
  amount: { type: Number, required: true },   // Final amount
  subtotal: { type: Number, required: true }, // Before discount
  discount: { type: Number, default: 0 },     
  couponCode: { type: String }, 
  shippingFee: { type: Number, default: 0 },

  // --- Address ---
  address: { 
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    country: { type: String, default: "India" },
    email: { type: String } // Added email (often useful in address)
  },
  
  // --- Order Status ---
  status: { type: String, default: "Processing" },
  
  // --- Payment Details ---
  paymentMethod: { type: String, enum: ['COD', 'ONLINE', 'UPI_MANUAL'], required: true },
  paymentStatus: { type: String, default: "Pending" },
  transactionId: { type: String },

  // --- SHIPROCKET INTEGRATION FIELDS ---
  shiprocketOrderId: { type: Number },
  shipmentId: { type: Number },        
  awbCode: { type: String },           
  courierName: { type: String }        

}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);