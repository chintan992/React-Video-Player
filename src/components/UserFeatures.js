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
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

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

  // Update the sort options
  const sortOptions = [
    { value: 'date-desc', label: 'Newest First' },
    { value: 'date-asc', label: 'Oldest First' },
    { value: 'title-asc', label: 'Title A-Z' },
    { value: 'title-desc', label: 'Title Z-A' },
    { value: 'rating-desc', label: 'Highest Rated' },
    { value: 'rating-asc', label: 'Lowest Rated' },
  ];

  // Add loading skeleton component
  const LoadingSkeleton = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
      {[...Array(10)].map((_, i) => (
        <div key={i} className="bg-white dark:bg-gray-900 rounded-xl shadow-md overflow-hidden">
          <div className="aspect-[2/3] bg-gray-200 dark:bg-gray-800 animate-pulse" />
          <div className="p-4">
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse mb-2" />
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );

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

    if (loading) {
      return <LoadingSkeleton />;
    }

    if (!filteredItems?.length) {
      return (
        <div className="text-center py-16 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-xl shadow-md">
          <div className="max-w-sm mx-auto">
            <svg className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">No items found</h3>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              {searchQuery ? 'Try adjusting your search query' : 'Start adding items to your list'}
            </p>
            {!searchQuery && (
              <button 
                onClick={() => navigate('/browse')}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200"
              >
                Browse Content
              </button>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className={viewMode === 'grid' 
        ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
        : "flex flex-col gap-4"
      }>
        {filteredItems.map((item) => (
          <div 
            key={`${item.id}-${item.watchedAt?.seconds || ''}`}
            className={`bg-white dark:bg-gray-900 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group
              ${viewMode === 'grid' 
                ? 'transform hover:scale-[1.03] hover:-translate-y-1' 
                : 'flex gap-6 p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50'
              }`}
          >
            <div 
              className={`relative ${viewMode === 'grid' ? 'aspect-[2/3]' : 'w-24 h-36 flex-shrink-0'}`} 
              onClick={() => handleItemClick(item)}
            >
              <img 
                src={item.poster_path 
                  ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                  : 'https://via.placeholder.com/500x750?text=No+Image'
                }
                alt={item.title || item.name}
                className={`w-full h-full object-cover transition-all duration-300 ${
                  viewMode === 'grid' 
                    ? 'group-hover:scale-105 rounded-t-xl' 
                    : 'rounded-lg'
                }`}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/500x750?text=No+Image';
                }}
              />
              {viewMode === 'grid' && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-t-xl">
                  <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    <div className="flex gap-2 mb-2">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleItemClick(item);
                        }}
                        className="flex-1 px-3 py-1.5 bg-blue-600/90 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200 text-sm font-medium backdrop-blur-sm"
                      >
                        Watch Now
                      </button>
                      {removeFunction && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveClick(item, removeFunction);
                          }}
                          className="p-1.5 bg-red-500/90 hover:bg-red-500 text-white rounded-lg transition-colors duration-200 backdrop-blur-sm"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                    {item.overview && (
                      <p className="text-white/90 text-sm line-clamp-2 mb-1">
                        {item.overview}
                      </p>
                    )}
                  </div>
                </div>
              )}
              {/* Add rating badge if available */}
              {item.vote_average > 0 && (
                <div className="absolute top-2 right-2 px-2 py-1 bg-black/70 text-white text-sm font-medium rounded-md backdrop-blur-sm">
                  ★ {item.vote_average.toFixed(1)}
                </div>
              )}
            </div>
            
            {/* Grid view content */}
            {viewMode === 'grid' && (
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 group-hover:text-blue-500 transition-colors duration-200 line-clamp-2 mb-2">
                  {item.title || item.name}
                </h3>
                
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-md">
                    {item.media_type === 'movie' ? 'Movie' : 'TV Series'}
                  </span>
                  
                  {item.media_type === 'tv' && item.season && item.episode && (
                    <span className="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-md">
                      S{item.season} E{item.episode}
                    </span>
                  )}
                  
                  {item.watchedAt && (
                    <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {new Date(item.watchedAt.seconds * 1000).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            )}
            
            {/* List view content remains the same */}
            {viewMode === 'list' && (
              <div className="flex-1 py-1">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className={`font-semibold text-gray-800 dark:text-gray-100 group-hover:text-blue-500 transition-colors duration-200
                      ${viewMode === 'list' ? 'text-lg mb-2 line-clamp-2' : 'text-xl mb-1'}`}>
                      {item.title || item.name}
                    </h3>
                    
                    {/* Enhanced metadata display for list view */}
                    {viewMode === 'list' && (
                      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-400 mb-2">
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                              d={item.media_type === 'movie' 
                                ? "M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
                                : "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                              } 
                            />
                          </svg>
                          {item.media_type === 'movie' ? 'Movie' : 'TV Series'}
                        </span>
                        
                        {item.watchedAt && (
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {new Date(item.watchedAt.seconds * 1000).toLocaleDateString()}
                          </span>
                        )}
                        
                        {item.media_type === 'tv' && item.season && item.episode && (
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                            </svg>
                            <span>S{item.season} E{item.episode}</span>
                            {item.episodeName && (
                              <span className="italic">"{item.episodeName}"</span>
                            )}
                          </span>
                        )}
                      </div>
                    )}
                    
                    {/* Show overview in list view */}
                    {viewMode === 'list' && item.overview && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                        {item.overview}
                      </p>
                    )}
                  </div>
                  
                  {/* Action buttons for list view */}
                  {viewMode === 'list' && (
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleItemClick(item);
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Watch
                      </button>
                      {removeFunction && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveClick(item, removeFunction);
                          }}
                          className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-[#0A0F1C] dark:to-[#1C1C2C] p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-8">
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
              <div className="flex gap-4">
                <div className="relative flex-1 sm:flex-none">
                  <input
                    type="text"
                    placeholder="Search items..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full sm:w-64 px-4 py-2 pl-10 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 dark:bg-gray-800/50 dark:text-white transition-all duration-200"
                  />
                  <svg className="w-5 h-5 text-gray-400 dark:text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 dark:bg-gray-800/50 dark:text-white transition-all duration-200"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex rounded-xl border border-gray-300 dark:border-gray-700 overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-1 border-b border-gray-200 dark:border-gray-700 mb-6">
            {['watchlist', 'favorites', 'history'].map((tab) => (
              <button
                key={tab}
                className={`py-3 px-6 font-medium rounded-t-lg transition-all duration-200 relative ${
                  activeTab === tab
                    ? 'text-blue-500 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-400'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                  activeTab === tab
                    ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                }`}>
                  {tab === 'watchlist' && watchlist?.length}
                  {tab === 'favorites' && favorites?.length}
                  {tab === 'history' && watchHistory?.length}
                </span>
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 dark:bg-blue-400"></div>
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
