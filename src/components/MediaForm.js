// src/components/MediaForm.js
import React, { useState, useEffect } from 'react';
import './MediaForm.css';

const API_KEY = '297f1b91919bae59d50ed815f8d2e14c'; // Replace with your actual TMDB API key

const MediaForm = React.memo(({ mediaData, setMediaData, handleSubmit }) => {
  const [seasons, setSeasons] = useState([]);
  const [episodes, setEpisodes] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMediaData(prevData => ({ ...prevData, [name]: value }));
  };

  useEffect(() => {
    const fetchSeasons = async () => {
      if (mediaData.type === 'series' && mediaData.seriesId) {
        try {
          const response = await fetch(`https://api.themoviedb.org/3/tv/${mediaData.seriesId}?api_key=${API_KEY}`);
          const data = await response.json();
          setSeasons(data.seasons);
          if (data.seasons.length > 0) {
            setMediaData(prevData => ({ ...prevData, season: data.seasons[0].season_number.toString() }));
          }
        } catch (error) {
          console.error('Error fetching seasons:', error);
        }
      }
    };

    fetchSeasons();
  }, [mediaData.type, mediaData.seriesId, setMediaData]);

  useEffect(() => {
    const fetchEpisodes = async () => {
      if (mediaData.type === 'series' && mediaData.seriesId && mediaData.season) {
        try {
          const response = await fetch(`https://api.themoviedb.org/3/tv/${mediaData.seriesId}/season/${mediaData.season}?api_key=${API_KEY}`);
          const data = await response.json();
          setEpisodes(data.episodes);
          if (data.episodes.length > 0) {
            setMediaData(prevData => ({ ...prevData, episodeNo: '1' }));
          }
        } catch (error) {
          console.error('Error fetching episodes:', error);
        }
      }
    };

    fetchEpisodes();
  }, [mediaData.type, mediaData.seriesId, mediaData.season, setMediaData]);

  return (
    <form onSubmit={handleSubmit} className="media-form">
      <div className="form-group">
        <label className="form-label">Type</label>
        <div className="toggle-switch">
          <input 
            type="radio" 
            id="series" 
            name="type" 
            value="series" 
            checked={mediaData.type === 'series'} 
            onChange={handleInputChange}
          />
          <label htmlFor="series">Series</label>
          <input 
            type="radio" 
            id="movie" 
            name="type" 
            value="movie" 
            checked={mediaData.type === 'movie'} 
            onChange={handleInputChange}
          />
          <label htmlFor="movie">Movie</label>
        </div>
      </div>

      <div className="form-group">
  <label className="form-label">API</label>
  <div className="toggle-switch api-toggle">
    <input 
      type="radio" 
      id="multiembed" 
      name="apiType" 
      value="multiembed" 
      checked={mediaData.apiType === 'multiembed'} 
      onChange={handleInputChange}
    />
    <label htmlFor="multiembed">Multiembed</label>
    <input 
      type="radio" 
      id="autoembed" 
      name="apiType" 
      value="autoembed" 
      checked={mediaData.apiType === 'autoembed'} 
      onChange={handleInputChange}
    />
    <label htmlFor="autoembed">Autoembed</label>
    <input 
      type="radio" 
      id="2embed" 
      name="apiType" 
      value="2embed" 
      checked={mediaData.apiType === '2embed'} 
      onChange={handleInputChange}
    />
    <label htmlFor="2embed">2embed</label>
  </div>
</div>

      {mediaData.type === 'series' && (
        <div className="form-row">
          <div className="form-group half-width">
            <select
              name="season"
              value={mediaData.season}
              onChange={handleInputChange}
              className="season-select"
            >
              {seasons.map((season, index) => (
                <option key={index} value={season.season_number}>
                  Season {season.season_number}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group half-width episode-buttons">
            {episodes.map((episode, index) => (
              <button
                key={index}
                type="button"
                className={`episode-button ${mediaData.episodeNo === episode.episode_number.toString() ? 'active' : ''}`}
                onClick={() => setMediaData(prevData => ({ ...prevData, episodeNo: episode.episode_number.toString() }))}
              >
                {episode.episode_number}
              </button>
            ))}
          </div>
        </div>
      )}

      <button type="submit" className="submit-button">Stream Now</button>
    </form>
  );
});

export default MediaForm;