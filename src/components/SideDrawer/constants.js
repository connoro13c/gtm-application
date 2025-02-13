import HomeIcon from '@mui/icons-material/Home';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PieChartIcon from '@mui/icons-material/PieChart';
import PublicIcon from '@mui/icons-material/Public';
import AssignmentIcon from '@mui/icons-material/Assignment';
import StorageIcon from '@mui/icons-material/Storage';
import TuneIcon from '@mui/icons-material/Tune';
import ModelTrainingIcon from '@mui/icons-material/ModelTraining';
import SettingsIcon from '@mui/icons-material/Settings';
import PreviewIcon from '@mui/icons-material/Preview';

export const DRAWER_WIDTH = 250;

export const NAV_ITEMS = [
  { id: 'home', icon: HomeIcon, label: 'Home' },
  { 
    id: 'scoring', 
    icon: AssessmentIcon, 
    label: 'Account Scoring',
    subItems: [
      { id: 'scoring/data-source', icon: StorageIcon, label: 'Data Source' },
      { id: 'scoring/data-tagging', icon: TuneIcon, label: 'Data Tagging' },
      { id: 'scoring/model-config', icon: ModelTrainingIcon, label: 'Model Configuration' },
      { id: 'scoring/parameters', icon: SettingsIcon, label: 'Scoring Parameters' },
      { id: 'scoring/review', icon: PreviewIcon, label: 'Review' }
    ]
  },
  { id: 'segmentation', icon: PieChartIcon, label: 'Segmentation' },
  { id: 'territories', icon: PublicIcon, label: 'Territories' },
  { id: 'quota', icon: AssignmentIcon, label: 'Quota' }
]; 