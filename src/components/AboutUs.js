// src/components/AboutUs.js

// Import necessary dependencies
import React from 'react';
import { FiMonitor, FiUsers, FiCode, FiTrendingUp, FiGithub, FiTwitter, FiLinkedin } from 'react-icons/fi';
import { useDarkMode } from './DarkModeContext';
import Hyperspeed from '../background/Hyperspeed';
import { hyperspeedPresets } from '../background/Hyperspeedpreset';

const AboutUs = () => {
  const { isDarkMode } = useDarkMode();

  const features = [
    {
      icon: <FiMonitor className="w-8 h-8" />,
      title: "Seamless Streaming",
      description: "Access your favorite content with our intuitive streaming interface, designed for maximum enjoyment."
    },
    {
      icon: <FiUsers className="w-8 h-8" />,
      title: "User-Centric Design",
      description: "Built with you in mind, featuring personalized recommendations and user preferences."
    },
    {
      icon: <FiCode className="w-8 h-8" />,
      title: "Modern Technology",
      description: "Powered by cutting-edge web technologies including React and modern APIs."
    },
    {
      icon: <FiTrendingUp className="w-8 h-8" />,
      title: "Continuous Growth",
      description: "Regular updates and new features to enhance your streaming experience."
    }
  ];

  const teamMembers = [
    {
      name: "Chintan Rathod",
      role: "Lead Developer & Designer",
      image: "https://avatar.iran.liara.run/public/boy?username=john",
      social: {
        github: "https://github.com/chintan992",
        twitter: "https://twitter.com/sid992r",
        linkedin: "https://linkedin.com/in/chintan992"
      }
    }
  ];

  return (
    <>
      {/* Fixed Hyperspeed Background */}
      <div className="fixed inset-0 z-0">
        <Hyperspeed effectOptions={{
          ...hyperspeedPresets.cyberpunk,
          colors: {
            ...hyperspeedPresets.cyberpunk.colors,
            background: isDarkMode ? 0x000000 : 0xffffff,
          }
        }} />
      </div>

      {/* Scrollable Content with improved mobile layout */}
      <div className="relative z-10 min-h-screen w-full overflow-x-hidden">
        <div className={`w-full ${
          isDarkMode 
            ? 'bg-[#000e14]/70 backdrop-blur-sm' 
            : 'bg-white/70 backdrop-blur-sm'
        }`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            {/* Hero Section - improved mobile spacing */}
            <div className="text-center px-4 sm:px-6">
              <h1 className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Welcome to Let's Stream
              </h1>
              <p className={`text-lg sm:text-xl mb-8 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Your premier destination for seamless streaming entertainment
              </p>
            </div>

            {/* Features Grid - improved mobile spacing */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-12 sm:mb-16 px-4 sm:px-0">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`p-6 rounded-lg transition-transform duration-300 hover:scale-105 ${
                    isDarkMode
                      ? 'bg-gray-800 hover:bg-gray-700'
                      : 'bg-white hover:bg-gray-50 shadow-lg'
                  }`}
                >
                  <div className={`mb-4 ${isDarkMode ? 'text-primary-400' : 'text-primary-600'}`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Mission Statement - improved mobile spacing */}
            <div className={`text-center max-w-3xl mx-auto mb-12 sm:mb-16 px-4 sm:px-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              <h2 className={`text-3xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Our Mission
              </h2>
              <p className="text-lg leading-relaxed mb-4">
                At Let's Stream, we're passionate about bringing you the best streaming experience possible. 
                Our mission is to provide a user-friendly platform that connects you with your favorite movies 
                and TV series, all in one place.
              </p>
              <p className="text-lg leading-relaxed">
                We believe in the power of entertainment to bring people together and create memorable experiences. 
                That's why we're constantly working to improve our platform and bring you the latest features 
                and content.
              </p>
            </div>

            {/* Team Section - improved mobile spacing */}
            <div className="text-center mb-12 sm:mb-16 px-4 sm:px-0">
              <h2 className={`text-2xl sm:text-3xl font-bold mb-8 sm:mb-12 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Meet Our Team
              </h2>
              <div className="grid grid-cols-1 gap-8 sm:gap-12 max-w-4xl mx-auto">
                {teamMembers.map((member, index) => (
                  <div
                    key={index}
                    className={`p-6 rounded-lg transition-transform duration-300 hover:scale-105 ${
                      isDarkMode
                        ? 'bg-gray-800 hover:bg-gray-700'
                        : 'bg-white hover:bg-gray-50 shadow-lg'
                    }`}
                  >
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                    />
                    <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
                    <p className={`mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {member.role}
                    </p>
                    <div className="flex justify-center space-x-4">
                      <a
                        href={member.social.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`hover:text-primary-500 transition-colors ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}
                      >
                        <FiGithub className="w-6 h-6" />
                      </a>
                      <a
                        href={member.social.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`hover:text-primary-500 transition-colors ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}
                      >
                        <FiTwitter className="w-6 h-6" />
                      </a>
                      <a
                        href={member.social.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`hover:text-primary-500 transition-colors ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}
                      >
                        <FiLinkedin className="w-6 h-6" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Section - improved mobile spacing */}
            <div className={`text-center max-w-2xl mx-auto px-4 sm:px-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              <h2 className={`text-3xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Get in Touch
              </h2>
              <p className="text-lg mb-8">
                Have questions or suggestions? We'd love to hear from you! Reach out to us at{' '}
                <a
                  href="mailto:contact@letsstream.com"
                  className={`font-medium hover:underline ${isDarkMode ? 'text-primary-400' : 'text-primary-600'}`}
                >
                  contact@letsstream.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutUs;