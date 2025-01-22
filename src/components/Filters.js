import React from 'react';

const Filters = ({
  activeCategory,
  handleCategoryChange,
  streamingServices,
  activeStreamingService,
  handleStreamingServiceClick
}) => {
  return (
    <div className="sticky top-16 z-10 bg-gray-50 dark:bg-gray-900 py-4 mb-8 overflow-x-auto">
      <div className="flex flex-wrap gap-4 items-center justify-between">
        {/* Category Tabs */}
        <div className="flex space-x-2 overflow-x-auto">
          <button
            onClick={() => handleCategoryChange('all')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeCategory === 'all'
                ? 'bg-primary-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            All
          </button>
          <button
            onClick={() => handleCategoryChange('movies')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeCategory === 'movies'
                ? 'bg-primary-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            Movies
          </button>
          <button
            onClick={() => handleCategoryChange('tv')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeCategory === 'tv'
                ? 'bg-primary-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            TV Shows
          </button>
        </div>

        {/* Streaming Services */}
        <div className="flex flex-wrap gap-2 overflow-x-auto">
          {streamingServices.map((service) => (
            <button
              key={service.id}
              onClick={() => handleStreamingServiceClick(service.id)}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                activeStreamingService === service.id
                  ? service.color + ' text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              {service.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Filters;
