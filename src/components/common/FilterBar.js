import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tab } from '@headlessui/react';

const categories = [
  { id: 'all', name: 'All' },
  { id: 'movies', name: 'Movies' },
  { id: 'tvshows', name: 'TV Shows' },
  { id: 'trending', name: 'Trending' },
];

const genres = [
  { id: 28, name: 'Action' },
  { id: 35, name: 'Comedy' },
  { id: 18, name: 'Drama' },
  { id: 27, name: 'Horror' },
  { id: 10749, name: 'Romance' },
  { id: 878, name: 'Sci-Fi' },
];

const sortOptions = [
  { id: 'popularity.desc', name: 'Most Popular' },
  { id: 'vote_average.desc', name: 'Highest Rated' },
  { id: 'primary_release_date.desc', name: 'Recently Released' },
];

const FilterBar = ({
  activeCategory,
  activeGenres,
  activeSort,
  onCategoryChange,
  onGenreChange,
  onSortChange,
  streamingServices,
  activeStreamingService,
  onStreamingServiceChange
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="sticky top-16 z-10 bg-gray-50 dark:bg-[#000e14] py-4 space-y-4 border-b border-gray-200 dark:border-gray-700">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between text-gray-700 dark:text-gray-300 p-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
      >
        <span className="font-medium">Filters</span>
        <svg
          className={`w-5 h-5 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-4 mt-4"
          >
            {/* Categories */}
            <Tab.Group onChange={onCategoryChange}>
              <Tab.List className="flex space-x-2 overflow-x-auto pb-2 hide-scrollbar">
                {categories.map((category) => (
                  <Tab
                    key={category.id}
                    className={({ selected }) =>
                      `px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap
                      ${selected 
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                      }`
                    }
                  >
                    {category.name}
                  </Tab>
                ))}
              </Tab.List>
            </Tab.Group>

            <div className="flex flex-wrap gap-4">
              {/* Genres */}
              <div className="flex flex-wrap gap-2">
                {genres.map((genre) => (
                  <motion.button
                    key={genre.id}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onGenreChange(genre.id)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors
                      ${activeGenres.includes(genre.id)
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                      }`}
                  >
                    {genre.name}
                  </motion.button>
                ))}
              </div>

              {/* Sort Dropdown */}
              <select
                value={activeSort}
                onChange={(e) => onSortChange(e.target.value)}
                className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 
                  border-none focus:ring-2 focus:ring-primary-500 cursor-pointer"
              >
                {sortOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Streaming Services */}
            <div className="flex flex-wrap gap-2">
              {streamingServices.map((service) => (
                <motion.button
                  key={service.id}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onStreamingServiceChange(service.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2
                    ${activeStreamingService === service.id
                      ? `${service.color} text-white`
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`}
                >
                  {service.name}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FilterBar;
