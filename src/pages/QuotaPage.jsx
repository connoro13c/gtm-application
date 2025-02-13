import { Box, Typography } from '@mui/material';

export const QuotaPage = () => {
  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Quota Overview
      </Typography>
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: 3
      }}>
        {/* Add your quota management content here */}
      </Box>
    </Box>
  );
}; 