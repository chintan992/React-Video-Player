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
  const [noResults, setNoResults] = useState(false);

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

  const fetchFilteredContent = useCallback(async (category, serviceId, pageNum = 1) => {
    if (pageNum === 1) {
      setIsStreamingLoading(true);
    }
    setNoResults(false);
    
    try {
      let endpoints = [];
      
      if (serviceId) {
        // When streaming service is selected
        if (category === 'movies' || category === 'all') {
          endpoints.push(`${BASE_URL}/discover/movie?api_key=${API_KEY}&with_watch_providers=${serviceId}&watch_region=US&page=${pageNum}`);
        }
        if (category === 'tv' || category === 'all') {
          endpoints.push(`${BASE_URL}/discover/tv?api_key=${API_KEY}&with_watch_providers=${serviceId}&watch_region=US&page=${pageNum}`);
        }
      } else {
        // When only category is selected
        switch (category) {
          case 'movies':
            endpoints.push(`${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${pageNum}`);
            break;
          case 'tv':
            endpoints.push(`${BASE_URL}/tv/popular?api_key=${API_KEY}&page=${pageNum}`);
            break;
          case 'trending':
            endpoints.push(`${BASE_URL}/trending/all/week?api_key=${API_KEY}&page=${pageNum}`);
            break;
          default:
            endpoints.push(`${BASE_URL}/trending/all/week?api_key=${API_KEY}&page=${pageNum}`);
        }
      }

      const responses = await Promise.all(endpoints.map(endpoint => fetch(endpoint)));
      const data = await Promise.all(responses.map(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      }));
      
      let combinedResults = [];
      data.forEach((response, index) => {
        if (!response.results) {
          console.error('Invalid API response:', response);
          return;
        }

        const mediaType = endpoints[index].includes('/movie/') || endpoints[index].includes('discover/movie') 
          ? 'movie' 
          : endpoints[index].includes('/tv/') || endpoints[index].includes('discover/tv')
            ? 'tv'
            : null;
            
        const results = response.results.map(item => ({
          ...item,
          media_type: item.media_type || mediaType
        }));
        combinedResults = [...combinedResults, ...results];
      });

      combinedResults = combinedResults.filter((item, index, self) =>
        index === self.findIndex((t) => t.id === item.id)
      );

      if (pageNum === 1) {
        setMediaItems(combinedResults);
      } else {
        setMediaItems(prev => [...prev, ...combinedResults]);
      }

      setHasMore(combinedResults.length > 0);
      setNoResults(combinedResults.length === 0);
      
    } catch (error) {
      console.error('Error fetching filtered content:', error);
      setError('An error occurred while fetching content. Please try again.');
    } finally {
      if (pageNum === 1) {
        setIsStreamingLoading(false);
      }
    }
  }, []);

  const fetchData = useCallback(async () => {
    setIsInitialLoading(true);
    try {
      // Fetch featured content first
      await fetchFeaturedContent();
      
      // Then fetch initial content
      await fetchFilteredContent('all', null, 1);
      
    } catch (error) {
      console.error('Error in initial data fetch:', error);
      setError('Failed to load content. Please try again.');
    } finally {
      setIsInitialLoading(false);
    }
  }, [fetchFeaturedContent, fetchFilteredContent]);

  const handleCategoryChange = useCallback((category) => {
    setActiveCategory(category);
    setPage(1);
    setHasMore(true);
    fetchFilteredContent(category, activeStreamingService, 1);
  }, [activeStreamingService, fetchFilteredContent]);

  const handleStreamingServiceClick = useCallback((serviceId) => {
    setPage(1);
    setHasMore(true);
    
    if (activeStreamingService === serviceId) {
      setActiveStreamingService(null);
      fetchFilteredContent(activeCategory, null, 1);
    } else {
      setActiveStreamingService(serviceId);
      fetchFilteredContent(activeCategory, serviceId, 1);
    }
  }, [activeCategory, activeStreamingService, fetchFilteredContent]);

  const handleViewMore = useCallback(async () => {
    if (isLoadingMore) return;
    setIsLoadingMore(true);
    
    try {
      const nextPage = page + 1;
      await fetchFilteredContent(activeCategory, activeStreamingService, nextPage);
      setPage(nextPage);
    } catch (error) {
      console.error('Error loading more items:', error);
      toast.error('Failed to load more items');
    } finally {
      setIsLoadingMore(false);
    }
  }, [activeCategory, activeStreamingService, fetchFilteredContent, isLoadingMore, page]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (isInitialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16 bg-gray-50 dark:bg-[#000e14]">
        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16 bg-gray-50 dark:bg-[#000e14] text-gray-900 dark:text-white">
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
    <div className="min-h-screen pt-16 bg-gray-50 dark:bg-[#000e14] text-gray-900 dark:text-white overflow-x-hidden">
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
          noResults={noResults}
        />

        {/* View More Button */}
        <ViewMoreButton
          hasMore={hasMore}
          handleViewMore={handleViewMore}
          isLoadingMore={isLoadingMore}
        />

        {/* No Results Message */}
        {noResults && (
          <div className="text-center mt-4">
            <p className="text-gray-600 dark:text-gray-300">No results found for the selected filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Discover;
