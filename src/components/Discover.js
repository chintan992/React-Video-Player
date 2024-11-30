// src/components/Discover.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MediaItem from './MediaItem';
/* import LoadingSkeleton from './LoadingSkeleton'; */

const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const BASE_URL = process.env.REACT_APP_TMDB_BASE_URL;

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
  const navigate = useNavigate();
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

  const getCachedData = (key) => {
    try {
      const item = localStorage.getItem(key);
      if (!item) return null;
      
      const { data, timestamp } = JSON.parse(item);
      // Cache expires after 5 minutes
      if (Date.now() - timestamp > 5 * 60 * 1000) {
        localStorage.removeItem(key);
        return null;
      }
      return data;
    } catch (error) {
      console.error('Error reading from cache:', error);
      return null;
    }
  };

  const setCachedData = (key, data) => {
    try {
      localStorage.setItem(key, JSON.stringify({
        data,
        timestamp: Date.now()
      }));
    } catch (error) {
      console.error('Error writing to cache:', error);
    }
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      if (!process.env.REACT_APP_TMDB_API_KEY) {
        throw new Error('TMDB API key is not configured. Please check your environment variables.');
      }

      const endpoints = {
        latestMovies: `${BASE_URL}/movie/now_playing?api_key=${API_KEY}`,
        trendingMovies: `${BASE_URL}/trending/movie/week?api_key=${API_KEY}`,
        latestTVShows: `${BASE_URL}/tv/on_the_air?api_key=${API_KEY}`,
        trendingTVShows: `${BASE_URL}/trending/tv/week?api_key=${API_KEY}`
      };

      const newCategories = {};
      
      await Promise.all(
        Object.entries(endpoints).map(async ([key, url]) => {
          try {
            // Try to get cached data first
            const cachedData = getCachedData(key);
            if (cachedData) {
              newCategories[key] = cachedData;
              return;
            }

            // If no cache, fetch from API
            const response = await fetch(url);
            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.status_message || `Failed to fetch ${key}`);
            }
            
            const data = await response.json();
            const results = data.results.slice(0, 10);
            newCategories[key] = results;
            setCachedData(key, results);
          } catch (err) {
            console.error(`Error fetching ${key}:`, err);
            newCategories[key] = []; // Set empty array for failed category
          }
        })
      );

      // Check if all categories failed
      const allCategoriesEmpty = Object.values(newCategories).every(arr => arr.length === 0);
      if (allCategoriesEmpty) {
        throw new Error('Failed to fetch content. Please check your API configuration and try again.');
      }

      setCategories(newCategories);
      setError(null); // Clear any previous errors if successful
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error.message || 'An error occurred while fetching data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const filterByStreamingService = async (serviceId) => {
    setIsLoading(true);
    try {
      const cacheKey = `streaming_${serviceId}`;
      const cachedData = getCachedData(cacheKey);
      
      if (cachedData) {
        setCategories(cachedData);
        return;
      }

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

      const newCategories = {
        latestMovies: moviesData.results.slice(0, 10),
        trendingMovies: [],
        latestTVShows: tvShowsData.results.slice(0, 10),
        trendingTVShows: []
      };

      setCachedData(cacheKey, newCategories);
      setCategories(newCategories);
    } catch (error) {
      console.error('Error fetching streaming service data:', error);
      setError('An error occurred while fetching streaming service data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Memoize fetchData to prevent unnecessary re-renders
  const memoizedFetchData = React.useCallback(fetchData, []);

  useEffect(() => {
    memoizedFetchData();
  }, [memoizedFetchData]);

  const handleStreamingServiceClick = (serviceId) => {
    if (activeStreamingService === serviceId) {
      setActiveStreamingService(null);
      fetchData();
    } else {
      setActiveStreamingService(serviceId);
      filterByStreamingService(serviceId);
    }
  };

  const handleViewMore = (type, category, title) => {
    navigate('/expanded-view', { 
      state: { 
        type,
        category,
        title,
        streamingService: activeStreamingService 
      } 
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16 bg-gray-50 dark:bg-gray-900">
        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
        <div className="text-center px-4">
          <h2 className="text-2xl font-bold mb-4">Oops!</h2>
          <p className="mb-6 text-gray-600 dark:text-gray-300">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 
              transition-colors duration-200 focus:outline-none focus:ring-2 
              focus:ring-primary-500 focus:ring-offset-2"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const gridClasses = "grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6";

  return (
    <div className="min-h-screen pt-16 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <header className="mb-8 space-y-6">
          <h1 className="text-3xl font-bold">Discover</h1>
          
          {/* Category Navigation */}
          <nav className="flex flex-wrap gap-2">
            {['all', 'movies', 'tv'].map((category) => (
              <button 
                key={category}
                className={`px-4 py-2 rounded-lg transition-all duration-200 
                  ${activeCategory === category 
                    ? 'bg-primary-500 text-white shadow-lg' 
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                onClick={() => setActiveCategory(category)}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </nav>

          {/* Streaming Services */}
          <div className="flex flex-wrap gap-2">
            {streamingServices.map(service => (
              <button
                key={service.id}
                className={`px-4 py-2 rounded-lg transition-all duration-200 
                  ${activeStreamingService === service.id 
                    ? 'bg-primary-500 text-white shadow-lg' 
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                onClick={() => handleStreamingServiceClick(service.id)}
              >
                {service.name}
              </button>
            ))}
          </div>
        </header>

        {/* Content Sections */}
        <div className="space-y-12">
          {/* Movies Sections */}
          {(activeCategory === 'all' || activeCategory === 'movies') && (
            <>
              {/* Latest Movies */}
              <section className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-semibold">Latest Movies</h2>
                  <button 
                    className="px-4 py-2 text-sm bg-primary-500 text-white rounded-lg 
                      hover:bg-primary-600 transition-colors duration-200"
                    onClick={() => handleViewMore('movie', 'latest', 'Latest Movies')}
                  >
                    View More
                  </button>
                </div>
                <div className={gridClasses}>
                  {categories.latestMovies.map(movie => (
                    <MediaItem
                      key={movie.id}
                      item={{...movie, media_type: 'movie'}}
                      onClick={() => navigate(`/watch/movie/${movie.id}`)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') navigate(`/watch/movie/${movie.id}`);
                      }}
                      loading={isLoading}
                    />
                  ))}
                </div>
              </section>

              {/* Trending Movies */}
              {categories.trendingMovies.length > 0 && (
                <section className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-semibold">Trending Movies</h2>
                    <button 
                      className="px-4 py-2 text-sm bg-primary-500 text-white rounded-lg 
                        hover:bg-primary-600 transition-colors duration-200"
                      onClick={() => handleViewMore('movie', 'trending', 'Trending Movies')}
                    >
                      View More
                    </button>
                  </div>
                  <div className={gridClasses}>
                  {categories.trendingMovies.map(movie => (
                      <MediaItem
                        key={movie.id}
                        item={{...movie, media_type: 'movie'}}
                        onClick={() => navigate(`/watch/movie/${movie.id}`)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') navigate(`/watch/movie/${movie.id}`);
                        }}
                        loading={isLoading}
                      />
                    ))}
                  </div>
                </section>
              )}
            </>
          )}

          {/* TV Shows Sections */}
          {(activeCategory === 'all' || activeCategory === 'tv') && (
            <>
              {/* Latest TV Shows */}
              <section className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-semibold">Latest TV Shows</h2>
                  <button 
                    className="px-4 py-2 text-sm bg-primary-500 text-white rounded-lg 
                      hover:bg-primary-600 transition-colors duration-200"
                    onClick={() => handleViewMore('tv', 'latest', 'Latest TV Shows')}
                  >
                    View More
                  </button>
                </div>
                <div className={gridClasses}>
                  {categories.latestTVShows.map(tvShow => (
                    <MediaItem
                      key={tvShow.id}
                      item={{...tvShow, media_type: 'tv'}}
                      onClick={() => navigate(`/watch/tv/${tvShow.id}`)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') navigate(`/watch/tv/${tvShow.id}`);
                      }}
                      loading={isLoading}
                    />
                  ))}
                </div>
              </section>

              {/* Trending TV Shows */}
              {categories.trendingTVShows.length > 0 && (
                <section className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-semibold">Trending TV Shows</h2>
                    <button 
                      className="px-4 py-2 text-sm bg-primary-500 text-white rounded-lg 
                        hover:bg-primary-600 transition-colors duration-200"
                      onClick={() => handleViewMore('tv', 'trending', 'Trending TV Shows')}
                    >
                      View More
                    </button>
                  </div>
                  <div className={gridClasses}>
                    {categories.trendingTVShows.map(tvShow => (
                      <MediaItem
                        key={tvShow.id}
                        item={{...tvShow, media_type: 'tv'}}
                        onClick={() => navigate(`/watch/tv/${tvShow.id}`)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') navigate(`/watch/tv/${tvShow.id}`);
                        }}
                        loading={isLoading}
                      />
                    ))}
                  </div>
                </section>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Discover;
