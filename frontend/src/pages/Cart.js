import React, { useState } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Box,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Divider,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Alert,
  Snackbar,
  Grid,
  Paper,
  Chip
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

function Cart() {
  const { cart, removeFromCart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [address, setAddress] = useState(user?.address || { street: '', city: '', zipCode: '' });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [promoMessage, setPromoMessage] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [loading, setLoading] = useState(false);

  const applyPromoCode = async () => {
    if (!promoCode.trim()) {
      setPromoMessage('Please enter a promo code');
      return;
    }
    
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/promo/validate', {
        code: promoCode,
        totalAmount: cart.total
      });
      setDiscount(res.data.discount);
      setPromoMessage(res.data.message);
      setAppliedPromo(promoCode);
      setSnackbar({ open: true, message: 'Promo code applied successfully!', severity: 'success' });
    } catch (err) {
      setPromoMessage(err.response?.data?.message || 'Invalid promo code');
      setDiscount(0);
      setAppliedPromo(null);
      setSnackbar({ open: true, message: err.response?.data?.message || 'Failed to apply promo code', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const removePromoCode = () => {
    setDiscount(0);
    setPromoMessage('');
    setAppliedPromo(null);
    setPromoCode('');
    setSnackbar({ open: true, message: 'Promo code removed', severity: 'info' });
  };

  const handlePlaceOrder = async () => {
    if (!address.street || !address.city) {
      setSnackbar({ open: true, message: 'Please provide delivery address', severity: 'warning' });
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        restaurantId: cart.restaurantId,
        items: cart.items.map(item => ({
          menuItemId: item.menuItemId,
          name: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        totalAmount: cart.total - discount,
        deliveryAddress: address,
        paymentMethod,
        promoCode: appliedPromo,
        discount: discount
      };

      const res = await axios.post('http://localhost:5000/api/orders', orderData);
      await clearCart();
      setSnackbar({ open: true, message: 'Order placed successfully!', severity: 'success' });
      setTimeout(() => navigate('/orders'), 2000);
    } catch (err) {
      setSnackbar({ open: true, message: err.response?.data?.message || 'Failed to place order', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  if (cart.items.length === 0) {
    return (
      <Container sx={{ mt: 8, textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <ShoppingCartIcon sx={{ fontSize: 100, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" gutterBottom>Your cart is empty</Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Looks like you haven't added any items to your cart yet
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => navigate('/')}
            sx={{ mt: 2 }}
          >
            Browse Restaurants
          </Button>
        </motion.div>
      </Container>
    );
  }

  const finalTotal = cart.total - discount;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h4" gutterBottom>
          Your Cart
          <Chip 
            label={`${cart.items.length} items`} 
            color="primary" 
            size="small" 
            sx={{ ml: 2, verticalAlign: 'middle' }}
          />
        </Typography>
      </motion.div>
      
      <Grid container spacing={3}>
        {/* Cart Items Section */}
        <Grid item xs={12} md={7}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Order Items
                </Typography>
                <List>
                  {cart.items.map((item, index) => (
                    <React.Fragment key={item.menuItemId}>
                      <ListItem
                        secondaryAction={
                          <IconButton 
                            edge="end" 
                            onClick={() => removeFromCart(item.menuItemId)}
                            sx={{ '&:hover': { color: '#ff4757' } }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        }
                      >
                        <ListItemText
                          primary={
                            <Typography variant="subtitle1" fontWeight="bold">
                              {item.name}
                            </Typography>
                          }
                          secondary={`Quantity: ${item.quantity}`}
                        />
                        <Typography variant="body1" fontWeight="bold" color="primary">
                          ${(item.price * item.quantity).toFixed(2)}
                        </Typography>
                      </ListItem>
                      {index < cart.items.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
                
                <Box mt={2}>
                  <Divider />
                  <Box display="flex" justifyContent="space-between" mt={2}>
                    <Typography variant="h6">Subtotal:</Typography>
                    <Typography variant="h6">${cart.total.toFixed(2)}</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
        
        {/* Order Summary Section */}
        <Grid item xs={12} md={5}>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {/* Promo Code Section */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  <LocalOfferIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Promo Code
                </Typography>
                <Box display="flex" gap={1}>
                  <TextField
                    size="small"
                    placeholder="Enter promo code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    fullWidth
                    disabled={!!appliedPromo}
                  />
                  {!appliedPromo ? (
                    <Button 
                      variant="outlined" 
                      onClick={applyPromoCode}
                      disabled={loading}
                    >
                      Apply
                    </Button>
                  ) : (
                    <Button 
                      variant="outlined" 
                      color="error"
                      onClick={removePromoCode}
                    >
                      Remove
                    </Button>
                  )}
                </Box>
                {promoMessage && (
                  <Alert severity={discount > 0 ? 'success' : 'info'} sx={{ mt: 2 }}>
                    {promoMessage}
                  </Alert>
                )}
              </CardContent>
            </Card>
            
            {/* Delivery Address */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Delivery Address
                </Typography>
                <TextField
                  fullWidth
                  label="Street Address"
                  value={address.street}
                  onChange={(e) => setAddress({ ...address, street: e.target.value })}
                  margin="normal"
                  required
                  size="small"
                />
                <TextField
                  fullWidth
                  label="City"
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  margin="normal"
                  required
                  size="small"
                />
                <TextField
                  fullWidth
                  label="Zip Code"
                  value={address.zipCode}
                  onChange={(e) => setAddress({ ...address, zipCode: e.target.value })}
                  margin="normal"
                  size="small"
                />
              </CardContent>
            </Card>
            
            {/* Payment Method */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Payment Method
                </Typography>
                <RadioGroup value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                  <FormControlLabel 
                    value="cash" 
                    control={<Radio />} 
                    label="💵 Cash on Delivery" 
                  />
                  <FormControlLabel 
                    value="card" 
                    control={<Radio />} 
                    label="💳 Credit/Debit Card" 
                  />
                  <FormControlLabel 
                    value="online" 
                    control={<Radio />} 
                    label="🏦 Online Payment" 
                  />
                </RadioGroup>
              </CardContent>
            </Card>
            
            {/* Order Total */}
            <Paper sx={{ p: 3, bgcolor: '#f8f9fa' }}>
              <Typography variant="h6" gutterBottom>
                Order Summary
              </Typography>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography>Subtotal:</Typography>
                <Typography>${cart.total.toFixed(2)}</Typography>
              </Box>
              {discount > 0 && (
                <Box display="flex" justifyContent="space-between" mb={1} color="green">
                  <Typography>Discount:</Typography>
                  <Typography>-${discount.toFixed(2)}</Typography>
                </Box>
              )}
              <Box display="flex" justifyContent="space-between" mb={2}>
                <Typography>Delivery Fee:</Typography>
                <Typography>$0.00</Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box display="flex" justifyContent="space-between" mb={2}>
                <Typography variant="h6">Total:</Typography>
                <Typography variant="h5" color="primary" fontWeight="bold">
                  ${finalTotal.toFixed(2)}
                </Typography>
              </Box>
              <Button 
                variant="contained" 
                onClick={handlePlaceOrder}
                fullWidth
                size="large"
                disabled={loading}
                sx={{ 
                  mt: 2,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
                  }
                }}
              >
                {loading ? 'Placing Order...' : 'Place Order'}
              </Button>
            </Paper>
          </motion.div>
        </Grid>
      </Grid>
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default Cart;