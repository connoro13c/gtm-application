import { Box, IconButton, ListItemText, Collapse } from '@mui/material';
import PropTypes from 'prop-types';
import { memo, useState } from 'react';
import { colors } from '../../theme/colors';
import { DRAWER_WIDTH } from './constants';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

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
  backgroundColor: 'transparent',
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer'
};

const iconContainerStyles = {
  width: '48px',
  height: '40px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexShrink: 0
};

const SubNavItem = memo(({ 
  icon: Icon, 
  label, 
  isActive, 
  isOpen, 
  onClick 
}) => {
  return (
    <Box
      component="button"
      role="menuitem"
      aria-label={label}
      aria-current={isActive ? 'page' : undefined}
      onClick={onClick}
      tabIndex={0}
      sx={{
        ...navItemStyles,
        width: isOpen ? `${DRAWER_WIDTH - 32}px` : '48px',
        ml: isOpen ? 3 : 1,
        height: '36px',
        border: isActive ? `1px solid rgba(255, 255, 255, 0.1)` : 'none',
        padding: 0,
        cursor: 'pointer',
        backgroundColor: isActive ? 'rgba(255, 255, 255, 0.03)' : 'transparent',
        '&:hover': {
          backgroundColor: isActive ? 'rgba(255, 255, 255, 0.06)' : colors.background.hover,
        },
        '&:focus-visible': {
          outline: `1px solid rgba(255, 255, 255, 0.3)`,
          outlineOffset: -1,
        }
      }}
    >
      <Box sx={{ ...iconContainerStyles, width: '36px' }}>
        <IconButton 
          sx={{ 
            color: isActive ? colors.brand.red : colors.text.primary,
            padding: '6px',
            pointerEvents: 'none'
          }}
          tabIndex={-1}
        >
          <Icon fontSize="small" />
        </IconButton>
      </Box>
      
      {isOpen && (
        <ListItemText 
          primary={label} 
          sx={{ 
            margin: 0,
            ml: 1,
            flex: 1,
            '.MuiTypography-root': {
              color: isActive ? colors.brand.red : colors.text.primary,
              fontWeight: isActive ? 500 : 400,
              textAlign: 'left',
              fontSize: '0.875rem'
            }
          }} 
        />
      )}
    </Box>
  );
});

SubNavItem.displayName = 'SubNavItem';

SubNavItem.propTypes = {
  icon: PropTypes.elementType.isRequired,
  label: PropTypes.string.isRequired,
  isActive: PropTypes.bool.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired
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
  onClick,
  subItems,
  route
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasSubItems = Array.isArray(subItems) && subItems.length > 0;
  const isActiveParent = hasSubItems && subItems.some(item => item.id === isActive);

  const handleClick = () => {
    if (hasSubItems) {
      setIsExpanded(!isExpanded);
      onClick(route);
    } else {
      onClick(route);
    }
  };

  return (
    <>
      <Box
        component="button"
        role="menuitem"
        aria-label={label}
        aria-current={isActive ? 'page' : undefined}
        onClick={handleClick}
        onMouseEnter={onMouseEnter}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleClick();
          }
        }}
        tabIndex={0}
        sx={{
          ...navItemStyles,
          width: isOpen ? `${DRAWER_WIDTH - 16}px` : '48px',
          border: (isActive || isActiveParent) ? `1px solid rgba(255, 255, 255, 0.1)` : 'none',
          padding: 0,
          backgroundColor: (isActive || isActiveParent) ? 'rgba(255, 255, 255, 0.03)' : 'transparent',
          '&:hover': {
            backgroundColor: (isActive || isActiveParent) ? 'rgba(255, 255, 255, 0.06)' : colors.background.hover,
          },
          '&:focus-visible': {
            outline: `1px solid rgba(255, 255, 255, 0.3)`,
            outlineOffset: -1,
          }
        }}
      >
        <Box sx={{ width: '48px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <IconButton 
            sx={{ 
              color: (isActive || isActiveParent) ? colors.brand.red : colors.text.primary,
              padding: '8px',
              pointerEvents: 'none'
            }}
            tabIndex={-1}
          >
            <Icon />
          </IconButton>
        </Box>
        
        {isOpen && (
          <>
            <ListItemText 
              primary={label} 
              sx={{ 
                margin: 0,
                ml: 1,
                flex: 1,
                '.MuiTypography-root': {
                  color: (isActive || isActiveParent) ? colors.brand.red : colors.text.primary,
                  fontWeight: (isActive || isActiveParent) ? 500 : 400,
                  textAlign: 'left'
                }
              }} 
            />
            {hasSubItems && (
              <IconButton 
                sx={{ 
                  color: colors.text.primary,
                  padding: '4px',
                  mr: 1,
                  transform: isExpanded ? 'rotate(90deg)' : 'none',
                  transition: 'transform 0.3s ease'
                }}
                tabIndex={-1}
              >
                <ChevronRightIcon />
              </IconButton>
            )}
          </>
        )}
      </Box>

      {hasSubItems && isOpen && (
        <Collapse in={isExpanded} timeout="auto" unmountOnExit>
          <Box sx={{ py: 1 }}>
            {subItems.map((item) => (
              <Box
                key={item.id}
                component="button"
                role="menuitem"
                aria-label={item.label}
                aria-current={isActive === item.id ? 'page' : undefined}
                onClick={() => onClick(item.id)}
                tabIndex={0}
                sx={{
                  ...navItemStyles,
                  width: `${DRAWER_WIDTH - 32}px`,
                  ml: 3,
                  height: '36px',
                  border: isActive === item.id ? `1px solid rgba(255, 255, 255, 0.1)` : 'none',
                  padding: 0,
                  backgroundColor: isActive === item.id ? 'rgba(255, 255, 255, 0.03)' : 'transparent',
                  '&:hover': {
                    backgroundColor: isActive === item.id ? 'rgba(255, 255, 255, 0.06)' : colors.background.hover,
                  },
                  '&:focus-visible': {
                    outline: `1px solid rgba(255, 255, 255, 0.3)`,
                    outlineOffset: -1,
                  }
                }}
              >
                <Box sx={{ width: '36px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <IconButton 
                    sx={{ 
                      color: isActive === item.id ? colors.brand.red : colors.text.primary,
                      padding: '6px',
                      pointerEvents: 'none'
                    }}
                    tabIndex={-1}
                  >
                    <item.icon fontSize="small" />
                  </IconButton>
                </Box>
                
                <ListItemText 
                  primary={item.label} 
                  sx={{ 
                    margin: 0,
                    ml: 1,
                    flex: 1,
                    '.MuiTypography-root': {
                      color: isActive === item.id ? colors.brand.red : colors.text.primary,
                      fontWeight: isActive === item.id ? 500 : 400,
                      textAlign: 'left',
                      fontSize: '0.875rem'
                    }
                  }} 
                />
              </Box>
            ))}
          </Box>
        </Collapse>
      )}
    </>
  );
});

NavItem.displayName = 'NavItem';

NavItem.propTypes = {
  icon: PropTypes.elementType.isRequired,
  label: PropTypes.string.isRequired,
  isActive: PropTypes.bool.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onMouseEnter: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
  route: PropTypes.string,
  subItems: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    icon: PropTypes.elementType.isRequired,
    label: PropTypes.string.isRequired
  }))
}; 