// src/components/HomePage.js
import React, { useState } from 'react';

const HomePage = () => {
  const [mediaType, setMediaType] = useState('series'); // Default to 'series'
  const [seriesId, setSeriesId] = useState('');
  const [episodeNo, setEpisodeNo] = useState('');
  const [season, setSeason] = useState('');
  const [movieId, setMovieId] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle the form submission (you can add logic here)
  };

  const getIframeSrc = () => {
    if (mediaType === 'series') {
      return `https://multiembed.mov/?video_id=${seriesId}&s=${season}&e=${episodeNo}`;
    } else if (mediaType === 'movie') {
      return `https://multiembed.mov/?video_id=${movieId}`;
    }
    return '';
  };

  return (
    <div className="bg-gray-100 p-4">
      <div className="container mx-auto">
        <h2>Welcome to LetsStream!</h2>
        <form onSubmit={handleSubmit}>
          <label>
            <input
              type="radio"
              value="series"
              checked={mediaType === 'series'}
              onChange={() => setMediaType('series')}
            />
            Series
          </label>
          <label>
            <input
              type="radio"
              value="movie"
              checked={mediaType === 'movie'}
              onChange={() => setMediaType('movie')}
            />
            Movie
          </label>
          <br />
          {mediaType === 'series' && (
            <>
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
              <br />
            </>
          )}
          {mediaType === 'movie' && (
            <>
              <label>
                Movie ID:
                <input
                  type="text"
                  value={movieId}
                  onChange={(e) => setMovieId(e.target.value)}
                />
              </label>
              <br />
            </>
          )}
          <button type="submit">Submit</button>
        </form>
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
    </div>
  );
};

export default HomePage;
