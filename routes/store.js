const router = require('express').Router();
const Store = require('../models/Store');
const City = require('../models/City');
const withMongoId = require('../utils/withMongoId');

// 1. GET ALL STORES
router.get('/', async (req, res) => {
  try {
    const stores = await Store.findAll();
    res.status(200).json(stores.map(withMongoId));
  } catch (err) {
    res.status(500).json(err);
  }
});

// 2. GET ALL CITIES (For your dropdown logic)
router.get('/cities', async (req, res) => {
  try {
    const cities = await City.findAll();
    res.status(200).json(cities.map(withMongoId));
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;