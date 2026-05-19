const router = require('express').Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const Product = require('../models/Product');
const Store = require('../models/Store');
const City = require('../models/City');

// Import data files
const productsData = require('../data/products');
const storesData = require('../data/storeData');
const citiesData = require('../data/cityData');

/**
 * POST /api/admin/seed/basic-data
 * Admin-only endpoint to seed basic data (Products, Stores, Cities)
 * Does NOT touch Users, Orders, Carts, or MembershipRequests
 * Avoids duplicates using slug (products) and name (stores/cities)
 */
router.post('/basic-data', protect, adminOnly, async (req, res) => {
  try {
    let productCount = 0;
    let storeCount = 0;
    let cityCount = 0;

    // ==========================================
    // 1. SEED PRODUCTS
    // ==========================================
    console.log('Seeding products...');
    for (const product of productsData) {
      try {
        const [prod, created] = await Product.findOrCreate({
          where: { slug: product.slug },
          defaults: {
            name: product.name,
            title: product.name,
            slug: product.slug,
            category: product.category,
            tag: product.tag || null,
            image: product.image,
            benefits: product.benefits || null,
            description: product.description,
            price: product.price,
            originalPrice: product.originalPrice || null,
            countInStock: product.countInStock || 0,
            variants: product.variants || null,
            isFeatured: product.isFeatured || false,
          }
        });
        if (created) productCount++;
      } catch (err) {
        console.error(`Error seeding product ${product.slug}:`, err.message);
      }
    }
    console.log(`✓ Products: ${productCount} inserted`);

    // ==========================================
    // 2. SEED CITIES
    // ==========================================
    console.log('Seeding cities...');
    for (const city of citiesData) {
      try {
        const [cityRecord, created] = await City.findOrCreate({
          where: { name: city.name },
          defaults: {
            name: city.name,
            state: city.state || null,
            lat: city.lat || null,
            lng: city.lng || null,
            latitude: city.latitude || city.lat || null,
            longitude: city.longitude || city.lng || null,
            googleMapsUrl: city.googleMapsUrl || null,
            isActive: true,
          }
        });
        if (created) cityCount++;
      } catch (err) {
        console.error(`Error seeding city ${city.name}:`, err.message);
      }
    }
    console.log(`✓ Cities: ${cityCount} inserted`);

    // ==========================================
    // 3. SEED STORES
    // ==========================================
    console.log('Seeding stores...');
    for (const store of storesData) {
      try {
        const [storeRecord, created] = await Store.findOrCreate({
          where: { name: store.name },
          defaults: {
            name: store.name,
            address: store.address,
            city: store.city,
            state: store.state,
            pincode: store.zip || store.pincode || null,
            zip: store.zip || null,
            phone: store.phone || null,
            timings: store.timings || null,
            lat: store.lat || null,
            lng: store.lng || null,
            latitude: store.lat || null,
            longitude: store.lng || null,
            googleMapsUrl: store.googleMapsUrl || null,
          }
        });
        if (created) storeCount++;
      } catch (err) {
        console.error(`Error seeding store ${store.name}:`, err.message);
      }
    }
    console.log(`✓ Stores: ${storeCount} inserted`);

    // ==========================================
    // 4. RETURN SUCCESS
    // ==========================================
    res.status(200).json({
      success: true,
      message: 'Basic data seeded successfully',
      counts: {
        products: productCount,
        stores: storeCount,
        cities: cityCount,
        total: productCount + storeCount + cityCount
      }
    });

  } catch (error) {
    console.error('Seed error:', error);
    res.status(500).json({
      success: false,
      message: 'Error seeding data',
      error: error.message
    });
  }
});

module.exports = router;
