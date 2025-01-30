
import { AppBar, Box } from '@mui/material';
import logo from '../assets/Mono=False.png';

export const Header = () => {  
    return (
    <AppBar position="static"> 
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
        sx={{ height: 50, width: 'auto' }}
    />
    </Box>
    </AppBar>
  );
};


