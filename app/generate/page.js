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
  const { user } = useUser();
  const router = useRouter();

  const handleOpenDialog = () => setDialogOpen(true);
  const handleCloseDialog = () => setDialogOpen(false);
  const colors = ['#cdeffb', '#ffccd2', '#ffffaf', '#e6dbff']; 

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
        console.log('Generated flashcards:', data); // Log the data to check structure
        
        if (Array.isArray(data)) {
            setFlashcards(data); // Ensure to use data directly if it's an array
        } else if (data.flashcards) {
            setFlashcards(data.flashcards); // Ensure to use data.flashcards if it's an object
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
                        <Card sx={{ backgroundColor: colors[index % colors.length] }}>
                          <CardContent>
                            <Typography variant="h6">Front:</Typography>
                              <Typography>{flashcard.front}</Typography>
                              <Typography variant="h6" sx={{ mt: 2 }}>Back:</Typography>
                              <Typography>{flashcard.back}</Typography>
                              </CardContent>
                        </Card>
                      </Grid>
                    ))}
                </Grid>
              </Box>)}
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
                          },}}>Cancel</Button>
                        <Button onClick={saveFlashcards} color="primary" 
                          sx={{
                          fontWeight: 'bold',
                          backgroundColor: 'black',
                          color: 'white',
                          boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                          '&:hover': {
                            backgroundColor: 'black',
                            boxShadow: '0px 8px 15px rgba(0, 0, 0, 0.3)',
                          },}}>
                            Save
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </>
    );
}
