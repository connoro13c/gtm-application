import { Box, IconButton, ListItemText } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import SettingsIcon from '@mui/icons-material/Settings';
import TagIcon from '@mui/icons-material/Tag';
import { useCallback } from 'react';
import PropTypes from 'prop-types';
import themeDarkSpark from '../assets/ThemeDarkSpark.png';
import wordmarkDark from '../assets/WordmarkDark.png';

const DRAWER_WIDTH = 250;

// Common styles for navigation items
const navItemStyles = {
  position: 'relative',
  height: '40px',
  transition: theme => theme.transitions.create('width', {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.standard,
  }),
  '&:hover': {
    backgroundColor: '#2a2a2a',
    borderRadius: '6px',
  }
};

const iconContainerStyles = {
  position: 'absolute',
  left: 0,
  top: 0,
  bottom: 0,
  width: '64px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
};

const textContainerStyles = {
  position: 'absolute',
  left: '64px',
  top: 0,
  bottom: 0,
  display: 'flex',
  alignItems: 'center',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  transition: theme => theme.transitions.create('width', {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.standard,
  })
};

/**
 * NavItem component for rendering individual navigation items
 */
const NavItem = ({ icon: Icon, label, isActive, isOpen, onMouseEnter }) => (
  <Box
    onMouseEnter={onMouseEnter}
    sx={{
      ...navItemStyles,
      width: isOpen ? DRAWER_WIDTH : '64px',
      '&::before': isActive ? {
        content: '""',
        position: 'absolute',
        left: 0,
        top: '4px',
        bottom: '4px',
        width: '4px',
        backgroundColor: '#2927C0',
        borderTopRightRadius: '4px',
        borderBottomRightRadius: '4px'
      } : {}
    }}
  >
    <Box sx={iconContainerStyles}>
      <IconButton sx={{ color: 'white', padding: '8px' }}>
        <Icon />
      </IconButton>
    </Box>
    <Box sx={{
      ...textContainerStyles,
      width: isOpen ? `${DRAWER_WIDTH - 64}px` : 0,
    }}>
      <ListItemText primary={label} sx={{ margin: 0, pl: 2 }} />
    </Box>
  </Box>
);

NavItem.propTypes = {
  icon: PropTypes.elementType.isRequired,
  label: PropTypes.string.isRequired,
  isActive: PropTypes.bool.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onMouseEnter: PropTypes.func.isRequired
};

// Navigation items configuration
const NAV_ITEMS = [
  { id: 'home', icon: HomeIcon, label: 'Home' },
  { id: 'tags', icon: TagIcon, label: 'Tags' },
  { id: 'settings', icon: SettingsIcon, label: 'Settings' }
];

/**
 * SideDrawer component that provides a responsive navigation drawer with hover activation.
 * 
 * Features:
 * - Hover-activated expansion
 * - Active section highlighting
 * - Animated transitions
 * - Custom branding area
 * 
 * @component
 */
export const SideDrawer = ({ 
  open, 
  activeSection, 
  onOpenChange, 
  onMouseLeave 
}) => {
  const handleIconHover = useCallback(() => {
    onOpenChange(true);
  }, [onOpenChange]);

  return (
    <Box 
      onMouseLeave={onMouseLeave}
      sx={{ position: 'fixed', left: 0, top: 0, bottom: 0, zIndex: 1 }}
    >
      <Box sx={{ display: 'flex', height: '100%' }}>
        {/* Static left sidebar with icons */}
        <Box sx={{
          width: '64px',
          height: '100%',
          backgroundColor: '#1a1a1a',
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Logo Item */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              position: 'relative',
              marginTop: '12px',
              minHeight: '40px'
            }}
          >
            <Box sx={{ 
              minWidth: '64px', 
              display: 'flex', 
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <Box
                component="img"
                src={themeDarkSpark}
                alt="Theme Dark Spark"
                onClick={() => onOpenChange(true)}
                sx={{
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
            </Box>
            <Box sx={{ 
              position: 'absolute',
              left: '64px',
              height: '40px',
              backgroundColor: '#343434',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              width: open ? `${DRAWER_WIDTH - 76}px` : 0,
              overflow: 'hidden',
              transition: theme => theme.transitions.create('width', {
                easing: theme.transitions.easing.easeInOut,
                duration: theme.transitions.duration.standard,
              })
            }}>
              <Box
                component="img"
                src={wordmarkDark}
                alt="Sourcegraph"
                sx={{
                  height: '24px',
                  width: 'auto',
                  objectFit: 'contain',
                  marginLeft: '8px',
                  marginRight: '8px'
                }}
              />
            </Box>
          </Box>

          {/* Navigation Items */}
          <Box sx={{ paddingTop: '24px', flex: 1 }}>
            {NAV_ITEMS.map(({ id, icon, label }) => (
              <NavItem
                key={id}
                icon={icon}
                label={label}
                isActive={activeSection === id}
                isOpen={open}
                onMouseEnter={handleIconHover}
              />
            ))}
          </Box>
        </Box>

        {/* Animated drawer portion */}
        <Box
          sx={{
            width: open ? `${DRAWER_WIDTH - 64}px` : 0,
            backgroundColor: '#1a1a1a',
            borderRight: open ? '1px solid rgba(255, 255, 255, 0.12)' : 'none',
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
  );
};

SideDrawer.propTypes = {
  open: PropTypes.bool.isRequired,
  activeSection: PropTypes.oneOf(['home', 'tags', 'settings']),
  onOpenChange: PropTypes.func.isRequired,
  onMouseLeave: PropTypes.func.isRequired
};

export { DRAWER_WIDTH }; 