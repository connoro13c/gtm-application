import { Box, IconButton } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import logo from '../assets/Mono=False.png';
import PropTypes from 'prop-types';

export const Header = ({ onClose, showCloseButton = false, size = 'default' }) => {  
  return (
    <Box 
      display="flex" 
      justifyContent="space-between" 
      alignItems="center" 
      width="100%"
      p={2}
    >
      <Box 
        component="img"
        src={logo} 
        alt="Logo" 
        sx={{ 
          width: size === 'large' ? '200px' : '140px',
          height: size === 'large' ? '40px' : 'auto', // Fixed height for large size
          maxWidth: '100%',
          objectFit: 'contain'
        }}
      />
      {showCloseButton && (
        <IconButton onClick={onClose} sx={{ color: 'white' }}>
          <ChevronLeftIcon />
        </IconButton>
      )}
    </Box>
  );
};

Header.propTypes = {
  onClose: PropTypes.func,
  showCloseButton: PropTypes.bool,
  size: PropTypes.oneOf(['default', 'large']),
};


