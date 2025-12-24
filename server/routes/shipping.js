const express = require('express');
const router = express.Router();
const axios = require('axios');
const Order = require('../models/Order');

// --- CONFIGURATION ---
// Ideally, put these in your .env file
const SR_EMAIL = process.env.SR_EMAIL;
const SR_PASSWORD = process.env.SR_PASSWORD;

// HELPER: Login to Shiprocket to get a temporary Session Token
const getShiprocketToken = async () => {
    try {
        const res = await axios.post('https://apiv2.shiprocket.in/v1/external/auth/login', {
            email: SR_EMAIL,
            password: SR_PASSWORD
        });
        return res.data.token;
    } catch (error) {
        console.error("Shiprocket Login Failed:", error.response?.data || error.message);
        throw new Error("Could not authenticate with Shiprocket. Check your email/password.");
    }
};

// ==========================================
// 1. PUSH ORDER TO SHIPROCKET
// ==========================================
router.post('/create-order/:id', async (req, res) => {
    try {
        const orderId = req.params.id;
        const order = await Order.findById(orderId);
        
        if (!order) return res.status(404).json({ message: "Order not found" });

        // 1. Get Authentication Token
        const token = await getShiprocketToken();

        // 2. Format Date (YYYY-MM-DD HH:mm)
        const date = new Date().toISOString().slice(0, 10) + " 11:00";

        // 3. Prepare the Data Payload (Strict Format Required by Shiprocket)
        const payload = {
            order_id: order._id,
            order_date: date,
            pickup_location: "Primary", // MUST match the name in Shiprocket Settings -> Pickup Address
            
            // Customer Details
            billing_customer_name: order.address.fullName.split(" ")[0],
            billing_last_name: order.address.fullName.split(" ")[1] || "",
            billing_address: order.address.street,
            billing_city: order.address.city,
            billing_pincode: order.address.pincode,
            billing_state: order.address.state,
            billing_country: "India",
            billing_email: "customer@example.com", // You can add email to your Order schema later
            billing_phone: order.address.phone,
            
            shipping_is_billing: true,
            
            // Products
            order_items: order.products.map(p => ({
                name: p.title,
                sku: p.productId || "SKU_DEFAULT",
                units: p.quantity,
                selling_price: p.price,
                discount: 0
            })),
            
            // Payment Logic
            payment_method: order.paymentMethod === 'COD' ? 'COD' : 'Prepaid',
            sub_total: order.amount,
            length: 10, breadth: 10, height: 10, weight: 0.5 // Default dimensions (Adjust if needed)
        };

        // 4. Send to Shiprocket
        const srRes = await axios.post('https://apiv2.shiprocket.in/v1/external/orders/create/adhoc', payload, {
            headers: { Authorization: `Bearer ${token}` }
        });

        // 5. Save Shiprocket IDs to our Database
        order.shiprocketOrderId = srRes.data.order_id;
        order.shipmentId = srRes.data.shipment_id;
        order.status = "Processed"; // Update status to show we handled it
        await order.save();

        res.json({ success: true, message: "Sent to Shiprocket!", data: srRes.data });

    } catch (error) {
        console.error("Shipping Error:", error.response?.data || error.message);
        res.status(500).json({ 
            message: "Failed to push to Shiprocket", 
            error: error.response?.data || error.message 
        });
    }
});

// ==========================================
// 2. TRACK ORDER STATUS
// ==========================================
router.get('/track/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        
        // If we haven't shipped it yet
        if (!order || !order.shipmentId) {
            return res.status(404).json({ message: "Shipment not generated yet" });
        }

        const token = await getShiprocketToken();

        // Call Shiprocket Tracking API
        const trackRes = await axios.get(`https://apiv2.shiprocket.in/v1/external/courier/track/shipment/${order.shipmentId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        // The API returns data keyed by shipment ID. Let's extract it safely.
        const trackingData = trackRes.data?.[order.shipmentId];

        if (trackingData) {
            // If we found an AWB (Tracking Number), save it permanently
            if (trackingData.awb_code && !order.awbCode) {
                order.awbCode = trackingData.awb_code;
                order.courierName = trackingData.courier_name;
                order.status = "Shipped"; // Auto-update status to Shipped
                await order.save();
            }
            
            res.json(trackingData);
        } else {
            res.json({ status: "Pending Courier Assignment" });
        }

    } catch (error) {
        console.error("Tracking Error:", error.message);
        res.status(500).json({ message: "Tracking Error" });
    }
});

module.exports = router;