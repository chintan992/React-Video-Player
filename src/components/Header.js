// src/components/Header.js
import React from 'react';
import './Header.css'; // Import the CSS file for styling

const Header = () => {
  return (
    <header>
      <div className="logo-container">
        <img src="/favicon.ico" alt="Favicon" className="favicon" />
        <h1>Lets Stream</h1>
      </div>
    </header>
  );
};

export default Header;
