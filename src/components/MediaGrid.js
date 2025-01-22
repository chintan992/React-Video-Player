import React from 'react';
import { motion } from 'framer-motion';
import MediaCard from './common/MediaCard';
import { MediaItemSkeleton } from './common/SkeletonLoader';

const MediaGrid = ({ mediaItems, isStreamingLoading, watchlist, handleWatchlistToggle }) => {
  return (
    <div className="grid gap-3 grid-cols-3 sm:gap-4 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
      {isStreamingLoading ? (
        Array.from({ length: 8 }).map((_, index) => (
          <MediaItemSkeleton key={`skeleton-${index}`} />
        ))
      ) : mediaItems.length > 0 ? (
        mediaItems.map((item) => (
          <motion.div
            key={`${item.id}-${item.media_type}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <MediaCard
              item={{
                ...item,
                media_type: item.media_type || (item.first_air_date ? 'tv' : 'movie')
              }}
              onWatchlistToggle={() => handleWatchlistToggle(item)}
              isInWatchlist={watchlist.some((watchItem) => watchItem.id === item.id)}
            />
          </motion.div>
        ))
      ) : (
        <div className="col-span-full text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">No items found</p>
        </div>
      )}
    </div>
  );
};

export default MediaGrid;
