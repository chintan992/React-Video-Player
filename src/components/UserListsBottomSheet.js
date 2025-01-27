import React from 'react';
import { useDarkMode } from './DarkModeContext';
import WatchHistory from './WatchHistory';
import Watchlist from './Watchlist';
import Favorites from './Favorites';

const UserListsBottomSheet = ({ 
  showUserLists, 
  setShowUserLists, 
  watchHistory, 
  watchlist, 
  favorites, 
  handleListItemClick 
}) => {
  const { isDarkMode } = useDarkMode();

  if (!showUserLists) return null;

  return (
    <div
      className={`
        fixed bottom-0 left-0 right-0 
        max-h-[80vh] overflow-y-auto z-[70]
        ${isDarkMode ? 'bg-gray-900' : 'bg-white'}
        rounded-t-2xl shadow-lg
        transform transition-transform duration-300 ease-in-out
        ${showUserLists ? 'translate-y-0' : 'translate-y-full'}
      `}
    >
      <div className="sticky top-0 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            My Lists
          </h2>
          <button 
            onClick={() => setShowUserLists(false)}
            className={`p-2 rounded-full 
              ${isDarkMode 
                ? 'hover:bg-gray-700 text-gray-300' 
                : 'hover:bg-gray-200 text-gray-600'} 
              transition-colors duration-200`}
            aria-label="Close bottom sheet"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <div className="p-4 space-y-6 overflow-y-auto">
        <WatchHistory watchHistory={watchHistory} handleListItemClick={handleListItemClick} />
        <Watchlist watchlist={watchlist} handleListItemClick={handleListItemClick} />
        <Favorites favorites={favorites} handleListItemClick={handleListItemClick} />
      </div>

      {/* Add a drag handle/indicator */}
      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
        <div className={`w-12 h-1 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`} />
      </div>
    </div>
  );
};

export default UserListsBottomSheet;
