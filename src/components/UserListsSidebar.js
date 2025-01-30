import React, { useCallback, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useDarkMode } from './DarkModeContext';
import ListSection from './ListSection';

const UserListsSidebar = ({
  showUserLists,
  setShowUserLists,
  watchHistory,
  watchlist,
  favorites,
  handleListItemClick
}) => {
  const { isDarkMode } = useDarkMode();
  const sidebarRef = useRef(null);

  const handleClose = useCallback(() => {
    setShowUserLists(false);
  }, [setShowUserLists]);

  // Handle focus trap and keyboard navigation
  useEffect(() => {
    if (!showUserLists) return;

    const sidebar = sidebarRef.current;
    const focusableElements = sidebar.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        handleClose();
        return;
      }
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    }

    sidebar.addEventListener('keydown', handleKeyDown);
    firstElement.focus();

    return () => {
      sidebar.removeEventListener('keydown', handleKeyDown);
    };
  }, [showUserLists, handleClose]);

  return (
    <div
      ref={sidebarRef}
      role="dialog"
      aria-label="My Lists"
      aria-modal="true"
      className={`fixed right-0 top-0 h-full w-80 ${isDarkMode ? 'bg-[#000e14]' : 'bg-white'} 
        shadow-lg transform transition-all duration-300 ease-in-out ${showUserLists ? 'translate-x-0' : 'translate-x-full'} 
        z-[70] overflow-y-auto`}
    >
      <div className="h-full flex flex-col">
        <div className="p-4 border-b dark:border-gray-700">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">My Lists</h2>
            <button
              onClick={handleClose}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
              aria-label="Close sidebar"
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
            onItemClick={handleListItemClick}
          />
          <ListSection
            title="Watchlist"
            items={watchlist}
            emptyMessage="No items in watchlist"
            onItemClick={handleListItemClick}
          />
          <ListSection
            title="Favorites"
            items={favorites}
            emptyMessage="No favorite items"
            onItemClick={handleListItemClick}
          />
        </div>
      </div>
    </div>
  );
};

UserListsSidebar.propTypes = {
  showUserLists: PropTypes.bool.isRequired,
  setShowUserLists: PropTypes.func.isRequired,
  watchHistory: PropTypes.array,
  watchlist: PropTypes.array,
  favorites: PropTypes.array,
  handleListItemClick: PropTypes.func.isRequired
};

export default UserListsSidebar;
