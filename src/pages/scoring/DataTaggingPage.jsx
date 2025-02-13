import { Box, Typography } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { FieldSelection } from '../../components/AccountScoring/FieldSelection';

export const DataTaggingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { runName = 'New Scoring Run', sourceData } = location.state || {};
  const [selectedFields, setSelectedFields] = useState({
    identifier: [],
    target: [],
    features: []
  });

  // Transform sourceData into availableFields
  const availableFields = sourceData ? Object.keys(sourceData[0] || {}).map(field => ({
    name: field,
    type: typeof sourceData[0][field]
  })) : [];

  const handleFieldSelect = (field, category) => {
    setSelectedFields(prev => ({
      ...prev,
      [category]: [...prev[category], field]
    }));
  };

  const handleFieldRemove = (field, category) => {
    setSelectedFields(prev => ({
      ...prev,
      [category]: prev[category].filter(f => f !== field)
    }));
  };

  const handleComplete = () => {
    // Validate that we have at least one field in each required category
    if (selectedFields.identifier.length > 0 && selectedFields.target.length > 0) {
      navigate('/scoring/model-config', {
        state: {
          ...location.state,
          selectedFields
        }
      });
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Data Tagging: {runName}
      </Typography>
      <FieldSelection 
        availableFields={availableFields}
        selectedFields={selectedFields}
        onFieldSelect={handleFieldSelect}
        onFieldRemove={handleFieldRemove}
        onComplete={handleComplete}
      />
    </Box>
  );
}; 