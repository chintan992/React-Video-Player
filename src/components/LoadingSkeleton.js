// src/components/LoadingSkeleton.js
import React from 'react';

const LoadingSkeleton = () => {
  return (
    <div className="group relative rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow-lg">
      {/* Image Skeleton */}
      <div className="relative aspect-[2/3] bg-gray-200 dark:bg-gray-700 animate-pulse" />
      
      {/* Content Skeleton */}
      <div className="p-3 sm:p-4 space-y-3">
        {/* Title Skeleton */}
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        
        {/* Rating and Year */}
        <div className="flex items-center space-x-2">
          <div className="h-5 w-12 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
          <div className="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>
        
        {/* Overview */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-5/6" />
        </div>
      </div>
    </div>
  );
};

export default LoadingSkeleton;
