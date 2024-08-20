'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { collection, doc, getDoc } from 'firebase/firestore';
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
  const [subscriptionDialogOpen, setSubscriptionDialogOpen] = useState(false);
  const [generationLimitDialogOpen, setGenerationLimitDialogOpen] = useState(false);
  const [flipIndex, setFlipIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generationCount, setGenerationCount] = useState(0);
  const [isPro, setIsPro] = useState(false);
  const [savedSets, setSavedSets] = useState(0);

  const { user, isLoaded, isSignedIn } = useUser();
  const router = useRouter();

  const colors = ['#ffa4a3', '#b3f9c6', '#a6e7ff', '#e6dbff'];

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/sign-in');
    } else if (user) {
      fetchUserData();
    }
  }, [user, isLoaded, isSignedIn, router]);

  const fetchUserData = async () => {
    if (!user) return;

    const userDocRef = doc(collection(db, 'users'), user.id);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();
      setGenerationCount(userData.generationCount || 0);
      setIsPro(userData.subscription?.status === 'pro');
      setSavedSets(userData.savedSets || 0);
    }
  };

  const handleSubmit = async () => {
    if (!text.trim()) {
      alert('Please enter some text to generate flashcards.');
      return;
    }

    if (!isSignedIn) {
      router.push('/sign-in');
      return;
    }

    if (!isPro && generationCount >= 2) {
      setGenerationLimitDialogOpen(true);
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
        if (response.status === 401) {
          router.push('/sign-in');
          return;
        }
        if (response.status === 403) {
          setGenerationLimitDialogOpen(true);
          return;
        }
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate flashcards');
      }

      const data = await response.json();
      setFlashcards(data);
      await fetchUserData(); // Refresh user data after generation

    } catch (error) {
      console.error('Error generating flashcards:', error);
      alert(`An error occurred while generating flashcards: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = () => {
    if (!isPro && savedSets >= 1) {
      setSubscriptionDialogOpen(true);
    } else {
      setDialogOpen(true);
    }
  };

  const handleCloseDialog = () => setDialogOpen(false);
  const handleCloseSubscriptionDialog = () => setSubscriptionDialogOpen(false);

  const handleCardClick = (index) => {
    setFlipIndex(flipIndex === index ? null : index);
  };

  const saveFlashcards = async () => {
    if (!setName.trim()) {
      alert('Please enter a name for your flashcard set.');
      return;
    }

    if (!isSignedIn) {
      router.push('/sign-in');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/generate', {
        method: 'PUT',
        body: JSON.stringify({ setName, flashcards }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save flashcards');
      }

      await fetchUserData(); // Refresh user data after saving
      router.push('/dashboard');
    } catch (error) {
      console.error('Error saving flashcards:', error);
      alert(`An error occurred while saving flashcards: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <Container maxWidth="md">
        {isLoaded && isSignedIn ? (
          <Box sx={{ my: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Generate Flashcards
            </Typography>
            <Typography variant="body1" gutterBottom>
              {isPro ? 'Pro user: Unlimited generations' : `Generations left today: ${Math.max(2 - generationCount, 0)}`}
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
              disabled={loading || (!isPro && generationCount >= 2)}
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
        ) : (
          <Box sx={{ my: 4 }}>
            <Typography variant="h6">Please sign in to generate flashcards.</Typography>
          </Box>
        )}

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

        <Dialog open={subscriptionDialogOpen} onClose={handleCloseSubscriptionDialog}>
          <DialogTitle>Upgrade Required</DialogTitle>
          <DialogContent>
            <DialogContentText>
              You have reached the limit of 1 flashcard set with the Base subscription. Please upgrade to the Pro version to create more sets.
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

        <Dialog open={generationLimitDialogOpen} onClose={() => setGenerationLimitDialogOpen(false)}>
          <DialogTitle>Daily Generation Limit Reached</DialogTitle>
          <DialogContent>
            <DialogContentText>
              You have reached the limit of 2 flashcard generations per day. Please upgrade to the Pro version for unlimited generations.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setGenerationLimitDialogOpen(false)}
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