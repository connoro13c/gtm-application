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
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import PropTypes from 'prop-types';
import { SideDrawer, DRAWER_WIDTH } from '../components/SideDrawer';
import { PageHeader } from '../components/PageHeader';
import { NAV_ITEMS } from '../components/SideDrawer/constants';
import { colors } from '../theme/colors';

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    paddingTop: '88px', // Account for header height (64px) + spacing
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeInOut,
      duration: theme.transitions.duration.standard,
    }),
    marginLeft: '64px',
    ...(open && {
      marginLeft: `${DRAWER_WIDTH}px`,
    }),
  }),
);

export const MainLayout = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  // If we're at the root path (/), set activeSection to '/'
  const activeSection = location.pathname === '/' ? '/' : location.pathname.slice(1);

  const handleDrawerMouseLeave = useCallback(() => {
    setOpen(false);
  }, []);

  const handleNavigate = useCallback((section) => {
    navigate(section); // No need to modify the path, just navigate directly
  }, [navigate]);

  const handleLogoClick = useCallback(() => {
    navigate('home');
  }, [navigate]);

  const getPageTitle = () => {
    if (activeSection === '/') return 'Home';
    
    const [section, subSection] = activeSection.split('/');
    const parentItem = NAV_ITEMS.find(item => item.id === section);
    
    if (!parentItem) return 'Home';
    
    if (subSection && parentItem.subItems) {
      const subItem = parentItem.subItems.find(item => item.id === `${section}/${subSection}`);
      return subItem ? subItem.label : parentItem.label;
    }
    
    return parentItem.label;
  };

  return (
    <Box sx={{ 
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: colors.background.default,
    }}>
      <SideDrawer
        open={open}
        activeSection={activeSection}
        onOpenChange={setOpen}
        onMouseLeave={handleDrawerMouseLeave}
        onNavigate={handleNavigate}
        onLogoClick={handleLogoClick}
      />
      <PageHeader title={getPageTitle()} />
      <Main open={open}>
        <Outlet />
      </Main>
    </Box>
  );
};

MainLayout.propTypes = {
  children: PropTypes.node,
  activeSection: PropTypes.string,
  onNavigate: PropTypes.func
};


