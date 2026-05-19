const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const Coupon = sequelize.define('Coupon', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  code: { type: DataTypes.STRING, allowNull: false, unique: true },
  discountType: { type: DataTypes.STRING, allowNull: false },
  discountValue: { type: DataTypes.FLOAT, allowNull: false },
  minOrderValue: { type: DataTypes.FLOAT, allowNull: true, defaultValue: 0 },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
  expiresAt: { type: DataTypes.DATE, allowNull: true },
}, {
  timestamps: true,
  freezeTableName: true,
});

module.exports = Coupon;