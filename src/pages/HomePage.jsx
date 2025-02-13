import { Box, Typography, Paper, Grid, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PieChartIcon from '@mui/icons-material/PieChart';
import PublicIcon from '@mui/icons-material/Public';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { colors } from '../theme/colors';

export const HomePage = () => {
  const navigate = useNavigate();

  const dashboardItems = [
    {
      id: 'scoring',
      title: 'Account Scoring',
      description: 'Configure and manage account scoring models',
      icon: AssessmentIcon,
      metrics: {
        total: '12,548',
        label: 'Accounts Scored'
      }
    },
    {
      id: 'segmentation',
      title: 'Segmentation',
      description: 'Analyze and manage customer segments',
      icon: PieChartIcon,
      metrics: {
        total: '6',
        label: 'Active Segments'
      }
    },
    {
      id: 'territories',
      title: 'Territory Management',
      description: 'Define and optimize sales territories',
      icon: PublicIcon,
      metrics: {
        total: '24',
        label: 'Territories'
      }
    },
    {
      id: 'quota',
      title: 'Quota Planning',
      description: 'Set and track sales quotas',
      icon: AssignmentIcon,
      metrics: {
        total: '156',
        label: 'Quota Plans'
      }
    }
  ];

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4, color: colors.text.primary }}>
        Welcome to the Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        {dashboardItems.map(({ id, title, description, icon: Icon, metrics }) => (
          <Grid item xs={12} sm={6} md={3} key={id}>
            <Paper 
              sx={{ 
                p: 3,
                height: '100%',
                backgroundColor: colors.background.paper,
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                  '& .dashboard-icon': {
                    color: colors.brand.red,
                    transform: 'scale(1.1)'
                  }
                }
              }}
              onClick={() => navigate(`/${id}`)}
            >
              <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
                <IconButton 
                  className="dashboard-icon"
                  sx={{ 
                    backgroundColor: `${colors.brand.red}10`,
                    transition: 'all 0.2s',
                    '&:hover': {
                      backgroundColor: `${colors.brand.red}20`
                    }
                  }}
                >
                  <Icon sx={{ color: colors.text.primary }} />
                </IconButton>
              </Box>
              
              <Typography variant="h3" sx={{ mb: 1, color: colors.text.primary }}>
                {metrics.total}
              </Typography>
              
              <Typography variant="body2" sx={{ mb: 2, color: colors.text.secondary }}>
                {metrics.label}
              </Typography>
              
              <Typography variant="h6" sx={{ mb: 1, color: colors.text.primary }}>
                {title}
              </Typography>
              
              <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                {description}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}; 