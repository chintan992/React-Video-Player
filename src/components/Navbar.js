// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useDarkMode } from './DarkModeContext';
import './Navbar.css';

const Navbar = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <nav className={isDarkMode ? 'dark-mode' : 'light-mode'}>
      <div className="logo">LetsStream</div>
      <div className={`nav-links ${isDarkMode ? 'dark-text' : 'light-text'}`}>
        <Link to="/">Home</Link>
        <Link to="/about">About Us</Link>
        <Link to="/support">Support</Link>
      </div>
      <div className="dark-mode-toggle" onClick={toggleDarkMode}>
        {isDarkMode ? 'Light Mode' : 'Dark Mode'}
      </div>
    </nav>
  );
};

export default Navbar;
