// src/components/Discover.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDarkMode } from './DarkModeContext';
import './Discover.css';

const API_KEY = '297f1b91919bae59d50ed815f8d2e14c';
const BASE_URL = 'https://api.themoviedb.org/3';

const streamingServices = [
  { id: 8, name: 'Netflix' },
  { id: 9, name: 'Amazon Prime' },
  { id: 337, name: 'Disney+' },
  { id: 1899, name: 'HBO Max' },
  { id: 15, name: 'Hulu' },
  { id: 531, name: 'Paramount+' },
  { id: 350, name: 'Apple TV+' },
];

function Discover() {
  const [categories, setCategories] = useState({
    latestMovies: [],
    trendingMovies: [],
    latestTVShows: [],
    trendingTVShows: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeStreamingService, setActiveStreamingService] = useState(null);
  const { isDarkMode } = useDarkMode();

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const endpoints = {
        latestMovies: `${BASE_URL}/movie/now_playing?api_key=${API_KEY}`,
        trendingMovies: `${BASE_URL}/trending/movie/week?api_key=${API_KEY}`,
        latestTVShows: `${BASE_URL}/tv/on_the_air?api_key=${API_KEY}`,
        trendingTVShows: `${BASE_URL}/trending/tv/week?api_key=${API_KEY}`
      };

      const responses = await Promise.all(
        Object.values(endpoints).map(url => fetch(url))
      );
      
      const data = await Promise.all(
        responses.map(res => res.json())
      );

      setCategories({
        latestMovies: data[0].results.slice(0, 10),
        trendingMovies: data[1].results.slice(0, 10),
        latestTVShows: data[2].results.slice(0, 10),
        trendingTVShows: data[3].results.slice(0, 10)
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('An error occurred while fetching data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filterByStreamingService = async (serviceId) => {
    setIsLoading(true);
    try {
      const moviesEndpoint = `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_watch_providers=${serviceId}&watch_region=US`;
      const tvShowsEndpoint = `${BASE_URL}/discover/tv?api_key=${API_KEY}&with_watch_providers=${serviceId}&watch_region=US`;

      const [moviesResponse, tvShowsResponse] = await Promise.all([
        fetch(moviesEndpoint),
        fetch(tvShowsEndpoint)
      ]);

      const [moviesData, tvShowsData] = await Promise.all([
        moviesResponse.json(),
        tvShowsResponse.json()
      ]);

      setCategories({
        latestMovies: moviesData.results.slice(0, 10),
        trendingMovies: [],
        latestTVShows: tvShowsData.results.slice(0, 10),
        trendingTVShows: []
      });
    } catch (error) {
      console.error('Error fetching streaming service data:', error);
      setError('An error occurred while fetching streaming service data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStreamingServiceClick = (serviceId) => {
    if (activeStreamingService === serviceId) {
      setActiveStreamingService(null);
      fetchData();
    } else {
      setActiveStreamingService(serviceId);
      filterByStreamingService(serviceId);
    }
  };

  const renderMediaItem = (item, mediaType) => (
    <Link 
      to={`/watch/${mediaType}/${item.id}`} 
      key={item.id} 
      className="media-item"
      data-rating={item.vote_average}
    >
      <div className="media-poster">
        <img
          src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
          alt={item.title || item.name}
          loading="lazy"
        />
        <div className="media-overlay">
          <div className="media-rating">{item.vote_average.toFixed(1)}</div>
          <div className="media-date">
            {new Date(item.release_date || item.first_air_date).getFullYear()}
          </div>
        </div>
      </div>
      <div className="media-info">
        <h3>{item.title || item.name}</h3>
        <p className="media-overview">{item.overview ? `${item.overview.slice(0, 100)}...` : 'No overview available'}</p>
      </div>
    </Link>
  );

  if (isLoading) {
    return (
      <div className={`discover-page ${isDarkMode ? 'dark-mode' : ''}`}>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`discover-page ${isDarkMode ? 'dark-mode' : ''}`}>
        <div className="error-container">
          <h2>Oops!</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className={`discover-page ${isDarkMode ? 'dark-mode' : ''}`}>
      <header className="discover-header">
        <h1>Discover</h1>
        <nav className="category-nav">
          <button 
            className={activeCategory === 'all' ? 'active' : ''} 
            onClick={() => setActiveCategory('all')}
          >
            All
          </button>
          <button 
            className={activeCategory === 'movies' ? 'active' : ''} 
            onClick={() => setActiveCategory('movies')}
          >
            Movies
          </button>
          <button 
            className={activeCategory === 'tv' ? 'active' : ''} 
            onClick={() => setActiveCategory('tv')}
          >
            TV Shows
          </button>
        </nav>
        <div className="streaming-services">
          {streamingServices.map(service => (
            <button
              key={service.id}
              className={`streaming-service-button ${activeStreamingService === service.id ? 'active' : ''}`}
              onClick={() => handleStreamingServiceClick(service.id)}
            >
              {service.name}
            </button>
          ))}
        </div>
      </header>

      {(activeCategory === 'all' || activeCategory === 'movies') && (
        <>
          <section className="media-section">
            <h2>Latest Movies</h2>
            <div className="media-list">
              {categories.latestMovies.map(movie => renderMediaItem(movie, 'movie'))}
            </div>
          </section>
          {categories. trendingMovies.length > 0 && (
            <section className="media-section">
              <h2>Trending Movies</h2>
              <div className="media-list">
                {categories.trendingMovies.map(movie => renderMediaItem(movie, 'movie'))}
              </div>
            </section>
          )}
        </>
      )}

      {(activeCategory === 'all' || activeCategory === 'tv') && (
        <>
          <section className="media-section">
            <h2>Latest TV Shows</h2>
            <div className="media-list">
              {categories.latestTVShows.map(tvShow => renderMediaItem(tvShow, 'tv'))}
            </div>
          </section>
          {categories.trendingTVShows.length > 0 && (
            <section className="media-section">
              <h2>Trending TV Shows</h2>
              <div className="media-list">
                {categories.trendingTVShows.map(tvShow => renderMediaItem(tvShow, 'tv'))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}

export default Discover;