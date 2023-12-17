// pages/index.tsx

import React, { useState } from 'react';
import Header from '../components/Header';
import SEO from '../components/SEO';
import DarkModeToggle from '../components/DarkModeToggle';

const Home: React.FC = () => {
  const [seriesId, setSeriesId] = useState('');
  const [episodeNo, setEpisodeNo] = useState('');
  const [videoUrl, setVideoUrl] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Assuming you have a logic to fetch the video URL based on seriesId and episodeNo
    // Replace the following line with your logic to fetch the video URL
    try {
      const fetchedVideoUrl = await fetchVideoUrl(seriesId, episodeNo);
      setVideoUrl(fetchedVideoUrl);
    } catch (error) {
      console.error('Error fetching video URL:', error);
    }
  };

  const fetchVideoUrl = async (seriesId: string, episodeNo: string) => {
    // Implement your logic to fetch the video URL here
    // For example, make an API call or retrieve from a database
    const response = await fetch(`https://example.com/api/videos/${seriesId}/${episodeNo}`);
    const data = await response.json();
    return data.videoUrl;
  };

  return (
    <div>
      <SEO />
      <Header />
      <h1>Video Player</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Series ID:
          <input type="text" value={seriesId} onChange={(e) => setSeriesId(e.target.value)} />
        </label>
        <br />
        <label>
          Episode Number:
          <input type="text" value={episodeNo} onChange={(e) => setEpisodeNo(e.target.value)} />
        </label>
        <br />
        <button type="submit">Submit</button>
      </form>
      {videoUrl && (
        <div>
          <h2>Video Player</h2>
          <iframe
            width="560"
            height="315"
            src={videoUrl}
            title="Video Player"
            frameBorder="0"
            allowFullScreen
          ></iframe>
        </div>
      )}
    </div>
  );
};

export default Home;
