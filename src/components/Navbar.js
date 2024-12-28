import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDarkMode } from './DarkModeContext';
import { logout } from '../firebase/auth';
import { useAuth } from '../context/AuthContext';
import { useSearch } from '../context/SearchContext';

import { BsSunFill, BsMoonStarsFill, BsSearch, BsList, BsX, BsPerson, BsBoxArrowRight } from 'react-icons/bs';
// removed BsGearFill
const Navbar = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { currentUser } = useAuth();
  const { setQuery } = useSearch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [errorMessage, setErrorMessage] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  // Add online/offline detection
  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      setErrorMessage('');
    };
    const handleOffline = () => {
      setIsOffline(true);
      setErrorMessage('You are offline. Some features may be limited.');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Move debounce function definition inside useCallback
  const debouncedSearch = useCallback((searchTerm) => {
    const debounceTimeout = setTimeout(async () => {
      if (!searchTerm.trim()) {
        setSuggestions([]);
        return;
      }

      if (isOffline) {
        setErrorMessage('Search is not available offline');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setErrorMessage('');
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

        const response = await fetch(
          `https://api.themoviedb.org/3/search/multi?api_key=${process.env.REACT_APP_TMDB_API_KEY}&query=${encodeURIComponent(searchTerm)}&page=1`,
          {
            signal: controller.signal,
            headers: {
              'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
            }
          }
        );

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error('Search failed. Please try again.');
        }

        const data = await response.json();
        
        const filteredResults = data.results
          .filter(item => item.media_type === 'movie' || item.media_type === 'tv')
          .slice(0, 5)
          .map(item => ({
            id: item.id,
            title: item.title || item.name,
            mediaType: item.media_type,
            year: item.release_date || item.first_air_date
              ? new Date(item.release_date || item.first_air_date).getFullYear()
              : null
          }));

        setSuggestions(filteredResults);
      } catch (error) {
        if (error.name === 'AbortError') {
          setErrorMessage('Search timed out. Please try again.');
        } else {
          setErrorMessage(error.message || 'Failed to fetch suggestions');
        }
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(debounceTimeout);
  }, [isOffline]);

  useEffect(() => {
    setIsMenuOpen(false);
    setIsProfileOpen(false);
    setIsSearchOpen(false);
  }, [location]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      // Check if the user is not typing in an input or textarea
      const isTyping = ['input', 'textarea'].includes(document.activeElement.tagName.toLowerCase());
      
      if (e.key === '/' && !isTyping) {
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

  // Update the handleSearchSubmit to handle direct searches vs suggestion clicks
  const handleSearchSubmit = (e, suggestionData = null) => {
    e.preventDefault();
    if (suggestionData) {
      // If suggestion clicked, navigate to specific watch page
      const route = suggestionData.mediaType === 'movie' ? 'movie' : 'tv';
      navigate(`/watch/${route}/${suggestionData.id}`);
    } else if (searchQuery.trim()) {
      // If regular search, go to search page
      setQuery(searchQuery.trim());
      navigate('/search');
    }
    setIsSearchOpen(false);
    setSearchQuery('');
    setSuggestions([]);
  };

  const handleSearchInput = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    debouncedSearch(value);
  };

  // Update the handleKeyDown for suggestion navigation
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedSuggestion(prev => 
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedSuggestion(prev => prev > -1 ? prev - 1 : -1);
    } else if (e.key === 'Enter' && selectedSuggestion > -1) {
      e.preventDefault();
      const selectedItem = suggestions[selectedSuggestion];
      handleSearchSubmit(e, selectedItem);
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
                <BsSearch className="w-5 h-5" />
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
                {isDarkMode ? <BsMoonStarsFill className="w-5 h-5" /> : <BsSunFill className="w-5 h-5" />}
              </button>

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
                      <BsPerson className="w-5 h-5" />
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
                          <BsPerson className="w-4 h-4" />
                          <span>Profile</span>
                        </div>
                      </Link>
                      {/* Settings route temporarily disabled
                      <Link
                        to="/settings"
                        className={`block px-4 py-2 text-sm transition-colors duration-200 ${
                          isDarkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <BsGearFill className="w-4 h-4" />
                          <span>Settings</span>
                        </div>
                      </Link>
                      */}
                      <button
                        onClick={handleLogout}
                        className={`w-full text-left px-4 py-2 text-sm transition-colors duration-200 ${
                          isDarkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <BsBoxArrowRight className="w-4 h-4" />
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
                  <BsX className="w-6 h-6" />
                ) : (
                  <BsList className="w-6 h-6" />
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
                  <BsSearch className={`w-5 h-5 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchInput}
                    onKeyDown={handleKeyDown}
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

                {/* Error Message */}
                {errorMessage && (
                  <div className={`mt-2 px-4 py-2 text-sm rounded ${
                    isDarkMode 
                      ? 'bg-red-900/50 text-red-200' 
                      : 'bg-red-100 text-red-600'
                  }`}>
                    {errorMessage}
                  </div>
                )}

                {/* Offline Banner */}
                {isOffline && (
                  <div className={`mt-2 px-4 py-2 text-sm rounded ${
                    isDarkMode 
                      ? 'bg-gray-800 text-gray-300' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    You are currently offline
                  </div>
                )}

                {/* Updated Suggestions dropdown */}
                {(suggestions.length > 0 || isLoading) && !errorMessage && (
                  <div className={`mt-2 py-2 ${
                    isDarkMode ? 'border-t border-gray-700' : 'border-t border-gray-200'
                  }`}>
                    {isLoading ? (
                      <div className={`px-4 py-2 ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        Searching...
                      </div>
                    ) : (
                      suggestions.map((suggestion, index) => (
                        <div
                          key={suggestion.id}
                          onClick={(e) => handleSearchSubmit(e, suggestion)}
                          className={`px-4 py-2 cursor-pointer ${
                            index === selectedSuggestion
                              ? isDarkMode
                                ? 'bg-gray-800 text-white'
                                : 'bg-gray-100 text-primary-600'
                              : isDarkMode
                                ? 'text-gray-300 hover:bg-gray-800'
                                : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <span>{suggestion.title}</span>
                            <span className={`text-xs ${
                              isDarkMode ? 'text-gray-500' : 'text-gray-400'
                            }`}>
                              {suggestion.mediaType === 'movie' ? 'Movie' : 'TV Show'}
                              {suggestion.year ? ` (${suggestion.year})` : ''}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;