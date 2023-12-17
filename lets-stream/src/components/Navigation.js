// src/components/Navigation.js
import React from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

const Navigation = () => {
  return (
    <AppBar position="static">
      <Toolbar className="justify-between">
        <div className="flex items-center">
          <ul className="flex">
            <li className="mr-4">
              <Link to="/" className="text-white">
                Home
              </Link>
            </li>
            <li className="mr-4">
              <Link to="/about" className="text-white">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/support" className="text-white">
                Support
              </Link>
            </li>
          </ul>
          <Typography variant="h6" component={Link} to="/" sx={{ textDecoration: 'none', color: 'inherit' }}>
            Lets Stream
          </Typography>
        </div>
        <ThemeToggle />
      </Toolbar>
    </AppBar>
  );
};

export default Navigation;
