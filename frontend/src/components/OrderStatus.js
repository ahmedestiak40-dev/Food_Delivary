import React from 'react';
import { Box, Stepper, Step, StepLabel, Typography, Chip } from '@mui/material';
import { motion } from 'framer-motion';

const steps = ['Order Placed', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered'];

const statusColors = {
  pending: '#ffa502',
  confirmed: '#1e90ff',
  preparing: '#ff6348',
  'out-for-delivery': '#2ed573',
  delivered: '#2ed573',
  cancelled: '#ff4757'
};

function OrderStatus({ status }) {
  const activeStep = {
    pending: 0,
    confirmed: 1,
    preparing: 2,
    'out-for-delivery': 3,
    delivered: 4
  }[status] || 0;

  return (
    <Box sx={{ width: '100%', mt: 2 }}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel>
              <Typography variant="caption" fontWeight={index <= activeStep ? 'bold' : 'normal'}>
                {label}
              </Typography>
            </StepLabel>
          </Step>
        ))}
      </Stepper>
      <Box display="flex" justifyContent="center" mt={2}>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Chip
            label={status.toUpperCase()}
            sx={{
              bgcolor: statusColors[status],
              color: 'white',
              fontWeight: 'bold',
              fontSize: '1rem',
              p: 2
            }}
          />
        </motion.div>
      </Box>
    </Box>
  );
}

export default OrderStatus;