const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

// --- CONFIGURE EMAIL SENDER ---
// 1. Make sure 2-Step Verification is ON in your Google Account
// 2. Generate an "App Password" (search in Google Account settings)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'parosateams@gmail.com', // <--- REPLACE WITH YOUR REAL EMAIL
    pass: 'fgokpjenzndtphwa'      // <--- REPLACE WITH 16-CHAR APP PASSWORD
  }
});

// 1. REGISTER (Save Info & Send OTP)
router.post('/register', async (req, res) => {
  try {
    // Check if user exists and is already verified
    const userExists = await User.findOne({ email: req.body.email });
    if (userExists && userExists.isVerified) {
      return res.status(400).send("Email already exists");
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = Date.now() + 10 * 60 * 1000; // 10 Minutes

    // Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    let user = await User.findOne({ email: req.body.email });
    
    // If user exists (unverified) update them, else create new
    if (user) {
      user.name = req.body.name;
      user.phone = req.body.phone;
      user.password = hashedPassword;
      user.otp = otp;
      user.otpExpires = otpExpires;
    } else {
      user = new User({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        password: hashedPassword,
        otp: otp,
        otpExpires: otpExpires
      });
    }

    await user.save();

    // --- SAFETY BLOCK: TRY TO SEND EMAIL ---
    try {
      await transporter.sendMail({
        from: '"Parosa Auth" <your-email@gmail.com>',
        to: req.body.email,
        subject: 'OTP for Parosa',
        html: `
          <h1>Welcome to Parosa</h1>
          <p>Your verification code is:</p>
          <h2 style="color: #4A4A4A; letter-spacing: 5px;">${otp}</h2>
          <p>This code expires in 10 minutes.</p>
          <p> </p>
          <p>Regards,</p>
          <p>Parosa Team</p>
        `
      });

      // If successful:
      res.status(200).send("OTP sent to email");

    } catch (emailError) {
      console.error("EMAIL SENDING FAILED:", emailError);
      
      // IMPORTANT: Send a text string, NOT the error object, to prevent React crash
      return res.status(500).send("Account created, but failed to send OTP email. Check server console.");
    }

  } catch (err) {
    console.log("SERVER ERROR:", err);
    // Send a generic string error to frontend
    res.status(500).send("Internal Server Error");
  }
});

// 2. VERIFY OTP (Finalize Account)
router.post('/verify', async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).send("User not found");
    
    if (user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).send("Invalid or expired OTP");
    }

    // Mark as verified
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    // Login user immediately
    const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, "secret_key_123");
    const { password, ...others } = user._doc;
    
    res.status(200).json({ ...others, token });

  } catch (err) {
    console.log(err);
    res.status(500).send("Verification failed");
  }
});

// 3. LOGIN (Only Verified Users)
router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).send("User not found");

    if (!user.isVerified) return res.status(400).send("Please verify your email first");

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send("Wrong password");

    const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, "secret_key_123");
    const { password, ...others } = user._doc;
    res.status(200).json({ ...others, token });
  } catch (err) {
    console.log(err);
    res.status(500).send("Login failed");
  }
});

module.exports = router;