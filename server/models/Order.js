const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  
  products: [
    {
      productId: { type: String },
      title: String,
      quantity: { type: Number, default: 1 },
      price: Number,
      variant: String, // Kept your existing variant field
      image: String    // Kept your existing image field
    }
  ],

  // --- Payment & Costs ---
  amount: { type: Number, required: true },   // Final amount user pays
  subtotal: { type: Number, required: true }, // Total before discount
  discount: { type: Number, default: 0 },     // Discount applied
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
    country: { type: String, default: "India" }
  },
  
  // --- Order Status ---
  status: { type: String, default: "Processing" }, // Changed default to 'Processing' to match Admin panel logic
  
  // --- Payment Details ---
  paymentMethod: { type: String, enum: ['UPI', 'COD'], required: true },
  paymentStatus: { type: String, default: "Pending" }, // pending, success, failed
  transactionId: { type: String }, // PhonePe Transaction ID

  // --- NEW: SHIPROCKET INTEGRATION FIELDS ---
  shiprocketOrderId: { type: Number }, // The ID inside Shiprocket
  shipmentId: { type: Number },        // Used to generate AWB
  awbCode: { type: String },           // The Tracking Number
  courierName: { type: String }        // e.g., "Delhivery", "BlueDart"

}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);