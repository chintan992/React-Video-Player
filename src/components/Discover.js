// src/components/Discover.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDarkMode } from './DarkModeContext';
import './Discover.css';

const API_KEY = '297f1b91919bae59d50ed815f8d2e14c';
const BASE_URL = 'https://api.themoviedb.org/3';

function Discover() {
  const [latestMovies, setLatestMovies] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [latestTVShows, setLatestTVShows] = useState([]);
  const [trendingTVShows, setTrendingTVShows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isDarkMode } = useDarkMode();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [latestMoviesRes, trendingMoviesRes, latestTVRes, trendingTVRes] = await Promise.all([
          fetch(`${BASE_URL}/movie/now_playing?api_key=${API_KEY}`),
          fetch(`${BASE_URL}/trending/movie/week?api_key=${API_KEY}`),
          fetch(`${BASE_URL}/tv/on_the_air?api_key=${API_KEY}`),
          fetch(`${BASE_URL}/trending/tv/week?api_key=${API_KEY}`)
        ]);

        const [latestMoviesData, trendingMoviesData, latestTVData, trendingTVData] = await Promise.all([
          latestMoviesRes.json(),
          trendingMoviesRes.json(),
          latestTVRes.json(),
          trendingTVRes.json()
        ]);

        setLatestMovies(latestMoviesData.results.slice(0, 10));
        setTrendingMovies(trendingMoviesData.results.slice(0, 10));
        setLatestTVShows(latestTVData.results.slice(0, 10));
        setTrendingTVShows(trendingTVData.results.slice(0, 10));
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('An error occurred while fetching data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) return <div className={`discover-page ${isDarkMode ? 'dark-mode' : ''}`}>Loading...</div>;
  if (error) return <div className={`discover-page ${isDarkMode ? 'dark-mode' : ''}`}>{error}</div>;

  const renderMediaList = (mediaList, mediaType) => (
    <div className="media-list">
      {mediaList.map(item => (
        <Link to={`/watch/${mediaType}/${item.id}`} key={item.id} className="media-item">
          <img
            src={`https://image.tmdb.org/t/p/w200${item.poster_path}`}
            alt={item.title || item.name}
          />
          <h3>{item.title || item.name}</h3>
        </Link>
      ))}
    </div>
  );

  return (
    <div className={`discover-page ${isDarkMode ? 'dark-mode' : ''}`}>
      <h1>Discover</h1>
      
      <section>
        <h2>Latest Movies</h2>
        {renderMediaList(latestMovies, 'movie')} </section>

      <section>
        <h2>Trending Movies</h2>
        {renderMediaList(trendingMovies, 'movie')} 
      </section>

      <section>
        <h2>Latest TV Shows</h2>
        {renderMediaList(latestTVShows, 'tv')} 
      </section>

      <section>
        <h2>Trending TV Shows</h2>
        {renderMediaList(trendingTVShows, 'tv')} 
      </section>
    </div>
  );
}

export default Discover;