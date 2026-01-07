const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String },
  
  email: { 
    type: String, 
    unique: true, 
    sparse: true,
    // RECOMMENDATION: Since phone is now optional, you might want to make email mandatory:
    required: true 
  },

  phone: { 
    type: String, 
    required: false, // 👈 CHANGE 1: Set to false
    unique: true,
    sparse: true     // 👈 CHANGE 2: Add this!
  }, 

  password: { type: String }, 
  isAdmin: { type: Boolean, default: false },
  
  // Verification Flags
  isEmailVerified: { type: Boolean, default: false },
  isPhoneVerified: { type: Boolean, default: false },

  // OTP Storage
  otp: { type: String },
  otpExpires: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);