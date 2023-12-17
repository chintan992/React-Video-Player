// src/app/page.tsx

import React, { useState } from 'react';
import { useClient } from 'next/client';
import Header from '../components/Header';
import SEO from '../components/SEO';

const Home: React.FC = () => {
  const [seriesId, setSeriesId] = useState('');
  const [episodeNo, setEpisodeNo] = useState('');
  const [videoUrl, setVideoUrl] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const fetchedVideoUrl = await fetchVideoUrl(seriesId, episodeNo);
      setVideoUrl(fetchedVideoUrl);
    } catch (error) {
      console.error('Error fetching video URL:', error);
    }
  };

  const fetchVideoUrl = async (seriesId: string, episodeNo: string) => {
    const response = await fetch(`https://example.com/api/videos/${seriesId}/${episodeNo}`);
    const data = await response.json();
    return data.videoUrl;
  };

  // Mark the component as a "Client Component"
  useClient();

  return (
    <div>
      <SEO />
      <Header />
      <h1>Video Player</h1>
      <form onSubmit={handleSubmit}>
        {/* ... (rest of the form code) */}
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

// Optionally, you can export a function that marks this component as a Client Component
export function useClientFunction() {
  useClient();
}