const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const MembershipRequest = sequelize.define('MembershipRequest', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  fullName: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING, allowNull: false },
  address: { type: DataTypes.TEXT, allowNull: false },
  status: { type: DataTypes.STRING, defaultValue: 'pending' },
  acceptedAt: { type: DataTypes.DATE, allowNull: true },
  rejectedAt: { type: DataTypes.DATE, allowNull: true },
}, {
  timestamps: true,
  freezeTableName: true,
});

module.exports = MembershipRequest;
