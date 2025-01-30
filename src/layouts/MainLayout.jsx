/**
 * Main layout component that provides a responsive drawer navigation and themed container.
 * Includes a collapsible sidebar, background wallpaper, and themed content area.
 * 
 * Features:
 * - Responsive drawer navigation with customizable width
 * - Dark theme with custom background
 * - Animated transitions for drawer open/close
 * - Fixed menu button for collapsed state
 * - Full viewport coverage with background wallpaper
 * 
 * @component
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components to render in the main content area
 */
import { Box, IconButton, ThemeProvider, createTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from 'react';
import { SideDrawer } from '@components/SideDrawer';
import PropTypes from 'prop-types';
import wallpaper from '../assets/WallpaperDimensionalSparks.png';
import { Header } from '@components/header';

const DRAWER_WIDTH = 240;

const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#242424'
    }
  }
});

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${DRAWER_WIDTH}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  }),
);

/**
 * Main layout component that provides a responsive drawer navigation and themed container.
 * Includes a collapsible sidebar, background wallpaper, and themed content area.
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components to render in the main content area
 */
export const MainLayout = ({ children }) => {
  const [open, setOpen] = useState(false);

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ 
        display: 'flex', 
        minHeight: '100vh',
        minWidth: '100vw',
        backgroundColor: 'background.default',
        backgroundImage: `url(${wallpaper})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        overflow: 'hidden'
      }}>
        <SideDrawer open={open} onClose={() => setOpen(false)} />
        <Header />
        {!open && (
          <IconButton
            sx={{
              position: 'fixed',
              left: 16,
              top: 16,
              backgroundColor: '#1a1a1a',
              color: 'white',
              '&:hover': {
                backgroundColor: '#2a2a2a',
              }
            }}
            onClick={() => setOpen(true)}
          >
            <MenuIcon />
            
          </IconButton>
        )}
        <Main open={open}>
          {children}
        </Main>
        
      </Box>
      
    </ThemeProvider>
  );
};

MainLayout.propTypes = {
  children: PropTypes.node.isRequired,
};


