import React, { useState } from 'react';

const Settings = ({ onToggleSplashCursor }) => {
  const [isSplashCursorEnabled, setIsSplashCursorEnabled] = useState(true);

  const handleToggle = () => {
    const newValue = !isSplashCursorEnabled;
    setIsSplashCursorEnabled(newValue);
    onToggleSplashCursor(newValue); // Notify parent component of the change
  };

  return (
    <div className="settings-container">
      <h1 className="text-lg font-bold">Settings</h1>
      <div className="flex items-center">
        <label className="mr-2">Enable Splash Cursor:</label>
        <input
          type="checkbox"
          checked={isSplashCursorEnabled}
          onChange={handleToggle}
        />
      </div>
    </div>
  );
};

export default Settings;
