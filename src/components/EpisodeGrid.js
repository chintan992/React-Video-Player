import React from 'react';
import { motion } from 'framer-motion';

const EpisodeGrid = ({ type, mediaData, episodes, seasons, currentEpisode, handleInputChange }) => {
  if (type !== 'tv') return null;

  const episodeItemClasses = (episode) => `
    relative p-4 rounded-lg transition-all duration-200 cursor-pointer
    ${currentEpisode?.id === episode.id 
      ? 'bg-[#02c39a]/20 dark:bg-[#00edb8]/20 ring-2 ring-[#02c39a] dark:ring-[#00edb8] shadow-lg' 
      : 'hover:bg-white/10 dark:hover:bg-gray-800/60'}
    ${episode.still_path 
      ? 'hover:scale-105 active:scale-95' 
      : 'opacity-50'}
  `;

  return (
    <div className="space-y-6">
      {/* Season selector */}
      <div className="flex items-center gap-4">
        <label className="text-lg font-semibold">Season:</label>
        <select
          name="season"
          value={mediaData.season}
          onChange={handleInputChange}
          className="bg-white/10 dark:bg-gray-800/40 rounded-lg px-4 py-2 outline-none 
            focus:ring-2 ring-[#02c39a] dark:ring-[#00edb8] backdrop-blur-sm
            border border-gray-200/20 hover:bg-white/20 dark:hover:bg-gray-800/60
            transition-all duration-200"
        >
          {seasons.map((season) => (
            <option key={season.season_number} value={season.season_number}>
              Season {season.season_number}
            </option>
          ))}
        </select>
      </div>

      {/* Episodes grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {episodes.map((episode) => (
          <motion.div
            key={episode.id}
            layoutId={`episode-${episode.id}`}
            className={episodeItemClasses(episode)}
            onClick={() => handleInputChange({
              target: { name: 'episodeNo', value: episode.episode_number.toString() }
            })}
          >
            {/* Episode thumbnail */}
            <div className="relative aspect-video rounded-lg overflow-hidden mb-3 
              bg-gray-900/40 backdrop-blur-sm">
              {episode.still_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w300${episode.still_path}`}
                  alt={episode.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-gray-400">No Preview</span>
                </div>
              )}
              {/* Current episode indicator */}
              {currentEpisode?.id === episode.id && (
                <div className="absolute top-2 right-2 flex items-center gap-2 
                  bg-[#02c39a] dark:bg-[#00edb8] px-3 py-1 rounded-full shadow-lg">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  <span className="text-xs font-medium">Playing</span>
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 p-2 
                bg-gradient-to-t from-black/80 to-transparent">
                <span className="text-sm font-medium text-white">
                  Episode {episode.episode_number}
                </span>
              </div>
            </div>

            {/* Episode info */}
            <div className="space-y-2">
              <h3 className="font-semibold line-clamp-1 group-hover:text-[#02c39a] 
                dark:group-hover:text-[#00edb8] transition-colors">
                {episode.name}
              </h3>
              <p className="text-sm text-gray-400 dark:text-gray-300 line-clamp-2">
                {episode.overview || 'No description available.'}
              </p>
              {episode.air_date && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Aired: {new Date(episode.air_date).toLocaleDateString()}
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default EpisodeGrid;
