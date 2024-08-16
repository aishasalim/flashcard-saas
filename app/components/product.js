import { Container, Typography, Box, Grid, Paper } from '@mui/material';

export default function ProductSection() {
  return (
    <Container maxWidth="lg" id="product" sx={{ my: 20 }}>
      <Grid container spacing={4} alignItems="center">
        {/* Left Column: Heading and Description */}
        <Grid item xs={12} md={6}>
          <Typography variant="h3" component="h2" sx={{ fontWeight: 'bold', mb: 2 }}>
            Simple. Effective. User-Friendly.
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '1.1rem'}}>
            Just give your a prompt, and let the AI generate personalized flashcards for you. 
            Save them as study sets when you're logged in, and easily create, 
            edit, or update the cards to suit your needs.
          </Typography>
        </Grid>

        {/* Right Column: Steps */}
        <Grid item xs={12} md={6}>
          <Grid container spacing={2} direction="column">
            {[
              { title: "Create a new study set", description: "Enter a title and prompt, then click 'Create' to start a new study set.", bgColor: '#cdeffb', number: "01" },
              { title: "Generate Flashcards", description: "Provide a topic to generate AI-powered flashcards instantly.", bgColor: '#ffccd2', number: "02" },
              { title: "Review and Edit", description: "Review the flashcards and make any edits as needed.", bgColor: '#ffffaf', number: "03" },
              { title: "Save the Study Set", description: "Save your finalized study set to your account.", bgColor: '#e6dbff', number: "04" }
            ].map((item, index) => (
              <Grid item key={index}>
                <Paper
                  elevation={2}
                  sx={{
                    my: 3,
                    p: 2,
                    backgroundColor: item.bgColor,
                    borderRadius: 2,
                    transform: `rotate(${index % 2 === 0 ? '4deg' : '-4deg'})`,
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, fontSize: '1.4rem' }} className="font-edu">
                    {item.title} <span style={{ float: 'right', fontWeight: 'normal', fontSize: '1.2rem' }} className="font-edu">{item.number}</span>
                  </Typography>
                  <Typography variant="body2" sx={{ fontStyle: 'italic', fontSize: '1.1rem' }} className="font-poppins">
                    {item.description}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}
