import React from 'react';

const ViewMoreButton = ({ hasMore, handleViewMore, isLoadingMore }) => {
  return (
    hasMore && (
      <div className="flex justify-center mt-8 mb-12">
        <button
          onClick={handleViewMore}
          disabled={isLoadingMore}
          className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600
            transition-colors duration-200 focus:outline-none focus:ring-2
            focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoadingMore ? (
            <div className="flex items-center">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Loading...
            </div>
          ) : (
            'View More'
          )}
        </button>
      </div>
    )
  );
};

export default ViewMoreButton;
