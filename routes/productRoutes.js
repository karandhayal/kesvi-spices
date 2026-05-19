const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const withMongoId = require('../utils/withMongoId');

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
router.get('/', async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products.map(withMongoId));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error: Unable to fetch products' });
  }
});

// @desc    Fetch single product by Slug (e.g., /api/products/turmeric-powder)
// @route   GET /api/products/:slug
// @access  Public
router.get('/:slug', async (req, res) => {
  try {
    // We search by 'slug', not '_id'
    const product = await Product.findOne({ where: { slug: req.params.slug } });

    if (product) {
      res.json(withMongoId(product));
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error: Unable to fetch product' });
  }
});

// @desc    Update product stock
// @route   PUT /api/products/:id
// @access  Admin
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const { countInStock } = req.body;
    const parsedStock = Number(countInStock);

    if (!Number.isInteger(parsedStock)) {
      return res.status(400).json({ message: 'countInStock must be an integer' });
    }

    if (parsedStock < 0) {
      return res.status(400).json({ message: 'countInStock must be a non-negative integer' });
    }

    const updatedProduct = await Product.findByPk(req.params.id);

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    updatedProduct.countInStock = parsedStock;
    await updatedProduct.save();

    res.status(200).json(withMongoId(updatedProduct));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error: Unable to update product' });
  }
});

module.exports = router;
