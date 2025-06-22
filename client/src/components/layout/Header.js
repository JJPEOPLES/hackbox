import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  Terminal as TerminalIcon,
  Info as InfoIcon,
  Menu as MenuIcon,
  Computer as ComputerIcon
} from '@mui/icons-material';

const Header = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <TerminalIcon sx={{ mr: 2 }} />
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{
            textDecoration: 'none',
            color: 'inherit',
            flexGrow: 1,
            fontWeight: 'bold'
          }}
        >
          HackBox
        </Typography>

        {isMobile ? (
          <Box>
            <IconButton
              size="large"
              edge="end"
              color="inherit"
              aria-label="menu"
              onClick={handleMenu}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem 
                component={RouterLink} 
                to="/"
                onClick={handleClose}
              >
                Dashboard
              </MenuItem>
              <MenuItem 
                component={RouterLink} 
                to="/terminal"
                onClick={handleClose}
              >
                Terminal
              </MenuItem>
              <MenuItem 
                component={RouterLink} 
                to="/gui"
                onClick={handleClose}
              >
                GUI Access
              </MenuItem>
              <MenuItem 
                component={RouterLink} 
                to="/about"
                onClick={handleClose}
              >
                About
              </MenuItem>
            </Menu>
          </Box>
        ) : (
          <Box sx={{ display: 'flex' }}>
            <Button 
              color="inherit" 
              component={RouterLink} 
              to="/"
            >
              Dashboard
            </Button>
            <Button 
              color="inherit" 
              component={RouterLink} 
              to="/terminal"
              startIcon={<TerminalIcon />}
            >
              Terminal
            </Button>
            <Button 
              color="inherit" 
              component={RouterLink} 
              to="/gui"
              startIcon={<ComputerIcon />}
            >
              GUI Access
            </Button>
            <Button 
              color="inherit" 
              component={RouterLink} 
              to="/about"
              startIcon={<InfoIcon />}
            >
              About
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;