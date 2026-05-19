const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const Order = sequelize.define('Order', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  userId: { type: DataTypes.STRING, allowNull: true },
  orderItems: { type: DataTypes.JSON, allowNull: false, defaultValue: [] },
  address: { type: DataTypes.JSON, allowNull: false },
  amount: { type: DataTypes.FLOAT, allowNull: false },
  itemsPrice: { type: DataTypes.FLOAT, allowNull: true },
  subtotal: { type: DataTypes.FLOAT, allowNull: true },
  shippingFee: { type: DataTypes.FLOAT, allowNull: true, defaultValue: 0 },
  taxPrice: { type: DataTypes.FLOAT, allowNull: true },
  discount: { type: DataTypes.FLOAT, allowNull: true, defaultValue: 0 },
  couponCode: { type: DataTypes.STRING, allowNull: true },
  paymentMethod: { type: DataTypes.STRING, allowNull: false },
  isPaid: { type: DataTypes.BOOLEAN, defaultValue: false },
  paymentStatus: { type: DataTypes.STRING, defaultValue: 'Pending' },
  paymentProvider: { type: DataTypes.STRING, allowNull: true },
  razorpayOrderId: { type: DataTypes.STRING, allowNull: true },
  razorpayPaymentId: { type: DataTypes.STRING, allowNull: true },
  paymentResult: { type: DataTypes.JSON, allowNull: true },
  paidAt: { type: DataTypes.DATE, allowNull: true },
  status: { type: DataTypes.STRING, defaultValue: 'Processing' },
  shippingStatus: { type: DataTypes.STRING, allowNull: true },
  shiprocketOrderId: { type: DataTypes.STRING, allowNull: true },
  shiprocketShipmentId: { type: DataTypes.STRING, allowNull: true },
  shipmentId: { type: DataTypes.STRING, allowNull: true },
  awbCode: { type: DataTypes.STRING, allowNull: true },
  courierName: { type: DataTypes.STRING, allowNull: true },
  trackingUrl: { type: DataTypes.TEXT, allowNull: true },
  expectedDeliveryDate: { type: DataTypes.DATE, allowNull: true },
  shippedAt: { type: DataTypes.DATE, allowNull: true },
  deliveredAt: { type: DataTypes.DATE, allowNull: true },
  cancelledAt: { type: DataTypes.DATE, allowNull: true },
}, {
  timestamps: true,
  freezeTableName: true,
});

module.exports = Order;