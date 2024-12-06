import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDarkMode } from './DarkModeContext';
import { logout } from '../firebase/auth';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { currentUser } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const handleSearchClick = () => {
    navigate('/search');
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-200 ${
      isDarkMode ? 'bg-dark-bg border-dark-border' : 'bg-white border-gray-200' } border-b`}>
      <div className="max-w-7xl mx-auto px-4 py-2 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 flex-wrap sm:flex-nowrap"> 
          {/* Logo */}
          <Link 
            to="/" 
            className={`text-2xl font-bold transition-colors duration-200 ${
              isDarkMode ? 'text-white hover:text-primary-400' : 'text-primary-600 hover:text-primary-700'
            }`}
          >
            LetsStream
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-6 lg:space-x-8">
            <Link
              to="/" 
              className={`transition-colors duration-200 ${
                isDarkMode 
                  ? 'text-gray-300 hover:text-white' 
                  : 'text-gray-700 hover:text-primary-600'
              } ${location.pathname === '/' ? 'font-semibold' : ''}`}
            >
              Discover
            </Link>
            <Link 
              to="/about" 
              className={`transition-colors duration-200 ${
                isDarkMode 
                  ? 'text-gray-300 hover:text-white' 
                  : 'text-gray-700 hover:text-primary-600'
              } ${location.pathname === '/about' ? 'font-semibold' : ''}`}
            >
              About Us
            </Link>
            <Link 
              to="/support" 
              className={`transition-colors duration-200 ${
                isDarkMode 
                  ? 'text-gray-300 hover:text-white' 
                  : 'text-gray-700 hover:text-primary-600'
              } ${location.pathname === '/support' ? 'font-semibold' : ''}`}
            >
              Support
            </Link>
          </div>

          {/* Right side buttons */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            <button 
              onClick={toggleDarkMode}
              className={`p-2 rounded-full transition-colors duration-200 ${
                isDarkMode 
                  ? 'text-gray-300 hover:text-white hover:bg-gray-800' 
                  : 'text-gray-700 hover:text-primary-600 hover:bg-gray-100'
              }`}
              aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDarkMode ? '🌙' : '☀️'}
            </button>
            
            <button 
              onClick={handleSearchClick}
              className={`p-2 rounded-full transition-colors duration-200 ${
                isDarkMode 
                  ? 'text-gray-300 hover:text-white hover:bg-gray-800' 
                  : 'text-gray-700 hover:text-primary-600 hover:bg-gray-100'
              }`}
              aria-label="Search"
            >
              🔍
            </button>

            {/* Authentication Links */}
            {currentUser ? (
              <div className="flex items-center space-x-3 sm:space-x-4">
<Link to="/profile">
  <img 
    src={`https://avatar.iran.liara.run/username?username=${currentUser?.displayName || 'Default'}`} 
    alt="User Avatar" 
    className="w-10 h-10 rounded-full"
  />
</Link>
                <button 
                  onClick={handleLogout}
                  className={`p-2 rounded-full transition-colors duration-200 ${
                    isDarkMode 
                      ? 'text-gray-300 hover:text-white hover:bg-gray-800' 
                      : 'text-gray-700 hover:text-primary-600 hover:bg-gray-100'
                  }`}
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link 
                  to="/login"
                  className={`p-2 rounded-full transition-colors duration-200 ${
                    isDarkMode 
                      ? 'text-gray-300 hover:text-white' 
                      : 'text-gray-700 hover:text-primary-600'
                  }`}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className={`p-2 rounded-full transition-colors duration-200 ${
                    isDarkMode 
                      ? 'text-gray-300 hover:text-white' 
                      : 'text-gray-700 hover:text-primary-600'
                  }`}
                >
                  Sign Up
                </Link>
              </>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className="md:hidden p-2 rounded-lg transition-colors duration-200 focus:outline-none hover:bg-gray-200"
              aria-label="Toggle menu"
            >
              <div className="relative w-6 h-5">
                <span 
                  className={`absolute w-6 h-0.5 transform transition-all duration-300 ${
                    isDarkMode ? 'bg-white' : 'bg-gray-800'
                  } ${isMenuOpen ? 'rotate-45 top-2' : 'top-0'}`}
                />
                <span 
                  className={`absolute w-6 h-0.5 top-2 ${
                    isDarkMode ? 'bg-white' : 'bg-gray-800'
                  } ${isMenuOpen ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
                />
                <span 
                  className={`absolute w-6 h-0.5 transform transition-all duration-300 ${
                    isDarkMode ? 'bg-white' : 'bg-gray-800'
                  } ${isMenuOpen ? '-rotate-45 top-2' : 'top-4'}`}
                />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div 
          className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
            isMenuOpen 
              ? 'max-h-96 opacity-100' 
              : 'max-h-0 opacity-0 pointer-events-none'
          }`}
        >
          <div className="py-3 space-y-4">
            <Link 
              to="/" 
              className={`block transition-colors duration-200 ${
                isDarkMode 
                  ? 'text-gray-300 hover:text-white' 
                  : 'text-gray-700 hover:text-primary-600'
              } ${location.pathname === '/' ? 'font-semibold' : ''}`}
            >
              Discover
            </Link>
            <Link 
              to="/about" 
              className={`block transition-colors duration-200 ${
                isDarkMode 
                  ? 'text-gray-300 hover:text-white' 
                  : 'text-gray-700 hover:text-primary-600'
              } ${location.pathname === '/about' ? 'font-semibold' : ''}`}
            >
              About Us
            </Link>
            <Link 
              to="/support" 
              className={`block transition-colors duration-200 ${
                isDarkMode 
                  ? 'text-gray-300 hover:text-white' 
                  : 'text-gray-700 hover:text-primary-600'
              } ${location.pathname === '/support' ? 'font-semibold' : ''}`}
            >
              Support
            </Link>
            {currentUser ? (
              <>
                <Link 
                  to="/profile"
                  className={`block transition-colors duration-200 ${
                    isDarkMode 
                      ? 'text-gray-300 hover:text-white' 
                      : 'text-gray-700 hover:text-primary-600'
                  }`}
                >
                  Profile
                </Link>
                <button 
                  onClick={handleLogout}
                  className={`block w-full text-left transition-colors duration-200 ${
                    isDarkMode 
                      ? 'text-gray-300 hover:text-white' 
                      : 'text-gray-700 hover:text-primary-600'
                  }`}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login"
                  className={`block transition-colors duration-200 ${
                    isDarkMode 
                      ? 'text-gray-300 hover:text-white' 
                      : 'text-gray-700 hover:text-primary-600'
                  }`}
                >
                  Login
                </Link>
                <Link 
                  to="/signup"
                  className={`block transition-colors duration-200 ${
                    isDarkMode 
                      ? 'text-gray-300 hover:text-white' 
                      : 'text-gray-700 hover:text-primary-600'
                  }`}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
