import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Grid, Paper, Button } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const ProductSlide = ({ item, index, glowColor }) => (
  <Paper
    elevation={2}
    sx={{
      p: 4,
      borderRadius: 2,
      color: 'white',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
      backgroundColor: glowColor, // Set the card background color
      '&:before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        borderRadius: 'inherit',
        boxShadow: `0 0 15px ${glowColor}`, // Apply glow effect
        zIndex: -1,
        opacity: 0.5,
      },
    }}
  >
    <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2, fontSize: '1.8rem' }} className="font-edu">
      {item.title}
    </Typography>
    <Typography variant="body1" sx={{ fontSize: '1.2rem', mb: 2 }} className="font-poppins">
      {item.description}
    </Typography>
    <Typography 
      variant="h2" 
      sx={{ 
        position: 'absolute', 
        bottom: -20, 
        right: -10, 
        opacity: 0.2, 
        fontSize: '8rem',
        fontWeight: 'bold',
      }}
    >
      {item.number}
    </Typography>
  </Paper>
);

export default function ProductSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    { 
      title: "Start a New Study Set", 
      description: "Enter a title and prompt, then click 'Create' to initiate a new study set.", 
      color: '#ffa4a3', // Pastel pink
      number: "01" 
    },
    { 
      title: "Generate Flashcards", 
      description: "Provide a topic, and our AI will generate personalized flashcards for you.", 
      color: '#92e0a7', // Pastel green
      number: "02" 
    },
    { 
      title: "Review and Customize", 
      description: "Examine your flashcards and make any necessary adjustments.", 
      color: '#a6e7ff', // Pastel blue
      number: "03" 
    },
    { 
      title: "Save Your Study Set", 
      description: "Save your completed study set to your account for future use.", 
      color: '#d8c7ff', // Pastel purple
      number: "04" 
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, []);

  const handlePrevSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide - 1 + slides.length) % slides.length);
  };

  const handleNextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
  };

  return (
    <Container maxWidth="lg" id="product" sx={{ my: 20, color: 'black' }}>
      <Grid container spacing={4} alignItems="center">
        <Grid  xs={12} md={6} item>
        <Typography
        variant="h4"
        sx={{
          textAlign: 'center',
          fontWeight: 'bold',
          mb: 3,
          color: '#333', // Slightly darker for contrast
          lineHeight: '1.3', // Improved readability
        }}
      >
        Straightforward. Powerful. Intuitive.
      </Typography>
      <Typography
        variant="body1"
        sx={{
          color: '#333', // Consistent with the heading color
          fontSize: '1.1rem',
          lineHeight: '1.6', // Improved readability
          textAlign: 'center', // Centered text for uniformity
          mb: 4, // Extra margin for spacing
        }}
      >
        Simply provide a prompt and let our AI create customized flashcards for you. 
        Save them as study sets when logged in, and easily manage, adjust, or update the cards to fit your needs.
      </Typography>
        </Grid>
        <Grid xs={12} md={6} item >
          <Box sx={{ position: 'relative', height: 300 }}>
            {slides.map((item, index) => (
              <Box
                key={index}
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  my: 6,
                  width: '100%',
                  opacity: currentSlide === index ? 1 : 0,
                  transition: 'opacity 0.5s ease-in-out',
                }}
              >
                <ProductSlide item={item} index={index} glowColor={item.color} />
              </Box>
            ))}
            <Button 
              onClick={handlePrevSlide}
              sx={{ position: 'absolute', left: -20, top: '50%', transform: 'translateY(-50%)' }}
            >
              <ArrowBackIosNewIcon />
            </Button>
            <Button 
              onClick={handleNextSlide}
              sx={{ position: 'absolute', right: -20, top: '50%', transform: 'translateY(-50%)' }}
            >
              <ArrowForwardIosIcon />
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}
