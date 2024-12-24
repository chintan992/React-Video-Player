import React from 'react';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';
import { useDarkMode } from './DarkModeContext';

const Footer = () => {
  const { isDarkMode } = useDarkMode();

  return (
    <footer className={`${isDarkMode ? 'bg-gray-900 text-gray-300' : 'bg-gray-100 text-gray-700'} transition-colors duration-200`}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <h3 className={`${isDarkMode ? 'text-white' : 'text-gray-900'} text-lg font-bold mb-4`}>Video Player</h3>
            <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              A modern video player built with React, providing seamless video playback experience.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className={`${isDarkMode ? 'text-white' : 'text-gray-900'} text-lg font-bold mb-4`}>Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/" className={`${isDarkMode ? 'hover:text-white' : 'hover:text-gray-900'} transition-colors`}>Home</a></li>
              <li><a href="/about" className={`${isDarkMode ? 'hover:text-white' : 'hover:text-gray-900'} transition-colors`}>About Us</a></li>
              <li><a href="/support" className={`${isDarkMode ? 'hover:text-white' : 'hover:text-gray-900'} transition-colors`}>Support</a></li>
              <li><a href="/search" className={`${isDarkMode ? 'hover:text-white' : 'hover:text-gray-900'} transition-colors`}>Search</a></li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className={`${isDarkMode ? 'text-white' : 'text-gray-900'} text-lg font-bold mb-4`}>Connect With Us</h3>
            <div className="flex space-x-4">
              <a href="https://github.com/chintan992" className={`${isDarkMode ? 'hover:text-white' : 'hover:text-gray-900'} transition-colors`}>
                <FaGithub size={24} />
              </a>
              <a href="https://linkedin.com/in/chintan992" className={`${isDarkMode ? 'hover:text-white' : 'hover:text-gray-900'} transition-colors`}>
                <FaLinkedin size={24} />
              </a>
              <a href="https://twitter.com/sid992r" className={`${isDarkMode ? 'hover:text-white' : 'hover:text-gray-900'} transition-colors`}>
                <FaTwitter size={24} />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className={`border-t ${isDarkMode ? 'border-gray-800' : 'border-gray-200'} mt-8 pt-4 text-center text-sm`}>
          <p>&copy; {new Date().getFullYear()} Video Player. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
