import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserFeatures } from '../hooks/useUserFeatures';
import { useAuth } from '../context/AuthContext';
import { initializeUserDocument } from '../firebase/userService';

const UserFeatures = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { 
    watchlist, 
    favorites, 
    watchHistory, 
    loading, 
    error,
    removeFromWatchlist,
    removeFromFavorites,
    removeFromWatchHistory
  } = useUserFeatures();

  const [activeTab, setActiveTab] = useState('watchlist');
  const [initError, setInitError] = useState(null);

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

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <p className="text-lg text-gray-600 dark:text-gray-300">Please login to view your profile</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || initError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <p className="text-red-500">{error || initError}</p>
      </div>
    );
  }

  const renderMediaList = (items, removeFunction) => {
    if (!items?.length) {
      return (
        <p className="text-gray-500 dark:text-gray-400 text-center py-8">No items found</p>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((item) => (
          <div 
            key={`${item.id}-${item.watchedAt?.seconds || ''}`}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200 cursor-pointer group"
            onClick={() => handleItemClick(item)}
          >
            <img 
              src={item.poster_path 
                ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                : 'https://via.placeholder.com/500x750?text=No+Image'
              }
              alt={item.title || item.name}
              className="w-full h-48 object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/500x750?text=No+Image';
              }}
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
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
                    removeFunction(item);
                  }}
                  className="text-sm text-red-500 hover:text-red-600 transition-colors duration-200 opacity-0 group-hover:opacity-100"
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            My Profile
          </h1>
          <div className="flex space-x-4 border-b border-gray-200 dark:border-gray-700">
            <button
              className={`py-2 px-4 ${
                activeTab === 'watchlist'
                  ? 'border-b-2 border-blue-500 text-blue-500'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
              onClick={() => setActiveTab('watchlist')}
            >
              Watchlist
            </button>
            <button
              className={`py-2 px-4 ${
                activeTab === 'favorites'
                  ? 'border-b-2 border-blue-500 text-blue-500'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
              onClick={() => setActiveTab('favorites')}
            >
              Favorites
            </button>
            <button
              className={`py-2 px-4 ${
                activeTab === 'history'
                  ? 'border-b-2 border-blue-500 text-blue-500'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
              onClick={() => setActiveTab('history')}
            >
              Watch History
            </button>
          </div>
        </div>

        <div className="mt-6">
          {activeTab === 'watchlist' && renderMediaList(watchlist, removeFromWatchlist)}
          {activeTab === 'favorites' && renderMediaList(favorites, removeFromFavorites)}
          {activeTab === 'history' && renderMediaList(watchHistory, removeFromWatchHistory)}
        </div>
      </div>
    </div>
  );
};

export default UserFeatures;
