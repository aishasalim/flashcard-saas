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
  CardContent,
  CircularProgress,
} from '@mui/material';
import Navbar from '../components/navbar'; 

export default function Generate() {
  const [text, setText] = useState('');
  const [flashcards, setFlashcards] = useState([]);
  const [setName, setSetName] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [subscriptionDialogOpen, setSubscriptionDialogOpen] = useState(false); // New dialog state

  const [flipIndex, setFlipIndex] = useState(null);
  const [loading, setLoading] = useState(false);

  const { user } = useUser();
  const router = useRouter();
  
  const handleOpenDialog = () => setDialogOpen(true);
  const handleCloseDialog = () => setDialogOpen(false);
  const handleCloseSubscriptionDialog = () => setSubscriptionDialogOpen(false); // Close the subscription dialog

  const colors = ['#ffa4a3', '#b3f9c6', '#a6e7ff', '#e6dbff'];

  const handleSubmit = async () => {
    if (!text.trim()) {
      alert('Please enter some text to generate flashcards.');
      return;
    }

    setLoading(true);

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
    } finally {
      setLoading(false);
    }
  };

  const saveFlashcards = async () => {
    if (!setName.trim()) {
      alert('Please enter a name for your flashcard set.');
      return;
    }
  
    if (!user) {
      router.push('/sign-in');
      return;
    }
  
    setLoading(true);
  
    try {
      const userDocRef = doc(collection(db, 'users'), user.id);
      const userDocSnap = await getDoc(userDocRef);
  
      const batch = writeBatch(db);
  
      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        const existingSets = userData.flashcardSets || [];
  
        if (existingSets.length >= 3 && userData.subscription.status !== 'pro') {
          setSubscriptionDialogOpen(true); // Open the subscription dialog
          setLoading(false);
          return;
        }
  
        const updatedSets = [...existingSets, { name: setName }];
        batch.update(userDocRef, { flashcardSets: updatedSets });
  
        if (!userData.subscription) {
          batch.update(userDocRef, { subscription: { status: "base" } });
        }
      } else {
        batch.set(userDocRef, {
          flashcardSets: [{ name: setName }],
          subscription: { status: "base" }
        });
      }
  
      const setDocRef = doc(collection(userDocRef, 'flashcardSets'), setName);
      batch.set(setDocRef, { flashcards });
  
      await batch.commit();
  
      router.push('/dashboard');
    } catch (error) {
      console.error('Error saving flashcards:', error);
      alert('An error occurred while saving flashcards. Please try again.');
    } finally {
      setLoading(false);
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
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Generate Flashcards'}
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
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Save Flashcards'}
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
                        height: '200px',
                        perspective: '1000px',
                        borderRadius: '12px',
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
                          borderRadius: '12px',
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
                            borderRadius: '12px',
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
                            borderRadius: '12px',
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
              }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Save'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Subscription Limit Dialog */}
        <Dialog open={subscriptionDialogOpen} onClose={handleCloseSubscriptionDialog}>
          <DialogTitle>Upgrade Required</DialogTitle>
          <DialogContent>
            <DialogContentText>
              You have reached the limit of 3 flashcard sets with the Base subscription. Please upgrade to the Pro version to create more sets.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseSubscriptionDialog}
              sx={{
                fontWeight: 'bold',
                backgroundColor: 'black',
                color: 'white',
                boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                '&:hover': {
                  backgroundColor: 'black',
                  boxShadow: '0px 8px 15px rgba(0, 0, 0, 0.3)',
                },
              }}>Close</Button>
            <Button onClick={() => router.push('/#pricing')} color="primary"
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
              Upgrade to Pro
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
}

