import React from 'react';

const MediaControls = ({ 
  type, 
  seasons, 
  episodes, 
  mediaData, 
  onInputChange, 
  onSubmit 
}) => {
  if (type !== 'tv') return null;

  return (
    <div className="mt-6 bg-white dark:bg-[#000e14] rounded-xl shadow-lg p-6">
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
            onChange={onInputChange}
            className="w-full px-4 py-2.5 rounded-lg border transition-colors duration-200 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
          >
            {seasons.map((season) => (
              <option key={season} value={season}>
                {season}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="episode" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Episode
          </label>
          <select 
            id="episode" 
            name="episode" 
            value={mediaData.episode} 
            onChange={onInputChange}
            className="w-full px-4 py-2.5 rounded-lg border transition-colors duration-200 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
          >
            {episodes.map((episode) => (
              <option key={episode} value={episode}>
                {episode}
              </option>
            ))}
          </select>
        </div>
      </div>
      <button 
        onClick={onSubmit} 
        className="mt-6 w-full bg-indigo-600 text-white py-2.5 rounded-lg transition-colors duration-200 hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
      >
        Submit
      </button>
    </div>
  );
};

export default MediaControls;
