// src/components/VideoSection.js
import React, { useRef, useEffect } from 'react';
import './VideoSection.css';

const VideoSection = React.memo(({ getIframeSrc }) => {
  const iframeSrc = getIframeSrc();
  const iframeRef = useRef(null);

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
          <div className="overlay"></div>
        </>
      )}
    </div>
  );
});

export default VideoSection;