const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const Product = sequelize.define('Product', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  title: { type: DataTypes.STRING, allowNull: true },
  slug: { type: DataTypes.STRING, allowNull: false, unique: true },
  tag: { type: DataTypes.STRING, allowNull: true },
  category: { type: DataTypes.STRING, allowNull: false },
  benefits: { type: DataTypes.TEXT, allowNull: true },
  description: { type: DataTypes.TEXT('long'), allowNull: true },
  image: { type: DataTypes.TEXT('long'), allowNull: false, defaultValue: '/products/placeholder.jpg' },
  images: { type: DataTypes.JSON, allowNull: true },
  variants: { type: DataTypes.JSON, allowNull: true },
  price: { type: DataTypes.FLOAT, allowNull: false },
  originalPrice: { type: DataTypes.FLOAT, allowNull: true },
  countInStock: { type: DataTypes.INTEGER, defaultValue: 0 },
  isFeatured: { type: DataTypes.BOOLEAN, defaultValue: false },
}, {
  timestamps: true,
  freezeTableName: true,
});

module.exports = Product;