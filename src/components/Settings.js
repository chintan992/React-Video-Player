// src/components/Settings.js

import React, { useState, useEffect } from 'react';
import { useDarkMode } from './DarkModeContext';
import Hyperspeed from '../background/Hyperspeed';
import { hyperspeedPresets } from '../background/Hyperspeedpreset';

const Settings = ({ onToggleSplashCursor }) => {
  const { isDarkMode } = useDarkMode();
  const [isSplashCursorEnabled, setIsSplashCursorEnabled] = useState(true);

  // Check local storage for cached preference on mount
  useEffect(() => {
    const cachedValue = localStorage.getItem('splashCursorEnabled');
    const expirationDate = localStorage.getItem('splashCursorExpiration');
    const now = new Date().getTime();

    if (cachedValue && expirationDate && now < expirationDate) {
      setIsSplashCursorEnabled(JSON.parse(cachedValue));
    }
  }, []);

  const handleToggle = () => {
    const newValue = !isSplashCursorEnabled;
    setIsSplashCursorEnabled(newValue);
    onToggleSplashCursor(newValue); // Notify parent component of the change

    // Save preference in local storage with expiration
    localStorage.setItem('splashCursorEnabled', JSON.stringify(newValue));
    localStorage.setItem('splashCursorExpiration', new Date().getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days
  };

  return (
    <>
      {/* Fixed Hyperspeed Background */}
      <div className="fixed inset-0 z-0">
        <Hyperspeed
          effectOptions={{
            ...hyperspeedPresets.cyberpunk,
            colors: {
              ...hyperspeedPresets.cyberpunk.colors,
              background: isDarkMode ? 0x000000 : 0xffffff,
            },
          }}
        />
      </div>

      {/* Scrollable Content with improved mobile layout */}
      <div className="relative z-10 min-h-screen w-full overflow-x-hidden">
        <div
          className={`w-full ${
            isDarkMode
              ? 'bg-gray-900/70 backdrop-blur-sm'
              : 'bg-white/70 backdrop-blur-sm'
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            {/* Hero Section - improved mobile spacing */}
            <div className="text-center px-4 sm:px-6">
              <h1
                className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-4 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}
              >
                Settings
              </h1>
              <p
                className={`text-lg sm:text-xl mb-8 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}
              >
                Customize your experience
              </p>
            </div>

            {/* Toggle Section */}
            <div className="flex items-center justify-center mb-12">
              <label
                htmlFor="splash-cursor-toggle"
                className={`mr-2 text-lg ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}
              >
                Enable Splash Cursor:
              </label>
              <input
                id="splash-cursor-toggle"
                type="checkbox"
                checked={isSplashCursorEnabled}
                onChange={handleToggle}
                className="toggle-checkbox w-5 h-5 rounded focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              />
            </div>

            {/* Features Section */}
            {/* Add your features here */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;