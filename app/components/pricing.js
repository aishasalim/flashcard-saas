import React from 'react';
import { Container, Typography, Grid, Stack, Paper, Button, Box } from '@mui/material';
import Link from 'next/link';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export default function PricingSection() {
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
      backgroundColor: "#ffd3d9",
    },
    {
      title: "Pro",
      price: "$1.99",
      description: "One time payment",
      features: [
        "Exclusive content and features",
        "Unlimited flashcard generation",
        "Unlimited saved flashcard sets",
      ],
      buttonText: "Upgrade to Pro",
      backgroundColor: "#d0f0fd",
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
        Pick Your Plan
      </Typography>
      <Typography variant="h6" component="p" className="font-poppins" sx={{ textAlign: 'center', color: 'text.secondary', mb: 6 }}>
        Choose the plan that <span style={{ color: '#ff69b4', fontWeight: 'bold' }}>best fits</span> your learning needs
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
                <Typography sx={{ fontSize: '1.8rem', fontWeight: 'bold', mb: 2 }} variant="h5" className="font-edu">{plan.title}</Typography>
                <Typography sx={{ fontSize: '3rem', fontWeight: 'bold', mb: 2 }} variant="h4" className="font-poppins">{plan.price}</Typography>
                <Typography sx={{ fontSize: '1.2rem', color: 'text.secondary', mb: 4 }} variant="h6" className="font-edu">{plan.description}</Typography>

                {plan.features.map((feature, i) => (
                  <Stack key={i} m={1} width={'100%'} justifyContent={'flex-start'} direction={'row'} alignItems={'center'}>
                    <CheckCircleIcon sx={{ mx: 2 }} />
                    <Typography sx={{ flexGrow: 1, fontFamily: "'Edu VIC WA NT Beginner', sans-serif", fontSize: '1rem' }} className="font-poppins">{feature}</Typography>
                  </Stack>
                ))}

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
              </Stack>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
