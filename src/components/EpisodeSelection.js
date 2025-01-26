import React from 'react';

const EpisodeSelection = ({ seasons, episodes, mediaData, handleInputChange }) => (
  <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
    <h2 className="text-lg font-semibold mb-4">Episode Selection</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <div>
        <label htmlFor="season" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
          Season
        </label>
        <select 
          id="season" 
          name="season" 
          value={mediaData.season} 
          onChange={handleInputChange}
          className="w-full px-4 py-2.5 rounded-lg border transition-colors duration-200 focus:ring-2 focus:ring-offset-2 
            bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 
            text-gray-900 dark:text-white focus:ring-blue-500"
        >
          {seasons.map(season => (
            <option key={season.season_number} value={season.season_number}>
              {season.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="episodeNo" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
          Episode
        </label>
        <select 
          id="episodeNo" 
          name="episodeNo" 
          value={mediaData.episodeNo} 
          onChange={handleInputChange}
          className="w-full px-4 py-2.5 rounded-lg border transition-colors duration-200 focus:ring-2 focus:ring-offset-2 
            bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 
            text-gray-900 dark:text-white focus:ring-blue-500"
        >
          {episodes.map(episode => (
            <option key={episode.episode_number} value={episode.episode_number}>
              {episode.name || `Episode ${episode.episode_number}`}
            </option>
          ))}
        </select>
      </div>
    </div>
  </div>
);

export default EpisodeSelection;
