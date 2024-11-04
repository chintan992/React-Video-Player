// src/components/MediaItem.js
import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import './MediaItem.css';

const MediaItem = forwardRef(({ item, onClick, onKeyDown }, ref) => {
  return (
    <div 
      ref={ref}
      className="media-item" 
      onClick={onClick}
      onKeyDown={onKeyDown}
      tabIndex="0"
      role="button"
      aria-label={`View details for ${item.title || item.name}`}
    >
      <img
        src={item.poster_path 
          ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
          : 'https://via.placeholder.com/500x750?text=No+Image'}
        alt={item.title || item.name}
        className="media-poster"
      />
      <div className="media-info">
        <h3>{item.title || item.name}</h3>
        <p className="media-type">{item.media_type === 'movie' ? 'Movie' : 'TV Show'}</p>
        <p className="media-rating">Rating: {item.vote_average.toFixed(1)}</p>
        <p className="media-year">{(item.release_date || item.first_air_date || '').split('-')[0]}</p>
      </div>
    </div>
  );
});

MediaItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string,
    name: PropTypes.string,
    poster_path: PropTypes.string,
    media_type: PropTypes.string.isRequired,
    vote_average: PropTypes.number.isRequired,
    release_date: PropTypes.string,
    first_air_date: PropTypes.string,
  }).isRequired,
  onClick: PropTypes.func.isRequired,
  onKeyDown: PropTypes.func.isRequired,
};

MediaItem.displayName = 'MediaItem';

export default React.memo(MediaItem);