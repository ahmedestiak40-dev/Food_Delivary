const mongoose = require('mongoose');

const promoSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true
  },
  discountType: {
    type: String,
    enum: ['percentage', 'fixed'],
    default: 'percentage'
  },
  discountValue: {
    type: Number,
    required: true
  },
  minOrder: {
    type: Number,
    default: 0
  },
  validUntil: Date,
  isActive: {
    type: Boolean,
    default: true
  },
  usageLimit: Number,
  usedCount: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model('PromoCode', promoSchema);