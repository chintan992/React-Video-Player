import React from 'react';
import { useDarkMode } from './DarkModeContext';

const UseBrave = () => {
  const { isDarkMode } = useDarkMode();

  return (
    <div className={`${isDarkMode ? 'bg-gray-800 text-gray-200' : 'bg-gray-100 text-gray-800'} 
                    p-4 rounded-lg border ${isDarkMode ? 'border-gray-700' : 'border-gray-300'} 
                    my-4 flex items-center justify-center`}>
      <span className="text-sm sm:text-base">
        For an ad-free experience and better privacy, consider using 
        <a href="https://brave.com" target="_blank" rel="noopener noreferrer" className="ml-1 font-semibold underline">
          Brave Browser
        </a>.
      </span>
      <br />
      <span>
        Make Sure you enable Ad blocker and Popup blocker in the settings.
      </span>
    </div>
  );
};

export default UseBrave;
