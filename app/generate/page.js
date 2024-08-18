'use client';

import React, { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { collection, doc, getDoc, writeBatch } from 'firebase/firestore';
import { db } from '../firebase'; // Ensure this import is correct
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import Navbar from '../components/navbar'; // Ensure this import is correct

export default function Generate() {
  const [text, setText] = useState('');
  const [flashcards, setFlashcards] = useState([]);
  const [setName, setSetName] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [flipIndex, setFlipIndex] = useState(null); // Manage flip state
  const { user } = useUser();
  const router = useRouter();
  
  const handleOpenDialog = () => setDialogOpen(true);
  const handleCloseDialog = () => setDialogOpen(false);
  const colors = ['#ffa4a3', '#b3f9c6', '#a6e7ff', '#e6dbff'];

  const handleSubmit = async () => {
    if (!text.trim()) {
      alert('Please enter some text to generate flashcards.');
      return;
    }

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        body: JSON.stringify({ text }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to generate flashcards');
      }

      const data = await response.json();
      console.log('Generated flashcards:', data);

      if (Array.isArray(data)) {
        setFlashcards(data);
      } else if (data.flashcards) {
        setFlashcards(data.flashcards);
      } else {
        console.error('Unexpected response format:', data);
        alert('Unexpected response format. Please try again.');
      }

    } catch (error) {
      console.error('Error generating flashcards:', error);
      alert('An error occurred while generating flashcards. Please try again.');
    }
  };

  const saveFlashcards = async () => {
    if (!setName.trim()) {
      alert('Please enter a name for your flashcard set.');
      return;
    }

    try {
      if (!user) {
        alert('User not found. Please log in and try again.');
        return;
      }

      const userDocRef = doc(collection(db, 'users'), user.id);
      const userDocSnap = await getDoc(userDocRef);

      const batch = writeBatch(db);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        const updatedSets = [...(userData.flashcardSets || []), { name: setName }];
        batch.update(userDocRef, { flashcardSets: updatedSets });
      } else {
        batch.set(userDocRef, { flashcardSets: [{ name: setName }] });
      }

      const setDocRef = doc(collection(userDocRef, 'flashcardSets'), setName);
      batch.set(setDocRef, { flashcards });

      await batch.commit();

      alert('Flashcards saved successfully!');
      handleCloseDialog();
      setSetName('');
    } catch (error) {
      console.error('Error saving flashcards:', error);
      alert('An error occurred while saving flashcards. Please try again.');
    }
  };

  const handleCardClick = (index) => {
    setFlipIndex(flipIndex === index ? null : index);
  };

  return (
    <>
      <Navbar />
      <Container maxWidth="md">
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Generate Flashcards
          </Typography>
          <TextField
            value={text}
            onChange={(e) => setText(e.target.value)}
            label="Enter text"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            fullWidth
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
          >
            Generate Flashcards
          </Button>

          {flashcards.length > 0 && (
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleOpenDialog}
                fullWidth
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
              >
                Save Flashcards
              </Button>
            </Box>
          )}

          {flashcards.length > 0 && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h5" component="h2" gutterBottom>Generated Flashcards</Typography>
              <Grid container spacing={2}>
                {flashcards.map((flashcard, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <div
                      onClick={() => handleCardClick(index)}
                      style={{
                        width: '100%',
                        height: '200px', // Adjust height as needed
                        perspective: '1000px',
                        borderRadius: '12px', // Rounded corners
                        boxShadow: flipIndex === index ? '0px 0px 15px rgba(0, 0, 0, 0.5)' : '0px 4px 8px rgba(0, 0, 0, 0.1)',
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
            </Box>
          )}
        </Box>

        <Dialog open={dialogOpen} onClose={handleCloseDialog}>
          <DialogTitle>Save Flashcard Set</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please enter a name for your flashcard set.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              label="Set Name"
              type="text"
              fullWidth
              value={setName}
              onChange={(e) => setSetName(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}
              sx={{
                fontWeight: 'bold',
                backgroundColor: 'black',
                color: 'white',
                boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                '&:hover': {
                  backgroundColor: 'black',
                  boxShadow: '0px 8px 15px rgba(0, 0, 0, 0.3)',
                },
              }}>Cancel</Button>
            <Button onClick={saveFlashcards} color="primary"
              sx={{
                fontWeight: 'bold',
                backgroundColor: 'black',
                color: 'white',
                boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                '&:hover': {
                  backgroundColor: 'black',
                  boxShadow: '0px 8px 15px rgba(0, 0, 0, 0.3)',
                },
              }}>
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
}
