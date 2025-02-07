import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme } from '@mui/material';
import { MainLayout } from '@layouts/MainLayout'

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#151c28', // Dark background color
      paper: '#1d2535'
    }
  }
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <MainLayout />
    </ThemeProvider>
  );
}

export default App;