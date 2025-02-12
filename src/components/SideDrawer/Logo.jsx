import { Box, Skeleton } from '@mui/material';
import { useState } from 'react';
import PropTypes from 'prop-types';
import { DRAWER_WIDTH } from './constants';
import { colors } from '../../theme/colors';
import themeDarkSpark from '../../assets/ThemeDarkSpark.png';
import wordmarkDark from '../../assets/WordmarkDark.png';

/**
 * Logo component for the sidebar with loading and error states
 */
export const Logo = ({ isOpen, onLogoClick }) => {
  const [isThemeImageLoaded, setThemeImageLoaded] = useState(false);
  const [isWordmarkLoaded, setWordmarkLoaded] = useState(false);
  const [hasThemeImageError, setThemeImageError] = useState(false);
  const [hasWordmarkError, setWordmarkError] = useState(false);

  return (
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
        {!isThemeImageLoaded && !hasThemeImageError && (
          <Skeleton 
            variant="rounded" 
            width={40} 
            height={40} 
            sx={{ bgcolor: colors.background.paper }}
          />
        )}
        <Box
          component="img"
          src={themeDarkSpark}
          alt="Theme Dark Spark"
          onClick={onLogoClick}
          onLoad={() => setThemeImageLoaded(true)}
          onError={() => setThemeImageError(true)}
          sx={{
            width: '40px',
            height: '40px',
            objectFit: 'contain',
            cursor: 'pointer',
            padding: '8px',
            backgroundColor: colors.background.paper,
            borderRadius: '8px',
            '&:hover': {
              opacity: 0.8
            },
            display: isThemeImageLoaded && !hasThemeImageError ? 'block' : 'none'
          }}
        />
        {hasThemeImageError && (
          <Box
            sx={{
              width: '40px',
              height: '40px',
              backgroundColor: colors.background.paper,
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: colors.text.secondary,
              fontSize: '12px',
              textAlign: 'center',
              padding: '4px'
            }}
          >
            Logo
          </Box>
        )}
      </Box>
      <Box sx={{ 
        position: 'absolute',
        left: '64px',
        height: '40px',
        backgroundColor: colors.background.paper,
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        width: isOpen ? `${DRAWER_WIDTH - 76}px` : 0,
        overflow: 'hidden',
        transition: theme => theme.transitions.create('width', {
          easing: theme.transitions.easing.easeInOut,
          duration: theme.transitions.duration.standard,
        })
      }}>
        {!isWordmarkLoaded && !hasWordmarkError && isOpen && (
          <Skeleton 
            variant="text" 
            width={120} 
            height={24} 
            sx={{ 
              bgcolor: colors.background.hover,
              ml: 1 
            }}
          />
        )}
        <Box
          component="img"
          src={wordmarkDark}
          alt="Sourcegraph"
          onLoad={() => setWordmarkLoaded(true)}
          onError={() => setWordmarkError(true)}
          sx={{
            height: '24px',
            width: 'auto',
            objectFit: 'contain',
            marginLeft: '8px',
            marginRight: '8px',
            display: isWordmarkLoaded && !hasWordmarkError ? 'block' : 'none'
          }}
        />
        {hasWordmarkError && isOpen && (
          <Box
            sx={{
              color: colors.text.secondary,
              ml: 1,
              fontSize: '16px'
            }}
          >
            Sourcegraph
          </Box>
        )}
      </Box>
    </Box>
  );
};

Logo.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onLogoClick: PropTypes.func.isRequired
}; 