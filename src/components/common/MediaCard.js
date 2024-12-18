import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaPlay, FaHeart, FaShare } from 'react-icons/fa';
//import toast from 'react-hot-toast';
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from 'react-share';

const MediaCard = ({ item, onWatchlistToggle, isInWatchlist }) => {
  const navigate = useNavigate();
 // const [isHovered, setIsHovered] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  const handlePlayClick = () => {
    const mediaType = item.media_type || 'movie'; // Default to movie if not specified
    navigate(`/watch/${mediaType}/${item.id}`);
  };

  const handleWatchlistClick = () => {
    onWatchlistToggle(item);
  };

  const handleShareClick = (e) => {
    e.stopPropagation();
    setShowShareMenu(!showShareMenu);
  };

  const shareUrl = `${window.location.origin}/watch/${item.media_type}/${item.id}`;
  const title = item.title || item.name;

  return (
    <motion.div
      className="relative aspect-[2/3] rounded-lg overflow-hidden group"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      //onHoverStart={() => setIsHovered(true)}
      //onHoverEnd={() => setIsHovered(false)}
    >
      <img
        src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
        alt={title}
        className="w-full h-full object-cover"
        loading="lazy"
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Content */}
      <div className="absolute inset-0 p-2 sm:p-4 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {/* Title Section */}
        <div className="text-white">
          <h3 className="text-sm sm:text-lg font-bold line-clamp-1 sm:line-clamp-2">{title}</h3>
          <p className="text-xs sm:text-sm text-gray-300">{item.release_date?.slice(0, 4) || item.first_air_date?.slice(0, 4)}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={handlePlayClick}
            className="p-1.5 sm:p-2 bg-primary-500 rounded-full text-white hover:bg-primary-600 transition-colors"
            aria-label="Play"
          >
            <FaPlay className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>

          <button
            onClick={handleWatchlistClick}
            className={`p-1.5 sm:p-2 rounded-full transition-colors ${
              isInWatchlist
                ? 'bg-red-500 text-white'
                : 'bg-gray-800 text-white hover:bg-gray-700'
            }`}
            aria-label={isInWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
          >
            <FaHeart className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>

          <div className="relative">
            <button
              onClick={handleShareClick}
              className="p-1.5 sm:p-2 bg-gray-800 rounded-full text-white hover:bg-gray-700 transition-colors"
              aria-label="Share"
            >
              <FaShare className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>

            {/* Share Menu */}
            <AnimatePresence mode="sync">
              {showShareMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute bottom-full left-0 mb-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 flex flex-col gap-2"
                >
                  <FacebookShareButton url={shareUrl} quote={title}>
                    <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded">
                      Facebook
                    </div>
                  </FacebookShareButton>
                  <TwitterShareButton url={shareUrl} title={title}>
                    <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded">
                      Twitter
                    </div>
                  </TwitterShareButton>
                  <WhatsappShareButton url={shareUrl} title={title}>
                    <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded">
                      WhatsApp
                    </div>
                  </WhatsappShareButton>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MediaCard;
