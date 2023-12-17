// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Navigation from './components/Navigation';
import HomePage from './components/HomePage';
import AboutUsPage from './components/AboutUsPage';
import SupportPage from './components/SupportPage';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// Define your custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#FFFFB3',
    },
    secondary: {
      main: '#DCAB6B',
    },
    error: {
      main: '#6E0D25',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <div>
          <Header />
          <Navigation />
          <Routes>
            <Route path="/about" element={<AboutUsPage />} />
            <Route path="/support" element={<SupportPage />} />
            <Route path="/" element={<HomePage />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
