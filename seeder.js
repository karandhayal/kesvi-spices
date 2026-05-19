require('dotenv').config();
const colors = require('colors');
const { connectDB } = require('./db');

// --- LOAD MODELS ---
const Product = require('./models/Product');
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
    await Product.destroy({ where: {} });
    await Store.destroy({ where: {} });
    await City.destroy({ where: {} });

    console.log("🌱 Inserting new data...".yellow);
    await Product.bulkCreate(products);
    await Store.bulkCreate(storeData);
    await City.bulkCreate(cityData);

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
    await Product.destroy({ where: {} });
    await Store.destroy({ where: {} });
    await City.destroy({ where: {} });

    console.log('🛑 Data Destroyed!'.red.inverse);
    process.exit();
  } catch (error) {
    console.error(`❌ Destroy Error: ${error.message}`.red.inverse);
    process.exit(1);
  }
};

// Start the script
runSeeder();