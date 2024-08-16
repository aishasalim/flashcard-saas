'use client'

import React, { useEffect, useState, useMemo } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter, useSearchParams } from 'next/navigation';
import { collection, doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
} from '@mui/material';

export default function Flashcard() {
    const [flashcards, setFlashcards] = useState([]);
    const [flippedCard, setFlippedCard] = useState(null); // State to track the flipped card
    const { user } = useUser();
    const router = useRouter();
    const searchParams = useSearchParams();
    const search = searchParams.get('id');

    const handleCardClick = (id) => {
        router.push(`/flashcard?id=${id}`);
    };

    const handleFlipClick = (id) => {
        setFlippedCard(flippedCard === id ? null : id); // Toggle flip state
    };

    useEffect(() => {
        async function getFlashcards() {
            if (!user || !user.id) return;
            try {
                const docRef = doc(collection(db, 'users'), user.id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const collections = docSnap.data().flashcards || [];
                    console.log('Fetched flashcards:', collections); // Check fetched data
                    setFlashcards(collections);
                } else {
                    console.log('Document does not exist. Creating new document.');
                    await setDoc(docRef, { flashcards: [] });
                }
            } catch (error) {
                console.error('Error fetching flashcards:', error);
            }
        }
        getFlashcards();
    }, [user]);

    const displayedFlashcards = useMemo(() => flashcards, [flashcards]);

    if (search) {
        const flashcard = displayedFlashcards.find(fc => fc.id === search);
        if (!flashcard) return <div>Flashcard not found</div>;

        return (
            <Container maxWidth="md">
                <Typography variant="h4" component="h1" gutterBottom>
                    Flashcard Details
                </Typography>
                <Typography variant="h5">
                    Front: {flashcard.front}
                </Typography>
                <Typography variant="h5">
                    Back: {flashcard.back}
                </Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="md">
            <Grid container spacing={3} sx={{ mt: 4 }}>
                {displayedFlashcards.length === 0 ? (
                    <Typography variant="h6">No flashcards available</Typography>
                ) : (
                    displayedFlashcards.map((flashcard) => {
                        const isFlipped = flippedCard === flashcard.id;

                        return (
                            <Grid item xs={12} sm={6} md={4} key={flashcard.id}>
                                <Card
                                    onClick={() => handleFlipClick(flashcard.id)}
                                    sx={{
                                        position: 'relative',
                                        width: '100%',
                                        height: '200px',
                                        cursor: 'pointer',
                                        transition: 'transform 0.6s',
                                        transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                                        transformStyle: 'preserve-3d',
                                        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
                                    }}
                                >
                                    <CardContent
                                        sx={{
                                            position: 'absolute',
                                            width: '100%',
                                            height: '100%',
                                            backfaceVisibility: 'hidden',
                                            display: isFlipped ? 'none' : 'block',
                                            backgroundColor: '#fff',
                                            color: 'black',
                                            padding: '16px',
                                        }}
                                    >
                                        <Typography variant="h5" component="div">
                                            {flashcard.front}
                                        </Typography>
                                    </CardContent>
                                    <CardContent
                                        sx={{
                                            position: 'absolute',
                                            width: '100%',
                                            height: '100%',
                                            backfaceVisibility: 'hidden',
                                            display: isFlipped ? 'block' : 'none',
                                            backgroundColor: '#f0f0f0',
                                            color: 'black',
                                            padding: '16px',
                                            transform: 'rotateY(180deg)',
                                        }}
                                    >
                                        <Typography variant="h5" component="div">
                                            {flashcard.back}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        );
                    })
                )}
            </Grid>
        </Container>
    );
}
