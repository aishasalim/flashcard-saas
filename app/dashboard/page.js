'use client';

import React from 'react';
import { Container, Typography, Button, Box, IconButton, Stack, Grid, CardContent, Paper } from "@mui/material";
import Link from "next/link";
import { styled } from "@mui/system";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useUser } from "@clerk/nextjs";
import Navbar from "../components/navbar";
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import CircularProgress from '@mui/material/CircularProgress';
import DeleteIcon from '@mui/icons-material/Delete';
import { doc, deleteDoc, updateDoc, arrayRemove, getDoc } from 'firebase/firestore';


const FlashcardBox = styled(Box)(({ theme, isFlipped, cardColor }) => ({
  backgroundColor: cardColor,
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
  transition: 'transform 0.6s, background-color 0.6s', // Added background-color transition
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

export default function Dashboard() {
  const [userFlashCards, setUserFlashCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null); // State for selected card set
  const [currentCardIndex, setCurrentCardIndex] = useState(0); // State to track current flashcard index
  const { user } = useUser();
  const colors = ['#ffa4a3', '#b3f9c6', '#a6e7ff', '#e6dbff'];
  const [isFlipped, setIsFlipped] = useState(false);
  const [flipIndex, setFlipIndex] = useState(null); // Manage flip state
  const [correctCards, setCorrectCards] = useState(0);
  const [incorrectCards, setIncorrectCards] = useState([]); // State to track incorrectly answered cards
  const [loading, setLoading] = useState(true);

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
        setLoading(false); 
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
      const currentFlashcard = userFlashCards[selectedCard].flashcards[currentCardIndex];
      setIncorrectCards((prev) => [...prev, currentFlashcard]); // Track the entire flashcard as incorrect
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

  const handleDeleteFromFirebase = async (setId) => {
    if (!user) {
      console.error("User is not authenticated.");
      return;
    }
  
    const userId = user.id;
    const userDocRef = doc(db, 'users', userId);
  
    // Optimistically update the UI before making the database call
    setUserFlashCards(prev => prev.filter(set => set.name !== setId));
  
    // Retrieve the current user document
    const userDocSnap = await getDoc(userDocRef);
    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();
  
      // Find the flashcard set to remove
      const flashcardSetToRemove = userData.flashcardSets.find(set => set.name === setId);
      
      if (flashcardSetToRemove) {
        // Remove the specific flashcard set from the array in Firestore
        await updateDoc(userDocRef, {
          flashcardSets: arrayRemove(flashcardSetToRemove)
        });
      } else {
        console.error("Flashcard set not found in the user's document.");
      }
    } else {
      console.error("User document does not exist.");
    }
  };
  
  const handleDeleteSet = async (setId) => {
    if (!user) {
        console.error("User is not authenticated.");
        return;
    }

    const userId = user.id;
    const flashcardSetDocRef = doc(db, `users/${userId}/flashcardSets`, setId);

    try {
        // Delete the flashcard set document from Firestore
        await deleteDoc(flashcardSetDocRef);
        setUserFlashCards(prev => prev.filter(set => set.id !== setId));
        console.log("Flashcard set removed from UI.");
        handleDeleteFromFirebase(setId);
    } catch (error) {
        console.error("Error deleting flashcard set:", error);
    }
};

  const handleCorrectCard = () => {
    if (selectedCard !== null) {
      setCorrectCards((prev) => prev + 1);
      handleNextCard(); // Move to the next card
    }
  };

  const handleCardFlip = () => {
    setIsFlipped(!isFlipped); // Toggle the flip state
  };  

  const handleIncorrectCardFlip = (index) => {
    setFlipIndex(flipIndex === index ? null : index);
  };

  return (
    <>
      <Navbar />
      {selectedCard !== null ? (
        <Container sx={{ my: 7, textAlign: 'center' }} maxWidth={false}>
          {userFlashCards[selectedCard] && userFlashCards[selectedCard].flashcards.length > 0 ? (
            currentCardIndex >= userFlashCards[selectedCard].flashcards.length ? (
              <>
                <Typography variant="h4" sx={{ mt: 5 }} className="font-poppins">
                  {incorrectCards.length === 0
                    ? "Good Job! You got all cards correct."
                    : `${incorrectCards.length} out of ${userFlashCards[selectedCard].flashcards.length} cards were marked as skipped.`}
                </Typography>
                <Typography variant="h6" sx={{ mb: 4 }} className="font-poppins">
                  {incorrectCards.length === 0
                    ? "You did a fantastic job reviewing the flashcards!"
                    : "Focus on these flashcards, you had trouble with them."}
                </Typography>

                <Grid container spacing={2} justifyContent="center" alignItems="center">
                {incorrectCards.map((flashcard, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                  <div
                    onClick={() => handleIncorrectCardFlip(index)}
                    style={{
                      width: '100%',
                      height: '200px', // Adjust height as needed
                      perspective: '1000px',
                      borderRadius: '12px', // Rounded corners
                      transition: 'box-shadow 0.3s ease',
                    }}
                  >
                    <div
                      style={{
                        position: 'relative',
                        width: '100%',
                        height: '100%',
                        transition: 'transform 0.6s',
                        transformStyle: 'preserve-3d',
                        transform: flipIndex === index ? 'rotateY(180deg)' : 'rotateY(0deg)',
                        borderRadius: '12px', // Rounded corners
                      }}
                    >
                      <div
                        style={{
                          position: 'absolute',
                          width: '100%',
                          height: '100%',
                          backfaceVisibility: 'hidden',
                          backgroundColor: colors[index % colors.length],
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '16px',
                          borderRadius: '12px', // Rounded corners
                        }}
                      >
                        <CardContent>
                          <Typography variant="body1">{flashcard.front}</Typography>
                        </CardContent>
                      </div>
                      <div
                        style={{
                          position: 'absolute',
                          width: '100%',
                          height: '100%',
                          backfaceVisibility: 'hidden',
                          backgroundColor: '#f0f0f0',
                          transform: 'rotateY(180deg)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '16px',
                          borderRadius: '12px', // Rounded corners
                        }}
                      >
                        <CardContent>
                          <Typography variant="body1">{flashcard.back}</Typography>
                        </CardContent>
                      </div>
                    </div>
                  </div>
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
                    Back to Dashboard
                  </Button>
                </Box>
              </>
            ) : (
              <>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Button
                  variant="contained"
                  sx={{
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
                  Back to Dashboard
                </Button>
              </Stack>
              <Stack direction="row" justifyContent="center" alignItems="center" sx={{ mb: 2 }}>
                <Typography variant="h5" className="font-poppins"> Study Set Card </Typography>
                <Typography variant="h6" sx={{ minWidth: "60px", ml: 8 }} className="font-poppins">
                  {currentCardIndex + 1} / {userFlashCards[selectedCard].flashcards.length}
                </Typography>
              </Stack>
                <FlashcardBox 
                  isFlipped={isFlipped} 
                  onClick={handleCardFlip}
                  cardColor={colors[currentCardIndex % colors.length]} // Dynamically change color based on currentCardIndex
                >
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
            )
          ) : (
            <Typography variant="h6" sx={{ mt: 5 }}>
              No flashcards available in this set.
            </Typography>
          )}
        </Container>
      ) : loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
          <CircularProgress />
        </Box>
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
                sx={{ 
                  cursor: 'pointer', 
                  position: 'relative',
                  pointerEvents: 'auto' // Ensure the entire paper is clickable
                }}
                onClick={() => handleCardClick(index)} // Handle card click
              >
                <Typography variant="h6" className="font-poppins">
                  {set.id}
                </Typography>
                <IconButton
                  aria-label="delete"
                  sx={{ 
                    position: 'absolute', 
                    top: '8px', 
                    right: '8px', 
                    color: 'black',
                    pointerEvents: 'auto' // Ensure the delete button is clickable
                  }}
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering the onClick for the card itself
                    handleDeleteSet(set.id);
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </StyledPaper>

            </Grid>
            
            ))}
          </Grid>
        </Container>
      )}
    </>
  );
}  