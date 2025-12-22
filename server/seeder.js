require('dotenv').config();
const mongoose = require('mongoose');
const colors = require('colors');
const Product = require('./models/Product');
const User = require('./models/User');
const products = require('./data/products');
const connectDB = require('./db');

connectDB();

const importData = async () => {
  try {
    // 1. Wipe existing data to avoid duplicates
    await Product.deleteMany();
    await User.deleteMany();

    // 2. Insert Products
    await Product.insertMany(products);

    console.log('✅ Data Imported Successfully!'.green.inverse);
    process.exit();
  } catch (error) {
    console.error(`❌ Error: ${error.message}`.red.inverse);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Product.deleteMany();
    await User.deleteMany();

    console.log('🛑 Data Destroyed!'.red.inverse);
    process.exit();
  } catch (error) {
    console.error(`❌ Error: ${error.message}`.red.inverse);
    process.exit(1);
  }
};

// Check command line argument
if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}