import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import { Tooltip } from 'react-tooltip';

const EpisodeNavigation = ({
  episodes,
  currentEpisodeNo,
  season,
  onEpisodeChange,
  isDarkMode,
  isLoading
}) => {
  const currentEpisodeIndex = episodes.findIndex(ep => ep.episode_number === parseInt(currentEpisodeNo));
  const hasPrevious = currentEpisodeIndex > 0;
  const hasNext = currentEpisodeIndex < episodes.length - 1;
  const currentEpisode = episodes[currentEpisodeIndex];

  const handlePrevious = () => {
    if (hasPrevious) onEpisodeChange(episodes[currentEpisodeIndex - 1].episode_number);
  };

  const handleNext = () => {
    if (hasNext) onEpisodeChange(episodes[currentEpisodeIndex + 1].episode_number);
  };

  if (!episodes.length || !currentEpisode) return null;

  return (
    <div className={`flex items-center justify-between gap-2 mt-4 p-3 rounded-lg ${
      isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
    }`}>
      <motion.button
        onClick={handlePrevious}
        disabled={!hasPrevious || isLoading}
        className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
          isDarkMode
            ? 'text-white hover:bg-gray-700 disabled:opacity-40 disabled:hover:bg-transparent'
            : 'text-gray-800 hover:bg-gray-200 disabled:opacity-40 disabled:hover:bg-transparent'
        }`}
        whileHover={hasPrevious && !isLoading ? { scale: 1.05 } : {}}
        whileTap={hasPrevious && !isLoading ? { scale: 0.95 } : {}}
        data-tooltip-id="prev-tooltip"
        data-tooltip-content={hasPrevious ?
          `S${season} E${episodes[currentEpisodeIndex - 1]?.episode_number}: ${episodes[currentEpisodeIndex - 1]?.name}` :
          'First episode'}
      >
        <ChevronLeftIcon className="w-6 h-6 sm:h-5 sm:w-5" />
        <span className="hidden sm:inline">Prev</span>
        <span className="hidden md:inline"> Episode</span>
      </motion.button>

      <AnimatePresence mode="wait">
        <motion.div
          key={`s${season}e${currentEpisodeNo}`}
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 5 }}
          className="flex items-center gap-2 text-sm md:text-base"
        >
          {isLoading ? (
            <div className="h-4 w-24 bg-gray-400/20 rounded animate-pulse" />
          ) : (
            <>
              <span className="sm:hidden">E{currentEpisodeNo}</span>
              <span className="hidden sm:inline md:hidden">Ep. {currentEpisodeNo}</span>
              <span className="hidden md:inline">
                S{season} E{currentEpisodeNo}:{' '}
                <span className="text-gray-500 dark:text-gray-400">
                  {currentEpisode.name}
                </span>
              </span>
            </>
          )}
        </motion.div>
      </AnimatePresence>

      <motion.button
        onClick={handleNext}
        disabled={!hasNext || isLoading}
        className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
          isDarkMode
            ? 'text-white hover:bg-gray-700 disabled:opacity-40 disabled:hover:bg-transparent'
            : 'text-gray-800 hover:bg-gray-200 disabled:opacity-40 disabled:hover:bg-transparent'
        }`}
        whileHover={hasNext && !isLoading ? { scale: 1.05 } : {}}
        whileTap={hasNext && !isLoading ? { scale: 0.95 } : {}}
        data-tooltip-id="next-tooltip"
        data-tooltip-content={hasNext ?
          `S${season} E${episodes[currentEpisodeIndex + 1]?.episode_number}: ${episodes[currentEpisodeIndex + 1]?.name}` :
          'Next episode coming soon'}
      >
        <span className="hidden sm:inline">Next</span>
        <span className="hidden md:inline"> Episode</span>
        <ChevronRightIcon className="w-6 h-6 sm:h-5 sm:w-5" />
      </motion.button>

      <Tooltip id="prev-tooltip" className="max-w-xs z-[100]" />
      <Tooltip id="next-tooltip" className="max-w-xs z-[100]" />
    </div>
  );
};

export default EpisodeNavigation;
