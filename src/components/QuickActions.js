import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { List, Heart } from 'react-feather';

const QuickActions = ({ isInWatchlist, isInFavorites, handleWatchlistToggle, handleFavoritesToggle, showQuickActions }) => {
  return (
    <AnimatePresence>
      {showQuickActions && (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          className="fixed bottom-20 left-1/2 transform -translate-x-1/2
            bg-white dark:bg-gray-800 rounded-full shadow-lg px-6 py-3
            flex items-center space-x-4 z-50"
        >
          <motion.button
            onClick={handleWatchlistToggle}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className={`p-2 rounded-full transition-colors duration-200
              ${isInWatchlist
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            aria-label={isInWatchlist ? "Remove from watchlist" : "Add to watchlist"}
          >
            <List
              className={`w-5 h-5 ${isInWatchlist ? 'fill-current' : ''}`}
              data-active={isInWatchlist}
            />
          </motion.button>
          <motion.button
            onClick={handleFavoritesToggle}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className={`p-2 rounded-full transition-colors duration-200
              ${isInFavorites
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            aria-label={isInFavorites ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart
              className={`w-5 h-5 ${isInFavorites ? 'fill-current' : ''}`}
              data-active={isInFavorites}
            />
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default QuickActions;
