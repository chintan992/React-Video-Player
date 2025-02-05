import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserFeatures } from '../hooks/useUserFeatures';
import { useAuth } from '../context/AuthContext';
import { initializeUserDocument } from '../firebase/userService';
//import { useDarkMode } from './DarkModeContext';

const UserFeatures = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
 // const { isDarkMode } = useDarkMode();
  const { 
    watchlist, 
    favorites, 
    watchHistory, 
    loading, 
    error,
    removeFromWatchlist,
    removeFromFavorites,
    removeFromWatchHistory,
    clearWatchHistory
  } = useUserFeatures();

  const [activeTab, setActiveTab] = useState('history');
  const [initError, setInitError] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);
  const [removeFunction, setRemoveFunction] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('date-desc');

  // Initialize user document if it doesn't exist
  useEffect(() => {
    const initializeUser = async () => {
      if (currentUser) {
        try {
          await initializeUserDocument(
            currentUser.uid,
            currentUser.displayName,
            currentUser.email
          );
        } catch (err) {
          setInitError(err.message);
        }
      }
    };

    initializeUser();
  }, [currentUser]);

  const handleItemClick = (item) => {
    navigate(`/watch/${item.media_type}/${item.id}`);
  };

  const handleRemoveClick = (item, removeFunc) => {
    setItemToRemove(item);
    setRemoveFunction(() => removeFunc);
    setShowConfirmDialog(true);
  };

  const confirmRemove = () => {
    if (itemToRemove && removeFunction) {
      removeFunction(itemToRemove);
    }
    setShowConfirmDialog(false);
    setItemToRemove(null);
    setRemoveFunction(null);
  };

  const filterAndSortItems = (items) => {
    if (!items) return [];
    
    let filteredItems = items;
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredItems = items.filter(item => 
        (item.title || item.name || '').toLowerCase().includes(query) ||
        (item.overview || '').toLowerCase().includes(query)
      );
    }

    // Apply sorting
    return [...filteredItems].sort((a, b) => {
      switch (sortOption) {
        case 'date-desc':
          return (b.watchedAt?.seconds || b.addedAt?.seconds || 0) - 
                 (a.watchedAt?.seconds || a.addedAt?.seconds || 0);
        case 'date-asc':
          return (a.watchedAt?.seconds || a.addedAt?.seconds || 0) - 
                 (b.watchedAt?.seconds || b.addedAt?.seconds || 0);
        case 'title-asc':
          return (a.title || a.name || '').localeCompare(b.title || b.name || '');
        case 'title-desc':
          return (b.title || b.name || '').localeCompare(a.title || a.name || '');
        default:
          return 0;
      }
    });
  };

  if (!currentUser) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-[#000e14] p-4">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Sign In Required</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">Please sign in to access your profile and manage your content.</p>
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-[#000e14]">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading your content...</p>
        </div>
      </div>
    );
  }

  if (error || initError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-[#000e14] p-4">
        <div className="text-center max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-red-600 dark:text-red-400 mb-4">Error</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{error || initError}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const renderMediaList = (items, removeFunction) => {
    const filteredItems = filterAndSortItems(items);

    if (!filteredItems?.length) {
      return (
        <div className="text-center py-16 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-md">
          <svg className="mx-auto h-16 w-16 text-gray-400 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">No items found</h3>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            {searchQuery ? 'Try adjusting your search query' : 'Start adding items to your list'}
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
        {filteredItems.map((item) => (
          <div 
            key={`${item.id}-${item.watchedAt?.seconds || ''}`}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] cursor-pointer group"
          >
            <div className="relative aspect-[2/3]" onClick={() => handleItemClick(item)}>
              <img 
                src={item.poster_path 
                  ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                  : 'https://via.placeholder.com/500x750?text=No+Image'
                }
                alt={item.title || item.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/500x750?text=No+Image';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
                    Watch Now
                  </button>
                </div>
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-500 transition-colors duration-200">
                {item.title || item.name}
              </h3>
              
              {/* TV show episode information with improved styling */}
              {item.media_type === 'tv' && (
                <div className="mb-2 text-sm text-gray-600 dark:text-gray-400">
                  {item.season && item.episode && (
                    <p className="flex items-center gap-1">
                      <span className="inline-block px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-md text-xs">
                        S{item.season} E{item.episode}
                      </span>
                      {item.episodeName && (
                        <span className="italic truncate">{item.episodeName}</span>
                      )}
                    </p>
                  )}
                </div>
              )}

              {/* Watch date with icon */}
              {item.watchedAt && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {new Date(item.watchedAt.seconds * 1000).toLocaleDateString()}
                </p>
              )}
              
              {/* Content type badge */}
              <span className="inline-block px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                {item.media_type === 'movie' ? 'Movie' : 'TV Series'}
              </span>

              {removeFunction && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveClick(item, removeFunction);
                  }}
                  className="text-sm text-red-500 hover:text-white hover:bg-red-500 transition-all duration-200 mt-3 w-full py-1.5 rounded-lg border border-red-500"
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-[#000e14] dark:to-[#001824] p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
            <div className="mb-6 sm:mb-0">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                My Profile
              </h1>
              <p className="text-gray-500 dark:text-gray-400">
                Manage your watchlist, favorites, and history
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full sm:w-64 px-4 py-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:bg-gray-700/50 dark:text-white transition-all duration-200"
                />
                <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:bg-gray-700/50 dark:text-white transition-all duration-200"
              >
                <option value="date-desc">Newest First</option>
                <option value="date-asc">Oldest First</option>
                <option value="title-asc">Title A-Z</option>
                <option value="title-desc">Title Z-A</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap gap-1 border-b border-gray-200 dark:border-gray-700 mb-6">
            {['watchlist', 'favorites', 'history'].map((tab) => (
              <button
                key={tab}
                className={`py-3 px-6 font-medium rounded-t-lg transition-all duration-200 relative ${
                  activeTab === tab
                    ? 'text-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/20'
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                  activeTab === tab
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}>
                  {tab === 'watchlist' && watchlist?.length}
                  {tab === 'favorites' && favorites?.length}
                  {tab === 'history' && watchHistory?.length}
                </span>
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"></div>
                )}
              </button>
            ))}
          </div>

          {activeTab === 'history' && watchHistory?.length > 0 && (
            <div className="mb-6 flex justify-end">
              <button
                onClick={() => handleRemoveClick(null, clearWatchHistory)}
                className="px-4 py-2 text-red-500 hover:text-red-600 transition-colors duration-200"
              >
                Clear History
              </button>
            </div>
          )}

          <div>
            {activeTab === 'watchlist' && renderMediaList(watchlist, removeFromWatchlist)}
            {activeTab === 'favorites' && renderMediaList(favorites, removeFromFavorites)}
            {activeTab === 'history' && renderMediaList(watchHistory, removeFromWatchHistory)}
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {itemToRemove ? 'Remove Item' : 'Clear History'}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {itemToRemove
                ? `Are you sure you want to remove "${itemToRemove.title || itemToRemove.name}" from your ${activeTab}?`
                : 'Are you sure you want to clear your entire watch history?'}
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmRemove}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserFeatures;
