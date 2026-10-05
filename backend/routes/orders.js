const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Restaurant = require('../models/Restaurant');
const auth = require('../middleware/auth');

// Create order
router.post('/', auth, async (req, res) => {
  try {
    const { restaurantId, items, deliveryAddress, paymentMethod, totalAmount } = req.body;
    
    const order = new Order({
      userId: req.user.id,
      restaurantId,
      items,
      totalAmount,
      deliveryAddress,
      paymentMethod
    });
    
    await order.save();
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get user orders
router.get('/my-orders', auth, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id })
      .populate('restaurantId', 'name image')
      .sort('-createdAt');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get order by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('restaurantId', 'name address')
      .populate('userId', 'name phone');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    if (order.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update order status (restaurant/admin only)
router.patch('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    order.status = status;
    await order.save();
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;