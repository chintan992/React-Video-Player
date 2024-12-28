import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { useDarkMode } from './DarkModeContext'; // Import the dark mode context

const IMAGE_BASE_URL = process.env.REACT_APP_TMDB_IMAGE_BASE_URL || 'https://image.tmdb.org/t/p';

const MediaItem = forwardRef(({ item, onClick, onKeyDown, className }, ref) => {
  const { isDarkMode } = useDarkMode(); // Get the dark mode state
  const posterUrl = item.poster_path
    ? `${IMAGE_BASE_URL}/w500${item.poster_path}`
    : '/placeholder-poster.png'; // Make sure to add a placeholder image

  return (
    <div
      ref={ref}
      onClick={onClick}
      onKeyDown={onKeyDown}
      tabIndex={0}
      role="button"
      className={`flex flex-col ${className} ${isDarkMode ? 'bg-gray-800 text-white shadow-md hover:shadow-lg' : 'bg-white text-gray-800 shadow-md hover:shadow-lg'}`}
    >
      <div className="relative pb-[150%] w-full overflow-hidden rounded-lg">
        <img
          src={posterUrl}
          alt={item.title || item.name}
          className="absolute top-0 left-0 w-full h-full object-cover transition-transform hover:scale-105"
          loading="lazy"
          onError={(e) => {
            e.target.src = '/placeholder-poster.png';
          }}
        />
      </div>
      <div className="mt-2 px-1">
        <h3 className="font-medium truncate">
          {item.title || item.name}
        </h3>
        <p className="text-sm opacity-75">
          {new Date(item.release_date || item.first_air_date).getFullYear() || 'N/A'}
        </p>
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
  className: PropTypes.string,
};

MediaItem.displayName = 'MediaItem';

export default React.memo(MediaItem);
