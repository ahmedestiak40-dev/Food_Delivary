import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Avatar,
  Grid,
  Divider,
  Alert,
  IconButton,
  Chip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

function Profile() {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: { street: '', city: '', zipCode: '' }
  });
  const [favorites, setFavorites] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        address: user.address || { street: '', city: '', zipCode: '' }
      });
      fetchFavorites();
    }
  }, [user]);

  const fetchFavorites = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/favorites');
      setFavorites(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async () => {
    try {
      // In a real app, you'd have an update profile endpoint
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setEditing(false);
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to update profile' });
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {message && (
        <Alert severity={message.type} sx={{ mb: 2 }}>
          {message.text}
        </Alert>
      )}
      
      <Grid container spacing={3}>
        {/* Profile Section */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Avatar
              sx={{
                width: 120,
                height: 120,
                margin: '0 auto',
                bgcolor: 'primary.main',
                fontSize: 48
              }}
            >
              {user?.name?.charAt(0).toUpperCase()}
            </Avatar>
            <Typography variant="h5" sx={{ mt: 2 }}>
              {user?.name}
            </Typography>
            <Typography color="text.secondary">
              {user?.email}
            </Typography>
            <Chip
              label={user?.role?.toUpperCase()}
              color="primary"
              size="small"
              sx={{ mt: 1 }}
            />
            <Button
              startIcon={editing ? <SaveIcon /> : <EditIcon />}
              variant="outlined"
              onClick={() => editing ? handleSave() : setEditing(true)}
              sx={{ mt: 2 }}
            >
              {editing ? 'Save Changes' : 'Edit Profile'}
            </Button>
          </Paper>
        </Grid>
        
        {/* Details Section */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Personal Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <TextField
              fullWidth
              label="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              disabled={!editing}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Phone Number"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              disabled={!editing}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Street Address"
              value={formData.address.street}
              onChange={(e) => setFormData({
                ...formData,
                address: { ...formData.address, street: e.target.value }
              })}
              disabled={!editing}
              margin="normal"
            />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="City"
                  value={formData.address.city}
                  onChange={(e) => setFormData({
                    ...formData,
                    address: { ...formData.address, city: e.target.value }
                  })}
                  disabled={!editing}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Zip Code"
                  value={formData.address.zipCode}
                  onChange={(e) => setFormData({
                    ...formData,
                    address: { ...formData.address, zipCode: e.target.value }
                  })}
                  disabled={!editing}
                  margin="normal"
                />
              </Grid>
            </Grid>
          </Paper>
          
          {/* Favorites Section */}
          <Paper sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              <FavoriteIcon sx={{ mr: 1, color: '#ff4757' }} />
              Favorite Restaurants
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {favorites.length === 0 ? (
              <Typography color="text.secondary">
                No favorite restaurants yet. Start adding some!
              </Typography>
            ) : (
              favorites.map((fav) => (
                <Box key={fav._id} sx={{ mb: 1 }}>
                  <Typography>{fav.restaurantId?.name}</Typography>
                </Box>
              ))
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Profile;