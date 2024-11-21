// src/components/Navbar.js
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDarkMode } from '../components/DarkModeContext';

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
    <nav className={`flex items-center justify-between p-4 shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="flex items-center justify-between w-full max-w-6xl mx-auto">
        <Link to="/" className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-blue-600'}`}>LetsStream</Link>
        <div className={`flex space-x-4 ${isMenuOpen ? 'block' : 'hidden'} md:flex`}>
          <Link to="/" className={`text-gray-700 hover:text-blue-600 ${location.pathname === '/' ? 'font-semibold' : ''}`}>Discover</Link>
          <Link to="/about" className={`text-gray-700 hover:text-blue-600 ${location.pathname === '/about' ? 'font-semibold' : ''}`}>About Us</Link>
          <Link to="/support" className={`text-gray-700 hover:text-blue-600 ${location.pathname === '/support' ? 'font-semibold' : ''}`}>Support</Link>
        </div>
        <button className={`text-xl ${isDarkMode ? 'text-white' : 'text-gray-800'}`} onClick={toggleDarkMode}>
          {isDarkMode ? '🌙' : '☀️'} {/* Changed icons for better representation */}
        </button>
        <button className={`text-xl ml-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`} onClick={handleSearchClick}>🔍</button>
        <div className="md:hidden cursor-pointer" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <div className={`h-1 w-6 ${isDarkMode ? 'bg-white' : 'bg-gray-800'} mb-1 ${isMenuOpen ? 'rotate-45' : ''}`}></div>
          <div className={`h-1 w-6 ${isDarkMode ? 'bg-white' : 'bg-gray-800'} mb-1 ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`}></div>
          <div className={`h-1 w-6 ${isDarkMode ? 'bg-white' : 'bg-gray-800'} ${isMenuOpen ? '-rotate-45' : ''}`}></div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;