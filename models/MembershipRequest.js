const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const MembershipRequest = sequelize.define('MembershipRequest', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  fullName: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING, allowNull: false },
  address: { type: DataTypes.TEXT, allowNull: false },
  quantityPerMonthKg: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  locationLatitude: { type: DataTypes.DECIMAL(10, 7), allowNull: true },
  locationLongitude: { type: DataTypes.DECIMAL(10, 7), allowNull: true },
  locationAccuracy: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
  locationCapturedAt: { type: DataTypes.DATE, allowNull: true },
  status: { type: DataTypes.STRING, defaultValue: 'pending' },
  acceptedAt: { type: DataTypes.DATE, allowNull: true },
  rejectedAt: { type: DataTypes.DATE, allowNull: true },
}, {
  timestamps: true,
  freezeTableName: true,
});

module.exports = MembershipRequest;
