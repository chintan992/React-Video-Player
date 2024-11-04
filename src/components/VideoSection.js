// src/components/VideoSection.js
import React, { useRef, useEffect, useState } from 'react';
import './VideoSection.css';
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
            return event.returnValue = "Are you sure you want to exit?";
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
    <div className="video-section">
      {iframeSrc && (
        <>
          <iframe
            ref={iframeRef}
            src={iframeSrc}
            frameBorder="0"
            allowFullScreen
            title="Video Player"
          ></iframe>
          {!isPlaying && (
            <div 
              className="overlay"
              onClick={handleOverlayClick}
            >
              <div className="play-icon"></div>
            </div>
          )}
        </>
      )}
    </div>
  );
});

export default VideoSection;