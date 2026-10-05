import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

const theme = createTheme({
  palette: {
    primary: {
      main: '#ff5722',
    },
  },
});

function TestApp() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="sm" sx={{ mt: 8, textAlign: 'center' }}>
        <Typography variant="h3" gutterBottom>
          Test Page
        </Typography>
        <Typography variant="body1" paragraph>
          If you can see this, Material-UI is working correctly!
        </Typography>
        <Button variant="contained" color="primary">
          Test Button
        </Button>
      </Container>
    </ThemeProvider>
  );
}

export default TestApp;