import React, { useEffect, useState } from 'react';

const SplashScreen = ({ onFinish }) => {
  const [isHiding, setIsHiding] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsHiding(true);
      setTimeout(onFinish, 500); // Wait for fade out animation
    }, 2000); // Show splash screen for 2 seconds

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div 
      className={`fixed inset-0 flex items-center justify-center flex-col bg-orange-500 z-50 transition-opacity duration-500 ${
        isHiding ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <img 
        src="/android-chrome-192x192.png" 
        alt="App Logo" 
        className="w-32 h-32 mb-6 animate-pulse"
      />
      <h1 className="text-white text-2xl font-bold m-0">
        Let's Stream
      </h1>
    </div>
  );
};

export default SplashScreen;
