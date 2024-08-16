import React from 'react';
import Link from 'next/link';
import { AppBar, Toolbar, Box, Typography, Button, Link as MuiLink } from '@mui/material';
import { SignedOut, SignedIn, UserButton } from '@clerk/nextjs';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { useUser } from '@clerk/nextjs';


const Navbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { isSignedIn } = useUser(); // Check if the user is signed in

  return (
    <AppBar position="static" color="transparent" elevation={0}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ ml: 1, fontWeight: 'bold' }}>
            <MuiLink href="/" color="inherit" underline="none">
              CoolCardsAI
            </MuiLink>
          </Typography>
        </Box>
        
        {/* Navigation Links */}
        {!isMobile && (
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Link
              href="/#product"
              color="inherit"
              underline="none"
              sx={{
                fontFamily: "'Poppins', sans-serif",
                borderRadius: '5px',
                px: '10px', // Horizontal padding
                py: '5px', // Optional: Vertical padding for better spacing
                '&:hover': {
                  backgroundColor: '#e0e0e0', // Change background on hover
                },
              }}
            >
              PRODUCT
            </Link>
            <Link
              href="/#pricing"
              color="inherit"
              underline="none"
              sx={{
                fontFamily: "'Poppins', sans-serif",
                borderRadius: '5px',
                px: '10px', // Horizontal padding
                py: '5px', // Optional: Vertical padding for better spacing
                '&:hover': {
                  backgroundColor: '#e0e0e0', // Change background on hover
                },
              }}
            >
              PRICING
            </Link>
            <Link
              href={isSignedIn ? "/dashboard" : "/sign-in"}
              color="inherit"
              underline="none"
              sx={{
                fontFamily: "'Poppins', sans-serif",
                borderRadius: '5px',
                px: '10px', // Horizontal padding
                py: '5px', // Optional: Vertical padding for better spacing
                '&:hover': {
                  backgroundColor: '#e0e0e0', // Change background on hover
                },
              }}
            >
              DASHBOARD
            </Link>
            <Link
              href="/generate"
              color="inherit"
              underline="none"
              sx={{
                fontFamily: "'Poppins', sans-serif",
                borderRadius: '5px',
                px: '10px', // Horizontal padding
                py: '5px', // Optional: Vertical padding for better spacing
                '&:hover': {
                  backgroundColor: '#e0e0e0', // Change background on hover
                },
              }}
            >
              GENERATE
            </Link>
          </Box>
        )}

        <SignedOut>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <MuiLink href="/sign-up" passHref>
              <Button
                variant="outlined"
                sx={{
                  fontWeight: 'bold',
                  borderColor: 'black', // Set the outline color to black
                  color: 'black',       // Set the text color to black
                  backgroundColor: 'white', // Set the background to white
                  '&:hover': {
                    backgroundColor: 'black', // Background color changes to black on hover
                    color: 'white',           // Text color changes to white on hover
                    borderColor: 'black',     // Keep the border color black on hover
                  },
                }}
              >
                Sign Up
              </Button>
            </MuiLink>
            <MuiLink href="/sign-in" passHref>
              <Button
                variant="contained"
                sx={{
                  fontWeight: 'bold',
                  backgroundColor: 'black', // Background color is black
                  color: 'white',           // Text color is white
                  '&:hover': {
                    backgroundColor: '#333', // Slightly lighter black on hover
                  },
                }}
              >
                Sign In
              </Button>
            </MuiLink>
          </Box>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
