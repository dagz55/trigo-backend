// src/components/Navbar.js
import React from 'react';
import { AppBar, Toolbar, Button, Typography } from '@mui/material';
import { useHistory } from 'react-router-dom';

const Navbar = () => {
  const history = useHistory();

  const goHome = () => {
    history.push('/');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          My Microservices App
        </Typography>
        <Button color="inherit" onClick={goHome}>Home</Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
