import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDarkMode } from './DarkModeContext';
import { logout } from '../firebase/auth';
import { useAuth } from '../context/AuthContext';
import { useSearch } from '../context/SearchContext';
import { FiSun, FiMoon, FiSearch, FiBell, FiMenu, FiX, FiUser, FiLogOut, FiSettings } from 'react-icons/fi';

const Navbar = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { currentUser } = useAuth();
  const { setQuery } = useSearch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setIsMenuOpen(false);
    setIsProfileOpen(false);
    setIsSearchOpen(false);
  }, [location]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === '/' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsSearchOpen(true);
      } else if (e.key === 'Escape') {
        setIsSearchOpen(false);
        setIsProfileOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setQuery(searchQuery.trim());
      navigate('/search');
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md transition-all duration-200 ${
        isDarkMode 
          ? 'bg-dark-bg/90 border-dark-border' 
          : 'bg-white/90 border-gray-200'
        } border-b`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link 
              to="/" 
              className={`text-2xl font-bold transition-all duration-200 hover:scale-105 ${
                isDarkMode ? 'text-white hover:text-primary-400' : 'text-primary-600 hover:text-primary-700'
              }`}
            >
              LetsStream
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex md:items-center md:space-x-8">
              {['Discover', 'About', 'Support'].map((item) => (
                <Link
                  key={item}
                  to={item === 'Discover' ? '/' : `/${item.toLowerCase()}`}
                  className={`relative py-2 transition-colors duration-200 group ${
                    isDarkMode 
                      ? 'text-gray-300 hover:text-white' 
                      : 'text-gray-700 hover:text-primary-600'
                  } ${location.pathname === (item === 'Discover' ? '/' : `/${item.toLowerCase()}`) ? 'font-semibold' : ''}`}
                >
                  {item}
                  <span className={`absolute bottom-0 left-0 w-full h-0.5 transform scale-x-0 transition-transform duration-200 ${
                    isDarkMode ? 'bg-primary-400' : 'bg-primary-600'
                  } group-hover:scale-x-100 ${
                    location.pathname === (item === 'Discover' ? '/' : `/${item.toLowerCase()}`) ? 'scale-x-100' : ''
                  }`} />
                </Link>
              ))}
            </div>

            {/* Right side buttons */}
            <div className="flex items-center space-x-4">
              {/* Search Button */}
              <button 
                onClick={() => setIsSearchOpen(true)}
                className={`p-2 rounded-full transition-all duration-200 hover:scale-105 ${
                  isDarkMode 
                    ? 'text-gray-300 hover:text-white hover:bg-gray-800/50' 
                    : 'text-gray-700 hover:text-primary-600 hover:bg-gray-100/50'
                }`}
                aria-label="Search"
              >
                <FiSearch className="w-5 h-5" />
              </button>

              {/* Dark Mode Toggle */}
              <button 
                onClick={toggleDarkMode}
                className={`p-2 rounded-full transition-all duration-200 hover:scale-105 ${
                  isDarkMode 
                    ? 'text-gray-300 hover:text-white hover:bg-gray-800/50' 
                    : 'text-gray-700 hover:text-primary-600 hover:bg-gray-100/50'
                }`}
                aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDarkMode ? <FiMoon className="w-5 h-5" /> : <FiSun className="w-5 h-5" />}
              </button>

              {/* Notifications */}
              {currentUser && (
                <button 
                  className={`p-2 rounded-full transition-all duration-200 hover:scale-105 relative ${
                    isDarkMode 
                      ? 'text-gray-300 hover:text-white hover:bg-gray-800/50' 
                      : 'text-gray-700 hover:text-primary-600 hover:bg-gray-100/50'
                  }`}
                  aria-label="Notifications"
                >
                  <FiBell className="w-5 h-5" />
                  {notifications.length > 0 && (
                    <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
                  )}
                </button>
              )}

              {/* User Profile */}
              {currentUser ? (
                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className={`flex items-center space-x-2 p-2 rounded-full transition-all duration-200 ${
                      isDarkMode 
                        ? 'text-gray-300 hover:text-white hover:bg-gray-800/50' 
                        : 'text-gray-700 hover:text-primary-600 hover:bg-gray-100/50'
                    }`}
                  >
                    {currentUser.photoURL ? (
                      <img 
                        src={currentUser.photoURL} 
                        alt="Profile" 
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <FiUser className="w-5 h-5" />
                    )}
                  </button>

                  {/* Profile Dropdown */}
                  {isProfileOpen && (
                    <div className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 transition-all duration-200 ${
                      isDarkMode ? 'bg-dark-bg border border-dark-border' : 'bg-white border border-gray-200'
                    }`}>
                      <Link
                        to="/profile"
                        className={`block px-4 py-2 text-sm transition-colors duration-200 ${
                          isDarkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <FiUser className="w-4 h-4" />
                          <span>Profile</span>
                        </div>
                      </Link>
                      <Link
                        to="/settings"
                        className={`block px-4 py-2 text-sm transition-colors duration-200 ${
                          isDarkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <FiSettings className="w-4 h-4" />
                          <span>Settings</span>
                        </div>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className={`w-full text-left px-4 py-2 text-sm transition-colors duration-200 ${
                          isDarkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <FiLogOut className="w-4 h-4" />
                          <span>Logout</span>
                        </div>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className={`px-4 py-2 rounded-md transition-all duration-200 ${
                    isDarkMode
                      ? 'bg-primary-500 text-white hover:bg-primary-600'
                      : 'bg-primary-600 text-white hover:bg-primary-700'
                  }`}
                >
                  Sign In
                </Link>
              )}

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`md:hidden p-2 rounded-full transition-all duration-200 ${
                  isDarkMode 
                    ? 'text-gray-300 hover:text-white hover:bg-gray-800/50' 
                    : 'text-gray-700 hover:text-primary-600 hover:bg-gray-100/50'
                }`}
              >
                {isMenuOpen ? (
                  <FiX className="w-6 h-6" />
                ) : (
                  <FiMenu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className={`md:hidden transition-all duration-200 ${
            isDarkMode ? 'bg-dark-bg border-dark-border' : 'bg-white border-gray-200'
          }`}>
            <div className="px-2 pt-2 pb-3 space-y-1">
              {['Discover', 'About', 'Support'].map((item) => (
                <Link
                  key={item}
                  to={item === 'Discover' ? '/' : `/${item.toLowerCase()}`}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                    location.pathname === (item === 'Discover' ? '/' : `/${item.toLowerCase()}`)
                      ? isDarkMode
                        ? 'bg-gray-800 text-white'
                        : 'bg-gray-100 text-primary-600'
                      : isDarkMode
                        ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-primary-600'
                  }`}
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Search Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-start justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div 
              className="fixed inset-0 transition-opacity" 
              onClick={() => setIsSearchOpen(false)}
            >
              <div className={`absolute inset-0 ${
                isDarkMode ? 'bg-black/75' : 'bg-gray-500/75'
              }`} />
            </div>

            <div className={`inline-block align-bottom rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full ${
              isDarkMode ? 'bg-dark-bg' : 'bg-white'
            }`}>
              <form onSubmit={handleSearchSubmit} className="p-4">
                <div className="flex items-center space-x-4">
                  <FiSearch className={`w-5 h-5 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search videos... (Press '/' to focus)"
                    className={`w-full bg-transparent border-none focus:ring-0 text-lg ${
                      isDarkMode ? 'text-white placeholder-gray-400' : 'text-gray-900 placeholder-gray-500'
                    }`}
                    autoFocus
                  />
                  <kbd className={`hidden sm:inline-block px-2 py-1 text-xs font-semibold rounded ${
                    isDarkMode 
                      ? 'bg-gray-800 text-gray-400 border border-gray-700'
                      : 'bg-gray-100 text-gray-500 border border-gray-200'
                  }`}>
                    ESC
                  </kbd>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
