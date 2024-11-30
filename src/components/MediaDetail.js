import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDarkMode } from './DarkModeContext';
import { useUserFeatures } from '../hooks/useUserFeatures';

const MediaDetail = ({ item, onClose }) => {
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode();
  const [message, setMessage] = useState('');
  const { 
    addToWatchlist, 
    addToFavorites, 
    addToWatchHistory,
    watchlist,
    favorites,
    watchHistory,
    error 
  } = useUserFeatures();

  const handleWatchNow = async () => {
    try {
      // Add to watch history when clicking Watch Now
      await addToWatchHistory(item);
      navigate(`/watch/${item.media_type}/${item.id}`);
      onClose();
    } catch (err) {
      setMessage('Failed to update watch history');
    }
  };

  const handleAddToWatchlist = async () => {
    try {
      await addToWatchlist(item);
      setMessage('Added to watchlist');
      setTimeout(() => setMessage(''), 2000);
    } catch (err) {
      setMessage('Failed to add to watchlist');
    }
  };

  const handleAddToFavorites = async () => {
    try {
      await addToFavorites(item);
      setMessage('Added to favorites');
      setTimeout(() => setMessage(''), 2000);
    } catch (err) {
      setMessage('Failed to add to favorites');
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const isInWatchlist = watchlist?.some(i => i.id === item.id);
  const isInFavorites = favorites?.some(i => i.id === item.id);
  const isInHistory = watchHistory?.some(i => i.id === item.id);

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50"
      onClick={handleOverlayClick}
    >
      <div className={`rounded-lg shadow-lg p-4 max-w-full w-full sm:max-w-md md:max-w-lg h-auto sm:h-[90vh] overflow-y-auto transition-all duration-300 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
        <button className="text-2xl absolute top-4 right-4" onClick={onClose}>×</button>
        
        {message && (
          <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded ${
            error ? 'bg-red-500' : 'bg-green-500'
          } text-white z-50`}>
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <img
            src={item.poster_path 
              ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
              : 'https://via.placeholder.com/500x750?text=No+Image'}
            alt={item.title || item.name}
            className="rounded-lg shadow-md w-full h-auto max-h-64 object-cover"
          />
          <div className="media-detail-info">
            <h2 className="text-2xl font-semibold">{item.title || item.name}</h2>
            <p className="mt-2"><strong>Type:</strong> {item.media_type === 'movie' ? 'Movie' : 'TV Show'}</p>
            <p><strong>Rating:</strong> {item.vote_average}/10</p>
            <p><strong>Release Date:</strong> {item.release_date || item.first_air_date || 'N/A'}</p>
            <p><strong>Overview:</strong> {item.overview || 'No overview available.'}</p>
            {item.media_type === 'tv' && (
              <>
                <p><strong>Number of Seasons:</strong> {item.number_of_seasons || 'N/A'}</p>
                <p><strong>Number of Episodes:</strong> {item.number_of_episodes || 'N/A'}</p>
              </>
            )}
            
            <div className="flex flex-wrap gap-2 mt-4">
              <button 
                onClick={handleWatchNow} 
                className={`px-4 py-2 rounded transition duration-200 ${
                  isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
                } text-white`}
              >
                {isInHistory ? 'Watch Again' : 'Watch Now'}
              </button>
              
              <button 
                onClick={handleAddToWatchlist}
                disabled={isInWatchlist}
                className={`px-4 py-2 rounded transition duration-200 ${
                  isInWatchlist
                    ? 'bg-gray-400 cursor-not-allowed'
                    : isDarkMode
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-green-500 hover:bg-green-600'
                } text-white`}
              >
                {isInWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
              </button>
              
              <button 
                onClick={handleAddToFavorites}
                disabled={isInFavorites}
                className={`px-4 py-2 rounded transition duration-200 ${
                  isInFavorites
                    ? 'bg-gray-400 cursor-not-allowed'
                    : isDarkMode
                      ? 'bg-yellow-600 hover:bg-yellow-700'
                      : 'bg-yellow-500 hover:bg-yellow-600'
                } text-white`}
              >
                {isInFavorites ? 'In Favorites' : 'Add to Favorites'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaDetail;
