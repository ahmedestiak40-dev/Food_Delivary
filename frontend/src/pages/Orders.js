import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Box,
  Chip,
  Grid,
  CircularProgress,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import axios from 'axios';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/orders/my-orders');
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusStep = (status) => {
    const steps = ['pending', 'confirmed', 'preparing', 'out-for-delivery', 'delivered'];
    return steps.indexOf(status);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (orders.length === 0) {
    return (
      <Container sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h5">No orders yet</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>My Orders</Typography>
      
      {orders.map((order) => (
        <Card key={order._id} sx={{ mb: 3 }}>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">
                Order #{order._id.slice(-6)}
              </Typography>
              <Chip 
                label={order.status.toUpperCase()} 
                color={order.status === 'delivered' ? 'success' : 'primary'}
              />
            </Box>
            
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Restaurant: {order.restaurantId?.name}
            </Typography>
            
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Date: {new Date(order.createdAt).toLocaleDateString()}
            </Typography>
            
            <Box mt={2}>
              <Typography variant="subtitle2">Items:</Typography>
              {order.items.map((item, idx) => (
                <Typography key={idx} variant="body2">
                  {item.quantity}x {item.name} - ${item.price * item.quantity}
                </Typography>
              ))}
            </Box>
            
            <Box mt={2}>
              <Typography variant="h6">
                Total: ${order.totalAmount}
              </Typography>
            </Box>
            
            <Box mt={2}>
              <Stepper activeStep={getStatusStep(order.status)} alternativeLabel>
                <Step><StepLabel>Pending</StepLabel></Step>
                <Step><StepLabel>Confirmed</StepLabel></Step>
                <Step><StepLabel>Preparing</StepLabel></Step>
                <Step><StepLabel>Out for Delivery</StepLabel></Step>
                <Step><StepLabel>Delivered</StepLabel></Step>
              </Stepper>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Container>
  );
}

export default Orders;