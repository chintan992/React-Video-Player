import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import MediaItem from './MediaItem';

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

  // Carousel settings for featured content
  const featuredSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: true,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          arrows: false
        }
      }
    ]
  };

  // Carousel settings for media sections
  const mediaSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 2,
    arrows: true,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 4,
        }
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
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

  return (
    <div className="min-h-screen pt-16 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Featured Content Carousel */}
        {featuredContent.length > 0 && (
          <section className="mb-12">
            <Slider {...featuredSettings} className="featured-carousel">
              {featuredContent.map(item => (
                <div key={item.id} className="relative aspect-[16/9]">
                  <img
                    src={`https://image.tmdb.org/t/p/original${item.backdrop_path}`}
                    alt={item.title || item.name}
                    className="w-full h-full object-cover rounded-xl"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black to-transparent">
                    <h2 className="text-3xl font-bold text-white mb-2">
                      {item.title || item.name}
                    </h2>
                    <p className="text-gray-200 line-clamp-2 mb-4">{item.overview}</p>
                    <button
                      onClick={() => navigate(`/watch/${item.media_type}/${item.id}`)}
                      className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 
                        transition-colors duration-200"
                    >
                      Watch Now
                    </button>
                  </div>
                </div>
              ))}
            </Slider>
          </section>
        )}

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
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2">
            {streamingServices.map(service => (
              <button
                key={service.id}
                className={`px-4 py-3 rounded-lg transition-all duration-200 flex items-center justify-center
                  ${activeStreamingService === service.id 
                    ? `${service.color} text-white shadow-lg` 
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
                <Slider {...mediaSettings} className="media-carousel">
                  {categories.latestMovies.map(movie => (
                    <div key={movie.id} className="px-2">
                      <MediaItem
                        item={{...movie, media_type: 'movie'}}
                        onClick={() => navigate(`/watch/movie/${movie.id}`)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') navigate(`/watch/movie/${movie.id}`);
                        }}
                        loading={isLoading}
                      />
                    </div>
                  ))}
                </Slider>
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
                  <Slider {...mediaSettings} className="media-carousel">
                    {categories.trendingMovies.map(movie => (
                      <div key={movie.id} className="px-2">
                        <MediaItem
                          item={{...movie, media_type: 'movie'}}
                          onClick={() => navigate(`/watch/movie/${movie.id}`)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') navigate(`/watch/movie/${movie.id}`);
                          }}
                          loading={isLoading}
                        />
                      </div>
                    ))}
                  </Slider>
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
                <Slider {...mediaSettings} className="media-carousel">
                  {categories.latestTVShows.map(tvShow => (
                    <div key={tvShow.id} className="px-2">
                      <MediaItem
                        item={{...tvShow, media_type: 'tv'}}
                        onClick={() => navigate(`/watch/tv/${tvShow.id}`)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') navigate(`/watch/tv/${tvShow.id}`);
                        }}
                        loading={isLoading}
                      />
                    </div>
                  ))}
                </Slider>
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
                  <Slider {...mediaSettings} className="media-carousel">
                    {categories.trendingTVShows.map(tvShow => (
                      <div key={tvShow.id} className="px-2">
                        <MediaItem
                          item={{...tvShow, media_type: 'tv'}}
                          onClick={() => navigate(`/watch/tv/${tvShow.id}`)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') navigate(`/watch/tv/${tvShow.id}`);
                          }}
                          loading={isLoading}
                        />
                      </div>
                    ))}
                  </Slider>
                </section>
              )}
            </>
          )}
        </div>
      </div>

      {/* Custom CSS for Slick Carousel */}
      <style jsx="true">{`
        .featured-carousel .slick-prev,
        .featured-carousel .slick-next {
          z-index: 10;
          width: 40px;
          height: 40px;
        }
        
        .featured-carousel .slick-prev {
          left: 20px;
        }
        
        .featured-carousel .slick-next {
          right: 20px;
        }

        .featured-carousel .slick-dots {
          bottom: 20px;
        }

        .featured-carousel .slick-dots li button:before {
          color: white;
        }

        .media-carousel .slick-prev,
        .media-carousel .slick-next {
          z-index: 10;
          width: 30px;
          height: 30px;
        }

        .media-carousel .slick-prev {
          left: -10px;
        }

        .media-carousel .slick-next {
          right: -10px;
        }

        @media (max-width: 640px) {
          .media-carousel .slick-prev,
          .media-carousel .slick-next {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}

export default Discover;
