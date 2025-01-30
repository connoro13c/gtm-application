import { Box, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from 'react';
import { SideDrawer } from '@components/SideDrawer';
import PropTypes from 'prop-types';

const DRAWER_WIDTH = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${DRAWER_WIDTH}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  }),
);

export const MainLayout = ({ children }) => {
  const [open, setOpen] = useState(true);

  return (
    <Box sx={{ display: 'flex' }}>
      <SideDrawer open={open} onClose={() => setOpen(false)} />
      
      {!open && (
        <IconButton
          sx={{
            position: 'fixed',
            left: 16,
            top: 16,
            backgroundColor: '#1a1a1a',
            color: 'white',
            '&:hover': {
              backgroundColor: '#2a2a2a',
            }
          }}
          onClick={() => setOpen(true)}
        >
          <MenuIcon />
        </IconButton>
      )}
      
      <Main open={open}>
        {children}
      </Main>
    </Box>
  );
};

MainLayout.propTypes = {
  children: PropTypes.node.isRequired,
};