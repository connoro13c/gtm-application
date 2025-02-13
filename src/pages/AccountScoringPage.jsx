import { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Button, 
  Dialog, 
  TextField, 
  Typography, 
  Grid, 
  Paper,
  Chip,
  Card,
  CardContent,
  Divider,
  Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import BarChartIcon from '@mui/icons-material/BarChart';
import TimelineIcon from '@mui/icons-material/Timeline';
import { colors } from '../theme/colors';

// Mock data - replace with real data from database
const MOCK_RECENT_RUNS = [
  {
    id: 1,
    name: 'Q2 Enterprise Scoring',
    date: '2024-03-15',
    accuracy: 87.5,
    accounts: 1250,
    model: 'Random Forest',
    status: 'completed'
  },
  {
    id: 2,
    name: 'SMB Account Analysis',
    date: '2024-03-14',
    accuracy: 82.3,
    accounts: 3400,
    model: 'Gradient Boosting',
    status: 'completed'
  },
  {
    id: 3,
    name: 'Strategic Accounts Q2',
    date: '2024-03-13',
    accuracy: 91.2,
    accounts: 500,
    model: 'Hybrid Model',
    status: 'completed'
  }
];

const MOCK_INSIGHTS = [
  {
    title: 'High Accuracy Trend',
    description: 'Recent models show 15% improvement in accuracy for Enterprise segment',
    type: 'positive'
  },
  {
    title: 'Data Quality Alert',
    description: 'Missing firmographic data in 12% of SMB accounts',
    type: 'warning'
  },
  {
    title: 'Model Recommendation',
    description: 'Hybrid model consistently outperforms single algorithms',
    type: 'info'
  }
];

const QuickAction = ({ icon: Icon, title, description, onClick }) => (
  <Paper
    onClick={onClick}
    sx={{
      p: 3,
      cursor: 'pointer',
      backgroundColor: colors.background.paper,
      border: `1px solid ${colors.border.drawer}`,
      transition: 'all 0.2s',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: 3,
        borderColor: colors.brand.red
      }
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Icon sx={{ fontSize: 32, color: colors.brand.red }} />
      <Box>
        <Typography variant="h6">{title}</Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </Box>
    </Box>
  </Paper>
);

QuickAction.propTypes = {
  icon: PropTypes.elementType.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired
};

export const AccountScoringPage = () => {
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newRunName, setNewRunName] = useState('');

  const handleStartNewRun = () => {
    setIsDialogOpen(true);
  };

  const handleCreateRun = () => {
    navigate('/scoring/data-source', { state: { runName: newRunName } });
    setIsDialogOpen(false);
    setNewRunName('');
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">
          Account Scoring
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleStartNewRun}
          sx={{
            backgroundColor: colors.brand.red,
            '&:hover': {
              backgroundColor: `${colors.brand.red}dd`
            }
          }}
        >
          Start Scoring Run
        </Button>
      </Box>

      {/* Quick Actions */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <QuickAction
            icon={TrendingUpIcon}
            title="Compare Models"
            description="Analyze performance across different scoring models"
            onClick={() => {}}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <QuickAction
            icon={BarChartIcon}
            title="Score Distribution"
            description="View account score distribution and insights"
            onClick={() => {}}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <QuickAction
            icon={TimelineIcon}
            title="Trend Analysis"
            description="Track scoring trends and model accuracy"
            onClick={() => {}}
          />
        </Grid>
      </Grid>

      {/* Recent Runs */}
      <Typography variant="h5" sx={{ mb: 3 }}>
        Recent Scoring Runs
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {MOCK_RECENT_RUNS.map(run => (
          <Grid item xs={12} md={4} key={run.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6">{run.name}</Typography>
                  <Chip 
                    label={run.status}
                    size="small"
                  />
                </Box>
                <Typography color="text.secondary" sx={{ mb: 2 }}>
                  {run.date}
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Accuracy
                    </Typography>
                    <Typography variant="h6">
                      {run.accuracy}%
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Accounts
                    </Typography>
                    <Typography variant="h6">
                      {run.accounts.toLocaleString()}
                    </Typography>
                  </Grid>
                </Grid>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Model: {run.model}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Insights */}
      <Typography variant="h5" sx={{ mb: 3 }}>
        Insights & Recommendations
      </Typography>
      <Grid container spacing={3}>
        {MOCK_INSIGHTS.map((insight, index) => (
          <Grid item xs={12} key={index}>
            <Alert severity={insight.type}>
              <Typography variant="subtitle1">{insight.title}</Typography>
              <Typography variant="body2">{insight.description}</Typography>
            </Alert>
          </Grid>
        ))}
      </Grid>

      {/* New Run Dialog */}
      <Dialog 
        open={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Start New Scoring Run
          </Typography>
          <TextField
            fullWidth
            label="Run Name"
            value={newRunName}
            onChange={(e) => setNewRunName(e.target.value)}
            sx={{ 
              mb: 3,
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
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="contained"
              onClick={handleCreateRun}
              disabled={!newRunName.trim()}
              sx={{
                backgroundColor: colors.brand.red,
                '&:hover': {
                  backgroundColor: `${colors.brand.red}dd`
                }
              }}
            >
              Start Scoring Run
            </Button>
          </Box>
        </Box>
      </Dialog>
    </Box>
  );
}; 