// src/components/Navbar.js
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDarkMode } from '../components/DarkModeContext';
import './Navbar.css';

const Navbar = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const handleSearchClick = () => {
    navigate('/search');
  };

  return (
    <nav className={`navbar ${isDarkMode ? 'dark-mode' : ''} ${isMenuOpen ? 'menu-open' : ''}`}>
      <div className="navbar-container">
        <Link to="/" className="logo">LetsStream</Link>
        <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Discover</Link>
          <Link to="/about" className={location.pathname === '/about' ? 'active' : ''}>About Us</Link>
          <Link to="/support" className={location.pathname === '/support' ? 'active' : ''}>Support</Link>
        </div>
        <button className="dark-mode-toggle" onClick={toggleDarkMode}>
          {isDarkMode ? '🕶' : '🕶️'}
        </button>
        <button className="search-button" onClick={handleSearchClick}>🔍</button>
        <div className="auth-button-container">
          <Link to="/login" className="auth-button">Login</Link>
          <Link to="/signup" className="auth-button">Sign Up</Link>
        </div>
        <div className="hamburger" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;