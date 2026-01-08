const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  // 1. User Handling
  userId: { type: String, required: false }, // False allows Guest Checkout
  
  // 2. Order Items
  orderItems: [
    {
      productId: { type: String },
      name: String, // ✅ CHANGED: Frontend sends 'name', not 'title'
      quantity: { type: Number, default: 1 },
      price: Number,
      variant: String,
      image: String
    }
  ],

  // --- Payment & Costs ---
  amount: { type: Number, required: true },   // Final amount to pay
  subtotal: { type: Number, required: true }, // Cart total before fees
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
    email: { type: String }
  },
  
  // --- Order Status ---
  status: { type: String, default: "Processing" },
  
  // --- Payment Details ---
  paymentMethod: { type: String, enum: ['COD', 'ONLINE', 'UPI_MANUAL'], required: true },
  
  // ✅ CRITICAL FIX: Match the 'orders.js' payload structure
  paymentResult: {
    id: String,      // Stores the UPI Transaction ID / UTR
    status: String,  // Stores "Pending Verification"
    email_address: String,
    update_time: String
  },

  isPaid: { type: Boolean, default: false }, // ✅ Added to track payment status easily

  // --- SHIPROCKET INTEGRATION FIELDS ---
  shiprocketOrderId: { type: Number },
  shipmentId: { type: Number },        
  awbCode: { type: String },           
  courierName: { type: String }        

}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);