const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const Cart = sequelize.define('Cart', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  userId: { type: DataTypes.STRING, allowNull: true },
  guestId: { type: DataTypes.STRING, allowNull: true },
  items: { type: DataTypes.JSON, allowNull: false, defaultValue: [] },
}, {
  timestamps: true,
  freezeTableName: true,
});

module.exports = Cart;