const router = require('express').Router();
const Store = require('../models/Store');

// 1. GET ALL STORES
router.get('/', async (req, res) => {
  try {
    const stores = await Store.find();
    res.status(200).json(stores);
  } catch (err) {
    res.status(500).json(err);
  }
});

// 2. SEED DATA (Run this once to populate DB)
// Access via browser: http://localhost:5000/api/stores/seed
router.get('/seed', async (req, res) => {
  const seedData = [
    {
      name: "Parosa Flagship - Bandra",
      address: "Plot 105, Turner Road, Bandra West",
      city: "Mumbai",
      state: "Maharashtra",
      zip: "400050",
      phone: "+91 98765 43210",
      lat: 19.0596,
      lng: 72.8295,
      googleMapsUrl: "https://goo.gl/maps/exampleBandra",
      timings: "10:00 AM - 9:00 PM"
    },
    {
      name: "Parosa Boutique - Colaba",
      address: "Arthur Bunder Rd, Colaba",
      city: "Mumbai",
      state: "Maharashtra",
      zip: "400005",
      phone: "+91 98765 11111",
      lat: 18.9220,
      lng: 72.8347,
      googleMapsUrl: "https://goo.gl/maps/exampleColaba",
      timings: "11:00 AM - 8:00 PM"
    }
    // Add more stores here if you want
  ];

  try {
    await Store.deleteMany({}); // Clears old data
    const createdStores = await Store.insertMany(seedData);
    res.json({ success: true, message: "Stores seeded!", data: createdStores });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;