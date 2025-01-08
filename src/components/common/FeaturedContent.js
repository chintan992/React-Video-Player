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
    <div className="relative aspect-[16/9] md:aspect-[21/9] rounded-lg md:rounded-xl overflow-hidden">
      {/* Background Image with better mobile optimization */}
      <div className="absolute inset-0">
        <picture>
          {/* Mobile-optimized image */}
          <source
            media="(max-width: 768px)"
            srcSet={`https://image.tmdb.org/t/p/w780${item.backdrop_path}`}
          />
          {/* Desktop image */}
          <img
            src={`https://image.tmdb.org/t/p/original${item.backdrop_path}`}
            alt={item.title || item.name}
            className="w-full h-full object-cover"
            loading="eager"
          />
        </picture>
        {/* Enhanced gradient overlay for better text visibility on mobile */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
      </div>

      {/* Content with improved mobile layout */}
      <div className="absolute inset-0 flex flex-col justify-end p-3 sm:p-6 md:p-8 lg:p-12">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-1 sm:mb-3"
        >
          <span className="px-2 py-0.5 sm:px-3 sm:py-1 bg-primary-500 text-white rounded-full text-[10px] sm:text-sm font-medium">
            Featured
          </span>
        </motion.div>

        {/* Title with improved mobile typography */}
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-1 sm:mb-3 line-clamp-2"
        >
          {item.title || item.name}
        </motion.h2>

        {/* Overview with better mobile readability */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="hidden sm:block text-sm md:text-base text-gray-200 mb-4 line-clamp-3 max-w-2xl"
        >
          {item.overview}
        </motion.p>

        {/* Metadata with mobile-optimized spacing */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex items-center gap-2 mb-2 sm:mb-4"
        >
          <span className="bg-yellow-500 text-black px-1.5 py-0.5 rounded text-[10px] sm:text-sm font-medium">
            {item.vote_average?.toFixed(1)}
          </span>
          <span className="text-gray-300 text-[10px] sm:text-sm">
            {new Date(item.release_date || item.first_air_date).getFullYear()}
          </span>
          {item.adult && (
            <span className="bg-red-500 text-white px-1.5 py-0.5 rounded text-[10px] sm:text-sm">
              18+
            </span>
          )}
        </motion.div>

        {/* Action Buttons with improved mobile touch targets */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex gap-2 sm:gap-4"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePlayClick}
            className="flex-1 sm:flex-none min-h-[40px] px-3 sm:px-6 py-2 bg-white text-black rounded-lg 
              text-sm sm:text-base font-medium flex items-center justify-center gap-2 
              hover:bg-white/90 transition-colors active:bg-white/80 touch-manipulation"
          >
            <FaPlay className="text-xs sm:text-sm" /> 
            <span className="whitespace-nowrap">Play Now</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleMoreInfoClick}
            className="flex-1 sm:flex-none min-h-[40px] px-3 sm:px-6 py-2 bg-gray-600/80 text-white 
              rounded-lg text-sm sm:text-base font-medium flex items-center justify-center gap-2 
              hover:bg-gray-600/90 transition-colors active:bg-gray-600 touch-manipulation"
          >
            <FaInfoCircle className="text-xs sm:text-sm" /> 
            <span className="whitespace-nowrap">More Info</span>
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default FeaturedContent;
