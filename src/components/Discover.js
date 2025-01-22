import React, { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import FeaturedContentCarousel from './FeaturedContentCarousel';
import Filters from './Filters';
import MediaGrid from './MediaGrid';
import ViewMoreButton from './ViewMoreButton';

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
  const [categories, setCategories] = useState({
    latestMovies: [],
    trendingMovies: [],
    latestTVShows: [],
    trendingTVShows: []
  });
  const [featuredContent, setFeaturedContent] = useState([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeStreamingService, setActiveStreamingService] = useState(null);
  const [mediaItems, setMediaItems] = useState([]);
  const [watchlist, setWatchlist] = useState(() => {
    const saved = localStorage.getItem('watchlist');
    return saved ? JSON.parse(saved) : [];
  });
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isStreamingLoading, setIsStreamingLoading] = useState(false);

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
    setIsInitialLoading(true);
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
      setIsInitialLoading(false);
    }
  }, [fetchFeaturedContent]);

  const filterByStreamingService = async (serviceId) => {
    setIsStreamingLoading(true);
    try {
      const cacheKey = `streaming_${serviceId}`;
      const cachedData = getCachedData(cacheKey);

      if (cachedData) {
        setMediaItems(cachedData);
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

      const filteredItems = [
        ...moviesData.results.map(item => ({ ...item, media_type: 'movie' })),
        ...tvShowsData.results.map(item => ({ ...item, media_type: 'tv' }))
      ];

      setCachedData(cacheKey, filteredItems);
      setMediaItems(filteredItems);
    } catch (error) {
      console.error('Error fetching streaming service data:', error);
      setError('An error occurred while fetching streaming service data. Please try again.');
    } finally {
      setIsStreamingLoading(false);
    }
  };

  const handleViewMore = async () => {
    if (isLoadingMore) return;
    setIsLoadingMore(true);
    const nextPage = page + 1;

    try {
      let endpoint;
      const currentCategory = activeCategory;

      if (activeStreamingService) {
        switch (currentCategory) {
          case 'movies':
            endpoint = `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_watch_providers=${activeStreamingService}&watch_region=US&page=${nextPage}`;
            break;
          case 'tv':
            endpoint = `${BASE_URL}/discover/tv?api_key=${API_KEY}&with_watch_providers=${activeStreamingService}&watch_region=US&page=${nextPage}`;
            break;
          default:
            endpoint = `${BASE_URL}/discover/all?api_key=${API_KEY}&with_watch_providers=${activeStreamingService}&watch_region=US&page=${nextPage}`;
        }
      } else {
        switch (currentCategory) {
          case 'movies':
            endpoint = `${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${nextPage}`;
            break;
          case 'tv':
            endpoint = `${BASE_URL}/tv/popular?api_key=${API_KEY}&page=${nextPage}`;
            break;
          case 'trending':
            endpoint = `${BASE_URL}/trending/all/week?api_key=${API_KEY}&page=${nextPage}`;
            break;
          default:
            endpoint = `${BASE_URL}/trending/all/week?api_key=${API_KEY}&page=${nextPage}`;
        }
      }

      const response = await fetch(endpoint);
      const data = await response.json();

      if (!data.results || data.results.length === 0) {
        setHasMore(false);
      } else {
        setMediaItems(prevItems => {
          const newItems = data.results.filter(newItem =>
            !prevItems.some(existingItem => existingItem.id === newItem.id)
          );
          return [...prevItems, ...newItems];
        });
        setPage(nextPage);
      }
    } catch (error) {
      console.error('Error fetching more items:', error);
      toast.error('Failed to load more items');
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleCategoryChange = useCallback((category) => {
    setActiveCategory(category);
    setPage(1);
    setHasMore(true);
    setMediaItems([]);

    let filteredItems = [];
    switch (category) {
      case 'movies':
        filteredItems = [...categories.latestMovies, ...categories.trendingMovies]
          .filter((item, index, self) =>
            index === self.findIndex((t) => t.id === item.id)
          )
          .map(item => ({ ...item, media_type: 'movie' }));
        break;
      case 'tv':
        filteredItems = [...categories.latestTVShows, ...categories.trendingTVShows]
          .filter((item, index, self) =>
            index === self.findIndex((t) => t.id === item.id)
          )
          .map(item => ({ ...item, media_type: 'tv' }));
        break;
      case 'trending':
        filteredItems = [...categories.trendingMovies, ...categories.trendingTVShows]
          .filter((item, index, self) =>
            index === self.findIndex((t) => t.id === item.id)
          )
          .map(item => ({
            ...item,
            media_type: item.first_air_date ? 'tv' : 'movie'
          }));
        break;
      default:
        filteredItems = [
          ...categories.latestMovies.map(item => ({ ...item, media_type: 'movie' })),
          ...categories.trendingMovies.map(item => ({ ...item, media_type: 'movie' })),
          ...categories.latestTVShows.map(item => ({ ...item, media_type: 'tv' })),
          ...categories.trendingTVShows.map(item => ({ ...item, media_type: 'tv' }))
        ].filter((item, index, self) =>
          index === self.findIndex((t) => t.id === item.id)
        );
    }

    setMediaItems(filteredItems);
  }, [categories]);

  useEffect(() => {
    handleCategoryChange(activeCategory);
  }, [activeCategory, handleCategoryChange]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleStreamingServiceClick = (serviceId) => {
    setPage(1);
    setHasMore(true);
    setMediaItems([]);

    if (activeStreamingService === serviceId) {
      setActiveStreamingService(null);
      handleCategoryChange(activeCategory);
    } else {
      setActiveStreamingService(serviceId);
      filterByStreamingService(serviceId);
    }
  };

  if (isInitialLoading) {
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
    <div className="min-h-screen pt-16 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Featured Content Carousel */}
        {featuredContent && featuredContent.length > 0 && (
          <FeaturedContentCarousel featuredContent={featuredContent} carouselSettings={carouselSettings} />
        )}

        {/* Filters */}
        <Filters
          activeCategory={activeCategory}
          handleCategoryChange={handleCategoryChange}
          streamingServices={streamingServices}
          activeStreamingService={activeStreamingService}
          handleStreamingServiceClick={handleStreamingServiceClick}
        />

        {/* Media Grid */}
        <MediaGrid
          mediaItems={mediaItems}
          isStreamingLoading={isStreamingLoading}
          watchlist={watchlist}
          handleWatchlistToggle={handleWatchlistToggle}
        />

        {/* View More Button */}
        <ViewMoreButton
          hasMore={hasMore}
          handleViewMore={handleViewMore}
          isLoadingMore={isLoadingMore}
        />
      </div>
    </div>
  );
}

export default Discover;
