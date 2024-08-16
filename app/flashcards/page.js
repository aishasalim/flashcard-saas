'use client'

import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter, useSearchParams } from 'next/navigation';
import { collection, doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import {
  Container,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  Typography,
} from '@mui/material';

export default function Flashcard() {
    const [flashcards, setFlashcards] = useState([]);
    const router = useRouter();
    
    const searchParams = useSearchParams();
    const search = searchParams.get('id');

    const handleCardClick = (id) => {
        router.push(`/flashcard?id=${id}`);
    };

    useEffect(() => {
        async function getFlashcards() {
          // Replace `user.id` with a hardcoded user ID or remove it if not needed
          const userId = 'some-unique-user-id'; // Example: replace with an actual user ID or remove if not needed
          const docRef = doc(collection(db, 'users'), userId);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const collections = docSnap.data().flashcards || [];
            setFlashcards(collections);
          } else {
            await setDoc(docRef, { flashcards: [] });
          }
        }
        getFlashcards();
      }, []);

    return (
        <Container maxWidth="md">
            <Grid container spacing={3} sx={{ mt: 4 }}>
            {flashcards.map((flashcard, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                <Card>
                    <CardActionArea onClick={() => handleCardClick(flashcard.name)}>
                    <CardContent>
                        <Typography variant="h5" component="div">
                        {flashcard.name}
                        </Typography>
                    </CardContent>
                    </CardActionArea>
                </Card>
                </Grid>
            ))}
            </Grid>
        </Container>
    );
}
