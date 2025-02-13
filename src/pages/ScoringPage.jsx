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
  LinearProgress,
  Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import BarChartIcon from '@mui/icons-material/BarChart';
import TimelineIcon from '@mui/icons-material/Timeline';
import CompareIcon from '@mui/icons-material/Compare';
import SettingsIcon from '@mui/icons-material/Settings';
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
      transition: 'all 0.2s',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: 3
      }
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Icon sx={{ fontSize: 32 }} />
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">
          Account Scoring
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleStartNewRun}
        >
          Start Scoring Run
        </Button>
      </Box>

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
            sx={{ mb: 3 }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="contained"
              onClick={handleCreateRun}
              disabled={!newRunName.trim()}
            >
              Start Scoring Run
            </Button>
          </Box>
        </Box>
      </Dialog>
    </Box>
  );
}; 