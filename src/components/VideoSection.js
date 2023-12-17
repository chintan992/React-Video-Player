// src/components/VideoSection.js
import React from 'react';

const VideoSection = ({ getIframeSrc }) => {
  return (
    <div className="video-section">
      {/* Display the video using an iframe */}
      <iframe
        title="Series Episode or Movie"
        width="560"
        height="315"
        src={getIframeSrc()}
        frameBorder="0"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default VideoSection;
