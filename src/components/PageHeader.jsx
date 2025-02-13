import { Box, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { colors } from '../theme/colors';

export const PageHeader = ({ title }) => {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: '64px', // Aligns with the sidebar
        right: 0,
        height: '64px',
        backgroundColor: colors.background.default,
        display: 'flex',
        alignItems: 'center',
        padding: '0 24px',
        zIndex: 0, // Lower z-index so drawer overlays it
        borderBottom: `1px solid ${colors.border.drawer}`,
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)' // Subtle shadow for depth
      }}
    >
      <Typography
        variant="h6"
        sx={{
          color: colors.text.primary, // Light text for dark background
          fontWeight: 500,
          fontSize: '20px'
        }}
      >
        {title}
      </Typography>
    </Box>
  );
};

PageHeader.propTypes = {
  title: PropTypes.string.isRequired
}; 