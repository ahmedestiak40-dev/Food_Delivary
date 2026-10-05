const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// In a real app, you'd store cart in Redis or a separate collection
// This is a simplified version using in-memory storage
let userCarts = {};

// Get cart
router.get('/', auth, (req, res) => {
  const cart = userCarts[req.user.id] || { items: [], total: 0 };
  res.json(cart);
});

// Add to cart
router.post('/add', auth, (req, res) => {
  const { menuItem, restaurantId } = req.body;
  
  if (!userCarts[req.user.id]) {
    userCarts[req.user.id] = { items: [], restaurantId: null, total: 0 };
  }
  
  const cart = userCarts[req.user.id];
  
  // Check if restaurant is same
  if (cart.restaurantId && cart.restaurantId !== restaurantId) {
    return res.status(400).json({ message: 'Cannot add items from different restaurants' });
  }
  
  cart.restaurantId = restaurantId;
  
  const existingItem = cart.items.find(item => item.menuItemId === menuItem._id);
  
  if (existingItem) {
    existingItem.quantity++;
    existingItem.totalPrice = existingItem.quantity * existingItem.price;
  } else {
    cart.items.push({
      menuItemId: menuItem._id,
      name: menuItem.name,
      price: menuItem.price,
      quantity: 1,
      totalPrice: menuItem.price
    });
  }
  
  cart.total = cart.items.reduce((sum, item) => sum + item.totalPrice, 0);
  
  res.json(cart);
});

// Remove from cart
router.delete('/remove/:itemId', auth, (req, res) => {
  const cart = userCarts[req.user.id];
  if (!cart) {
    return res.status(404).json({ message: 'Cart not found' });
  }
  
  cart.items = cart.items.filter(item => item.menuItemId !== req.params.itemId);
  cart.total = cart.items.reduce((sum, item) => sum + item.totalPrice, 0);
  
  res.json(cart);
});

// Clear cart
router.delete('/clear', auth, (req, res) => {
  delete userCarts[req.user.id];
  res.json({ message: 'Cart cleared' });
});

module.exports = router;