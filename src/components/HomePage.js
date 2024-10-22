// src/components/HomePage.js
import React, { useState, useCallback, useEffect } from 'react';
import './HomePage.css';
import VideoSection from './VideoSection';
import MediaForm from './MediaForm';

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

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    const validationError = validateForm();
    setError(validationError);
  }, [validateForm]);

  const getIframeSrc = useCallback(() => {
    const { type, apiType, seriesId, season, episodeNo, movieId } = mediaData;
    let baseUrl = '';

    switch (apiType) {
      case 'multiembed':
        baseUrl = 'https://multiembed.mov/';
        return type === 'series'
          ? `${baseUrl}?video_id=${seriesId}&s=${season}&e=${episodeNo}`
          : `${baseUrl}?video_id=${movieId}`;
      case 'autoembed':
        baseUrl = 'https://player.autoembed.cc/embed/';
        return type === 'series'
          ? `${baseUrl}tv/${seriesId}/${season}/${episodeNo}`
          : `${baseUrl}movie/${movieId}`;
      case '2embed':
        return type === 'series'
          ? `https://www.2embed.cc/embedtv/${seriesId}&s=${season}&e=${episodeNo}`
          : `https://www.2embed.cc/embed/${movieId}`;
      default:
        return '';
    }
  }, [mediaData]);

  useEffect(() => {
    let popupBlockerInterval;
    let originalWindowOpen = window.open;

    const popupBlocker = () => {
      window.open = function() {
        console.log("Popup blocked");
        return null;
      };
    };

    const startPopupBlocker = () => {
      popupBlocker();
      popupBlockerInterval = setInterval(popupBlocker, 100);
    };

    const stopPopupBlocker = () => {
      clearInterval(popupBlockerInterval);
      window.open = originalWindowOpen;
    };

    startPopupBlocker();

    return () => {
      stopPopupBlocker();
    };
  }, []);

  return (
    <div className="home-page-container">
      <div className="form-container">
        <div className="form-section">
          <h2>Welcome to LetsStream!</h2>
          {error && <p className="error-message">{error}</p>}
          <MediaForm
            mediaData={mediaData}
            setMediaData={setMediaData}
            handleSubmit={handleSubmit}
          />
        </div>
      </div>
      <VideoSection getIframeSrc={getIframeSrc} />
    </div>
  );
});

export default HomePage;