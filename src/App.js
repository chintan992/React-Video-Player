// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import { DarkModeProvider } from './components/DarkModeContext'; // Adjust the import path

const AboutUs = () => <div>About Us</div>;
const Support = () => <div>Support</div>;

function App() {
  return (
    <DarkModeProvider>
      <Router>
        <div>
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/support" element={<Support />} />
          </Routes>
        </div>
      </Router>
    </DarkModeProvider>
  );
}

export default App;
