import React from 'react';

const WatchHistory = ({ watchHistory, handleListItemClick }) => (
  <div className="space-y-3">
    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Watch History</h3>
    <div className="space-y-2">
      {watchHistory?.length > 0 ? (
        watchHistory.map((item) => (
          <div
            key={`${item.id}-${item.watchedAt?.seconds}`}
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
              <div className="flex flex-col text-sm text-gray-500 dark:text-gray-400">
                <span>{item.media_type === 'movie' ? 'Movie' : 'TV Series'}</span>
                <span>Watched: {new Date(item.watchedAt?.seconds * 1000).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500 dark:text-gray-400 text-sm">No watch history</p>
      )}
    </div>
  </div>
);

export default WatchHistory;
