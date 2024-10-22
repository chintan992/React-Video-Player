// src/components/MediaDetail.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDarkMode } from './DarkModeContext';
import './MediaDetail.css';

const MediaDetail = ({ item, onClose }) => {
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode();

  const handleWatchNow = () => {
    navigate(`/watch/${item.media_type}/${item.id}`);
    onClose(); // Close the modal after navigation
  };

  return (
    <div className={`media-detail-overlay ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="media-detail-content">
        <button className="close-button" onClick={onClose}>×</button>
        <div className="media-detail-grid">
          <img
            src={item.poster_path 
              ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
              : 'https://via.placeholder.com/500x750?text=No+Image'}
            alt={item.title || item.name}
            className="media-detail-poster"
          />
          <div className="media-detail-info">
            <h2>{item.title || item.name}</h2>
            <p><strong>Type:</strong> {item.media_type === 'movie' ? 'Movie' : 'TV Show'}</p>
            <p><strong>Rating:</strong> {item.vote_average}/10</p>
            <p><strong>Release Date:</strong> {item.release_date || item.first_air_date || 'N/A'}</p>
            <p><strong>Overview:</strong> {item.overview || 'No overview available.'}</p>
            {item.media_type === 'tv' && (
              <>
                <p><strong>Number of Seasons:</strong> {item.number_of_seasons || 'N/A'}</p>
                <p><strong>Number of Episodes:</strong> {item.number_of_episodes || 'N/A'}</p>
              </>
            )}
            <button onClick={handleWatchNow} className="watch-now-button">Watch Now</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaDetail;