'use client'

import { Container, Typography, Button, Stack, Grid } from "@mui/material";
import Flashcard from "../components/Flashcard";
import Link from "next/link";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useUser } from "@clerk/nextjs";

export default function Dashboard() {
  const [userFlashCards, setUserFlashCards] = useState([]);
  const { user } = useUser();

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
          <Grid item xs={12} sm={8} md={4} key={index}>
            <Link 
              href={{
                pathname: `/flashcard/${set.id}`,
                query: { flashcards: JSON.stringify(set.flashcards) }, // Pass the flashcards as a query parameter
              }} 
              style={{ textDecoration: "none", color: "inherit" }}>
              <Flashcard
                hover={true}
                title={set.name}
                content={set.description}
                rotate={`${Math.random() * 4 - 2}`}
                cardColor={`accent.accent${Math.floor(Math.random() * 4) + 1}`}
              />
            </Link>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
