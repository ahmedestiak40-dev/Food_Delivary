const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  category: String,
  image: String,
  isAvailable: {
    type: Boolean,
    default: true
  }
});

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  cuisine: [String],
  address: {
    street: String,
    city: String,
    zipCode: String
  },
  rating: {
    type: Number,
    default: 0
  },
  deliveryTime: String,
  minOrder: Number,
  image: String,
  menu: [menuItemSchema],
  isOpen: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Restaurant', restaurantSchema);