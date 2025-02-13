import { IconButton, Tooltip } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PropTypes from 'prop-types';
import { colors } from '../theme/colors';

export const BackButton = ({ onBack }) => {
  return (
    <Tooltip title="Back">
      <IconButton 
        onClick={onBack}
        sx={{ 
          position: 'absolute',
          left: 24,
          top: 24,
          backgroundColor: colors.background.paper,
          '&:hover': {
            backgroundColor: colors.background.hover
          }
        }}
      >
        <ArrowBackIcon />
      </IconButton>
    </Tooltip>
  );
};

BackButton.propTypes = {
  onBack: PropTypes.func.isRequired
}; 