const express = require('express');
const router = express.Router();
const Restaurant = require('../models/Restaurant');
const auth = require('../middleware/auth');

// Get all restaurants
router.get('/', async (req, res) => {
  try {
    const { cuisine, search } = req.query;
    let query = {};
    
    if (cuisine) {
      query.cuisine = cuisine;
    }
    
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    
    const restaurants = await Restaurant.find(query);
    res.json(restaurants);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single restaurant with menu
router.get('/:id', async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    res.json(restaurant);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add menu item (restaurant owner only)
router.post('/:id/menu', auth, async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    
    restaurant.menu.push(req.body);
    await restaurant.save();
    res.json(restaurant);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;