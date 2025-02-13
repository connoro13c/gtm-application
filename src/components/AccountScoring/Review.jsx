import { Box, Typography, Paper, Chip, Alert } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import PropTypes from 'prop-types';
import { colors } from '../../theme/colors';

const FieldSection = ({ title, fields }) => (
  <Box sx={{ mb: 2 }}>
    <Typography variant="subtitle2" sx={{ mb: 1 }}>
      {title}
    </Typography>
    {fields.length === 0 ? (
      <Typography variant="body2" color="text.secondary">
        Not selected
      </Typography>
    ) : (
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {fields.map(field => (
          <Chip
            key={field.name}
            label={field.name}
            size="small"
            sx={{
              backgroundColor: colors.background.paper,
              border: `1px solid ${colors.border.drawer}`
            }}
          />
        ))}
      </Box>
    )}
  </Box>
);

FieldSection.propTypes = {
  title: PropTypes.string.isRequired,
  fields: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    type: PropTypes.string
  })).isRequired
};

export const Review = ({ formData }) => {
  const { selectedFields, modelType, modelParameters, weights, analysisResults } = formData;

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Review Configuration
      </Typography>

      {/* Selected Fields */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="subtitle1" sx={{ mb: 3 }}>
          Selected Fields
        </Typography>
        <FieldSection title="Account Identifier" fields={selectedFields.identifier} />
        <FieldSection title="Target Outcome" fields={selectedFields.target} />
        <FieldSection title="Engagement Metrics" fields={selectedFields.engagement} />
        <FieldSection title="Firmographic Data" fields={selectedFields.firmographics} />
        <FieldSection title="Additional Features" fields={selectedFields.features} />
      </Paper>

      {/* Model Configuration */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="subtitle1" sx={{ mb: 3 }}>
          Model Configuration
        </Typography>
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Model Type
          </Typography>
          <Typography>
            {modelType || 'Not selected'}
          </Typography>
        </Box>
        {Object.keys(modelParameters).length > 0 && (
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Parameters
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              {Object.entries(modelParameters).map(([key, value]) => (
                <Chip
                  key={key}
                  label={`${key}: ${value}`}
                  size="small"
                  sx={{
                    backgroundColor: `${colors.brand.red}10`,
                    color: colors.text.primary
                  }}
                />
              ))}
            </Box>
          </Box>
        )}
      </Paper>

      {/* Weights */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="subtitle1" sx={{ mb: 3 }}>
          Scoring Weights
        </Typography>
        {Object.keys(weights).length === 0 ? (
          <Typography color="text.secondary">
            No weights configured
          </Typography>
        ) : (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            {Object.entries(weights).map(([category, value]) => (
              <Chip
                key={category}
                label={`${category}: ${value}%`}
                size="small"
                sx={{
                  backgroundColor: `${colors.brand.red}10`,
                  color: colors.text.primary
                }}
              />
            ))}
          </Box>
        )}
      </Paper>

      {/* Validation Results - Only show if we have analysis results */}
      {analysisResults && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="subtitle1" sx={{ mb: 3 }}>
            Validation Results
          </Typography>
          
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <CheckCircleIcon sx={{ color: colors.brand.red }} />
              <Typography variant="body1">
                Model Performance
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Accuracy: {(analysisResults.accuracy * 100).toFixed(1)}%
              {analysisResults.additionalMetrics && (
                <>
                  <br />
                  Precision: {(analysisResults.additionalMetrics.precision * 100).toFixed(1)}%
                  <br />
                  Recall: {(analysisResults.additionalMetrics.recall * 100).toFixed(1)}%
                </>
              )}
            </Typography>
          </Box>

          {analysisResults.warnings && analysisResults.warnings.length > 0 && (
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <WarningIcon sx={{ color: '#FFA726' }} />
                <Typography variant="body1">
                  Warnings
                </Typography>
              </Box>
              {analysisResults.warnings.map((warning, index) => (
                <Alert 
                  key={index}
                  severity="warning"
                  sx={{ mb: 2 }}
                >
                  {warning}
                </Alert>
              ))}
            </Box>
          )}
        </Paper>
      )}
    </Box>
  );
};

Review.propTypes = {
  formData: PropTypes.shape({
    selectedFields: PropTypes.shape({
      identifier: PropTypes.array.isRequired,
      target: PropTypes.array.isRequired,
      engagement: PropTypes.array.isRequired,
      firmographics: PropTypes.array.isRequired,
      features: PropTypes.array.isRequired
    }).isRequired,
    modelType: PropTypes.string.isRequired,
    modelParameters: PropTypes.object.isRequired,
    weights: PropTypes.object.isRequired,
    analysisResults: PropTypes.shape({
      accuracy: PropTypes.number.isRequired,
      additionalMetrics: PropTypes.shape({
        precision: PropTypes.number.isRequired,
        recall: PropTypes.number.isRequired,
        auc: PropTypes.number.isRequired
      }).isRequired,
      warnings: PropTypes.arrayOf(PropTypes.string)
    })
  }).isRequired
}; 