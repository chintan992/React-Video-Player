// src/components/VideoSection.js
import React, { useRef, useEffect, useState } from 'react';
import { getIframeSrc } from '../api';

const VideoSection = React.memo(({ mediaData }) => {
  const iframeSrc = getIframeSrc(mediaData);
  const iframeRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const currentIframe = iframeRef.current;

    const handleLoad = () => {
      try {
        // Frame Buster Buster
        if (currentIframe && currentIframe.contentWindow) {
          currentIframe.contentWindow.addEventListener('beforeunload', (event) => {
            event.preventDefault();
            return (event.returnValue = "Are you sure you want to exit?");
          });
        }
      } catch (error) {
        console.error("Error in frame buster buster:", error);
      }
    };

    if (currentIframe) {
      currentIframe.addEventListener('load', handleLoad);
    }

    return () => {
      if (currentIframe) {
        currentIframe.removeEventListener('load', handleLoad);
      }
    };
  }, [iframeSrc]);

  const handleOverlayClick = () => {
    setIsPlaying(true);
  };

  return (
    <div className="relative w-full h-0 pb-[56.25%] mt-5"> {/* 16:9 aspect ratio */}
      {iframeSrc && (
        <>
          <iframe
            ref={iframeRef}
            src={iframeSrc}
            className="absolute top-0 left-0 w-full h-full border-0"
            allowFullScreen
            title="Video Player"
          ></iframe>
          {!isPlaying && (
            <div 
              className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-60 flex justify-center items-center cursor-pointer"
              onClick={handleOverlayClick}
            >
              <div className="w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-b-[30px] border-b-white"></div> {/* Play icon */}
            </div>
          )}
        </>
      )}
    </div>
  );
});

export default VideoSection;