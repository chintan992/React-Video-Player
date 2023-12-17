// src/components/HomePage.js
import React, { useState } from 'react';

const HomePage = () => {
  const [seriesId, setSeriesId] = useState('');
  const [episodeNo, setEpisodeNo] = useState('');
  const [season, setSeason] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle the form submission (you can add logic here)
  };

  return (
    <div className="bg-gray-100 p-4">
    <div className="container mx-auto">
      <h2>Welcome to LetsStream!</h2>
      <form onSubmit={handleSubmit}>
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
          <input type="text"
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
        <button type="submit">Submit</button>
      </form>
      {/* Display the video using an iframe */}
      <iframe
        title="Series Episode"
        width="560"
        height="315"
        src={`https://multiembed.mov/?video_id=${seriesId}&s=${season}&e=${episodeNo}`}
        frameborder="0"
        allowfullscreen
      ></iframe>
    </div>
    </div>
  );
};

export default HomePage;
