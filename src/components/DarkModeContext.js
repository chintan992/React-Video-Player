// src/components/DarkModeContext.js

// Import necessary hooks and functions from React
import React, { createContext, useState, useContext, useEffect } from 'react';

// Create a new context for dark mode
const DarkModeContext = createContext();

// Define the DarkModeProvider component
export const DarkModeProvider = ({ children }) => {
  // Create a state variable for dark mode status
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Use effect hook to run once when component mounts
  useEffect(() => {
    // Retrieve dark mode setting from local storage
    const savedMode = localStorage.getItem('darkMode');
    // If a setting exists, update the state
    if (savedMode) {
      setIsDarkMode(JSON.parse(savedMode));
    }
  }, []); // Empty dependency array means this runs once on mount

  // Function to toggle dark mode
  const toggleDarkMode = () => {
    // Toggle the current mode
    const newMode = !isDarkMode;
    // Update the state
    setIsDarkMode(newMode);
    // Save the new mode to local storage
    localStorage.setItem('darkMode', JSON.stringify(newMode));
  };

  // Provide the dark mode context to children components
  return (
    <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};

// Custom hook to use the dark mode context
export const useDarkMode = () => useContext(DarkModeContext);