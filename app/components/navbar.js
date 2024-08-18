"use client";
import React from 'react';
import Link from 'next/link';
import { AppBar, Toolbar, Box, Typography, Button } from '@mui/material';
import { SignedOut, SignedIn, UserButton } from '@clerk/nextjs';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { useUser } from '@clerk/nextjs';

const Navbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { isSignedIn } = useUser();

  return (
    <AppBar position="static" color="transparent" elevation={0}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ ml: 1, fontWeight: 'bold' }}>
            <Link href="/" passHref>
              <Button sx={{ color: 'inherit', textTransform: 'none', fontFamily: "'Poppins', sans-serif" }}>
                CoolCardsAI
              </Button>
            </Link>
          </Typography>
        </Box>
        
        {/* Navigation Links */}
        {!isMobile && (
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Link href="/#product" passHref>
              <Button
                sx={{
                  color: 'inherit',
                  textTransform: 'none',
                  fontFamily: "'Poppins', sans-serif",
                  borderRadius: '5px',
                  px: '10px', 
                  py: '5px', 
                  transition: 'color 0.3s, background-color 0.3s, box-shadow 0.3s', 
                  '&:hover': {
                    color: 'rgb(255, 99, 132)', 
                    backgroundColor: 'rgba(255, 99, 132, 0.2)', 
                    boxShadow: '0 0 10px rgba(255, 99, 132, 0.7)', 
                  },
                }}
              >
                PRODUCT
              </Button>
            </Link>
            <Link href="/#pricing" passHref>
              <Button
                sx={{
                  color: 'inherit',
                  textTransform: 'none',
                  fontFamily: "'Poppins', sans-serif",
                  borderRadius: '5px',
                  px: '10px', // Horizontal padding
                  py: '5px', // Optional: Vertical padding
                  transition: 'color 0.3s, background-color 0.3s, box-shadow 0.3s', // Smooth transition
                  '&:hover': {
                    color: '#97f29d', // Pastel green text
                    backgroundColor: 'rgba(75, 192, 192, 0.2)', // Slight pastel green background
                    boxShadow: '0 0 10px #97f29d', // Pastel green glow
                  },
                }}
              >
                PRICING
              </Button>
            </Link>
            <Link href={isSignedIn ? "/dashboard" : "/sign-in"} passHref>
              <Button
                sx={{
                  color: 'inherit',
                  textTransform: 'none',
                  fontFamily: "'Poppins', sans-serif",
                  borderRadius: '5px',
                  px: '10px', // Horizontal padding
                  py: '5px', // Optional: Vertical padding
                  transition: 'color 0.3s, background-color 0.3s, box-shadow 0.3s', // Smooth transition
                  '&:hover': {
                    color: 'rgb(54, 162, 235)', // Pastel blue text
                    backgroundColor: 'rgba(54, 162, 235, 0.2)', // Slight pastel blue background
                    boxShadow: '0 0 10px rgba(54, 162, 235, 0.7)', // Pastel blue glow
                  },
                }}
              >
                DASHBOARD
              </Button>
            </Link>
            <Link href="/generate" passHref>
              <Button
                sx={{
                  color: 'inherit',
                  textTransform: 'none',
                  fontFamily: "'Poppins', sans-serif",
                  borderRadius: '5px',
                  px: '10px', // Horizontal padding
                  py: '5px', // Optional: Vertical padding
                  transition: 'color 0.3s, background-color 0.3s, box-shadow 0.3s', // Smooth transition
                  '&:hover': {
                    color: 'rgb(153, 102, 255)', // Pastel purple text
                    backgroundColor: 'rgba(153, 102, 255, 0.2)', // Slight pastel purple background
                    boxShadow: '0 0 10px rgba(153, 102, 255, 0.7)', // Pastel purple glow
                  },
                }}
              >
                GENERATE
              </Button>
            </Link>
          </Box>
        )}

        <SignedOut>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Link href="/sign-up" passHref>
              <Button
                variant="outlined"
                sx={{
                  fontWeight: 'bold',
                  borderColor: 'black',
                  color: 'black',
                  backgroundColor: 'white',
                  transition: 'background-color 0.3s, color 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    backgroundColor: 'black',
                    color: 'white',
                    boxShadow: '0 0 10px rgba(255, 99, 132, 0.7)', // Pastel red glow
                  },
                }}
              >
                Sign Up
              </Button>
            </Link>
            <Link href="/sign-in" passHref>
              <Button
                variant="contained"
                sx={{
                  fontWeight: 'bold',
                  backgroundColor: 'black',
                  color: 'white',
                  transition: 'background-color 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    backgroundColor: '#333',
                    boxShadow: '0 0 10px rgba(75, 192, 192, 0.7)', // Pastel green glow
                  },
                }}
              >
                Sign In
              </Button>
            </Link>
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
