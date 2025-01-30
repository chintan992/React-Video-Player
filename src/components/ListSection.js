import React, { memo } from 'react';
import PropTypes from 'prop-types';

const ListSection = memo(({ title, items, emptyMessage, onItemClick }) => {
  const handleItemClick = React.useCallback((item) => {
    onItemClick(item);
  }, [onItemClick]);

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{title}</h3>
      <div className="space-y-2">
        {items?.length > 0 ? (
          items.map((item) => (
            <div
              key={`${item.id}-${item.watchedAt?.seconds || ''}`}
              onClick={() => handleItemClick(item)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleItemClick(item);
                }
              }}
              role="button"
              tabIndex={0}
              className="flex items-center p-2 rounded-lg cursor-pointer
                hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <div className="relative w-12 h-16">
                <img
                  src={`https://image.tmdb.org/t/p/w92${item.poster_path}`}
                  alt={item.title || item.name}
                  className="w-12 h-16 object-cover rounded"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/placeholder-poster.jpg'; // Add a placeholder image to public folder
                  }}
                />
              </div>
              <div className="ml-3 flex-1">
                <p className="font-medium text-gray-800 dark:text-white line-clamp-2">
                  {item.title || item.name}
                </p>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  <span>{item.media_type === 'movie' ? 'Movie' : 'TV Series'}</span>
                  {item.watchedAt && (
                    <span> • {new Date(item.watchedAt.seconds * 1000).toLocaleDateString()}</span>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-sm">{emptyMessage}</p>
        )}
      </div>
    </div>
  );
});

ListSection.propTypes = {
  title: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string,
    name: PropTypes.string,
    poster_path: PropTypes.string,
    media_type: PropTypes.string.isRequired,
    watchedAt: PropTypes.shape({
      seconds: PropTypes.number
    })
  })),
  emptyMessage: PropTypes.string.isRequired,
  onItemClick: PropTypes.func.isRequired
};

ListSection.displayName = 'ListSection';

export default ListSection;
