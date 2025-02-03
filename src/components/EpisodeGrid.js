import React from 'react';
import { motion } from 'framer-motion';

const EpisodeGrid = ({ type, mediaData, episodes, seasons, handleInputChange }) => {
  return (
    type === 'tv' && seasons && seasons.length > 0 && ( // Conditionally render season select
      <div className="mt-6 bg-white dark:bg-[#000e14] rounded-xl shadow-lg p-6">
        <div className="mb-4">
          <select
            value={mediaData.season}
            onChange={(e) => handleInputChange({
              target: { name: 'season', value: e.target.value }
            })}
            className="w-full md:w-auto px-4 py-2 rounded-lg border dark:bg-gray-700
              dark:border-gray-600 dark:text-white"
          >
            {seasons.map((season) => ( // Map over seasons prop
              <option key={season.season_number} value={season.season_number}>
                Season {season.season_number} 
              </option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {episodes.map((episode) => (
            <motion.div
              key={episode.id}
              whileHover={{ scale: 1.02 }}
              className="relative rounded-lg overflow-hidden cursor-pointer"
              onClick={() => handleInputChange({
                target: { name: 'episodeNo', value: episode.episode_number.toString() }
              })}
            >
              <div className="relative aspect-video">
                <img
                  src={`https://image.tmdb.org/t/p/w500${episode.still_path}`}
                  alt={episode.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
              <div className="absolute bottom-0 p-3 text-white">
                <h4 className="font-semibold">{episode.name}</h4>
                <p className="text-sm opacity-90">Episode {episode.episode_number}</p>
              </div>
              <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-green-500" />
            </motion.div>
          ))}
        </div>
      </div>
    )
  );
};

export default EpisodeGrid;
