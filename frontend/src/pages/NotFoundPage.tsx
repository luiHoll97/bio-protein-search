import React from 'react';
import { Box, Button, Container, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  return (
    <Container maxWidth="md">
      <Box sx={{ 
        my: 8, 
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2
      }}>
        <Typography variant="h1" component="h1" sx={{ fontWeight: 600 }}>
          404
        </Typography>
        <Typography variant="h4" component="h2">
          Page Not Found
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 2, mb: 4 }}>
          The page you're looking for doesn't exist or has been moved.
        </Typography>
        <Button 
          variant="contained" 
          component={RouterLink} 
          to="/"
          size="large"
        >
          Go to Home Page
        </Button>
      </Box>
    </Container>
  );
};

export default NotFoundPage;