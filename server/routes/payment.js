const router = require('express').Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');

// Initialize Razorpay Instance
// Make sure these variables are in your backend .env file
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// ==========================================
// 1. CREATE ORDER (Initiate Payment)
// ==========================================
router.post('/create-order', async (req, res) => {
  try {
    const { amount } = req.body;

    // Validation
    if (!amount) {
      return res.status(400).json({ success: false, message: "Amount is required" });
    }

    // Razorpay expects amount in "Paise" (1 INR = 100 Paise)
    // We round it to handle decimal issues
    const options = {
      amount: Math.round(amount * 100), 
      currency: "INR",
      receipt: "receipt_" + Date.now(),
      payment_capture: 1 // Auto capture payment
    };

    const order = await razorpay.orders.create(options);

    // Send order details to frontend
    res.json({
      success: true,
      id: order.id,
      currency: order.currency,
      amount: order.amount
    });

  } catch (error) {
    console.error("Razorpay Create Order Error:", error);
    res.status(500).json({ success: false, message: "Could not initiate payment" });
  }
});

// ==========================================
// 2. VERIFY PAYMENT (Security Check)
// ==========================================
router.post('/verify-payment', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // 1. Construct the expected signature
    // Formula: order_id + "|" + payment_id
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    // 2. Generate HMAC SHA256 signature using your Secret Key
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    // 3. Compare signatures
    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      // Payment is Valid
      res.json({ 
        success: true, 
        message: "Payment verified successfully" 
      });
    } else {
      // Signature mismatch - Potential Fraud
      res.status(400).json({ 
        success: false, 
        message: "Invalid Payment Signature" 
      });
    }

  } catch (error) {
    console.error("Razorpay Verify Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

module.exports = router;