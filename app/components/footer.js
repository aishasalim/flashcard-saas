import { Container, Grid, Typography, Link as MuiLink, Box } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

export default function Footer() {
  return (
    <Box component="footer" sx={{ backgroundColor: '#f8f8f8', py: 4, mt: 10 }}>
      <Container maxWidth="lg">
        <Grid container spacing={4} justifyContent="space-between">
          
          {/* Left Side Sections */}
          <Grid item xs={6} md={2}>
            <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold', mb: 2 }}>
              Product
            </Typography>
            <MuiLink href="#pricing" x={{ fontWeight: 'bold', mb: 2 }} color="text.primary" underline="hover">
              Pricing
            </MuiLink>
          </Grid>
          <Grid item xs={6} md={2}>
            <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold', mb: 2 }}>
              Generate
            </Typography>
            <MuiLink href="/dashboard" color="text.primary" underline="hover">
              Dashboard
            </MuiLink>
          </Grid>

          {/* Right Side Sections */}
          <Grid item xs={12} md={6} sx={{ textAlign: { xs: 'center', md: 'right' } }}>
            <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold', mb: 2 }}>
              Connect with us
            </Typography>
            <MuiLink href="https://github.com/aishasalim/flashcard-saas" color="text.primary" underline="hover" target="_blank" sx={{ display: 'inline-flex', alignItems: 'center', mr: 3 }}>
              <GitHubIcon sx={{ mr: 1 }} />
            </MuiLink>
            <MuiLink href="https://www.linkedin.com/in/esterlin-jerez-paulino/" color="text.primary" underline="hover" target="_blank" sx={{ display: 'inline-flex', alignItems: 'center', mr: 3 }}>
              <LinkedInIcon sx={{ mr: 1 }} />
              
            </MuiLink>
            <MuiLink href="https://www.linkedin.com/in/aisha-salimgereyeva/" color="text.primary" underline="hover" target="_blank" sx={{ display: 'inline-flex', alignItems: 'center' }}>
              <LinkedInIcon sx={{ mr: 1 }} />
            </MuiLink>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
