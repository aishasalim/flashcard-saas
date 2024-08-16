'use client';

import { Container, Typography, Button, Stack, Grid, Paper } from "@mui/material";
import { styled } from "@mui/system";
import Link from "next/link";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useUser } from "@clerk/nextjs";
import Navbar from "../components/navbar";

// Define StyledPaper
const StyledPaper = styled(Paper)(({ rotate, cardColor }) => ({
  transform: `rotate(${rotate})`,
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
  const { user } = useUser();
  const colors = ['#cdeffb', '#ffccd2', '#ffffaf', '#e6dbff']; 

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

  return (
    <>
    <Navbar />
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
          <Link 
            href={`/flashcard/${set.id}`} 
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <StyledPaper
              cardColor={colors[index % colors.length]} // Cycle through colors
            >
              <Typography variant="h6" sx={{ fontFamily: "'Poppins', sans-serif" }}>
                {set.id}
              </Typography>
              <Typography variant="body2" align="right" sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 'bold' }}>
                {set.date}
              </Typography>
            </StyledPaper>
          </Link>
        </Grid>
      ))}
      </Grid>
    </Container>
    </>
  );
}
