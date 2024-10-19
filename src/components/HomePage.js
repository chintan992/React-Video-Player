// src/components/HomePage.js
import React, { useState } from 'react';
import './HomePage.css';
import VideoSection from './VideoSection';

const HomePage = () => {
  const [mediaType, setMediaType] = useState('series');
  const [apiType, setApiType] = useState('multiembed');
  const [seriesId, setSeriesId] = useState('');
  const [episodeNo, setEpisodeNo] = useState('');
  const [season, setSeason] = useState('');
  const [movieId, setMovieId] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (mediaType === 'series' && (!seriesId || !season || !episodeNo)) {
      setError('Please fill in all series fields.');
      return;
    }

    if (mediaType === 'movie' && !movieId) {
      setError('Please fill in the movie ID.');
      return;
    }

    // Clear error if validation passes
    setError('');
  };

  const getIframeSrc = () => {
    let baseUrl = '';

    if (apiType === 'multiembed') {
      baseUrl = 'https://multiembed.mov/';
      if (mediaType === 'series') {
        return `${baseUrl}?video_id=${seriesId}&s=${season}&e=${episodeNo}`;
      }
      return `${baseUrl}?video_id=${movieId}`;
    } else if (apiType === 'autoembed') {
      baseUrl = 'https://player.autoembed.cc/embed/';
      if (mediaType === 'series') {
        return `${baseUrl}tv/${seriesId}/${season}/${episodeNo}`;
      }
      return `${baseUrl}movie/${movieId}`;
    } else if (apiType === '2embed') {
      if (mediaType === 'series') {
        return `https://www.2embed.cc/embedtv/${seriesId}&s=${season}&e=${episodeNo}`;
      }
      return `https://www.2embed.cc/embed/${movieId}`;
    }

    return '';
  };

  return (
    <div className="home-page-container">
      <div className="form-container">
        <div className="form-section">
          <h2>Welcome to LetsStream!</h2>
          {error && <p className="error-message">{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className="radio-buttons">
              <input
                type="radio"
                id="series"
                value="series"
                checked={mediaType === 'series'}
                onChange={() => setMediaType('series')}
              />
              <label htmlFor="series">Series</label>

              <input
                type="radio"
                id="movie"
                value="movie"
                checked={mediaType === 'movie'}
                onChange={() => setMediaType('movie')}
              />
              <label htmlFor="movie">Movie</label>
            </div>

            <div className="api-radio-buttons">
              <h4>Select API:</h4>
              <input
                type="radio"
                id="multiembed"
                value="multiembed"
                checked={apiType === 'multiembed'}
                onChange={() => setApiType('multiembed')}
              />
              <label htmlFor="multiembed">MultiEmbed</label>

              <input
                type="radio"
                id="autoembed"
                value="autoembed"
                checked={apiType === 'autoembed'}
                onChange={() => setApiType('autoembed')}
              />
              <label htmlFor="autoembed">AutoEmbed</label>

              <input
                type="radio"
                id="2embed"
                value="2embed"
                checked={apiType === '2embed'}
                onChange={() => setApiType('2embed')}
              />
              <label htmlFor="2embed">2Embed</label>
            </div>

            {mediaType === 'series' && (
              <div className="form-fields">
                <label>
                  Series ID:
                  <input
                    type="text"
                    value={seriesId}
                    onChange={(e) => setSeriesId(e.target.value)}
                  />
                </label>
                <br />
                <label>
                  Season:
                  <input
                    type="text"
                    value={season}
                    onChange={(e) => setSeason(e.target.value)}
                  />
                </label>
                <br />
                <label>
                  Episode No.:
                  <input
                    type="text"
                    value={episodeNo}
                    onChange={(e) => setEpisodeNo(e.target.value)}
                  />
                </label>
              </div>
            )}
            {mediaType === 'movie' && (
              <div className="form-fields">
                <label>
                  Movie ID:
                  <input
                    type="text"
                    value={movieId}
                    onChange={(e) => setMovieId(e.target.value)}
                  />
                </label>
              </div>
            )}
            <button type="submit">Submit</button>
          </form>
        </div>
      </div>
      <VideoSection getIframeSrc={getIframeSrc} />
    </div>
  );
};

export default HomePage;
