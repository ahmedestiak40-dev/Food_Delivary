import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Box,
  Chip,
  Divider,
  Alert,
  Snackbar
} from '@mui/material';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

function RestaurantDetail() {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchRestaurant();
  }, [id]);

  const fetchRestaurant = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/restaurants/${id}`);
      setRestaurant(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddToCart = async (item) => {
    if (!user) {
      setSnackbar({ open: true, message: 'Please login to add items to cart', severity: 'warning' });
      setTimeout(() => navigate('/login'), 2000);
      return;
    }

    const result = await addToCart(item, restaurant._id);
    if (result.success) {
      setSnackbar({ open: true, message: 'Added to cart!', severity: 'success' });
    } else {
      setSnackbar({ open: true, message: result.error, severity: 'error' });
    }
  };

  if (!restaurant) return <Typography>Loading...</Typography>;

  const categories = ['All', ...new Set(restaurant.menu.map(item => item.category))];
  const filteredMenu = selectedCategory === 'All' 
    ? restaurant.menu 
    : restaurant.menu.filter(item => item.category === selectedCategory);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box mb={4}>
        <Typography variant="h4" gutterBottom>{restaurant.name}</Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          {restaurant.cuisine?.join(', ')} • ⏱️ {restaurant.deliveryTime} • Min order: ${restaurant.minOrder}
        </Typography>
        <Box display="flex" gap={1} flexWrap="wrap">
          {categories.map(category => (
            <Chip
              key={category}
              label={category}
              onClick={() => setSelectedCategory(category)}
              color={selectedCategory === category ? 'primary' : 'default'}
              sx={{ cursor: 'pointer' }}
            />
          ))}
        </Box>
      </Box>

      <Divider sx={{ mb: 4 }} />

      <Grid container spacing={3}>
        {filteredMenu.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item._id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>{item.name}</Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {item.description}
                </Typography>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="h6" color="primary">
                    ${item.price}
                  </Typography>
                  <Button 
                    variant="contained" 
                    size="small"
                    onClick={() => handleAddToCart(item)}
                    disabled={!restaurant.isOpen}
                  >
                    Add to Cart
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Container>
  );
}

export default RestaurantDetail;