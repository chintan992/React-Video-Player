// src/components/MediaDetail.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDarkMode } from './DarkModeContext';

const MediaDetail = ({ item, onClose }) => {
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode();

  const handleWatchNow = () => {
    navigate(`/watch/${item.media_type}/${item.id}`);
    onClose(); // Close the modal after navigation
  };

  const handleOverlayClick = (e) => {
    // Close the modal if the overlay is clicked
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className={`fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50`}
      onClick={handleOverlayClick} // Handle click on overlay
    >
      <div className={`rounded-lg shadow-lg p-4 max-w-full w-full sm:max-w-md md:max-w-lg h-auto sm:h-[90vh] overflow-y-auto transition-all duration-300 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
        <button className="text-2xl absolute top-4 right-4" onClick={onClose}>×</button>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <img
            src={item.poster_path 
              ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
              : 'https://via.placeholder.com/500x750?text=No+Image'}
            alt={item.title || item.name}
            className="rounded-lg shadow-md w-full h-auto max-h-64 object-cover" // Responsive image with max height
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
            <button onClick={handleWatchNow} className={`mt-4 px-4 py-2 rounded transition duration-200 ${isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white`}>
              Watch Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaDetail;