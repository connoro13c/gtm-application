import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SettingsIcon from '@mui/icons-material/Settings';
import TagIcon from '@mui/icons-material/Tag';
import PropTypes from 'prop-types';
import { Header } from '@components/header';

const DRAWER_WIDTH = 240;

export const SideDrawer = ({ open, activeSection }) => {
  return (
    <Drawer
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          backgroundColor: '#1a1a1a',
          color: '#ffffff',
          borderRight: '1px solid rgba(255, 255, 255, 0.12)',
        },
      }}
      variant="persistent"
      anchor="left"
      open={open}
    >
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        height: '100%'
      }}>
        <Box sx={{
          padding: '0px',
          backgroundColor: '#343434',
          borderRadius: '8px',
          margin: '12px',
        }}>
          <Header size="large" />
        </Box>
        <List>
          <ListItem 
            button
            sx={{
              position: 'relative',
              '&::before': activeSection === 'dashboard' ? {
                content: '""',
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: '4px',
                backgroundColor: '#2927C0',
                borderTopRightRadius: '4px',
                borderBottomRightRadius: '4px'
              } : {}
            }}
          >
            <ListItemIcon sx={{ color: 'white' }}>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>
          <ListItem 
            button
            sx={{
              position: 'relative',
              '&::before': activeSection === 'tags' ? {
                content: '""',
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: '4px',
                backgroundColor: '#2927C0',
                borderTopRightRadius: '4px',
                borderBottomRightRadius: '4px'
              } : {}
            }}
          >
            <ListItemIcon sx={{ color: 'white' }}>
              <TagIcon />
            </ListItemIcon>
            <ListItemText primary="Tags" />
          </ListItem>
          <ListItem 
            button
            sx={{
              position: 'relative',
              '&::before': activeSection === 'settings' ? {
                content: '""',
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: '4px',
                backgroundColor: '#2927C0',
                borderTopRightRadius: '4px',
                borderBottomRightRadius: '4px'
              } : {}
            }}
          >
            <ListItemIcon sx={{ color: 'white' }}>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Settings" />
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
};

SideDrawer.propTypes = {
  open: PropTypes.bool.isRequired,
  activeSection: PropTypes.string
};