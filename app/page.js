"use client";
import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Link as MuiLink } from '@mui/material';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import HeroSection from './components/hero.js';
import ProductSection from './components/product.js';
import PricingSection from './components/pricing.js';
import Footer from './components/footer.js';

export default function Home() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleSubmit = async () => {
    const checkoutSession = await fetch('/api/checkout_sessions', {
      method: 'POST',
      headers: { origin: 'http://localhost:3000' },
    });
    const checkoutSessionJson = await checkoutSession.json();
  
    const stripe = await getStripe();
    const { error } = await stripe.redirectToCheckout({
      sessionId: checkoutSessionJson.id,
    });
  
    if (error) {
      console.warn(error.message);
    }
  };

  return (
    <>
      {/* Navbar */}
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          {/* Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {/* <Image src="#" alt="FlashPrepAI" width={40} height={40} /> */}
            <Typography variant="h6" sx={{ ml: 1, fontWeight: 'bold' }}>
              CoolCardsAI
            </Typography>
          </Box>
          
          {/* Navigation Links */}
          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 2 }}>
              <MuiLink href="#product" color="inherit" underline="none">PRODUCT</MuiLink>
              <MuiLink href="#pricing" color="inherit" underline="none">PRICING</MuiLink>
              <MuiLink href="dashboard" color="inherit" underline="none">DASHBOARD</MuiLink>
              <MuiLink href="generate" color="inherit" underline="none">GENERATE</MuiLink>
            </Box>
          )}

          <SignedOut>
            <Link href="/sign-in" passHref>
            <Button variant="outlined"
            sx={{
              mt: 4,
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
            Sign In
          </Button>

            </Link>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </Toolbar>
      </AppBar>

      <HeroSection />
      <ProductSection />
      <PricingSection />
      <Footer />
    </>
  );
}
