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

const StyledPaper = styled(Paper)(({ rotate, cardColor, crossed }) => ({
  transform: `rotate(${rotate})`,
  backgroundColor: cardColor,
  padding: '16px',
  borderRadius: '8px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  minHeight: '100px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  position: 'relative',
  textDecoration: crossed ? 'line-through' : 'none', // Add strikethrough
  '&::after': crossed
    ? {
        content: '"X"',
        color: 'red',
        fontSize: '50px',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        opacity: 0.6,
      }
    : {},
}));

const FlippableCard = styled(Box)(({ isFlipped }) => ({
  marginTop: '1.5em',
  width: '100%',
  height: '100%',
  position: 'relative',
  transformStyle: 'preserve-3d',
  transition: 'transform 0.6s',
  transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
  display: 'flex',  // Added to make sure the card is displayed as a block
  justifyContent: 'center',  // Center content horizontally
  alignItems: 'center',  // Center content vertically
}));

const FlippableCardFront = styled(Box)({
  marginTop: '1.5em',
  position: 'absolute',
  width: '100%',
  height: '100%',
  backfaceVisibility: 'hidden',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontSize: '18px',
});

const FlippableCardBack = styled(Box)({
  position: 'absolute',
  width: '100%',
  height: '100%',
  backfaceVisibility: 'hidden',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontSize: '18px',
  transform: 'rotateY(180deg)',
});



export default function Dashboard() {
  const [userFlashCards, setUserFlashCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null); // State for selected card set
  const [currentCardIndex, setCurrentCardIndex] = useState(0); // State to track current flashcard index
  const { user } = useUser();
  const colors = ['#cdeffb', '#ffccd2', '#ffffaf', '#e6dbff']; 
  const [isFlipped, setIsFlipped] = useState(false);
  const [correctCards, setCorrectCards] = useState(0);
  const [incorrectCards, setIncorrectCards] = useState([]); // State to track incorrectly answered cards
  const [flippedStates, setFlippedStates] = useState(Array(incorrectCards.length).fill(false));

  const handleFlip = (index) => {
    const newFlippedStates = [...flippedStates];
    newFlippedStates[index] = !newFlippedStates[index];
    setFlippedStates(newFlippedStates);
  };

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
          id: doc.id, 
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
    setCorrectCards(0);
    setIncorrectCards([]); // Reset incorrect cards when a new set is selected
  };

  const handleBackClick = () => {
    if (selectedCard !== null) {
      setIncorrectCards((prev) => [...prev, currentCardIndex]); // Track the current card as incorrect
      handleNextCard(); // Move to the next card
    }
  };

  const handleNextCard = () => {
    if (selectedCard !== null) {
      if (currentCardIndex < userFlashCards[selectedCard].flashcards.length - 1) {
        setCurrentCardIndex((prevIndex) => prevIndex + 1);
        setIsFlipped(false); 
      } else {
        // If we've reached the last card, no further progression
        setCurrentCardIndex(userFlashCards[selectedCard].flashcards.length); // Mark that we've gone through all cards
      }
    }
  };
  

  const handleCorrectCard = () => {
    if (selectedCard !== null) {
      setCorrectCards((prev) => prev + 1);
      handleNextCard(); // Move to the next card
    }
  };

  return (
    <>
      <Navbar />
      {selectedCard !== null ? (
        <Container sx={{ my: 7, textAlign: 'center' }} maxWidth={false}>
          {currentCardIndex >= userFlashCards[selectedCard].flashcards.length ? (
            <>
              <Typography variant="h4" sx={{ mt: 5 }} className="font-poppins">
                {incorrectCards.length} out of {userFlashCards[selectedCard].flashcards.length} cards were marked as skipped.
              </Typography>
              <Typography variant="h6" sx={{ mb: 4 }} className="font-poppins">
                Focus on these flashcards, you had trouble with them.
              </Typography>
              <Grid container spacing={2} justifyContent="center">
                {incorrectCards.map((index, cardIdx) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <StyledPaper cardColor={colors[index % colors.length]} className="font-poppins">
                      <FlippableCard isFlipped={flippedStates[cardIdx]} onClick={() => handleFlip(cardIdx)}>
                        <FlippableCardFront>
                          <Typography variant="h6">
                            {userFlashCards[selectedCard].flashcards[index].front}
                          </Typography>
                        </FlippableCardFront>
                        <FlippableCardBack>
                          <Typography variant="h6">
                            {userFlashCards[selectedCard].flashcards[index].back}
                          </Typography>
                        </FlippableCardBack>
                      </FlippableCard>
                    </StyledPaper>
                  </Grid>
                ))}
              </Grid>

              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 4 }}>
                <Button
                  variant="outlined"
                  sx={{
                    fontWeight: 'bold',
                    borderColor: 'black',
                    color: 'black',
                    backgroundColor: 'white',
                    '&:hover': {
                      backgroundColor: 'black',
                      color: 'white',
                      borderColor: 'black',
                    },
                  }}
                  onClick={() => handleCardClick(selectedCard)} // Allow reviewing the same set again
                >
                  Review Again
                </Button>
                <Button
                  variant="contained"
                  sx={{
                    ml: 2,
                    fontWeight: 'bold',
                    backgroundColor: 'black',
                    color: 'white',
                    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                    '&:hover': {
                      backgroundColor: 'black',
                      boxShadow: '0px 8px 15px rgba(0, 0, 0, 0.3)',
                    },
                  }}
                  onClick={() => setSelectedCard(null)} // Go back to overview
                >
                  Back to Overview
                </Button>
              </Box>
            </>
          ) : (
            <>
              <Stack direction="row" justifyContent="center" alignItems="center" sx={{ mb: 2 }}>
                <Typography variant="h5" className="font-poppins"> Study Set Card </Typography>
                <Typography variant="h6" sx={{ minWidth: "60px", ml: 8 }} className="font-poppins">
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
                    mx: 2,
                    fontWeight: 'bold',
                    borderColor: 'black',
                    color: 'black',
                    backgroundColor: 'white',
                    '&:hover': {
                      backgroundColor: 'black',
                      color: 'white',
                      borderColor: 'black',
                    },
                  }}
                  onClick={handleNextCard}
                >
                  Next Card
                </Button>
  
                <IconButton aria-label="correct" sx={{ color: 'green', mx: 2 }} onClick={handleCorrectCard}>
                  <CheckIcon sx={{ fontSize: 40 }} />
                </IconButton>
              </Box>
            </>
          )}
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
                  },
                }}>Create study set</Button>
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