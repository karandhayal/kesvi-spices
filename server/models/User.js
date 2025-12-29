const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String },
  email: { 
    type: String, 
    unique: true, 
    sparse: true // Allows multiple null values (for phone-only users)
  },
  phone: { 
    type: String, 
    required: true, 
    unique: true 
  }, 
  password: { type: String }, // Optional if logging in via OTP
  isAdmin: { type: Boolean, default: false },
  
  // Verification Flags
  isEmailVerified: { type: Boolean, default: false },
  isPhoneVerified: { type: Boolean, default: false },

  // OTP Storage
  otp: { type: String },
  otpExpires: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);