// src/components/HomePage.js
import React, { useState, useCallback, useEffect } from 'react';
import './HomePage.css';
import VideoSection from './VideoSection';
import MediaForm from './MediaForm';
import { getIframeSrc } from '../api';

const HomePage = React.memo(() => {
  const [mediaData, setMediaData] = useState({
    type: 'series',
    apiType: 'multiembed',
    seriesId: '',
    episodeNo: '',
    season: '',
    movieId: '',
  });
  const [error, setError] = useState('');
  const [showVideo, setShowVideo] = useState(false); // Initially hide video section

  const validateForm = useCallback(() => {
    const { type, seriesId, season, episodeNo, movieId } = mediaData;
    if (type === 'series' && (!seriesId || !season || !episodeNo)) {
      return 'Please fill in all series fields.';
    }
    if (type === 'movie' && !movieId) {
      return 'Please fill in the movie ID.';
    }
    return '';
  }, [mediaData]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
    } else {
      setError('');
      setShowVideo(true); 
    }
  }, [validateForm]);

  useEffect(() => {
    // ... (Popup blocker code - Consider removing or refining for mobile)
  }, []);

  return (
    <div className="home-page-container">
      <div className="form-container">
        <div className="form-section">
          <h2>LetsStream!</h2> 
          {error && <p className="error-message">{error}</p>}
          <MediaForm
            mediaData={mediaData}
            setMediaData={setMediaData}
            handleSubmit={handleSubmit}
          />
        </div>
      </div>
      {showVideo && ( // Conditionally render VideoSection
        <VideoSection getIframeSrc={() => getIframeSrc(mediaData)} />
      )}
    </div>
  );
});

export default HomePage;
