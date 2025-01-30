import React from 'react';
import { useDarkMode } from './DarkModeContext';

const ApiSelector = ({ availableApis, currentApi, onApiChange }) => {
  const { isDarkMode } = useDarkMode();

  return (
    <div className="mt-6 bg-white dark:bg-[#000e14] rounded-xl shadow-lg p-6">
      <h2 className="text-lg font-semibold mb-4">Select Video Source</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {availableApis.filter(api => api.isWorking).map((api) => (
          <button
            key={api.id}
            onClick={() => onApiChange(api.id)}
            className={`flex flex-col p-4 rounded-lg border-2 transition-all duration-200
              ${currentApi === api.id
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'
              }
              ${isDarkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'}
            `}
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className={`font-medium
                ${currentApi === api.id
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-900 dark:text-white'
                }`}
              >
                {api.name}
              </h3>
              {currentApi === api.id && (
                <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {api.description}
            </p>
          </button>
        ))}
      </div>
      {/* Info section */}
      <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <div className="flex items-start">
          <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            If the current source isn't working, try switching to a different one. Some sources may work better than others depending on your location and the content.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ApiSelector;
