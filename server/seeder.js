require('dotenv').config();
const mongoose = require('mongoose');
const colors = require('colors');
const Product = require('./models/Product');
const User = require('./models/User');
// Make sure this path matches your actual file structure!
// If your products.js is in a 'data' folder, keep it. 
// If it's in the same folder, change to './products'
const products = require('./data/products'); 
const connectDB = require('./db');

// --- THE FIX: WAIT FOR CONNECTION BEFORE RUNNING ---
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

const importData = async () => {
  try {
    console.log("🧹 Clearing old data...".yellow);
    await Product.deleteMany();
    await User.deleteMany();

    console.log("🌱 Inserting new data...".yellow);
    await Product.insertMany(products);

    console.log('✅ Data Imported Successfully!'.green.inverse);
    process.exit();
  } catch (error) {
    console.error(`❌ Import Error: ${error.message}`.red.inverse);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    console.log("🔥 Destroying data...".red);
    await Product.deleteMany();
    await User.deleteMany();

    console.log('🛑 Data Destroyed!'.red.inverse);
    process.exit();
  } catch (error) {
    console.error(`❌ Destroy Error: ${error.message}`.red.inverse);
    process.exit(1);
  }
};

// Start the script
runSeeder();