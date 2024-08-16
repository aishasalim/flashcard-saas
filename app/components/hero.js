import React from 'react';
import { Container, Box, Typography, Button, Link as MuiLink } from '@mui/material';

export default function HeroSection() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ textAlign: 'center', my: 8 }}>
        <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Transform Your Learning with AI-Powered Flashcards
        </Typography>
        <Typography variant="h6" component="h2" gutterBottom sx={{ color: 'text.secondary' }}>
        <span style={{ color: '#ff69b4', fontWeight: 'bold' }}>AI-generated flashcards</span> that adapt to your needs and help you retain information <span style={{ color: '#ff69b4', fontWeight: 'bold' }}>more effectively</span>
        </Typography>
        <Button variant="contained" color="inherit"
            sx={{
                mt: 4,
                fontWeight: 'bold',
                backgroundColor: 'black',
                color: 'white',
                boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                '&:hover': {
                backgroundColor: 'black',
                boxShadow: '0px 8px 15px rgba(0, 0, 0, 0.3)',
                },}}>
          Get Started
        </Button>
      </Box>
    </Container>
  );
}
