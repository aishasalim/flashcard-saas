import { Container, Grid, Typography, TextField, Button, Link as MuiLink, Box } from '@mui/material';

export default function Footer() {
  return (
    <Box component="footer" sx={{ backgroundColor: '#f8f8f8', py: 4, mt: 10 }}>
      <Container maxWidth="lg">
        <Grid container spacing={4} justifyContent="space-between">

          {/* Product Section */}
          <Grid item xs={6} md={2}>
            <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold', mb: 2 }}>
              Product
            </Typography>
            <MuiLink href="#pricing" color="text.primary" underline="hover">
              Pricing
            </MuiLink>
          </Grid>

          {/* Legal Section */}
          <Grid item xs={6} md={2}>
            <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold', mb: 2 }}>
              Legal
            </Typography>
            <MuiLink href="#contact" color="text.primary" underline="hover">
              Contact
            </MuiLink>
          </Grid>
        </Grid>

      </Container>
    </Box>
  );
}
