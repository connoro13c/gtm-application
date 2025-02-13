import { Box, Typography } from '@mui/material';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { DataSourceSelection } from '../../components/AccountScoring/DataSourceSelection';

export const DataSourcePage = () => {
  const [selectedSource, setSelectedSource] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const runName = location.state?.runName || 'New Scoring Run';

  const handleSourceSelect = (source) => {
    setSelectedSource(source);
  };

  const handleFileLoaded = (data) => {
    // Store the data in state management or context if needed
    console.log('File loaded:', data);
    // Navigate to next step, passing along the run name
    navigate('/scoring/data-tagging', { 
      state: { 
        ...location.state,
        sourceData: data 
      } 
    });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Data Source: {runName}
      </Typography>
      <DataSourceSelection 
        selectedSource={selectedSource}
        onSelect={handleSourceSelect}
        onFileLoaded={handleFileLoaded}
      />
    </Box>
  );
}; 