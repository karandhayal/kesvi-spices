const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const axios = require('axios'); // Required for WhatsApp API

// --- ENV VARIABLES (Add these to your .env) ---
const WA_PHONE_ID = process.env.WA_PHONE_NUMBER_ID;
const WA_TOKEN = process.env.WA_ACCESS_TOKEN;
const JWT_SECRET = process.env.JWT_SECRET || "secret_key_123";

// --- NODEMAILER CONFIG ---
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'parosateams@gmail.com',
    pass: process.env.EMAIL_PASS || 'fgokpjenzndtphwa'
  }
});

// ==========================================
// 1. WHATSAPP OTP ROUTES
// ==========================================

// SEND Mobile OTP
router.post('/send-mobile-otp', async (req, res) => {
  const { phone } = req.body;
  if (!phone) return res.status(400).send("Phone number required");

  // Format Phone: Remove non-digits, ensure 91 prefix (adjust for your region)
  const cleaned = phone.replace(/\D/g, '');
  const formattedPhone = cleaned.length === 10 ? `91${cleaned}` : cleaned;

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpires = Date.now() + 10 * 60 * 1000;

  try {
    // Find or Create Temporary User
    let user = await User.findOne({ phone: formattedPhone });
    if (!user) {
      user = new User({ phone: formattedPhone, isPhoneVerified: false });
    }
    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    // Send via Meta Cloud API
    await axios.post(
      `https://graph.facebook.com/v17.0/${WA_PHONE_ID}/messages`,
      {
        messaging_product: "whatsapp",
        to: formattedPhone,
        type: "template",
        template: {
          name: "otp_verification", // MUST exist in your WhatsApp Manager
          language: { code: "en_US" },
          components: [
            { type: "body", parameters: [{ type: "text", text: otp }] },
            { type: "button", sub_type: "url", index: "0", parameters: [{ type: "text", text: otp }] }
          ]
        }
      },
      { headers: { Authorization: `Bearer ${WA_TOKEN}` } }
    );

    res.status(200).json({ success: true, message: "OTP sent to WhatsApp" });

  } catch (err) {
    console.error("WhatsApp Error:", err.response?.data || err.message);
    res.status(500).json({ success: false, message: "Failed to send WhatsApp OTP" });
  }
});

// VERIFY Mobile OTP & LOGIN (Handles Auto-Registration)
router.post('/verify-mobile-otp', async (req, res) => {
  const { phone, otp, name, email } = req.body;
  
  const cleaned = phone.replace(/\D/g, '');
  const formattedPhone = cleaned.length === 10 ? `91${cleaned}` : cleaned;

  try {
    const user = await User.findOne({ phone: formattedPhone });

    if (!user || user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    }

    // Update User
    user.isPhoneVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    
    // If coming from Checkout, update missing details
    if (name) user.name = name;
    if (email) user.email = email;
    
    await user.save();

    // Create Token
    const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, JWT_SECRET);
    
    // Return User Data (excluding password)
    const { password, ...userData } = user._doc;
    res.status(200).json({ success: true, user: userData, token });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Verification failed" });
  }
});


// ==========================================
// 2. EXISTING EMAIL AUTH ROUTES (Unchanged)
// ==========================================

router.post('/register', async (req, res) => {
  try {
    const userExists = await User.findOne({ email: req.body.email });
    if (userExists && userExists.isEmailVerified) {
      return res.status(400).json({ success: false, message: "Email already exists" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = Date.now() + 10 * 60 * 1000;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Upsert logic to handle if phone user adds email later
    let user = await User.findOne({ email: req.body.email });
    if (!user) user = new User({ ...req.body, phone: req.body.phone, password: hashedPassword });
    else {
        user.name = req.body.name;
        user.password = hashedPassword;
    }
    
    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    await transporter.sendMail({
      from: '"Parosa Auth" <parosateams@gmail.com>',
      to: req.body.email,
      subject: 'OTP for Parosa',
      html: `<h1>Your OTP is: ${otp}</h1>`
    });

    res.status(200).json({ success: true, message: "OTP sent to email" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

router.post('/verify-email', async (req, res) => {
  // Your existing verify logic adapted to return JSON format
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user || user.otp !== otp) return res.status(400).json({ success: false, message: "Invalid OTP" });

    user.isEmailVerified = true;
    user.otp = undefined;
    await user.save();

    const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, JWT_SECRET);
    const { password, ...others } = user._doc;
    res.status(200).json({ success: true, user: others, token });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error" });
  }
});

router.post('/login-email', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).json({ success: false, message: "Wrong password" });

    const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, JWT_SECRET);
    const { password, ...others } = user._doc;
    res.status(200).json({ success: true, user: others, token });
  } catch (err) {
    res.status(500).json({ success: false, message: "Login failed" });
  }
});

module.exports = router;