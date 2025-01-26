import React from 'react';

const Favorites = ({ favorites, handleListItemClick }) => (
  <div className="space-y-3">
    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Favorites</h3>
    <div className="space-y-2">
      {favorites?.length > 0 ? (
        favorites.map((item) => (
          <div
            key={item.id}
            onClick={() => handleListItemClick(item)}
            className="flex items-center p-2 rounded-lg cursor-pointer
              hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <img
              src={`https://image.tmdb.org/t/p/w92${item.poster_path}`}
              alt={item.title || item.name}
              className="w-12 h-16 object-cover rounded"
            />
            <div className="ml-3 flex-1">
              <p className="font-medium text-gray-800 dark:text-white line-clamp-2">
                {item.title || item.name}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {item.media_type === 'movie' ? 'Movie' : 'TV Series'}
              </p>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500 dark:text-gray-400 text-sm">No favorite items</p>
      )}
    </div>
  </div>
);

export default Favorites;
