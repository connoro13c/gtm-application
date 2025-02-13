import { Box } from '@mui/material';
import { useCallback } from 'react';
import PropTypes from 'prop-types';
import { colors } from '../../theme/colors';
import { DRAWER_WIDTH, NAV_ITEMS } from './constants';
import { Logo } from './Logo';
import { NavItem } from './NavItem';
import { SideDrawerErrorBoundary } from './ErrorBoundary';

/**
 * SideDrawer component that provides a responsive navigation drawer with hover activation.
 * 
 * Features:
 * - Hover-activated expansion
 * - Active section highlighting
 * - Animated transitions
 * - Custom branding area
 * - Error boundary protection
 * - Accessibility support
 * - Loading states
 * 
 * @component
 */
export const SideDrawer = ({ 
  open, 
  activeSection, 
  onOpenChange, 
  onMouseLeave,
  onNavigate
}) => {
  const handleIconHover = useCallback(() => {
    onOpenChange(true);
  }, [onOpenChange]);

  const handleLogoClick = useCallback(() => {
    onNavigate('/');
  }, [onNavigate]);

  const handleNavItemClick = useCallback((id) => {
    onNavigate(id);
  }, [onNavigate]);

  return (
    <SideDrawerErrorBoundary>
      <Box 
        role="navigation"
        aria-label="Main Navigation"
        onMouseLeave={onMouseLeave}
        sx={{ 
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          width: open ? DRAWER_WIDTH : '64px',
          backgroundColor: colors.background.default,
          transition: theme => theme.transitions.create('width', {
            easing: theme.transitions.easing.easeInOut,
            duration: theme.transitions.duration.standard,
          }),
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          zIndex: 2,
          borderRight: `1px solid ${colors.border.drawer}`
        }}
      >
        <Logo isOpen={open} onLogoClick={handleLogoClick} />

        <Box 
          component="nav"
          role="menu"
          sx={{ 
            flex: 1,
            overflowY: 'auto',
            overflowX: 'hidden',
            mt: 3,
            '&::-webkit-scrollbar': {
              width: '4px',
            },
            '&::-webkit-scrollbar-track': {
              background: 'transparent',
            },
            '&::-webkit-scrollbar-thumb': {
              background: colors.border.drawer,
              borderRadius: '4px',
              '&:hover': {
                background: colors.text.secondary,
              },
            },
          }}
        >
          {NAV_ITEMS.map(({ id, icon, label, subItems }) => (
            <NavItem
              key={id}
              icon={icon}
              label={label}
              isActive={activeSection}
              isOpen={open}
              onMouseEnter={handleIconHover}
              onClick={handleNavItemClick}
              subItems={subItems}
              route={id}
            />
          ))}
        </Box>
      </Box>
    </SideDrawerErrorBoundary>
  );
};

SideDrawer.propTypes = {
  open: PropTypes.bool.isRequired,
  activeSection: PropTypes.string.isRequired,
  onOpenChange: PropTypes.func.isRequired,
  onMouseLeave: PropTypes.func.isRequired,
  onNavigate: PropTypes.func.isRequired
}; 