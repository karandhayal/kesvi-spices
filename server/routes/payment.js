const router = require('express').Router();
const axios = require('axios');
const crypto = require('crypto');
const Order = require('../models/Order');

// --- PHONEPE TEST CREDENTIALS (VERIFIED) ---
// We use .trim() to ensure no accidental spaces cause the "KEY_NOT_CONFIGURED" error
const MERCHANT_ID = "PGTESTPAYUAT".trim();
const SALT_KEY = "099eb0cd-02cf-4e2a-8aca-3e6c6aff0399".trim();
const SALT_INDEX = 1;

// Use the specific "pg-sandbox" endpoint which works with PGTESTPAYUAT
const PHONEPE_HOST_URL = "https://api-preprod.phonepe.com/apis/pg-sandbox";

const APP_BE_URL = "http://localhost:5000"; 
const APP_FE_URL = "http://localhost:3000"; 

// 1. INITIATE PAYMENT
router.post('/initiate', async (req, res) => {
  try {
    const { orderId, amount, userId } = req.body;

    // A. Clean Data
    const merchantTransactionId = orderId.trim(); 
    const cleanUserId = userId.toString().replace(/\W/g, '').substring(0, 30); // Max 30 chars, no special chars
    const amountInPaisa = Math.floor(amount * 100);

    // B. Construct Payload
    const payload = {
      merchantId: MERCHANT_ID,
      merchantTransactionId: merchantTransactionId,
      merchantUserId: cleanUserId,
      amount: amountInPaisa,
      redirectUrl: `${APP_BE_URL}/api/payment/status/${merchantTransactionId}`,
      redirectMode: "POST",
      callbackUrl: `${APP_BE_URL}/api/payment/callback`,
      mobileNumber: "9999999999",
      paymentInstrument: {
        type: "PAY_PAGE" 
      }
    };

    // C. Generate Checksum (X-VERIFY)
    const bufferObj = Buffer.from(JSON.stringify(payload), "utf8");
    const base64EncodedPayload = bufferObj.toString("base64");

    // FORMULA: sha256(base64 + api_endpoint + salt_key) + ### + salt_index
    const stringToHash = base64EncodedPayload + "/pg/v1/pay" + SALT_KEY;
    const sha256 = crypto.createHash("sha256").update(stringToHash).digest("hex");
    const checksum = sha256 + "###" + SALT_INDEX;

    // D. Send Request
    const options = {
      method: 'post',
      url: `${PHONEPE_HOST_URL}/pg/v1/pay`,
      headers: {
        'Content-Type': 'application/json',
        'X-VERIFY': checksum
      },
      data: {
        request: base64EncodedPayload
      }
    };

    const response = await axios.request(options);
    
    if (response.data.success) {
      const redirectUrl = response.data.data.instrumentResponse.redirectInfo.url;
      res.status(200).json({ success: true, url: redirectUrl });
    } else {
      console.error("PhonePe Gateway Rejected:", response.data);
      res.status(400).json({ success: false, message: "Gateway Rejected Request" });
    }

  } catch (err) {
    if (err.response) {
      console.error("PhonePe API Error Details:", err.response.data); // Look here in terminal if it fails
    } else {
      console.error("Server Error:", err.message);
    }
    res.status(500).json({ success: false, message: "Payment Initialization Failed" });
  }
});

// 2. CHECK STATUS
router.post('/status/:txnId', async (req, res) => {
  const merchantTransactionId = req.params.txnId;
  const merchantId = MERCHANT_ID;

  const stringToHash = `/pg/v1/status/${merchantId}/${merchantTransactionId}` + SALT_KEY;
  const sha256 = crypto.createHash("sha256").update(stringToHash).digest("hex");
  const checksum = sha256 + "###" + SALT_INDEX;

  try {
    const options = {
      method: 'get',
      url: `${PHONEPE_HOST_URL}/pg/v1/status/${merchantId}/${merchantTransactionId}`,
      headers: {
        'Content-Type': 'application/json',
        'X-VERIFY': checksum,
        'X-MERCHANT-ID': merchantId
      }
    };

    const response = await axios.request(options);

    if (response.data.code === 'PAYMENT_SUCCESS') {
      await Order.findByIdAndUpdate(merchantTransactionId, {
        paymentStatus: 'success',
        status: 'processing',
        transactionId: response.data.data.transactionId
      });
      return res.redirect(`${APP_FE_URL}/order-success?id=${merchantTransactionId}`);
    } else {
      await Order.findByIdAndUpdate(merchantTransactionId, {
        paymentStatus: 'failed'
      });
      return res.redirect(`${APP_FE_URL}/checkout?error=payment_failed`);
    }

  } catch (err) {
    console.error("Status Check Error:", err);
    return res.redirect(`${APP_FE_URL}/checkout?error=server_error`);
  }
});

module.exports = router;