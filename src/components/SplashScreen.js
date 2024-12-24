import React, { useEffect, useState } from 'react';

const SplashScreen = ({ onFinish }) => {
  const [isHiding, setIsHiding] = useState(false);
  const [text, setText] = useState('');
  const fullText = "Let's Stream";

  useEffect(() => {
    // Typewriter effect
    let currentIndex = 0;
    const textInterval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(textInterval);
      }
    }, 100);

    // Splash screen timer
    const timer = setTimeout(() => {
      setIsHiding(true);
      setTimeout(onFinish, 800);
    }, 2500);

    return () => {
      clearTimeout(timer);
      clearInterval(textInterval);
    };
  }, [onFinish]);

  return (
    <div 
      className={`fixed inset-0 flex items-center justify-center flex-col bg-gradient-to-br from-primary-500 to-secondary-500 z-[9999] 
        transition-all duration-800 ${
        isHiding ? 'opacity-0 scale-110' : 'opacity-100 scale-100'
      }`}
    >
      <div className="transform transition-transform">
        <img 
          src="/android-chrome-192x192.png" 
          alt="App Logo" 
          className="w-32 h-32 mb-6 animate-bounce hover:animate-spin rounded-full border-4 border-white/30"
        />
      </div>
      <h1 className="text-white text-3xl font-bold m-0 tracking-wider">
        {text}
        <span className="animate-pulse">|</span>
      </h1>
    </div>
  );
};

export default SplashScreen;
