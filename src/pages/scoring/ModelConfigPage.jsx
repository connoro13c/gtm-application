import { Box, Typography } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { ModelSelection } from '../../components/AccountScoring/ModelSelection';

export const ModelConfigPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { runName = 'New Scoring Run', sourceData, selectedFields } = location.state || {};

  const handleModelConfigured = (modelConfig) => {
    navigate('/scoring/parameters', {
      state: {
        ...location.state,
        modelConfig
      }
    });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Model Configuration: {runName}
      </Typography>
      <ModelSelection 
        sourceData={sourceData}
        selectedFields={selectedFields}
        onComplete={handleModelConfigured}
      />
    </Box>
  );
}; 