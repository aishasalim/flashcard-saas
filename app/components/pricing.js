
'use client';

import React from 'react';
import { Container, Typography, Grid, Stack, Paper, Button } from '@mui/material';
import Link from 'next/link';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useRouter } from 'next/navigation';

export default function PricingSection() {
  const router = useRouter();

  const handleSubmit = async () => {
    try {
      const response = await fetch('/api/checkout_sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'An error occurred');
      }

      const session = await response.json();

      // Redirect to Stripe Checkout
      router.push(session.url);
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      alert('An error occurred while processing your request. Please try again.');
    }
  };

  const pricing = [
    {
      title: "Basic",
      price: "$0",
      description: "Free",
      features: [
        "Access to standard flashcards",
        "Limited flashcard generation",
        "Limited saved flashcard sets",
      ],
      buttonText: "Get Started",
      backgroundColor: "#e6dbff",
      isFree: true
    },
    {
      title: "Pro",
      price: "$10",
      description: "Per month",
      features: [
        "Exclusive content and features",
        "Unlimited flashcard generation",
        "Unlimited saved flashcard sets",
      ],
      buttonText: "Upgrade to Pro",
      backgroundColor: "#ffd3d9",
      isFree: false
    },
  ];

  return (
    <Container maxWidth="lg" id="pricing" sx={{ my: 12 }}>
      <Typography
        variant="h4"
        component="h2"
        className="font-hyperlegible"
        sx={{
          textAlign: 'center',
          fontWeight: 'bold',
          mb: 4,
        }} >
        Choose Your Plan
      </Typography>
      <Typography variant="h6" component="p" className="font-poppins" sx={{ textAlign: 'center', color: 'text.secondary', mb: 6 }}>
        Choose the plan that <span style={{ color: '#ff69b4', fontWeight: 'bold' }}>perfectly fits</span> your learning goals
      </Typography>

      <Grid container spacing={10} justifyContent="center">
        {pricing.map((plan, index) => (
          <Grid item xs={12} sm={8} md={5} key={index}>
            <Paper
              sx={{
                width: '100%',
                maxWidth: '400px',
                minHeight: '480px',
                backgroundColor: plan.backgroundColor,
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'rotate(-3deg)',
                },
                margin: 'auto',
                padding: 4,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
              elevation={5}
            >
              <Stack alignItems={'center'}>
                <Typography sx={{ fontSize: '1.8rem', fontWeight: 'bold', mb: 2 }} variant="h5" className="font-poppins">{plan.title}</Typography>
                <Typography sx={{ fontSize: '3rem', fontWeight: 'bold', mb: 2 }} variant="h4" className="font-poppins">{plan.price}</Typography>
                <Typography sx={{ fontSize: '1.2rem', color: 'text.secondary', mb: 4 }} variant="h6" className="font-poppins">{plan.description}</Typography>

                {plan.features.map((feature, i) => (
                  <Stack key={i} m={1} width={'100%'} justifyContent={'flex-start'} direction={'row'} alignItems={'center'}>
                    <CheckCircleIcon sx={{ mx: 2 }} />
                    <Typography sx={{ flexGrow: 1, fontFamily: "'Edu VIC WA NT Beginner', sans-serif", fontSize: '1.3rem' }} className="font-edu">{feature}</Typography>
                  </Stack>
                ))}

                {plan.isFree ? (
                  <Link href={'/generate'} passHref style={{ width: '100%', textDecoration: 'none' }}>
                    <Button
                      variant="contained"
                      color="inherit"
                      sx={{
                        width: '100%',
                        mt: 4,
                        fontWeight: 'bold',
                        backgroundColor: 'black',
                        color: 'white',
                        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                        '&:hover': {
                          backgroundColor: 'black',
                          boxShadow: '0px 8px 15px rgba(0, 0, 0, 0.3)',
                        },
                      }}
                    >
                      {plan.buttonText}
                    </Button>
                  </Link>
                ) : (
                  <Button
                    variant="contained"
                    color="inherit"
                    onClick={handleSubmit}
                    sx={{
                      width: '100%',
                      mt: 4,
                      fontWeight: 'bold',
                      backgroundColor: 'black',
                      color: 'white',
                      boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                      '&:hover': {
                        backgroundColor: 'black',
                        boxShadow: '0px 8px 15px rgba(0, 0, 0, 0.3)',
                      },
                    }}
                  >
                    {plan.buttonText}
                  </Button>
                )}
              </Stack>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}