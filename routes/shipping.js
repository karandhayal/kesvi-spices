const express = require('express');
const router = express.Router();
const axios = require('axios');
const Order = require('../models/Order');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// --- CONFIGURATION ---
const SR_EMAIL = process.env.SR_EMAIL;
const SR_PASSWORD = process.env.SR_PASSWORD;

// HELPER: Login to Shiprocket
const getShiprocketToken = async () => {
    try {
        const res = await axios.post('https://apiv2.shiprocket.in/v1/external/auth/login', {
            email: SR_EMAIL,
            password: SR_PASSWORD
        });
        return res.data.token;
    } catch (error) {
        console.error("Shiprocket Login Failed:", error.response?.data || error.message);
        throw new Error("Could not authenticate with Shiprocket.");
    }
};

// ==========================================
// 1. PUSH ORDER TO SHIPROCKET
// ==========================================
router.post('/create-order/:id', protect, adminOnly, async (req, res) => {
    try {
        const orderId = req.params.id;
        const order = await Order.findByPk(orderId);
        
        if (!order) return res.status(404).json({ message: "Order not found" });

        if (order.status === 'Cancelled') {
            return res.status(400).json({ message: "Cancelled orders cannot be shipped" });
        }

        if (!order.address || !order.orderItems || order.orderItems.length === 0) {
            return res.status(400).json({ message: "Order is missing address or items" });
        }

        if (order.paymentMethod === 'ONLINE' && !order.isPaid) {
            return res.status(400).json({ message: "Payment pending. Cannot create shipment" });
        }

        if (order.shiprocketOrderId || order.shiprocketShipmentId || order.shipmentId) {
            return res.json({
                success: true,
                message: "Shipment already created",
                order,
                tracking: {
                    shiprocketOrderId: order.shiprocketOrderId,
                    shiprocketShipmentId: order.shiprocketShipmentId || order.shipmentId,
                    awbCode: order.awbCode,
                    courierName: order.courierName,
                    trackingUrl: order.trackingUrl,
                    shippingStatus: order.shippingStatus
                }
            });
        }

        const token = await getShiprocketToken();
        const date = new Date().toISOString().slice(0, 10) + " 11:00";

        // 3. Prepare Payload
        const payload = {
            order_id: String(order.id),
            order_date: date,
            pickup_location: "Primary", // ⚠️ MUST match your Shiprocket 'Pickup Nickname'
            
            // Customer Details
            billing_customer_name: order.address.fullName.split(" ")[0],
            billing_last_name: order.address.fullName.split(" ")[1] || "",
            billing_address: order.address.street,
            billing_city: order.address.city,
            billing_pincode: order.address.pincode,
            billing_state: order.address.state,
            billing_country: "India",
            billing_email: order.address.email || "customer@parosa.com",
            billing_phone: order.address.phone,
            
            shipping_is_billing: true,
            
            // ✅ FIX: Use 'orderItems' instead of 'products'
            order_items: order.orderItems.map(p => ({
                name: p.title || p.name,
                sku: p.productId || "SKU_DEFAULT",
                units: p.quantity,
                selling_price: p.price,
                discount: 0
            })),
            
            // Payment Logic (UPI_MANUAL is considered Prepaid)
            payment_method: order.paymentMethod === 'COD' ? 'COD' : 'Prepaid',
            sub_total: order.amount,
            length: 10, breadth: 10, height: 10, weight: 0.5 
        };

        // 4. Send to Shiprocket
        const srRes = await axios.post('https://apiv2.shiprocket.in/v1/external/orders/create/adhoc', payload, {
            headers: { Authorization: `Bearer ${token}` }
        });

        const shiprocketOrderId = srRes.data?.order_id || srRes.data?.orderId;
        const shiprocketShipmentId = srRes.data?.shipment_id || srRes.data?.shipmentId;
        const awbCode = srRes.data?.awb_code || srRes.data?.awbCode;
        const courierName = srRes.data?.courier_name || srRes.data?.courierName;
        const trackingUrl = srRes.data?.tracking_url || srRes.data?.trackingUrl;
        const expectedDeliveryDate = srRes.data?.expected_delivery_date
            ? new Date(srRes.data.expected_delivery_date)
            : undefined;

        // 5. Update Local DB
        if (shiprocketOrderId) order.shiprocketOrderId = shiprocketOrderId;
        if (shiprocketShipmentId) {
            order.shiprocketShipmentId = shiprocketShipmentId;
            order.shipmentId = shiprocketShipmentId;
        }
        if (awbCode) order.awbCode = awbCode;
        if (courierName) order.courierName = courierName;
        if (trackingUrl) order.trackingUrl = trackingUrl;
        if (expectedDeliveryDate) order.expectedDeliveryDate = expectedDeliveryDate;

        if (awbCode || trackingUrl || shiprocketShipmentId) {
            order.status = 'Shipped';
            order.shippingStatus = awbCode || trackingUrl ? 'Shipped' : 'Shipment Created';
            order.shippedAt = order.shippedAt || new Date();
        } else {
            order.status = 'Processing';
            order.shippingStatus = 'Shipment Created';
        }

        await order.save();

        res.json({
            success: true,
            message: "Sent to Shiprocket!",
            order,
            tracking: {
                shiprocketOrderId: order.shiprocketOrderId,
                shiprocketShipmentId: order.shiprocketShipmentId || order.shipmentId,
                awbCode: order.awbCode,
                courierName: order.courierName,
                trackingUrl: order.trackingUrl,
                shippingStatus: order.shippingStatus
            }
        });

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
router.get('/track/:id', protect, adminOnly, async (req, res) => {
    try {
        const order = await Order.findByPk(req.params.id);
        
        const shipmentId = order?.shiprocketShipmentId || order?.shipmentId;

        if (!order || !shipmentId) {
            return res.status(404).json({ message: "Shipment not generated yet" });
        }

        const token = await getShiprocketToken();

        const trackRes = await axios.get(`https://apiv2.shiprocket.in/v1/external/courier/track/shipment/${shipmentId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        const trackingData = trackRes.data?.[shipmentId] || trackRes.data;

        if (trackingData) {
            const awbCode = trackingData.awb_code || trackingData.awbCode;
            const courierName = trackingData.courier_name || trackingData.courierName;
            const trackingUrl = trackingData.tracking_url || trackingData.trackingUrl;
            const expectedDeliveryDate = trackingData.etd || trackingData.expected_delivery_date;
            const currentStatus = trackingData.current_status || trackingData.status || trackingData.shipment_status;

            if (awbCode) order.awbCode = awbCode;
            if (courierName) order.courierName = courierName;
            if (trackingUrl) order.trackingUrl = trackingUrl;
            if (expectedDeliveryDate) order.expectedDeliveryDate = new Date(expectedDeliveryDate);

            if (typeof currentStatus === 'string' && currentStatus.toLowerCase().includes('deliver')) {
                order.status = 'Delivered';
                order.shippingStatus = 'Delivered';
                order.deliveredAt = order.deliveredAt || new Date();
            } else if (awbCode || trackingUrl || shipmentId) {
                order.status = 'Shipped';
                order.shippingStatus = currentStatus || order.shippingStatus || 'Shipped';
                order.shippedAt = order.shippedAt || new Date();
            }

            await order.save();

            res.json({
                success: true,
                order,
                tracking: {
                    shiprocketOrderId: order.shiprocketOrderId,
                    shiprocketShipmentId: order.shiprocketShipmentId || order.shipmentId,
                    awbCode: order.awbCode,
                    courierName: order.courierName,
                    trackingUrl: order.trackingUrl,
                    shippingStatus: order.shippingStatus,
                    expectedDeliveryDate: order.expectedDeliveryDate
                }
            });
        } else {
            res.json({
                success: true,
                order,
                tracking: {
                    shiprocketOrderId: order.shiprocketOrderId,
                    shiprocketShipmentId: order.shiprocketShipmentId || order.shipmentId,
                    shippingStatus: order.shippingStatus || "Pending Courier Assignment"
                }
            });
        }

    } catch (error) {
        console.error("Tracking Error:", error.message);
        res.status(500).json({ message: "Tracking Error" });
    }
});

module.exports = router;
