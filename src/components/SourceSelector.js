import React from 'react';
import { VIDEO_SOURCES } from '../api';

const SourceSelector = ({ videoSource, handleSourceChange, showSourceMenu, setShowSourceMenu }) => (
  <div className="mb-4">
    <div className="relative">
      <button
        onClick={() => setShowSourceMenu(!showSourceMenu)}
        className="w-full bg-white dark:bg-gray-800 px-4 py-2 rounded-lg flex items-center justify-between shadow-sm border border-gray-200 dark:border-gray-700"
      >
        <span className="flex items-center gap-2">
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          {VIDEO_SOURCES[videoSource].name}
          <span className="text-xs text-gray-500 dark:text-gray-400">
            ({VIDEO_SOURCES[videoSource].quality})
          </span>
        </span>
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {showSourceMenu && (
        <>
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setShowSourceMenu(false)}
          />
          <div className="absolute mt-2 w-full rounded-lg bg-white dark:bg-gray-800 shadow-lg z-50">
            {Object.entries(VIDEO_SOURCES).map(([key, { name, quality }]) => (
              <button
                key={key}
                onClick={() => {
                  handleSourceChange(key);
                  setShowSourceMenu(false);
                }}
                className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex justify-between items-center"
              >
                <span>{name}</span>
                <span className="text-xs text-gray-500">{quality}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  </div>
);

export default SourceSelector;
