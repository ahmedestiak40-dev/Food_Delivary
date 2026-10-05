import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Badge,
  Box
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { cart } = useCart();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography 
          variant="h6" 
          sx={{ flexGrow: 1, cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          FoodDelivery
        </Typography>
        
        <Box>
          <IconButton color="inherit" onClick={() => navigate('/cart')}>
            <Badge badgeContent={cart.items.length} color="error">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
          
          {user ? (
            <>
              <Button color="inherit" onClick={() => navigate('/orders')}>
                My Orders
              </Button>
              <Button color="inherit" onClick={logout}>
                Logout ({user.name})
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" onClick={() => navigate('/login')}>
                Login
              </Button>
              <Button color="inherit" onClick={() => navigate('/register')}>
                Register
              </Button>
              <Button color="inherit" onClick={() => navigate('/profile')}>
                 Profile
            </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;