const mongoose = require('mongoose');

const CouponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true },
  type: { type: String, enum: ['percent', 'flat'], required: true }, // 'percent' = % off, 'flat' = ₹ off
  value: { type: Number, required: true }, // e.g., 10 (for 10%) or 100 (for ₹100)
  minOrder: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
});

module.exports = mongoose.model('Coupon', CouponSchema);