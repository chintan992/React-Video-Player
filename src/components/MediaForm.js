// src/components/MediaForm.js
import React, { useState, useEffect } from 'react';
import { useDarkMode } from './DarkModeContext';

const API_KEY = process.env.REACT_APP_TMDB_API_KEY;

const MediaForm = React.memo(({ mediaData, setMediaData, handleSubmit }) => {
  const [seasons, setSeasons] = useState([]);
  const [episodes, setEpisodes] = useState([]);
  const { isDarkMode } = useDarkMode();

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
    <form onSubmit={handleSubmit} className={`max-w-2xl mx-auto space-y-6 p-6 rounded-xl shadow-lg transition-all duration-300 ${isDarkMode ? 'bg-gray-800 shadow-gray-900' : 'bg-white shadow-gray-200'}`}>
      {/* Hidden Type Selection - Maintains functionality but invisible to users */}
      <input 
        type="hidden" 
        name="type" 
        value={mediaData.type}
      />

      {/* API Selection */}
      <div className="mb-8">
        <h2 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Select API</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {['multiembed', 'autoembed', '2embed', 'newMultiembed', 'vidsrc', 'newAutoembed'].map(api => (
            <label key={api} className={`relative group ${mediaData.apiType === api ? 'scale-105' : ''}`}>
              <input 
                type="radio" 
                name="apiType" 
                value={api} 
                checked={mediaData.apiType === api} 
                onChange={handleInputChange}
                className="absolute opacity-0"
              />
              <div className={`cursor-pointer text-center py-2 px-4 rounded-lg transition-all duration-200 
                ${mediaData.apiType === api 
                  ? (isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white')
                  : (isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200')
                }
                ${mediaData.apiType === api ? 'shadow-md' : ''}
              `}>
                <span>{api}</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Series Selection - Only shown when type is series */}
      {mediaData.type === 'series' && (
        <div className="space-y-6">
          <h2 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Episode Selection</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="season" className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Season
              </label>
              <select 
                id="season" 
                name="season" 
                value={mediaData.season} 
                onChange={handleInputChange}
                className={`w-full px-4 py-2.5 rounded-lg border transition-colors duration-200 focus:ring-2 focus:ring-offset-2 
                  ${isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500' 
                    : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-400'
                  }`}
              >
                {seasons.map(season => (
                  <option key={season.season_number} value={season.season_number}>
                    {season.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="episodeNo" className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Episode
              </label>
              <select 
                id="episodeNo" 
                name="episodeNo" 
                value={mediaData.episodeNo} 
                onChange={handleInputChange}
                className={`w-full px-4 py-2.5 rounded-lg border transition-colors duration-200 focus:ring-2 focus:ring-offset-2 
                  ${isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500' 
                    : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-400'
                  }`}
              >
                {episodes.map(episode => (
                  <option key={episode.episode_number} value={episode.episode_number}>
                    {episode.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <div className="mt-8">
        <button 
          type="submit" 
          className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2
            ${isDarkMode 
              ? 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500' 
              : 'bg-blue-500 hover:bg-blue-600 text-white focus:ring-blue-400'
            }`}
        >
          Submit
        </button>
      </div>
    </form>
  );
});

export default MediaForm;
