import React, { useCallback, useEffect, useRef, useState } from 'react';
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
  useDarkMode();
  const sidebarRef = useRef(null);

  // Add state for tracking minimized sections
  const [minimizedSections, setMinimizedSections] = useState({
    history: false,
    watchlist: false,
    favorites: false
  });

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

  const toggleSection = (section) => {
    setMinimizedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const SectionTitle = ({ icon, title, count, section, isMinimized }) => (
    <div 
      onClick={() => toggleSection(section)}
      className="flex items-center justify-between w-full cursor-pointer group"
    >
      <div className="flex items-center gap-2 text-gray-800 dark:text-white">
        {icon}
        <span>{title}</span>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          ({count || 0})
        </span>
      </div>
      <button 
        className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 
          transition-colors duration-200 text-gray-400 hover:text-gray-600 
          dark:text-gray-500 dark:hover:text-gray-300"
        aria-label={isMinimized ? "Expand section" : "Minimize section"}
      >
        <svg 
          className={`w-5 h-5 transform transition-transform duration-200 ${isMinimized ? '-rotate-90' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    </div>
  );

  return (
    <>
      {/* Overlay with improved dark mode blur */}
      {showUserLists && (
        <div 
          className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm z-60"
          onClick={handleClose}
          aria-hidden="true"
        />
      )}

      <div
        ref={sidebarRef}
        role="dialog"
        aria-label="My Lists"
        aria-modal="true"
        className={`fixed right-0 top-0 h-full w-[340px] 
          bg-white/90 dark:bg-gray-900/95 backdrop-blur-xl
          shadow-[0_0_40px_rgba(0,0,0,0.1)] dark:shadow-[0_0_40px_rgba(0,0,0,0.5)]
          transform transition-all duration-300 ease-out
          ${showUserLists ? 'translate-x-0' : 'translate-x-full'} 
          z-[70] overflow-hidden flex flex-col
          border-l border-gray-200/20 dark:border-gray-700/30`}
      >
        {/* Header with improved gradient */}
        <div className="px-6 py-4 border-b border-gray-200/20 dark:border-gray-700/30 backdrop-blur-xl
          bg-white/50 dark:bg-gray-800/50">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-gray-900 via-gray-700 to-gray-800 
                dark:from-white dark:via-gray-200 dark:to-gray-300 bg-clip-text text-transparent">
                My Lists
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Quick access to your content
              </p>
            </div>
            <button
              onClick={handleClose}
              className="p-2 rounded-full hover:bg-gray-100/80 dark:hover:bg-gray-700/80 
                transition-colors duration-200 text-gray-500 dark:text-gray-400
                hover:text-gray-700 dark:hover:text-gray-200"
              aria-label="Close sidebar"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Content with improved section styling */}
        <div className="flex-1 overflow-y-auto bg-gradient-to-b from-transparent to-gray-50/50 
          dark:to-gray-800/20">
          <div className="p-6 space-y-8">
            {/* Watch History Section */}
            <div className="space-y-3 bg-white/40 dark:bg-gray-800/40 rounded-xl p-3 
              shadow-sm hover:shadow-md transition-shadow duration-200">
              <SectionTitle
                section="history"
                isMinimized={minimizedSections.history}
                icon={
                  <svg className="w-5 h-5 text-blue-500 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
                title="Watch History"
                count={watchHistory?.length}
              />
              <div className={`transition-all duration-300 overflow-hidden ${
                minimizedSections.history ? 'h-0 opacity-0' : 'opacity-100'
              }`}>
                <ListSection
                  items={watchHistory}
                  emptyMessage="No watch history yet"
                  onItemClick={handleListItemClick}
                />
              </div>
            </div>

            {/* Watchlist Section */}
            <div className="space-y-3 bg-white/40 dark:bg-gray-800/40 rounded-xl p-3 
              shadow-sm hover:shadow-md transition-shadow duration-200">
              <SectionTitle
                section="watchlist"
                isMinimized={minimizedSections.watchlist}
                icon={
                  <svg className="w-5 h-5 text-purple-500 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                }
                title="Watchlist"
                count={watchlist?.length}
              />
              <div className={`transition-all duration-300 overflow-hidden ${
                minimizedSections.watchlist ? 'h-0 opacity-0' : 'opacity-100'
              }`}>
                <ListSection
                  items={watchlist}
                  emptyMessage="Your watchlist is empty"
                  onItemClick={handleListItemClick}
                />
              </div>
            </div>

            {/* Favorites Section */}
            <div className="space-y-3 bg-white/40 dark:bg-gray-800/40 rounded-xl p-3 
              shadow-sm hover:shadow-md transition-shadow duration-200">
              <SectionTitle
                section="favorites"
                isMinimized={minimizedSections.favorites}
                icon={
                  <svg className="w-5 h-5 text-red-500 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                }
                title="Favorites"
                count={favorites?.length}
              />
              <div className={`transition-all duration-300 overflow-hidden ${
                minimizedSections.favorites ? 'h-0 opacity-0' : 'opacity-100'
              }`}>
                <ListSection
                  items={favorites}
                  emptyMessage="No favorites added"
                  onItemClick={handleListItemClick}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer with improved gradient button */}
        <div className="p-4 border-t border-gray-200/20 dark:border-gray-700/30 
          backdrop-blur-xl bg-white/50 dark:bg-gray-800/50">
          <button
            onClick={() => window.location.href = '/profile'}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-500 to-blue-600 
              dark:from-blue-600 dark:to-blue-700
              hover:from-blue-600 hover:to-blue-700 
              dark:hover:from-blue-500 dark:hover:to-blue-600 
              text-white rounded-xl
              transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]
              font-medium flex items-center justify-center gap-2
              shadow-sm hover:shadow-md"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            View Full Profile
          </button>
        </div>
      </div>
    </>
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
