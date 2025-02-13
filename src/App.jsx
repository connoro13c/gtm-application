import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import {
  HomePage,
  AccountScoringPage,
  SegmentationPage,
  TerritoriesPage,
  QuotaPage,
  DataSourcePage,
  DataTaggingPage,
  ModelConfigPage
} from './pages';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#1a1a1a',
      paper: '#343434'
    }
  }
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            {/* Redirect root to /home */}
            <Route index element={<Navigate to="/home" replace />} />
            <Route path="home" element={<HomePage />} />
            <Route path="scoring" element={<AccountScoringPage />} />
            <Route path="scoring/data-source" element={<DataSourcePage />} />
            <Route path="scoring/data-tagging" element={<DataTaggingPage />} />
            <Route path="scoring/model-config" element={<ModelConfigPage />} />
            <Route path="segmentation" element={<SegmentationPage />} />
            <Route path="territories" element={<TerritoriesPage />} />
            <Route path="quota" element={<QuotaPage />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;