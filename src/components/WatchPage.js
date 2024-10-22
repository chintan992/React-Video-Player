// src/components/WatchPage.js
import React, { useEffect, useState } from 'react';
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
  const [mediaData, setMediaData] = useState({
    type: mediaType === 'movie' ? 'movie' : 'series',
    apiType: 'multiembed',
    seriesId: mediaType === 'tv' ? id : '',
    episodeNo: mediaType === 'tv' ? '1' : '',
    season: mediaType === 'tv' ? '1' : '',
    movieId: mediaType === 'movie' ? id : '',
  });
  const [isVideoReady, setIsVideoReady] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await fetch(`${BASE_URL}/${mediaType}/${id}?api_key=${API_KEY}`);
        const data = await response.json();
        setItem(data);
        
        // Update mediaData with the correct ID
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

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsVideoReady(true);
  };

  if (isLoading) return <div className={`watch-page ${isDarkMode ? 'dark-mode' : ''}`}>Loading...</div>;
  if (error) return <div className={`watch-page ${isDarkMode ? 'dark-mode' : ''}`}>{error}</div>;
  if (!item) return <div className={`watch-page ${isDarkMode ? 'dark-mode' : ''}`}>No data found</div>;

  return (
    <div className={`watch-page ${isDarkMode ? 'dark-mode' : ''}`}>
      <button onClick={() => navigate(-1)} className="back-button">Back to Search</button>
      <h1>{item.title || item.name}</h1>
      <p><strong>Type:</strong> {mediaType === 'movie' ? 'Movie' : 'TV Show'}</p>
      <p><strong>Rating:</strong> {item.vote_average}/10</p>
      <p><strong>Release Date:</strong> {item.release_date || item.first_air_date || 'N/A'}</p>
      <p><strong>Overview:</strong> {item.overview || 'No overview available.'}</p>
      {mediaType === 'tv' && (
        <>
          <p><strong>Number of Seasons:</strong> {item.number_of_seasons || 'N/A'}</p>
          <p><strong>Number of Episodes:</strong> {item.number_of_episodes || 'N/A'}</p>
        </>
      )}
      <div className="watch-content">
        <MediaForm
          mediaData={mediaData}
          setMediaData={setMediaData}
          handleSubmit={handleSubmit}
        />
        {isVideoReady && (
          <VideoSection mediaData={mediaData} />
        )}
      </div>
    </div>
  );
}

export default WatchPage;