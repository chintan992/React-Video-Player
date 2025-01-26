import React from 'react';

const Recommendations = ({ recommendations, handleListItemClick }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
    <h2 className="text-xl font-bold mb-4">Recommendations</h2>
    <div className="space-y-4">
      {recommendations.slice(0, 5).map((rec) => (
        <div
          key={rec.id}
          onClick={() => handleListItemClick(rec)}
          className="flex items-center space-x-3 p-2 rounded-lg cursor-pointer
            hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
        >
          <img
            src={`https://image.tmdb.org/t/p/w92${rec.poster_path}`}
            alt={rec.title || rec.name}
            className="w-16 h-20 object-cover rounded"
          />
          <div>
            <h3 className="font-medium line-clamp-2">{rec.title || rec.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Rating: {rec.vote_average.toFixed(1)}
            </p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default Recommendations;
