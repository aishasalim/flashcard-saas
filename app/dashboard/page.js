'use client';

import React from 'react';
import { Container, Typography, Button, Box, IconButton, Stack, Grid, Paper } from "@mui/material";
import Link from "next/link";
import { styled } from "@mui/system";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useUser } from "@clerk/nextjs";
import Navbar from "../components/navbar";
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';

const FlashcardBox = styled(Box)(({ theme, isFlipped }) => ({
  backgroundColor: '#E6F7FF',
  width: '100%',
  maxWidth: '700px',
  minHeight: '400px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: '8px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  margin: '0 auto',
  padding: theme.spacing(4),
  position: 'relative',
  fontFamily: "'Comic Sans MS', sans-serif",
  transformStyle: 'preserve-3d',
  transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
  transition: 'transform 0.6s',
}));

const FlashcardContent = styled(Box)(({ theme, isFlipped, side }) => ({
  backfaceVisibility: 'hidden',
  position: 'absolute',
  width: '100%',
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontSize: '30px',
  padding: '16px',
  textAlign: 'center',
  transform: side === 'back' ? 'rotateY(180deg)' : 'rotateY(0deg)',
  visibility: isFlipped ? (side === 'front' ? 'hidden' : 'visible') : (side === 'back' ? 'hidden' : 'visible'),
}));

// Define StyledPaper
const StyledPaper = styled(Paper)(({ rotate, cardColor }) => ({
  transform: `rotate(${rotate})`,  // Fixed syntax
  backgroundColor: cardColor,
  padding: '16px',
  borderRadius: '8px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  minHeight: '100px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
}));

export default function Dashboard() {
  const [userFlashCards, setUserFlashCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null); // State for selected card set
  const [currentCardIndex, setCurrentCardIndex] = useState(0); // State to track current flashcard index
  const { user } = useUser();
  const colors = ['#cdeffb', '#ffccd2', '#ffffaf', '#e6dbff']; 
  const [isFlipped, setIsFlipped] = useState(false);

  const handleCardFlip = () => {
    setIsFlipped(!isFlipped);
  };

  useEffect(() => {
    const fetchFlashcards = async () => {
      if (user) {
        const userId = user.id;
        const flashcardSetsCollectionRef = collection(db, `users/${userId}/flashcardSets`);
        const flashcardSetsSnapshot = await getDocs(flashcardSetsCollectionRef);

        const flashcardSets = flashcardSetsSnapshot.docs.map(doc => ({
          id: doc.id, // Use the Firestore document ID here
          ...doc.data(),
        }));
        setUserFlashCards(flashcardSets);
      }
    };

    fetchFlashcards();
  }, [user]);

  const handleCardClick = (index) => {
    setSelectedCard(index); // Set the selected card set index
    setCurrentCardIndex(0); // Reset the flashcard index to 0 when a new set is selected
    setIsFlipped(false);
  };

  const handleNextCard = () => {
    if (selectedCard !== null) {
      setCurrentCardIndex((prevIndex) => 
        (prevIndex + 1) % userFlashCards[selectedCard].flashcards.length
      );
      setIsFlipped(false); 
    }
  };

  const handleBackClick = () => {
    setSelectedCard(null); // Reset selected card to null to go back
    setCurrentCardIndex(0); // Reset the flashcard index
    setIsFlipped(false);
  };

  return (
    <>
      <Navbar />
      {selectedCard !== null ? (
        <Container sx={{ mt: { xs: 2, md: 5 }, py: { xs: 3, md: 5 }, maxWidth: "xl", textAlign: 'center' }} maxWidth={false}>
          <Stack direction="row" justifyContent="center" alignItems="center" sx={{ mb: 2 }}>
            <Typography variant="h5" className="font-poppins"> Name: {userFlashCards[selectedCard].id} </Typography>
            <Typography variant="h6" sx={{minWidth: "60px", ml: 8}} className="font-poppins">
              {currentCardIndex + 1} / {userFlashCards[selectedCard].flashcards.length}
            </Typography>
          </Stack>
          
          <FlashcardBox isFlipped={isFlipped} onClick={handleCardFlip}>
          <FlashcardContent isFlipped={isFlipped} side="front">
            {userFlashCards[selectedCard].flashcards[currentCardIndex].front}
          </FlashcardContent>
          <FlashcardContent isFlipped={isFlipped} side="back">
            {userFlashCards[selectedCard].flashcards[currentCardIndex].back}
          </FlashcardContent>
        </FlashcardBox>


          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 4 }}>
            <IconButton aria-label="incorrect" sx={{ color: 'red', mx: 2 }} onClick={handleBackClick}>
              <CloseIcon sx={{ fontSize: 40 }} />
            </IconButton>
            <Button variant="outlined"
            sx={{
              fontWeight: 'bold',
              borderColor: 'black',
              color: 'black',
              backgroundColor: 'white',
              '&:hover': {
                backgroundColor: 'black',
                color: 'white',
                borderColor: 'black',
              },}}
              onClick={handleNextCard}
            >
              Next Card
            </Button>
            <IconButton aria-label="correct" sx={{ color: 'green', mx: 2 }} onClick={handleNextCard}>
              <CheckIcon sx={{ fontSize: 40 }} />
            </IconButton>
          </Box>
        </Container>
      ) : (
        <Container sx={{ mt: 5, py: 5, maxWidth: "xl" }} maxWidth={false}>
          <Stack direction={'row'} justifyContent={'space-between'}>
            <Typography variant="h4"> Study Sets </Typography>
            <Link href={'/generate'}>
              <Button variant="contained" color="inherit"
                sx={{
                  fontWeight: 'bold',
                  backgroundColor: 'black',
                  color: 'white',
                  boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                  '&:hover': {
                    backgroundColor: 'black',
                    boxShadow: '0px 8px 15px rgba(0, 0, 0, 0.3)',
                  },}}>Create study set</Button>
            </Link>
          </Stack>
          <Grid mt={2} container spacing={2}>
            {userFlashCards.map((set, index) => (
              <Grid item xs={12} sm={8} md={4} key={index}
                sx={{
                  width: '100%',
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'rotate(5deg)',
                  },
                  margin: 'auto',
                  padding: 4,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }} elevation={5}>
                <StyledPaper
                  cardColor={colors[index % colors.length]} // Cycle through colors
                  onClick={() => handleCardClick(index)} // Handle card click
                  sx={{ cursor: 'pointer' }} // Add pointer cursor on hover
                >
                  <Typography variant="h6" sx={{ fontFamily: "'Poppins', sans-serif" }}>
                    {set.id}
                  </Typography>
                </StyledPaper>
              </Grid>
            ))}
          </Grid>
        </Container>
      )}
    </>
  );
}
