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
        Transform Your Study Routine with AI-Generated Flashcards
      </Typography>
      <Typography variant="h6" component="h2" gutterBottom sx={{ color: 'text.secondary' }}>
        Experience <span style={{ color: '#ffa4a3', fontWeight: 'bold' }}>personalized flashcards</span> designed to help you <span style={{ color: '#ffa4a3', fontWeight: 'bold' }}>study smarter</span> and <span style={{ color: '#ffa4a3', fontWeight: 'bold' }}>retain information longer</span>.
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
