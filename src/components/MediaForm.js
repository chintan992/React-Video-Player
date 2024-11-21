// src/components/MediaForm.js
import React, { useState, useEffect } from 'react';
import './MediaForm.css'; // Import the CSS file for custom styles

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
    <form onSubmit={handleSubmit} className={`space-y-4 ${mediaData.isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'} p-4 rounded-lg`}>
      <div className="form-group sr-only">
        {/* Hidden label for accessibility */}
        <label className="sr-only">Type</label>
        <div className="flex space-x-4">
          <label className="custom-radio">
            <input 
              type="radio" 
              id="series" 
              name="type" 
              value="series" 
              checked={mediaData.type === 'series'} 
              onChange={handleInputChange}
              className="sr-only" // Hide the input visually
            />
            <span>Series</span>
          </label>
          <label className="custom-radio">
            <input 
              type="radio" 
              id="movie" 
              name="type" 
              value="movie" 
              checked={mediaData.type === 'movie'} 
              onChange={handleInputChange}
              className="sr-only" // Hide the input visually
            />
            <span>Movie</span>
          </label>
        </div>
      </div>

      <div className="form-group">
        <label className="block text-lg font-medium">API</label>
        <div className="flex flex-wrap space-x-4">
          {['multiembed', 'autoembed', '2embed', 'newMultiembed', 'vidsrc', 'newAutoembed'].map(api => (
            <label key={api} className="custom-radio">
              <input 
                type="radio" 
                id={api} 
                name="apiType" 
                value={api} 
                checked={mediaData.apiType === api} 
                onChange={handleInputChange}
              />
              <span>{api}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Additional form fields for series and episodes */}
      {mediaData.type === 'series' && (
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <div className="form-group flex-1">
            <label htmlFor="season" className="block text-lg font-medium">Season</label>
            <select 
              id="season" 
              name="season" 
              value={mediaData.season} 
              onChange={handleInputChange}
              className="border rounded p-2 w-full" // Ensure full width
            >
              {seasons.map(season => (
                <option key={season.season_number} value={season.season_number}>
                  {season.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group flex-1">
            <label htmlFor="episodeNo" className="block text-lg font-medium">Episode</label>
            <select 
              id="episodeNo" 
              name="episodeNo" 
              value={mediaData.episodeNo} 
              onChange={handleInputChange}
              className="border rounded p-2 w-full" // Ensure full width
            >
              {episodes.map(episode => (
                <option key={episode.episode_number} value={episode.episode_number}>
                  {episode.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}


      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        Submit
      </button>
    </form>
  );
});

export default MediaForm;