"use client";
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Container, Typography, CircularProgress, Box, Button } from '@mui/material';
import { doc, getDoc, writeBatch, collection }  from 'firebase/firestore'; // Import Firestore functions
import { db } from '../firebase'; // Import your Firestore instance
import { useUser } from '@clerk/nextjs';
import Navbar from '../components/navbar'; // Import your Navbar component

export default function Generate() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const session_id = searchParams.get('session_id');
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [error, setError] = useState(null);
  const { user } = useUser();

  useEffect(() => {
    async function checkUserSubscription() {
      if (!user) return;  // Wait until user is loaded
      
      const user_id = user.id;  // Now it's safe to use user.id
      try {
        const userDocRef = doc(collection(db, 'users'), user_id);
        const userDocSnap = await getDoc(userDocRef);
        
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
            updateSubscription();
          } else {
          console.log("User document does not exist.");
          setError("User not found.");
          setLoading(false);
        }
      } catch (error) {
        console.error("Error checking subscription status:", error);
        setError("Failed to check subscription status.");
        setLoading(false);
      }
    }
    
    async function updateSubscription() {
      try {
        const userDocRef = doc(collection(db, 'users'), user.id);
        const batch = writeBatch(db);
        
        // Update the subscription status to "pro"
        batch.update(userDocRef, { subscription: { status: "pro" } });
        await batch.commit();
      } catch (error) {
        console.error("Error updating subscription status:", error);
        setError("Failed to update subscription status.");
      } finally {
        setLoading(false);
      }
    }

    checkUserSubscription();
  }, [user, session_id]);

  useEffect(() => {
    const fetchCheckoutSession = async () => {
      if (!session_id) return;
      try {
        const res = await fetch(`/api/checkout_sessions?session_id=${session_id}`);
        const sessionData = await res.json();
        if (res.ok) {
          setSession(sessionData);
        } else {
          setError(sessionData.error);
        }
      } catch (err) {
        setError('An error occurred while retrieving the session.');
      } finally {
        setLoading(false);
      }
    };
    fetchCheckoutSession();
  }, [session_id]);

  const handleDashboardClick = () => {
    router.push('/dashboard'); // Navigate to the dashboard
  };
  
  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ textAlign: 'center', mt: 4 }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="sm" sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Container>
    );
  }

  return (
    <>
      <Navbar />
      <Container maxWidth="sm" sx={{ textAlign: 'center', mt: 10 }}>
        {session && session.payment_status === 'paid' ? (
          <>
            <Typography variant="h4">Thank you for your purchase!</Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body1">
                We have received your payment. Your account has been upgraded to pro. You will receive an email with the order details shortly.
              </Typography>
            </Box>
            <Button variant="contained" color="inherit"
            onClick={handleDashboardClick}
              sx={{
                my: 10,
                fontWeight: 'bold',
                backgroundColor: 'black',
                color: 'white',
                boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                '&:hover': {
                  backgroundColor: 'black',
                  boxShadow: '0px 8px 15px rgba(0, 0, 0, 0.3)',
                },}}>
              Go to Dashboard
            </Button>
          </>
        ) : (
          <>
            <Typography variant="h4">Payment failed</Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body1">
                Your payment was not successful. Please try again.
              </Typography>
            </Box>
            <Button variant="contained" color="inherit"
            onClick={handleDashboardClick}
              sx={{
                my: 10,
                fontWeight: 'bold',
                backgroundColor: 'black',
                color: 'white',
                boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                '&:hover': {
                  backgroundColor: 'black',
                  boxShadow: '0px 8px 15px rgba(0, 0, 0, 0.3)',
                },}}>
              Go to Dashboard
            </Button>
          </>
        )}
      </Container>
    </>
  );
}

