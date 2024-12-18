import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserFeatures } from '../hooks/useUserFeatures';
import { useAuth } from '../context/AuthContext';
import { initializeUserDocument } from '../firebase/userService';
import { useDarkMode } from './DarkModeContext';

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

  const [activeTab, setActiveTab] = useState('watchlist');
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
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
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
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading your content...</p>
        </div>
      </div>
    );
  }

  if (error || initError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
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
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No items found</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {searchQuery ? 'Try adjusting your search query' : 'Start adding items to your list'}
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredItems.map((item) => (
          <div 
            key={`${item.id}-${item.watchedAt?.seconds || ''}`}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] cursor-pointer group"
          >
            <div className="relative aspect-[2/3]" onClick={() => handleItemClick(item)}>
              <img 
                src={item.poster_path 
                  ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                  : 'https://via.placeholder.com/500x750?text=No+Image'
                }
                alt={item.title || item.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/500x750?text=No+Image';
                }}
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity duration-200">
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
                    Watch Now
                  </button>
                </div>
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2 line-clamp-2">
                {item.title || item.name}
              </h3>
              {item.watchedAt && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  Watched: {new Date(item.watchedAt.seconds * 1000).toLocaleDateString()}
                </p>
              )}
              {removeFunction && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveClick(item, removeFunction);
                  }}
                  className="text-sm text-red-500 hover:text-red-600 transition-colors duration-200 mt-2 w-full py-1 rounded-lg border border-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-0">
              My Profile
            </h1>
            <div className="flex flex-wrap gap-4">
              <input
                type="text"
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="date-desc">Newest First</option>
                <option value="date-asc">Oldest First</option>
                <option value="title-asc">Title A-Z</option>
                <option value="title-desc">Title Z-A</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 border-b border-gray-200 dark:border-gray-700 mb-6">
            {['watchlist', 'favorites', 'history'].map((tab) => (
              <button
                key={tab}
                className={`py-2 px-4 font-medium rounded-t-lg transition-colors duration-200 ${
                  activeTab === tab
                    ? 'border-b-2 border-blue-500 text-blue-500'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">
                  {tab === 'watchlist' && watchlist?.length}
                  {tab === 'favorites' && favorites?.length}
                  {tab === 'history' && watchHistory?.length}
                </span>
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
