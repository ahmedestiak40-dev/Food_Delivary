const express = require('express');
const router = express.Router();
const Favorite = require('../models/Favorite');
const auth = require('../middleware/auth');

// Get user favorites
router.get('/', auth, async (req, res) => {
  try {
    const favorites = await Favorite.find({ userId: req.user.id })
      .populate('restaurantId');
    res.json(favorites);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add to favorites
router.post('/:restaurantId', auth, async (req, res) => {
  try {
    const favorite = new Favorite({
      userId: req.user.id,
      restaurantId: req.params.restaurantId
    });
    await favorite.save();
    res.status(201).json(favorite);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Already in favorites' });
    }
    res.status(500).json({ message: err.message });
  }
});

// Remove from favorites
router.delete('/:restaurantId', auth, async (req, res) => {
  try {
    await Favorite.findOneAndDelete({
      userId: req.user.id,
      restaurantId: req.params.restaurantId
    });
    res.json({ message: 'Removed from favorites' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;