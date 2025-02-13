import { Box, Typography, Paper, Slider, TextField, Button, Alert } from '@mui/material';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { colors } from '../../theme/colors';

export const ScoringParameters = ({ 
  weights,
  onWeightChange,
  features,
  onTestScenario,
  modelType
}) => {
  const [totalWeight, setTotalWeight] = useState(100);
  const [scenarioValues, setScenarioValues] = useState({});
  const [weightError, setWeightError] = useState(false);

  useEffect(() => {
    const sum = Object.values(weights).reduce((acc, val) => acc + val, 0);
    setTotalWeight(sum);
    setWeightError(Math.abs(sum - 100) > 0.1); // Allow small floating point differences
  }, [weights]);

  const handleWeightChange = (category, value) => {
    if (onWeightChange) {
      onWeightChange(category, value);
    }
  };

  const handleScenarioValueChange = (feature, value) => {
    setScenarioValues(prev => ({
      ...prev,
      [feature]: value
    }));
  };

  const handleTestScenario = () => {
    if (onTestScenario) {
      onTestScenario(scenarioValues);
    }
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Scoring Parameters
      </Typography>
      <Typography variant="body1" sx={{ mb: 4, color: colors.text.secondary }}>
        Adjust how different factors contribute to the final score and test various scenarios.
      </Typography>

      {/* Weight Adjustment Section */}
      <Paper 
        sx={{ 
          p: 3, 
          mb: 4,
          backgroundColor: colors.background.paper,
          border: `1px solid ${colors.border.drawer}`
        }}
      >
        <Typography variant="subtitle1" sx={{ mb: 3 }}>
          Weight Distribution
        </Typography>

        {weightError && (
          <Alert 
            severity="warning" 
            sx={{ mb: 3 }}
          >
            Weights must sum to 100%. Current total: {totalWeight}%
          </Alert>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {Object.entries(weights).map(([category, value]) => (
            <Box key={category}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Typography>
                <Typography color="text.secondary">
                  {value}%
                </Typography>
              </Box>
              <Slider
                value={value}
                onChange={(_, newValue) => handleWeightChange(category, newValue)}
                min={0}
                max={100}
                sx={{
                  '& .MuiSlider-thumb': {
                    color: colors.brand.red
                  },
                  '& .MuiSlider-track': {
                    color: colors.brand.red
                  },
                  '& .MuiSlider-rail': {
                    color: colors.border.drawer
                  }
                }}
              />
            </Box>
          ))}
        </Box>
      </Paper>

      {/* Scenario Testing Section */}
      <Paper 
        sx={{ 
          p: 3,
          backgroundColor: colors.background.paper,
          border: `1px solid ${colors.border.drawer}`
        }}
      >
        <Typography variant="subtitle1" sx={{ mb: 3 }}>
          Test Scenario
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Input sample values to see how they would score with the current model ({modelType}).
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {features.map((feature) => (
            <TextField
              key={feature.name}
              label={feature.name}
              type={feature.type === 'number' ? 'number' : 'text'}
              value={scenarioValues[feature.name] || ''}
              onChange={(e) => handleScenarioValueChange(feature.name, e.target.value)}
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': {
                    borderColor: colors.brand.red
                  }
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: colors.brand.red
                }
              }}
            />
          ))}

          <Button
            variant="contained"
            onClick={handleTestScenario}
            sx={{
              mt: 2,
              backgroundColor: colors.brand.red,
              '&:hover': {
                backgroundColor: colors.brand.red,
                opacity: 0.9
              }
            }}
          >
            Calculate Score
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

ScoringParameters.propTypes = {
  weights: PropTypes.objectOf(PropTypes.number).isRequired,
  onWeightChange: PropTypes.func.isRequired,
  features: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired
  })).isRequired,
  onTestScenario: PropTypes.func.isRequired,
  modelType: PropTypes.string.isRequired
}; 