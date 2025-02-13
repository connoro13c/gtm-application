import { Box, Typography } from '@mui/material';

export const TerritoriesPage = () => {
  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Territory Management
      </Typography>
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: 3
      }}>
        {/* Add your territory management content here */}
      </Box>
    </Box>
  );
}; 