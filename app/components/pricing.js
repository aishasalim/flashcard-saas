import { Container, Typography, Box, Grid, Paper, Button, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export default function PricingSection() {
    const pricing = [
        {
          title: "Basic",
          price: "$0",
          description: "Free",
          features: [
            "Access to standard flashcards",
            "Limited flashcard generation",
            "Limited saved flashcard sets",
          ],
          buttonText: "Get Started",
          backgroundColor: "#ffd3d9",
        },
        {
          title: "Pro",
          price: "$1.99",
          description: "One time payment",
          features: [
            "Exclusive content and features",
            "Unlimited flashcard generation",
            "Unlimited saved flashcard sets",
          ],
          buttonText: "Upgrade to Pro",
          backgroundColor: "#d0f0fd",
        },
      ];

      
    return (
            <Container maxWidth="lg" id="pricing" sx={{ my: 8 }}>
            <Typography variant="h4" component="h2" sx={{ textAlign: 'center', fontWeight: 'bold', mb: 4 }}>
                Pick Your Plan
            </Typography>
            <Typography variant="h6" component="p" sx={{ textAlign: 'center', color: 'text.secondary', mb: 6 }}>
                Choose the plan that <span style={{ color: '#ff69b4', fontWeight: 'bold' }}>best fits</span> your learning needs
            </Typography>
        
            <Grid container spacing={10} justifyContent="center">
                {pricing.map((plan, index) => (
                <Grid item xs={12} sm={8} md={5} key={index}>
                    <Paper elevation={3} sx={{ p: 4, backgroundColor: plan.backgroundColor, borderRadius: 2 }}>
                    <Typography variant="h5" component="h3" sx={{ fontWeight: 'bold', mb: 2 }}>
                        {plan.title}
                    </Typography>
                    <Typography variant="h3" component="p" sx={{ fontWeight: 'bold', mb: 2 }}>
                        {plan.price}
                    </Typography>
                    <Typography variant="subtitle1" component="p" sx={{ mb: 2 }}>
                        {plan.description}
                    </Typography>
                    <List>
                        {plan.features.map((feature, i) => (
                        <ListItem key={i}>
                            <ListItemIcon>
                            <CheckCircleIcon />
                            </ListItemIcon>
                            <ListItemText primary={feature} />
                        </ListItem>
                        ))}
                    </List>
                    <Button variant="contained" color="inherit"
                        sx={{
                            mt: 4,
                            fontWeight: 'bold',
                            backgroundColor: 'black',
                            color: 'white',
                            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                            '&:hover': {
                            backgroundColor: 'black',
                            boxShadow: '0px 8px 15px rgba(0, 0, 0, 0.3)',
                            },
                        }}>
                        {plan.buttonText}
                    </Button>
                    </Paper>
                </Grid>
                ))}
            </Grid>
            </Container>
        );
    }

