import React from 'react';

const Skeleton = ({ isDarkMode }) => (
  <div className={`flex items-center justify-center min-h-screen ${isDarkMode ? 'bg-[#000e14] text-white' : 'bg-gray-50 text-black'}`}>
    <div className="flex flex-col items-center space-y-4 p-8 rounded-lg bg-opacity-50 backdrop-blur-sm">
      <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      <div className="flex flex-col items-center">
        <p className="text-xl font-medium">Loading content</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">Please wait a moment...</p>
      </div>
    </div>
  </div>
);

export default Skeleton;
