import { Box, Typography, Card, CardContent, CardActions, Button, Collapse, TextField, Slider, FormControlLabel, Switch, Chip } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { colors } from '../../theme/colors';

const MODEL_TYPES = [
  {
    id: 'random_forest',
    name: 'Random Forest',
    description: 'Robust, non-linear model great for capturing complex interactions.',
    advantages: ['Handles many variables well', 'Less prone to overfitting', 'Good with mixed data types'],
    parameters: {
      n_estimators: {
        label: 'Number of Trees',
        type: 'slider',
        min: 10,
        max: 1000,
        default: 100,
        description: 'More trees provide better accuracy and stability, but increase computation time. Too many trees can lead to diminishing returns.'
      },
      max_depth: {
        label: 'Maximum Tree Depth',
        type: 'slider',
        min: 3,
        max: 30,
        default: 10,
        description: 'Deeper trees can capture more complex patterns but risk overfitting. Shallower trees are more generalizable but might miss important relationships.'
      }
    }
  },
  {
    id: 'logistic_regression',
    name: 'Logistic Regression',
    description: 'Linear model providing interpretable results and probability scores.',
    advantages: ['Highly interpretable', 'Fast training', 'Good for linear relationships'],
    parameters: {
      regularization: {
        label: 'Regularization Strength',
        type: 'slider',
        min: 0.01,
        max: 10,
        default: 1,
        step: 0.01,
        description: 'Higher values reduce model complexity and prevent overfitting but might underfit. Lower values allow more complex patterns but risk overfitting to noise.'
      }
    }
  },
  {
    id: 'gradient_boosting',
    name: 'Gradient Boosting',
    description: 'Advanced model that often achieves best-in-class accuracy.',
    advantages: ['High accuracy', 'Handles non-linear relationships', 'Feature importance'],
    parameters: {
      learning_rate: {
        label: 'Learning Rate',
        type: 'slider',
        min: 0.01,
        max: 1,
        default: 0.1,
        step: 0.01,
        description: 'Lower rates mean slower but more stable learning, often better generalization. Higher rates learn faster but might be less stable.'
      },
      n_estimators: {
        label: 'Number of Boosting Stages',
        type: 'slider',
        min: 10,
        max: 1000,
        default: 100,
        description: 'More stages can improve accuracy but may overfit. Balance with learning rate - lower rates typically need more stages.'
      }
    }
  },
  {
    id: 'hybrid',
    name: 'Hybrid Model',
    description: 'Combines multiple algorithms for balanced, robust predictions.',
    advantages: ['Best of both worlds', 'Reduces model bias', 'More stable predictions'],
    parameters: {
      base_models: {
        label: 'Base Models',
        type: 'multiselect',
        options: ['random_forest', 'logistic_regression', 'gradient_boosting'],
        default: ['random_forest', 'logistic_regression'],
        min_selections: 2
      },
      ensemble_method: {
        label: 'Ensemble Method',
        type: 'select',
        options: [
          { value: 'average', label: 'Average Predictions' },
          { value: 'weighted', label: 'Weighted Average' },
          { value: 'stacking', label: 'Stacking (Advanced)' }
        ],
        default: 'average'
      }
    }
  }
];

