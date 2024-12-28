import React, { forwardRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useDarkMode } from './DarkModeContext'; // Import the dark mode context

const IMAGE_BASE_URL = process.env.REACT_APP_TMDB_IMAGE_BASE_URL || 'https://image.tmdb.org/t/p';

const MediaItem = forwardRef(({ item, onClick, onKeyDown, className }, ref) => {
  const { isDarkMode } = useDarkMode();
  const [imageLoaded, setImageLoaded] = useState(false);
  const posterUrl = item.poster_path
    ? `${IMAGE_BASE_URL}/w500${item.poster_path}`
    : '/placeholder-poster.png';

  const getRatingColor = (rating) => {
    if (rating >= 7) return 'bg-green-500';
    if (rating >= 5) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div
      ref={ref}
      onClick={onClick}
      onKeyDown={onKeyDown}
      tabIndex={0}
      role="button"
      className={`group relative flex flex-col ${className} 
                 transform transition-all duration-300 hover:-translate-y-1
                 ${isDarkMode 
                   ? 'bg-gray-800/90 hover:bg-gray-800' 
                   : 'bg-white hover:bg-gray-50'}`}
    >
      <div className="relative pb-[150%] w-full overflow-hidden rounded-lg">
        {!imageLoaded && (
          <div className="absolute inset-0 animate-pulse bg-gray-300 dark:bg-gray-700" />
        )}
        <img
          src={posterUrl}
          alt={item.title || item.name}
          className={`absolute top-0 left-0 w-full h-full object-cover transition-all duration-300
                    group-hover:brightness-90 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          onError={(e) => {
            e.target.src = '/placeholder-poster.png';
            setImageLoaded(true);
          }}
        />
        {/* Rating Badge */}
        {item.vote_average > 0 && (
          <div className={`absolute top-2 right-2 px-2 py-1 rounded-md text-white text-sm font-bold
                        ${getRatingColor(item.vote_average)} shadow-lg
                        transform transition-transform group-hover:scale-110`}>
            {item.vote_average.toFixed(1)}
          </div>
        )}
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 
                      transition-opacity duration-300 flex items-center justify-center">
          <span className="text-white text-lg font-medium px-4 py-2 rounded-lg 
                         bg-blue-500/80 transform -translate-y-2 group-hover:translate-y-0 
                         transition-transform duration-300">
            View Details
          </span>
        </div>
      </div>
      <div className="mt-3 px-2 pb-3">
        <h3 className="font-semibold text-lg leading-tight truncate">
          {item.title || item.name}
        </h3>
        <div className="flex items-center justify-between mt-1">
          <p className="text-sm opacity-75">
            {new Date(item.release_date || item.first_air_date).getFullYear() || 'N/A'}
          </p>
          <p className="text-sm opacity-75">
            {item.media_type.toUpperCase()}
          </p>
        </div>
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
