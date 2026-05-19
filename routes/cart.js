const router = require('express').Router();
const Cart = require('../models/Cart');
const withMongoId = require('../utils/withMongoId');

const normalizeCart = (cart) => {
  if (!cart) return { products: [] };
  const plain = withMongoId(cart);
  const items = Array.isArray(plain.items) ? plain.items : [];
  return {
    ...plain,
    items,
    products: items,
  };
};

// 1. ADD TO CART
router.post('/add', async (req, res) => {
  const { userId, productId, quantity, variant, title, price, image } = req.body;

  try {
    let cart = await Cart.findOne({ where: { userId } });

    if (cart) {
      // Cart exists for this user
      const items = Array.isArray(cart.items) ? [...cart.items] : [];
      let itemIndex = items.findIndex(p => p.productId === productId);

      if (itemIndex > -1) {
        // Product exists in cart, update quantity
        items[itemIndex].quantity += Number(quantity) || 1;
      } else {
        // Product does not exist in cart, add new item
        items.push({ productId, quantity: Number(quantity) || 1, variant, title, price, image });
      }
      cart.items = items;
      await cart.save();
      return res.status(200).send(normalizeCart(cart));
    } else {
      // No cart for user, create new cart
      const newCart = await Cart.create({
        userId,
        items: [{ productId, quantity: Number(quantity) || 1, variant, title, price, image }]
      });
      return res.status(201).send(normalizeCart(newCart));
    }
  } catch (err) {
    console.log("Error in /add:", err); // Check your terminal for this log if it fails
    res.status(500).send("Something went wrong");
  }
});

// 2. GET CART
router.get('/:userId', async (req, res) => {
  try {
    const cart = await Cart.findOne({ where: { userId: req.params.userId } });
    if (cart) {
      res.status(200).send(normalizeCart(cart));
    } else {
      res.status(200).send({ products: [] }); // Send empty cart if none found
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// 3. REMOVE ITEM
router.delete('/remove/:userId/:productId', async (req, res) => {
  try {
    let cart = await Cart.findOne({ where: { userId: req.params.userId } });
    if (!cart) return res.status(404).send("Cart not found");

    const items = Array.isArray(cart.items) ? cart.items : [];
    cart.items = items.filter(p => p.productId !== req.params.productId);
    await cart.save();
    res.status(200).send(normalizeCart(cart));
  } catch (err) {
    res.status(500).json(err);
  }
});

// 4. UPDATE QUANTITY
router.put('/update', async (req, res) => {
  const { userId, productId, quantity } = req.body;
  try {
    let cart = await Cart.findOne({ where: { userId } });
    if (!cart) return res.status(404).send("Cart not found");

    const items = Array.isArray(cart.items) ? [...cart.items] : [];
    let itemIndex = items.findIndex(p => p.productId === productId);
    if (itemIndex > -1) {
      items[itemIndex].quantity = Number(quantity) || 1;
      cart.items = items;
      await cart.save();
      res.status(200).send(normalizeCart(cart));
    } else {
      res.status(404).send("Item not found");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;