import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaPlay, FaInfoCircle } from 'react-icons/fa';

const FeaturedContent = ({ item }) => {
  const navigate = useNavigate();

  const handlePlayClick = () => {
    navigate(`/watch/${item.media_type}/${item.id}`);
  };

  const handleMoreInfoClick = () => {
    // Implement modal or navigate to details page
  };

  return (
    <div className="relative aspect-[16/9] rounded-xl overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={`https://image.tmdb.org/t/p/original${item.backdrop_path}`}
          alt={item.title || item.name}
          className="w-full h-full object-cover"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-8 md:p-12">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-2 sm:mb-4"
        >
          <span className="px-2 py-1 sm:px-3 sm:py-1 bg-primary-500 text-white rounded-full text-xs sm:text-sm font-medium">
            Featured
          </span>
        </motion.div>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-2xl sm:text-4xl md:text-5xl font-bold text-white mb-2 sm:mb-4"
        >
          {item.title || item.name}
        </motion.h2>

        {/* Overview */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-gray-200 text-sm sm:text-lg mb-4 sm:mb-6 line-clamp-2 sm:line-clamp-3 max-w-full sm:max-w-2xl"
        >
          {item.overview}
        </motion.p>

        {/* Metadata */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex items-center gap-2 sm:gap-4 mb-4 sm:mb-6"
        >
          <span className="bg-yellow-500 text-black px-2 py-0.5 rounded text-xs sm:text-sm font-medium">
            {item.vote_average?.toFixed(1)}
          </span>
          <span className="text-gray-300 text-xs sm:text-sm">
            {new Date(item.release_date || item.first_air_date).getFullYear()}
          </span>
          {item.adult && (
            <span className="bg-red-500 text-white px-2 py-0.5 rounded text-xs sm:text-sm">
              18+
            </span>
          )}
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePlayClick}
            className="w-full sm:w-auto px-3 sm:px-6 py-2 sm:py-2 bg-white text-black rounded-lg text-sm sm:text-base font-medium flex items-center justify-center gap-2 hover:bg-white/90 transition-colors"
          >
            <FaPlay /> Play Now
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleMoreInfoClick}
            className="w-full sm:w-auto px-3 sm:px-6 py-2 sm:py-2 bg-gray-600/80 text-white rounded-lg text-sm sm:text-base font-medium flex items-center justify-center gap-2 hover:bg-gray-600/90 transition-colors"
          >
            <FaInfoCircle /> More Info
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default FeaturedContent;
