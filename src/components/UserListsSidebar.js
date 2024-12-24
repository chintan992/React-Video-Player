import React from 'react';
import { useDarkMode } from './DarkModeContext';

const UserListsSidebar = ({ 
  showUserLists, 
  setShowUserLists, 
  watchHistory, 
  watchlist, 
  favorites, 
  handleListItemClick 
}) => {
  const { isDarkMode } = useDarkMode();

  const ListSection = ({ title, items, emptyMessage }) => (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{title}</h3>
      <div className="space-y-2">
        {items?.length > 0 ? (
          items.map((item) => (
            <div
              key={`${item.id}-${item.watchedAt?.seconds || ''}`}
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

  return (
    <div 
      className={`fixed right-0 top-0 h-full w-80 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} 
        shadow-lg transform transition-all duration-300 ease-in-out ${showUserLists ? 'translate-x-0' : 'translate-x-full'} 
        z-50 overflow-hidden`}
    >
      <div className="h-full flex flex-col">
        <div className="p-4 border-b dark:border-gray-700">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">My Lists</h2>
            <button 
              onClick={() => setShowUserLists(false)}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          <ListSection 
            title="Watch History" 
            items={watchHistory} 
            emptyMessage="No watch history" 
          />
          <ListSection 
            title="Watchlist" 
            items={watchlist} 
            emptyMessage="No items in watchlist" 
          />
          <ListSection 
            title="Favorites" 
            items={favorites} 
            emptyMessage="No favorite items" 
          />
        </div>
      </div>
    </div>
  );
};

export default UserListsSidebar;