export const ModelSelection = ({ formData, setFormData }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [expandedCard, setExpandedCard] = useState(null);

  const handleModelSelect = (model) => {
    setFormData(prev => ({
      ...prev,
      model: {
        type: model.id,
        name: model.name,
        parameters: model.parameters ? 
          Object.entries(model.parameters).reduce((acc, [key, param]) => {
            acc[key] = param.default;
            return acc;
          }, {}) 
          : {}
      }
    }));
  };

  const handleParameterChange = (key, value) => {
    setFormData(prev => ({
      ...prev,
      model: {
        ...prev.model,
        parameters: {
          ...prev.model.parameters,
          [key]: value
        }
      }
    }));
  };

  const handleExpandClick = (modelId) => {
    setExpandedCard(expandedCard === modelId ? null : modelId);
  };

  // Reset expanded state when toggling advanced settings off
  useEffect(() => {
    if (!showAdvanced) {
      setExpandedCard(null);
    }
  }, [showAdvanced]);

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Choose a Model
      </Typography>
      <Typography variant="body1" sx={{ mb: 4, color: colors.text.secondary }}>
        Select the machine learning model that best fits your needs. Each model has different strengths.
      </Typography>

      <FormControlLabel
        control={
          <Switch 
            checked={showAdvanced}
            onChange={(e) => setShowAdvanced(e.target.checked)}
            sx={{
              '& .MuiSwitch-switchBase.Mui-checked': {
                color: colors.brand.red,
                '&:hover': {
                  backgroundColor: `${colors.brand.red}20`
                }
              },
              '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                backgroundColor: colors.brand.red
              }
            }}
          />
        }
        label={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography>Show Advanced Settings</Typography>
            {showAdvanced && (
              <Typography variant="caption" sx={{ color: colors.text.secondary }}>
                (Configure model parameters for fine-tuned performance)
              </Typography>
            )}
          </Box>
        }
        sx={{ mb: 3 }}
      />

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {MODEL_TYPES.map((model) => {
          const isSelected = formData.model?.type === model.id;
          return (
            <Card
              key={model.id}
              sx={{
                backgroundColor: colors.background.paper,
                border: `1px solid ${isSelected ? colors.brand.red : colors.border.drawer}`,
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  borderColor: colors.brand.red
                }
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography variant="h6" sx={{ mb: 1 }}>
                      {model.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {model.description}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {model.advantages.map((advantage) => (
                        <Typography
                          key={advantage}
                          variant="caption"
                          sx={{
                            backgroundColor: `${colors.brand.red}10`,
                            color: colors.brand.red,
                            padding: '4px 8px',
                            borderRadius: '4px'
                          }}
                        >
                          {advantage}
                        </Typography>
                      ))}
                    </Box>
                  </Box>
                  <Button
                    variant={isSelected ? "contained" : "outlined"}
                    onClick={() => handleModelSelect(model)}
                    sx={{
                      minWidth: '100px',
                      transition: 'all 0.2s ease-in-out',
                      ...(isSelected ? {
                        backgroundColor: `${colors.brand.red} !important`,
                        color: 'white',
                        boxShadow: '0 4px 12px rgba(244, 67, 54, 0.25)',
                        transform: 'translateY(-2px)',
                        '&:hover': {
                          backgroundColor: `${colors.brand.red} !important`,
                          boxShadow: '0 6px 16px rgba(244, 67, 54, 0.35)',
                          transform: 'translateY(-3px)'
                        }
                      } : {
                        borderColor: colors.brand.red,
                        color: colors.brand.red,
                        '&:hover': {
                          borderColor: colors.brand.red,
                          backgroundColor: `${colors.brand.red}10`,
                          transform: 'translateY(-1px)',
                          boxShadow: '0 2px 8px rgba(244, 67, 54, 0.15)'
                        }
                      })
                    }}
                  >
                    {isSelected ? 'Selected' : 'Select'}
                  </Button>
                </Box>
              </CardContent>

              {showAdvanced && isSelected && model.parameters && Object.keys(model.parameters).length > 0 && (
                <>
                  <CardActions sx={{ 
                    justifyContent: 'space-between', 
                    borderTop: `1px solid ${colors.border.drawer}`,
                    backgroundColor: `${colors.brand.red}05`,
                    px: 3
                  }}>
                    <Button
                      onClick={() => handleExpandClick(model.id)}
                      endIcon={
                        <ExpandMoreIcon 
                          sx={{ 
                            transform: expandedCard === model.id ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform 0.2s'
                          }} 
                        />
                      }
                      sx={{
                        color: colors.text.primary,
                        pl: 0,
                        '&:hover': {
                          backgroundColor: 'transparent',
                          color: colors.brand.red
                        }
                      }}
                    >
                      Configure Model Parameters
                    </Button>
                    {expandedCard !== model.id && (
                      <Typography variant="caption" sx={{ color: colors.text.secondary }}>
                        Using optimal default values
                      </Typography>
                    )}
                  </CardActions>

                  <Collapse in={expandedCard === model.id}>
                    <CardContent sx={{ 
                      backgroundColor: `${colors.brand.red}05`,
                      borderTop: `1px solid ${colors.border.drawer}`
                    }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        {Object.entries(model.parameters).map(([key, param]) => (
                          <Box key={key}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mb: 1 }}>
                              <Typography>
                                {param.label}
                              </Typography>
                              <Typography variant="caption" sx={{ color: colors.text.secondary }}>
                                Default: {param.default}
                              </Typography>
                            </Box>
                            {param.type === 'select' ? (
                              <TextField
                                select
                                value={formData.model.parameters[key] || param.default}
                                onChange={(e) => handleParameterChange(key, e.target.value)}
                                fullWidth
                                SelectProps={{
                                  native: true
                                }}
                              >
                                {param.options.map((option) => (
                                  <option key={option.value} value={option.value}>
                                    {option.label}
                                  </option>
                                ))}
                              </TextField>
                            ) : param.type === 'multiselect' ? (
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {param.options.map((modelId) => {
                                  const isSelected = (formData.model.parameters[key] || param.default).includes(modelId);
                                  return (
                                    <Chip
                                      key={modelId}
                                      label={MODEL_TYPES.find(m => m.id === modelId)?.name || modelId}
                                      onClick={() => {
                                        const current = formData.model.parameters[key] || param.default;
                                        if (isSelected && current.length > param.min_selections) {
                                          handleParameterChange(key, current.filter(id => id !== modelId));
                                        } else if (!isSelected) {
                                          handleParameterChange(key, [...current, modelId]);
                                        }
                                      }}
                                      sx={{
                                        backgroundColor: isSelected ? colors.brand.red : 'transparent',
                                        color: isSelected ? 'white' : colors.text.primary,
                                        border: `1px solid ${isSelected ? colors.brand.red : colors.border.drawer}`,
                                        '&:hover': {
                                          backgroundColor: isSelected ? `${colors.brand.red}dd` : colors.background.hover
                                        }
                                      }}
                                    />
                                  );
                                })}
                              </Box>
                            ) : param.type === 'slider' ? (
                              <Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mb: 1 }}>
                                  <Typography variant="caption" sx={{ color: colors.text.secondary }}>
                                    {param.description}
                                  </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                  <Box sx={{ flex: 1 }}>
                                    <Slider
                                      value={formData.model.parameters[key] || param.default}
                                      min={param.min}
                                      max={param.max}
                                      step={param.step || 1}
                                      onChange={(_, value) => handleParameterChange(key, value)}
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
                                  <Box sx={{ 
                                    minWidth: '60px',
                                    backgroundColor: `${colors.brand.red}10`,
                                    padding: '4px 8px',
                                    borderRadius: '4px',
                                    display: 'flex',
                                    justifyContent: 'center'
                                  }}>
                                    <Typography variant="body2" sx={{ color: colors.brand.red, fontWeight: 500 }}>
                                      {formData.model.parameters[key] || param.default}
                                    </Typography>
                                  </Box>
                                </Box>
                              </Box>
                            ) : (
                              <TextField
                                value={formData.model.parameters[key] || param.default}
                                onChange={(e) => handleParameterChange(key, e.target.value)}
                                fullWidth
                              />
                            )}
                          </Box>
                        ))}
                      </Box>
                    </CardContent>
                  </Collapse>
                </>
              )}
            </Card>
          );
        })}
      </Box>
    </Box>
  );
};

ModelSelection.propTypes = {
  formData: PropTypes.shape({
    model: PropTypes.shape({
      type: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      parameters: PropTypes.object
    })
  }),
  setFormData: PropTypes.func.isRequired
}; 