/**
 * Main layout component that provides a responsive drawer navigation and themed container.
 * Includes a collapsible sidebar, and themed content area.
 * 
 * Features:
 * - Responsive drawer navigation with customizable width
 * - Dark theme with custom background
 * - Animated transitions for drawer open/close
 * - Hover-activated drawer
 * 
 * @component
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components to render in the main content area
 */
import { Box, IconButton, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { styled } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SettingsIcon from '@mui/icons-material/Settings';
import TagIcon from '@mui/icons-material/Tag';
import { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import wallpaper from '../assets/Frame28.png';
import themeDarkSpark from '../assets/ThemeDarkSpark.png';
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
 * Includes a collapsible sidebar, and themed content area.
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components to render in the main content area
 */
export const MainLayout = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(null);

  const handleIconHover = useCallback((section) => {
    setOpen(true);
    setActiveSection(section);
  }, []);

  const handleDrawerMouseLeave = useCallback(() => {
    setOpen(false);
    setActiveSection(null);
  }, []);

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
      <Box 
        onMouseLeave={handleDrawerMouseLeave}
        sx={{ position: 'fixed', left: 0, top: 0, bottom: 0, zIndex: 1 }}
      >
        {/* Static left sidebar with icons */}
        <Box sx={{
          width: '64px',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingTop: '88px',
          backgroundColor: '#1a1a1a',
          gap: 2,
          position: 'relative',
          zIndex: 2
        }}>
          {/* ThemeDarkSpark logo */}
          <Box
            component="img"
            src={themeDarkSpark}
            alt="Theme Dark Spark"
            onClick={() => {
              setOpen(true);
              setActiveSection(null);
            }}
            sx={{
              position: 'absolute',
              top: '12px',
              left: '12px',
              width: '40px',
              height: '40px',
              objectFit: 'contain',
              cursor: 'pointer',
              padding: '8px',
              backgroundColor: '#343434',
              borderRadius: '8px',
              '&:hover': {
                opacity: 0.8
              }
            }}
          />

          {/* Navigation Icons */}
          <Box
            onMouseEnter={() => handleIconHover('dashboard')}
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <IconButton
              sx={{
                color: 'white',
                '&:hover': {
                  backgroundColor: '#2a2a2a',
                }
              }}
            >
              <DashboardIcon />
            </IconButton>
          </Box>

          <Box
            onMouseEnter={() => handleIconHover('tags')}
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <IconButton
              sx={{
                color: 'white',
                '&:hover': {
                  backgroundColor: '#2a2a2a',
                }
              }}
            >
              <TagIcon />
            </IconButton>
          </Box>

          <Box
            onMouseEnter={() => handleIconHover('settings')}
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <IconButton
              sx={{
                color: 'white',
                '&:hover': {
                  backgroundColor: '#2a2a2a',
                }
              }}
            >
              <SettingsIcon />
            </IconButton>
          </Box>
        </Box>

        {/* Animated drawer portion */}
        <Box
          sx={{
            position: 'fixed',
            left: '64px',
            top: 0,
            bottom: 0,
            width: open ? `${DRAWER_WIDTH - 64}px` : 0,
            backgroundColor: '#1a1a1a',
            borderLeft: '1px solid rgba(255, 255, 255, 0.12)',
            transition: theme => theme.transitions.create('width', {
              easing: theme.transitions.easing.easeInOut,
              duration: theme.transitions.duration.standard,
            }),
            overflow: 'hidden',
            zIndex: 1
          }}
        >
          <Box sx={{
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            
            backgroundColor: '#343434',
            margin: '12px',
            marginBottom: '24px',
            borderRadius: '8px',
            transform: 'scale(1)',
            transformOrigin: 'left center'
          }}>
            <Header size="large" />
          </Box>
          <List sx={{ pt: 0 }}>
            <ListItem 
              button
              sx={{
                position: 'relative',
                height: '48px',
                '&::before': activeSection === 'dashboard' ? {
                  content: '""',
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: '4px',
                  backgroundColor: '#2927C0',
                  borderTopRightRadius: '4px',
                  borderBottomRightRadius: '4px'
                } : {}
              }}
            >
              <ListItemIcon sx={{ color: 'white', minWidth: '40px' }}>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItem>
            <ListItem 
              button
              sx={{
                position: 'relative',
                height: '48px',
                '&::before': activeSection === 'tags' ? {
                  content: '""',
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: '4px',
                  backgroundColor: '#2927C0',
                  borderTopRightRadius: '4px',
                  borderBottomRightRadius: '4px'
                } : {}
              }}
            >
              <ListItemIcon sx={{ color: 'white', minWidth: '40px' }}>
                <TagIcon />
              </ListItemIcon>
              <ListItemText primary="Tags" />
            </ListItem>
            <ListItem 
              button
              sx={{
                position: 'relative',
                height: '48px',
                '&::before': activeSection === 'settings' ? {
                  content: '""',
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: '4px',
                  backgroundColor: '#2927C0',
                  borderTopRightRadius: '4px',
                  borderBottomRightRadius: '4px'
                } : {}
              }}
            >
              <ListItemIcon sx={{ color: 'white', minWidth: '40px' }}>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText primary="Settings" />
            </ListItem>
          </List>
        </Box>
      </Box>
      <Main open={open}>
        {children}
      </Main>
    </Box>
  );
};

MainLayout.propTypes = {
  children: PropTypes.node.isRequired,
};


