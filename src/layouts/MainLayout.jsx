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
import { Box, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from 'react';
import { SideDrawer } from '@components/SideDrawer';
import PropTypes from 'prop-types';
import wallpaper from '../assets/Frame28.png';
import { Header } from '@components/header';

const DRAWER_WIDTH = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: 0,
    width: '100%',
    ...(open && {
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: `${DRAWER_WIDTH}px`,
      width: `calc(100% - ${DRAWER_WIDTH}px)`,
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
    <Box sx={{ 
      display: 'flex', 
      minHeight: '100vh',
      minWidth: '100vw',
      background: 'none',
      backgroundImage: `url(${wallpaper})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed',
      overflow: 'hidden'
    }}>
      <SideDrawer open={open} onClose={() => setOpen(false)} />
      {!open && (
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          position: 'fixed', 
          left: 0, 
          top: 0, 
          zIndex: 1,
          height: '64px' // Fixed height to match MUI's default AppBar height
        }}>
          <IconButton
            sx={{
              marginLeft: 2,
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
          <Box sx={{ 
            marginLeft: 2,
            display: 'flex',
            alignItems: 'center',
            height: '100%'
          }}>
            <Header size="large" />
          </Box>
        </Box>
      )}
      <Main open={open}>
        {children}
      </Main>
    </Box>
  );
};

MainLayout.propTypes = {
  children: PropTypes.node.isRequired,
};


