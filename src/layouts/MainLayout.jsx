/**
 * Main layout component that provides a responsive drawer navigation and themed container.
 * 
 * Features:
 * - Responsive layout with drawer navigation
 * - Dark theme with custom background
 * - Themed content area
 * 
 * @component
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components to render in the main content area
 * @param {string} props.activeSection - Currently active section ('home', 'tags', or 'settings')
 * @param {Function} props.onNavigate - Callback when navigation item is clicked
 */
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import wallpaper from '../assets/Frame28.png';
import { SideDrawer, DRAWER_WIDTH } from '../components/SideDrawer';

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

export const MainLayout = ({ children, activeSection, onNavigate }) => {
  const [open, setOpen] = useState(false);

  const handleDrawerMouseLeave = useCallback(() => {
    setOpen(false);
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
      <SideDrawer
        open={open}
        activeSection={activeSection}
        onOpenChange={setOpen}
        onMouseLeave={handleDrawerMouseLeave}
        onNavigate={onNavigate}
      />
      <Main open={open}>
        {children}
      </Main>
    </Box>
  );
};

MainLayout.propTypes = {
  children: PropTypes.node.isRequired,
  activeSection: PropTypes.oneOf(['home', 'tags', 'settings']),
  onNavigate: PropTypes.func.isRequired
};


