const router = require('express').Router();
const Cart = require('../models/Cart');

// 1. ADD TO CART
router.post('/add', async (req, res) => {
  const { userId, productId, quantity, variant, title, price, image } = req.body;

  try {
    let cart = await Cart.findOne({ userId });

    if (cart) {
      // Cart exists for this user
      let itemIndex = cart.products.findIndex(p => p.productId === productId);

      if (itemIndex > -1) {
        // Product exists in cart, update quantity
        cart.products[itemIndex].quantity += quantity;
      } else {
        // Product does not exist in cart, add new item
        cart.products.push({ productId, quantity, variant, title, price, image });
      }
      cart = await cart.save();
      return res.status(200).send(cart);
    } else {
      // No cart for user, create new cart
      const newCart = await Cart.create({
        userId,
        products: [{ productId, quantity, variant, title, price, image }]
      });
      return res.status(201).send(newCart);
    }
  } catch (err) {
    console.log("Error in /add:", err); // Check your terminal for this log if it fails
    res.status(500).send("Something went wrong");
  }
});

// 2. GET CART
router.get('/:userId', async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });
    if (cart) {
      res.status(200).send(cart);
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
    let cart = await Cart.findOne({ userId: req.params.userId });
    if (!cart) return res.status(404).send("Cart not found");

    cart.products = cart.products.filter(p => p.productId !== req.params.productId);
    await cart.save();
    res.status(200).send(cart);
  } catch (err) {
    res.status(500).json(err);
  }
});

// 4. UPDATE QUANTITY
router.put('/update', async (req, res) => {
  const { userId, productId, quantity } = req.body;
  try {
    let cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).send("Cart not found");

    let itemIndex = cart.products.findIndex(p => p.productId === productId);
    if (itemIndex > -1) {
      cart.products[itemIndex].quantity = quantity;
      await cart.save();
      res.status(200).send(cart);
    } else {
      res.status(404).send("Item not found");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;