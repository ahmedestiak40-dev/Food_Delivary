import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  TextField,
  Chip,
  Box,
  Rating,
  CircularProgress,
  InputAdornment,
  IconButton,
  Button,
  Drawer,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Fab
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import FavoriteIcon from '@mui/icons-material/Favorite';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

function Home() {
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    cuisine: '',
    minRating: 0,
    maxPrice: 50
  });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRestaurants();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [search, filters, restaurants]);

  const fetchRestaurants = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/restaurants');
      setRestaurants(res.data);
      setFilteredRestaurants(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...restaurants];
    
    if (search) {
      filtered = filtered.filter(r => 
        r.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    if (filters.cuisine) {
      filtered = filtered.filter(r => 
        r.cuisine?.includes(filters.cuisine)
      );
    }
    
    if (filters.minRating > 0) {
      filtered = filtered.filter(r => r.rating >= filters.minRating);
    }
    
    setFilteredRestaurants(filtered);
  };

  const cuisines = [...new Set(restaurants.flatMap(r => r.cuisine || []))];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Box sx={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        py: 6,
        mb: 4,
        borderRadius: '0 0 30px 30px'
      }}>
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Typography variant="h3" gutterBottom align="center">
              🍕 Hungry?
            </Typography>
            <Typography variant="h6" align="center" sx={{ mb: 4 }}>
              Order food from the best restaurants in town
            </Typography>
            
            <Box display="flex" gap={2} alignItems="center">
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search restaurants..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                sx={{ 
                  backgroundColor: 'white',
                  borderRadius: 5,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 5,
                  }
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
              <Fab 
                color="secondary" 
                onClick={() => setDrawerOpen(true)}
                sx={{ width: 56, height: 56 }}
              >
                <FilterListIcon />
              </Fab>
            </Box>
          </motion.div>
        </Container>
      </Box>

      <Container maxWidth="lg">
        <Box mb={3} display="flex" gap={1} flexWrap="wrap">
          {cuisines.slice(0, 6).map(cuisine => (
            <Chip
              key={cuisine}
              label={cuisine}
              onClick={() => setFilters({ ...filters, cuisine })}
              color={filters.cuisine === cuisine ? 'primary' : 'default'}
              sx={{ cursor: 'pointer', '&:hover': { transform: 'scale(1.05)' } }}
            />
          ))}
        </Box>

        <AnimatePresence>
          <Grid container spacing={3}>
            {filteredRestaurants.map((restaurant, index) => (
              <Grid item xs={12} sm={6} md={4} key={restaurant._id}>
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card 
                    sx={{ 
                      cursor: 'pointer', 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column',
                      position: 'relative'
                    }}
                    onClick={() => navigate(`/restaurant/${restaurant._id}`)}
                  >
                    <IconButton 
                      sx={{ position: 'absolute', top: 10, right: 10, zIndex: 1, bgcolor: 'white' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        // Add to favorites logic
                      }}
                    >
                      <FavoriteIcon sx={{ color: '#ff4757' }} />
                    </IconButton>
                    
                    <CardMedia
                      component="img"
                      height="200"
                      image={restaurant.image || 'https://via.placeholder.com/300x200?text=Restaurant'}
                      alt={restaurant.name}
                    />
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {restaurant.name}
                      </Typography>
                      <Box display="flex" alignItems="center" mb={1}>
                        <Rating value={restaurant.rating} readOnly size="small" />
                        <Typography variant="body2" color="text.secondary" ml={1}>
                          ({restaurant.rating})
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {restaurant.cuisine?.join(', ')}
                      </Typography>
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="body2" color="text.secondary">
                          ⏱️ {restaurant.deliveryTime}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Min ${restaurant.minOrder}
                        </Typography>
                      </Box>
                      <Box mt={1}>
                        {restaurant.isOpen ? (
                          <Chip 
                            label="Open Now" 
                            color="success" 
                            size="small"
                            sx={{ fontWeight: 'bold' }}
                          />
                        ) : (
                          <Chip 
                            label="Closed" 
                            color="error" 
                            size="small" 
                          />
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </AnimatePresence>

        {filteredRestaurants.length === 0 && (
          <Box textAlign="center" py={8}>
            <RestaurantIcon sx={{ fontSize: 80, color: 'text.secondary' }} />
            <Typography variant="h5" color="text.secondary">
              No restaurants found
            </Typography>
            <Button variant="contained" onClick={() => {
              setSearch('');
              setFilters({ cuisine: '', minRating: 0, maxPrice: 50 });
            }} sx={{ mt: 2 }}>
              Clear Filters
            </Button>
          </Box>
        )}
      </Container>

      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 300, p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Filter Restaurants
          </Typography>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Cuisine Type</InputLabel>
            <Select
              value={filters.cuisine}
              onChange={(e) => setFilters({ ...filters, cuisine: e.target.value })}
              label="Cuisine Type"
            >
              <MenuItem value="">All</MenuItem>
              {cuisines.map(cuisine => (
                <MenuItem key={cuisine} value={cuisine}>{cuisine}</MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <Box sx={{ mt: 3 }}>
            <Typography gutterBottom>Minimum Rating</Typography>
            <Slider
              value={filters.minRating}
              onChange={(e, val) => setFilters({ ...filters, minRating: val })}
              step={0.5}
              marks
              min={0}
              max={5}
              valueLabelDisplay="auto"
            />
          </Box>
          
          <Button
            fullWidth
            variant="contained"
            onClick={() => setDrawerOpen(false)}
            sx={{ mt: 3 }}
          >
            Apply Filters
          </Button>
        </Box>
      </Drawer>
    </>
  );
}

export default Home;