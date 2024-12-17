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
      <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-4"
        >
          <span className="px-3 py-1 bg-primary-500 text-white rounded-full text-sm font-medium">
            Featured
          </span>
        </motion.div>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-4xl md:text-5xl font-bold text-white mb-4"
        >
          {item.title || item.name}
        </motion.h2>

        {/* Overview */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-gray-200 text-lg mb-6 line-clamp-2 md:line-clamp-3 max-w-2xl"
        >
          {item.overview}
        </motion.p>

        {/* Metadata */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex items-center gap-4 mb-6"
        >
          <span className="bg-yellow-500 text-black px-2 py-0.5 rounded font-medium">
            {item.vote_average?.toFixed(1)}
          </span>
          <span className="text-gray-300">
            {new Date(item.release_date || item.first_air_date).getFullYear()}
          </span>
          {item.adult && (
            <span className="bg-red-500 text-white px-2 py-0.5 rounded text-sm">
              18+
            </span>
          )}
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex items-center gap-4"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePlayClick}
            className="px-8 py-3 bg-white text-black rounded-lg font-medium flex items-center gap-2 hover:bg-white/90 transition-colors"
          >
            <FaPlay /> Play Now
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleMoreInfoClick}
            className="px-8 py-3 bg-gray-600/80 text-white rounded-lg font-medium flex items-center gap-2 hover:bg-gray-600/90 transition-colors"
          >
            <FaInfoCircle /> More Info
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default FeaturedContent;
