import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import debounce from 'lodash.debounce';
import toast from 'react-hot-toast';

// Components
import MediaCard from './common/MediaCard';
import FeaturedContent from './common/FeaturedContent';
import ScrollToTop from './common/ScrollToTop';
import { MediaItemSkeleton } from './common/SkeletonLoader';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const BASE_URL = process.env.REACT_APP_TMDB_BASE_URL;

const streamingServices = [
  { id: 8, name: 'Netflix', color: 'bg-red-600' },
  { id: 9, name: 'Amazon Prime', color: 'bg-blue-500' },
  { id: 337, name: 'Disney+', color: 'bg-indigo-600' },
  { id: 1899, name: 'HBO Max', color: 'bg-purple-600' },
  { id: 15, name: 'Hulu', color: 'bg-green-500' },
  { id: 531, name: 'Paramount+', color: 'bg-cyan-600' },
  { id: 350, name: 'Apple TV+', color: 'bg-gray-600' },
];

function Discover() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState({
    latestMovies: [],
    trendingMovies: [],
    latestTVShows: [],
    trendingTVShows: []
  });
  const [featuredContent, setFeaturedContent] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeStreamingService, setActiveStreamingService] = useState(null);
  const [mediaItems, setMediaItems] = useState([]);
  const [watchlist, setWatchlist] = useState(() => {
    const saved = localStorage.getItem('watchlist');
    return saved ? JSON.parse(saved) : [];
  });

  // Intersection Observer for infinite scroll
  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0.5,
    triggerOnce: true
  });

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((query) => {
      // Implement search functionality
      console.log('Searching for:', query);
    }, 500),
    []
  );

  // Handle watchlist
  const handleWatchlistToggle = (item) => {
    setWatchlist(prev => {
      const exists = prev.some(i => i.id === item.id);
      if (exists) {
        const newWatchlist = prev.filter(i => i.id !== item.id);
        localStorage.setItem('watchlist', JSON.stringify(newWatchlist));
        toast.success('Removed from watchlist');
        return newWatchlist;
      } else {
        const newWatchlist = [...prev, item];
        localStorage.setItem('watchlist', JSON.stringify(newWatchlist));
        toast.success('Added to watchlist');
        return newWatchlist;
      }
    });
  };

  // Load watchlist from localStorage on mount
  useEffect(() => {
    const savedWatchlist = localStorage.getItem('watchlist');
    if (savedWatchlist) {
      try {
        setWatchlist(JSON.parse(savedWatchlist));
      } catch (error) {
        console.error('Error loading watchlist:', error);
        localStorage.removeItem('watchlist');
      }
    }
  }, []);

  // Carousel settings
  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: true,
    pauseOnHover: true
  };

  const getCachedData = (key) => {
    try {
      const item = localStorage.getItem(key);
      if (!item) return null;
      
      const { data, timestamp } = JSON.parse(item);
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

  const fetchFeaturedContent = React.useCallback(async () => {
    try {
      const cachedData = getCachedData('featured');
      if (cachedData) {
        setFeaturedContent(cachedData);
        return;
      }

      const response = await fetch(
        `${BASE_URL}/trending/all/day?api_key=${API_KEY}`
      );
      const data = await response.json();
      const featured = data.results.slice(0, 5);
      setFeaturedContent(featured);
      setCachedData('featured', featured);
    } catch (error) {
      console.error('Error fetching featured content:', error);
    }
  }, []);

  const fetchData = React.useCallback(async () => {
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
      
      await Promise.all([
        fetchFeaturedContent(),
        ...Object.entries(endpoints).map(async ([key, url]) => {
          try {
            const cachedData = getCachedData(key);
            if (cachedData) {
              newCategories[key] = cachedData;
              return;
            }

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
            newCategories[key] = [];
          }
        })
      ]);

      const allCategoriesEmpty = Object.values(newCategories).every(arr => arr.length === 0);
      if (allCategoriesEmpty) {
        throw new Error('Failed to fetch content. Please check your API configuration and try again.');
      }

      setCategories(newCategories);
      setError(null);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error.message || 'An error occurred while fetching data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [fetchFeaturedContent]);

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

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    
    // Filter media items based on category
    let filteredItems = [];
    switch (category) {
      case 'movies':
        filteredItems = [...categories.latestMovies, ...categories.trendingMovies]
          .filter((item, index, self) => 
            index === self.findIndex((t) => t.id === item.id)
          );
        break;
      case 'tv':
        filteredItems = [...categories.latestTVShows, ...categories.trendingTVShows]
          .filter((item, index, self) => 
            index === self.findIndex((t) => t.id === item.id)
          );
        break;
      case 'trending':
        filteredItems = [...categories.trendingMovies, ...categories.trendingTVShows]
          .filter((item, index, self) => 
            index === self.findIndex((t) => t.id === item.id)
          );
        break;
      default: // 'all'
        filteredItems = [
          ...categories.latestMovies,
          ...categories.trendingMovies,
          ...categories.latestTVShows,
          ...categories.trendingTVShows
        ].filter((item, index, self) => 
          index === self.findIndex((t) => t.id === item.id)
        );
    }

    setMediaItems(filteredItems);
  };

  useEffect(() => {
    handleCategoryChange(activeCategory);
  }, [categories, activeCategory, handleCategoryChange]); // Include dependencies

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleStreamingServiceClick = (serviceId) => {
    if (activeStreamingService === serviceId) {
      setActiveStreamingService(null);
      fetchData();
    } else {
      setActiveStreamingService(serviceId);
      filterByStreamingService(serviceId);
    }
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

  return (
    <div className="min-h-screen pt-16 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Featured Content Carousel */}
        {featuredContent && featuredContent.length > 0 && (
          <section className="mb-12">
            <Slider {...carouselSettings}>
              {featuredContent.map((item, index) => (
                <div key={item.id}>
                  <FeaturedContent item={item} />
                </div>
              ))}
            </Slider>
          </section>
        )}

        {/* Filters */}
        <div className="sticky top-16 z-10 bg-gray-50 dark:bg-gray-900 py-4 mb-8">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            {/* Category Tabs */}
            <div className="flex space-x-2">
              <button
                onClick={() => handleCategoryChange('all')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeCategory === 'all'
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                All
              </button>
              <button
                onClick={() => handleCategoryChange('movies')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeCategory === 'movies'
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                Movies
              </button>
              <button
                onClick={() => handleCategoryChange('tv')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeCategory === 'tv'
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                TV Shows
              </button>
            </div>

            {/* Streaming Services */}
            <div className="flex flex-wrap gap-2">
              {streamingServices.map((service) => (
                <button
                  key={service.id}
                  onClick={() => handleStreamingServiceClick(service.id)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    activeStreamingService === service.id
                      ? service.color + ' text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {service.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Media Grid */}
        <div className="grid gap-3 grid-cols-3 sm:gap-4 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
          {isLoading ? (
            Array.from({ length: 8 }).map((_, index) => (
              <MediaItemSkeleton key={`skeleton-${index}`} />
            ))
          ) : mediaItems.length > 0 ? (
            mediaItems.map((item) => (
              <motion.div
                key={`${item.id}-${item.media_type}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <MediaCard
                  item={item}
                  onWatchlistToggle={() => handleWatchlistToggle(item)}
                  isInWatchlist={watchlist.some((watchItem) => watchItem.id === item.id)}
                />
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">No items found</p>
            </div>
          )}
        </div>

        {/* Load More / Infinite Scroll Indicator */}
        <div
          ref={loadMoreRef}
          className="flex justify-center items-center py-8"
        >
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
        </div>

        {/* Scroll to Top Button */}
        <ScrollToTop />
      </div>
    </div>
  );
}

export default Discover;