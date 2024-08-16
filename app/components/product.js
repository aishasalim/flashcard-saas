import { Container, Typography, Box, Grid, Paper } from '@mui/material';

export default function ProductSection() {
  return (
    <Container maxWidth="lg" id="product" sx={{ my: 8 }}>
      <Grid container spacing={4} alignItems="center">
        {/* Left Column: Heading and Description */}
        <Grid item xs={12} md={6}>
          <Typography variant="h3" component="h2" sx={{ fontWeight: 'bold', mb: 2 }}>
            Simple. Easy To Use. Effortless.
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            Provide a prompt, and let AI generate personalized flashcards for you.
            Save these flashcards as study sets if you're logged in, and easily
            create, edit, update, or delete cards to fit your needs.
          </Typography>
        </Grid>

        {/* Right Column: Steps */}
        <Grid item xs={12} md={6}>
          <Grid container spacing={2} direction="column">
            {[
              { title: "Create a new study set", description: "Enter a title and prompt, then click 'Create' to start a new study set.", bgColor: '#d0f0fd', number: "01" },
              { title: "Generate Flashcards", description: "Provide a topic to generate AI-powered flashcards instantly.", bgColor: '#ffd3d9', number: "02" },
              { title: "Review and Edit", description: "Review the flashcards and make any edits as needed.", bgColor: '#ffffc4', number: "03" },
              { title: "Save the Study Set", description: "Save your finalized study set to your account.", bgColor: '#f2e5ff', number: "04" }
            ].map((item, index) => (
              <Grid item key={index}>
                <Paper
                  elevation={2}
                  sx={{
                    p: 2,
                    backgroundColor: item.bgColor,
                    borderRadius: 2,
                    transform: `rotate(${index % 2 === 0 ? '-2deg' : '2deg'})`,
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {item.title} <span style={{ float: 'right', fontWeight: 'normal' }}>{item.number}</span>
                  </Typography>
                  <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
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
