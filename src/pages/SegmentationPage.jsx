import { Box, Typography } from '@mui/material';

export const SegmentationPage = () => {
  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Customer Segmentation
      </Typography>
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: 3
      }}>
        {/* Add your segmentation content here */}
      </Box>
    </Box>
  );
}; 