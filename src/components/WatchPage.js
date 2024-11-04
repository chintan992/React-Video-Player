// src/components/WatchPage.js
import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDarkMode } from './DarkModeContext';
import MediaForm from './MediaForm';
import VideoSection from './VideoSection';
import './WatchPage.css';

const API_KEY = '297f1b91919bae59d50ed815f8d2e14c';
const BASE_URL = 'https://api.themoviedb.org/3';

function WatchPage() {
  const { mediaType, id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isDarkMode } = useDarkMode();
  const videoSectionRef = useRef(null);
  const popupBlockerInterval = useRef(null);

  const [mediaData, setMediaData] = useState({
    type: mediaType === 'movie' ? 'movie' : 'series',
    apiType: 'multiembed',
    seriesId: mediaType === 'tv' ? id : '',
    episodeNo: mediaType === 'tv' ? '1' : '',
    season: mediaType === 'tv' ? '1' : '',
    movieId: mediaType === 'movie' ? id : '',
  });
  const [isVideoReady, setIsVideoReady] = useState(false);

  // Fetch media details
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await fetch(`${BASE_URL}/${mediaType}/${id}?api_key=${API_KEY}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setItem(data);
        
        setMediaData(prevData => ({
          ...prevData,
          seriesId: mediaType === 'tv' ? id : '',
          movieId: mediaType === 'movie' ? id : '',
        }));
      } catch (error) {
        console.error('Error fetching detail data:', error);
        setError('Failed to load details. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetails();
  }, [id, mediaType]);

  // Popup blocker
  useEffect(() => {
    let originalOpen = window.open;
    let originalCreateElement = document.createElement;
    let blockedPopupCount = 0;

    const startPopupBlocker = () => {
      // Override window.open
      window.open = function() {
        blockedPopupCount++;
        console.log(`Popup blocked (${blockedPopupCount} total)`);
        return null;
      };

      // Override createElement to prevent creation of new window/popup triggers
      document.createElement = function(tagName) {
        const element = originalCreateElement.call(document, tagName);
        if (tagName.toLowerCase() === 'a') {
          element.addEventListener('click', (e) => {
            const href = element.getAttribute('href');
            if (href && (href.startsWith('javascript:window.open') || href.includes('popup'))) {
              e.preventDefault();
              console.log('Prevented popup from link click');
            }
          });
        }
        return element;
      };

      // Block window.open calls from iframes
      if (videoSectionRef.current) {
        const iframes = videoSectionRef.current.getElementsByTagName('iframe');
        Array.from(iframes).forEach(iframe => {
          try {
            if (iframe.contentWindow) {
              iframe.contentWindow.open = function() {
                console.log('Blocked popup from iframe');
                return null;
              };
            }
          } catch (e) {
            console.log('Could not access iframe content window');
          }
        });
      }
    };

    // Start the popup blocker
    startPopupBlocker();

    // Continuously monitor and block popups
    popupBlockerInterval.current = setInterval(startPopupBlocker, 1000);

    // Cleanup function
    return () => {
      window.open = originalOpen;
      document.createElement = originalCreateElement;
      if (popupBlockerInterval.current) {
        clearInterval(popupBlockerInterval.current);
      }
    };
  }, [isVideoReady]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsVideoReady(true);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className={`watch-page ${isDarkMode ? 'dark-mode' : ''}`}>
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={`watch-page ${isDarkMode ? 'dark-mode' : ''}`}>
        <div className="error-message">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Try Again</button>
        </div>
      </div>
    );
  }

  // No data state
  if (!item) {
    return (
      <div className={`watch-page ${isDarkMode ? 'dark-mode' : ''}`}>
        <div className="error-message">
          <h2>No Data Found</h2>
          <p>Unable to find the requested content.</p>
          <button onClick={() => navigate(-1)}>Go Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className={`watch-page ${isDarkMode ? 'dark-mode' : ''}`}>
      <button onClick={() => navigate(-1)} className="back-button">
        ← Back to Search
      </button>
      
      <div className="media-details">
        <h1>{item.title || item.name}</h1>
        <div className="media-info">
          <p><strong>Type:</strong> {mediaType === 'movie' ? 'Movie' : 'TV Show'}</p>
          <p><strong>Rating:</strong> {item.vote_average.toFixed(1)}/10</p>
          <p><strong>Release Date:</strong> {item.release_date || item.first_air_date || 'N/A'}</p>
          <p><strong>Overview:</strong> {item.overview || 'No overview available.'}</p>
          {mediaType === 'tv' && (
            <>
              <p><strong>Number of Seasons:</strong> {item.number_of_seasons || 'N/A'}</p>
              <p><strong>Number of Episodes:</strong> {item.number_of_episodes || 'N/A'}</p>
            </>
          )}
        </div>
      </div>

      <div className="watch-content" ref={videoSectionRef}>
        <MediaForm
          mediaData={mediaData}
          setMediaData={setMediaData}
          handleSubmit={handleSubmit}
        />
        {isVideoReady && (
          <div className="video-wrapper">
            <VideoSection mediaData={mediaData} />
          </div>
        )}
      </div>
    </div>
  );
}

export default WatchPage;