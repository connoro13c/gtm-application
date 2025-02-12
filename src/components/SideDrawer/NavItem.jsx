import { Box, IconButton, ListItemText } from '@mui/material';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { memo } from 'react';
import { colors } from '../../theme/colors';
import { DRAWER_WIDTH } from './constants';

const MotionBox = motion(Box);

const navItemStyles = {
  position: 'relative',
  height: '40px',
  transition: theme => theme.transitions.create(['width', 'background-color'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.standard,
  }),
  '&:hover': {
    backgroundColor: colors.background.hover,
  },
  borderRadius: '6px',
  margin: '0 8px',
  width: props => props.isOpen ? `${DRAWER_WIDTH - 16}px` : '48px', // Account for margins
};

const iconContainerStyles = {
  position: 'absolute',
  left: 0,
  top: 0,
  bottom: 0,
  width: '48px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
};

const textContainerStyles = {
  position: 'absolute',
  left: '48px',
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

const activeIndicatorVariants = {
  inactive: { 
    scaleY: 0,
    opacity: 0 
  },
  active: { 
    scaleY: 1,
    opacity: 1,
    transition: { 
      type: "spring",
      stiffness: 300,
      damping: 30
    }
  }
};

/**
 * NavItem component for rendering individual navigation items
 * with animations and accessibility features
 */
export const NavItem = memo(({ 
  icon: Icon, 
  label, 
  isActive, 
  isOpen, 
  onMouseEnter,
  onClick 
}) => {
  return (
    <Box
      component="button"
      role="menuitem"
      aria-label={label}
      aria-current={isActive ? 'page' : undefined}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick();
        }
      }}
      tabIndex={0}
      sx={{
        ...navItemStyles,
        isOpen,
        border: 'none',
        padding: 0,
        cursor: 'pointer',
        color: 'inherit',
        backgroundColor: isActive ? `${colors.primary.main}20` : 'transparent',
        '&:focus-visible': {
          outline: `2px solid ${colors.primary.main}`,
          outlineOffset: -2,
        },
        '&:hover': {
          backgroundColor: isActive ? `${colors.primary.main}30` : colors.background.hover,
        }
      }}
    >
      <MotionBox
        initial="inactive"
        animate={isActive ? "active" : "inactive"}
        variants={activeIndicatorVariants}
        sx={{
          position: 'absolute',
          left: 0,
          top: '4px',
          bottom: '4px',
          width: '4px',
          backgroundColor: colors.primary.main,
          borderTopRightRadius: '4px',
          borderBottomRightRadius: '4px',
          transformOrigin: 'left'
        }}
      />
      
      <Box sx={iconContainerStyles}>
        <IconButton 
          sx={{ 
            color: isActive ? colors.primary.main : colors.text.primary,
            padding: '8px',
            pointerEvents: 'none',
            '&:hover': {
              backgroundColor: 'transparent'
            }
          }}
          tabIndex={-1}
        >
          <Icon />
        </IconButton>
      </Box>
      
      <Box sx={{
        ...textContainerStyles,
        width: isOpen ? `${DRAWER_WIDTH - 64}px` : 0,
      }}>
        <ListItemText 
          primary={label} 
          sx={{ 
            margin: 0, 
            pl: 2,
            '.MuiTypography-root': {
              color: isActive ? colors.primary.main : colors.text.primary,
              fontWeight: isActive ? 500 : 400
            }
          }} 
        />
      </Box>
    </Box>
  );
});

NavItem.displayName = 'NavItem';

NavItem.propTypes = {
  icon: PropTypes.elementType.isRequired,
  label: PropTypes.string.isRequired,
  isActive: PropTypes.bool.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onMouseEnter: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired
}; 