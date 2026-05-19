require('dotenv').config();
const mongoose = require('mongoose');
const colors = require('colors');
const connectDB = require('./db');

// --- LOAD MODELS ---
const Product = require('./models/Product');
const User = require('./models/User');
const Store = require('./models/Store');
const City = require('./models/City');

// --- LOAD DATA ---
const products = require('./data/products');
const storeData = require('./data/storeData');
const cityData = require('./data/cityData');

// --- MAIN RUNNER ---
const runSeeder = async () => {
  try {
    // 1. Connect to DB and WAIT
    await connectDB(); 

    // 2. Check Command Line Arguments
    if (process.argv[2] === '-d') {
      await destroyData();
    } else {
      await importData();
    }
    
  } catch (error) {
    console.error(`❌ Connection Failed: ${error.message}`.red.inverse);
    process.exit(1);
  }
};

// --- IMPORT FUNCTION ---
const importData = async () => {
  try {
    console.log("🧹 Clearing old data...".yellow);
    await Product.deleteMany();
    await User.deleteMany();
    await Store.deleteMany();
    await City.deleteMany();

    console.log("🌱 Inserting new data...".yellow);
    // You can add Users here too if you have a users.js file
    await Product.insertMany(products);
    await Store.insertMany(storeData);
    await City.insertMany(cityData);

    console.log('✅ Data Imported Successfully!'.green.inverse);
    process.exit();
  } catch (error) {
    console.error(`❌ Import Error: ${error.message}`.red.inverse);
    process.exit(1);
  }
};

// --- DESTROY FUNCTION ---
const destroyData = async () => {
  try {
    console.log("🔥 Destroying data...".red);
    await Product.deleteMany();
    await User.deleteMany();
    await Store.deleteMany();
    await City.deleteMany();

    console.log('🛑 Data Destroyed!'.red.inverse);
    process.exit();
  } catch (error) {
    console.error(`❌ Destroy Error: ${error.message}`.red.inverse);
    process.exit(1);
  }
};

// Start the script
runSeeder();