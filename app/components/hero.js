import React from 'react';
import { Container, Box, Typography, Button } from '@mui/material';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';

export default function HeroSection() {
  const { isSignedIn } = useUser(); // Check if the user is signed in

  return (
    <Container maxWidth="lg">
      <Box sx={{ textAlign: 'center', my: 20 }}>
        <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Revolutionize Your Learning with AI Flashcards
        </Typography>
        <Typography variant="h6" component="h2" gutterBottom sx={{ color: 'text.secondary' }}>
          <span style={{ color: '#ff69b4', fontWeight: 'bold' }}>AI-generated flashcards</span> that will help you study <span style={{ color: '#ff69b4', fontWeight: 'bold' }}>more effectively</span>
        </Typography>

        {!isSignedIn && (
          <Link href="/sign-in" passHref>
            <Button variant="contained" color="inherit"
              sx={{
                mt: 4,
                mx: 4,
                fontWeight: 'bold',
                backgroundColor: 'black',
                color: 'white',
                boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                '&:hover': {
                  backgroundColor: 'black',
                  boxShadow: '0px 8px 15px rgba(0, 0, 0, 0.3)',
                },
              }}>
              Get Started
            </Button>
          </Link>
        )}

        <Link href="/generate" passHref>
          <Button variant="outlined"
            sx={{
              mt: 4,
              mx: 4,
              fontWeight: 'bold',
              borderColor: 'black', // Set the outline color to black
              color: 'black',       // Set the text color to black
              backgroundColor: 'white', // Set the background to white
              '&:hover': {
                backgroundColor: 'black', // Background color changes to black on hover
                color: 'white',           // Text color changes to white on hover
                borderColor: 'black',     // Keep the border color black on hover
              },
            }}>
            Generate Cards
          </Button>
        </Link>
      </Box>
    </Container>
  );
}
