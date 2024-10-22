// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import AboutUs from './components/AboutUs';
import Support from './components/Support';
import { DarkModeProvider, useDarkMode } from './components/DarkModeContext';
import './App.css';

function AppContent() {
  const { isDarkMode } = useDarkMode();

  return (
    <div className={`App ${isDarkMode ? 'dark-mode' : ''}`}>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/support" element={<Support />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <DarkModeProvider>
      <Router>
        <AppContent />
      </Router>
    </DarkModeProvider>
  );
}

export default App;