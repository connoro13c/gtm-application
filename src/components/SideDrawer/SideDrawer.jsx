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
    onOpenChange(true);
  }, [onOpenChange]);

  return (
    <SideDrawerErrorBoundary>
      <Box 
        role="navigation"
        aria-label="Main Navigation"
        onMouseLeave={onMouseLeave}
        sx={{ position: 'fixed', left: 0, top: 0, bottom: 0, zIndex: 1 }}
      >
        <Box sx={{ display: 'flex', height: '100%' }}>
          {/* Static left sidebar with icons */}
          <Box sx={{
            width: '64px',
            height: '100%',
            backgroundColor: colors.background.default,
            position: 'relative',
            zIndex: 2,
            display: 'flex',
            flexDirection: 'column'
          }}>
            <Logo isOpen={open} onLogoClick={handleLogoClick} />

            {/* Navigation Items */}
            <Box 
              component="nav"
              role="menu"
              sx={{ paddingTop: '24px', flex: 1 }}
            >
              {NAV_ITEMS.map(({ id, icon, label }) => (
                <NavItem
                  key={id}
                  icon={icon}
                  label={label}
                  isActive={activeSection === id}
                  isOpen={open}
                  onMouseEnter={handleIconHover}
                  onClick={() => onNavigate(id)}
                />
              ))}
            </Box>
          </Box>

          {/* Animated drawer portion */}
          <Box
            sx={{
              width: open ? `${DRAWER_WIDTH - 64}px` : 0,
              backgroundColor: colors.background.default,
              borderRight: open ? `1px solid ${colors.border.drawer}` : 'none',
              transition: theme => theme.transitions.create(['width'], {
                easing: theme.transitions.easing.easeInOut,
                duration: theme.transitions.duration.standard,
              }),
              overflow: 'hidden',
              zIndex: 1
            }}
          />
        </Box>
      </Box>
    </SideDrawerErrorBoundary>
  );
};

SideDrawer.propTypes = {
  open: PropTypes.bool.isRequired,
  activeSection: PropTypes.oneOf(NAV_ITEMS.map(item => item.id)),
  onOpenChange: PropTypes.func.isRequired,
  onMouseLeave: PropTypes.func.isRequired,
  onNavigate: PropTypes.func.isRequired
}; 