import { Box, Typography, Paper, Grid, CircularProgress, Chip } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AssessmentIcon from '@mui/icons-material/Assessment';
import { colors } from '../../theme/colors';
import PropTypes from 'prop-types';

export const AccountScoringSummary = ({ analysisResults }) => {
  if (!analysisResults) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress sx={{ color: colors.brand.red }} />
      </Box>
    );
  }

  const { summary, accuracy, additionalMetrics } = analysisResults;

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <AssessmentIcon sx={{ color: colors.brand.red }} />
        <Typography variant="h6">
          Account Scoring Overview
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Summary Stats */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="subtitle1" sx={{ mb: 3 }}>
              Propensity Distribution
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ color: colors.brand.red, mb: 1 }}>
                    {summary.highPropensity}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    High Propensity
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    ({((summary.highPropensity / summary.totalAccounts) * 100).toFixed(1)}%)
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ color: colors.text.primary, mb: 1 }}>
                    {summary.mediumPropensity}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Medium Propensity
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    ({((summary.mediumPropensity / summary.totalAccounts) * 100).toFixed(1)}%)
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ color: colors.text.secondary, mb: 1 }}>
                    {summary.lowPropensity}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Low Propensity
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    ({((summary.lowPropensity / summary.totalAccounts) * 100).toFixed(1)}%)
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Model Performance */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="subtitle1" sx={{ mb: 3 }}>
              Model Performance
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Overall Accuracy
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TrendingUpIcon sx={{ color: colors.brand.red }} />
                  <Typography variant="h4" sx={{ color: colors.brand.red }}>
                    {(accuracy * 100).toFixed(1)}%
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                <Chip 
                  label={`Precision: ${(additionalMetrics.precision * 100).toFixed(1)}%`}
                  size="small"
                  sx={{ backgroundColor: `${colors.brand.red}10`, color: colors.text.primary }}
                />
                <Chip 
                  label={`Recall: ${(additionalMetrics.recall * 100).toFixed(1)}%`}
                  size="small"
                  sx={{ backgroundColor: `${colors.brand.red}10`, color: colors.text.primary }}
                />
                <Chip 
                  label={`AUC: ${(additionalMetrics.auc * 100).toFixed(1)}%`}
                  size="small"
                  sx={{ backgroundColor: `${colors.brand.red}10`, color: colors.text.primary }}
                />
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Top Accounts */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 3 }}>
              Top Scoring Accounts
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {analysisResults.scores
                .sort((a, b) => b.score - a.score)
                .slice(0, 5)
                .map(account => (
                  <Box 
                    key={account.accountId}
                    sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      p: 2,
                      borderRadius: 1,
                      backgroundColor: colors.background.paper,
                      border: `1px solid ${colors.border.drawer}`
                    }}
                  >
                    <Box>
                      <Typography>{account.name}</Typography>
                      <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                        {account.topFactors.map(factor => (
                          <Chip
                            key={factor.name}
                            label={`${factor.name}: ${(factor.impact * 100).toFixed(0)}%`}
                            size="small"
                            sx={{ 
                              backgroundColor: `${colors.brand.red}${Math.round(factor.impact * 40)}`,
                              color: colors.text.primary
                            }}
                          />
                        ))}
                      </Box>
                    </Box>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        color: colors.brand.red,
                        fontWeight: 500
                      }}
                    >
                      {(account.score * 100).toFixed(1)}%
                    </Typography>
                  </Box>
                ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

AccountScoringSummary.propTypes = {
  analysisResults: PropTypes.shape({
    accuracy: PropTypes.number.isRequired,
    additionalMetrics: PropTypes.shape({
      precision: PropTypes.number.isRequired,
      recall: PropTypes.number.isRequired,
      auc: PropTypes.number.isRequired
    }).isRequired,
    scores: PropTypes.arrayOf(PropTypes.shape({
      accountId: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      score: PropTypes.number.isRequired,
      topFactors: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string.isRequired,
        impact: PropTypes.number.isRequired
      })).isRequired
    })).isRequired,
    summary: PropTypes.shape({
      totalAccounts: PropTypes.number.isRequired,
      highPropensity: PropTypes.number.isRequired,
      mediumPropensity: PropTypes.number.isRequired,
      lowPropensity: PropTypes.number.isRequired
    }).isRequired
  })
}; 