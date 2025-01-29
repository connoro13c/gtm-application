import { useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Drawer, IconButton, styled, ThemeProvider, createTheme } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import Logo from '../assets/Mono=False.png'

const DRAWER_WIDTH = 240;

const theme = createTheme();

const Main = styled('main')(({ theme, open }) => ({
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
}));

MainLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

const LogoContainer = styled('div')(({ theme, open }) => ({
  position: 'fixed',
  top: 16,
  left: open ? DRAWER_WIDTH + 16 : 16,
  transition: theme.transitions.create(['left'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  zIndex: 1100,
}));

export default function MainLayout({ children }) {
  const [open, setOpen] = useState(true);

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex' }}>
        <LogoContainer open={open}>
          <img 
            src={Logo} 
            alt="Company Logo"
            style={{
              height: '40px',
              width: 'auto'
            }}
          />
        </LogoContainer>

        <Drawer
          sx={{
            width: DRAWER_WIDTH,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: DRAWER_WIDTH,
              boxSizing: 'border-box',
            },
          }}
          variant="persistent"
          anchor="left"
          open={open}
        >
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            width: '100%' 
          }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'flex-end', 
              p: 1 
            }}>
              <IconButton onClick={() => setOpen(false)}>
                <ChevronLeftIcon />
              </IconButton>
            </Box>
          </Box>
          {/* Add your navigation items here */}
        </Drawer>
        
        {!open && (
          <IconButton
            sx={{ position: 'fixed', left: 16, top: 16 }}
            onClick={() => setOpen(true)}
          >
            <MenuIcon />
          </IconButton>
        )}
        
        <Main open={open}>
          {children}
        </Main>
      </Box>
    </ThemeProvider>
  );
}