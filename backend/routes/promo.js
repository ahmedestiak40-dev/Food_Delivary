const express = require('express');
const router = express.Router();
const PromoCode = require('../models/PromoCode');
const auth = require('../middleware/auth');

// Validate promo code
router.post('/validate', auth, async (req, res) => {
  try {
    const { code, totalAmount } = req.body;
    
    const promo = await PromoCode.findOne({ 
      code: code.toUpperCase(), 
      isActive: true,
      validUntil: { $gt: new Date() }
    });
    
    if (!promo) {
      return res.status(404).json({ message: 'Invalid or expired promo code' });
    }
    
    if (promo.usageLimit && promo.usedCount >= promo.usageLimit) {
      return res.status(400).json({ message: 'Promo code usage limit exceeded' });
    }
    
    if (totalAmount < promo.minOrder) {
      return res.status(400).json({ 
        message: `Minimum order amount of $${promo.minOrder} required for this promo code` 
      });
    }
    
    let discount = 0;
    if (promo.discountType === 'percentage') {
      discount = (totalAmount * promo.discountValue) / 100;
    } else {
      discount = promo.discountValue;
    }
    
    res.json({
      code: promo.code,
      discount,
      finalAmount: totalAmount - discount,
      message: `Promo code applied! You saved $${discount.toFixed(2)}`
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;