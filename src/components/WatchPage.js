import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDarkMode } from './DarkModeContext';
import { useUserFeatures } from '../hooks/useUserFeatures';
import { getRecommendations } from '../api/tmdbApi';
import { getStoredVideoSource, setStoredVideoSource, saveTVProgress, getTVProgress } from '../utils/storage';
import VideoSection from './VideoSection';
import { useAuth } from '../context/AuthContext';
import SourceSelector from './SourceSelector';
import Recommendations from './Recommendations';
//import Favorites from './Favorites';
//import Watchlist from './Watchlist';
//import WatchHistory from './WatchHistory';
import fetchEpisodes from '../utils/fetchEpisodes';
import Skeleton from './Skeleton';
import { motion, AnimatePresence } from 'framer-motion';
import { Tab } from '@headlessui/react';
import { List, Heart, Star, User } from 'react-feather';
import UserListsSidebar from './UserListsSidebar';

const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const BASE_URL = process.env.REACT_APP_TMDB_BASE_URL;

// Error boundary component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('VideoSection Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-container p-4 bg-red-100 text-red-700 rounded">
          <h2 className="font-bold">Something went wrong with the video player.</h2>
          <button 
            onClick={() => this.setState({ hasError: false })}
            className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Try Again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function WatchPage() {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth(); // Add this line
  const [item, setItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isDarkMode } = useDarkMode();
  const videoSectionRef = useRef(null);
  const [showUserLists, setShowUserLists] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [detailedOverview, setDetailedOverview] = useState('');
  const [showFullOverview, setShowFullOverview] = useState(false);
  const [seasons, setSeasons] = useState([]);
  const [episodes, setEpisodes] = useState([]);
  const [mediaData, setMediaData] = useState({
    type: type === 'movie' ? 'movie' : 'series',
    seriesId: type === 'tv' ? id : '',
    episodeNo: type === 'tv' ? '1' : '',
    season: type === 'tv' ? '1' : '',
    movieId: type === 'movie' ? id : '',
  });
  const iframeRef = useRef(null);
  const [videoSource, setVideoSource] = useState(() => getStoredVideoSource() || 'multiembed');
  const [showSourceMenu, setShowSourceMenu] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const contentRef = useRef(null);
  const [cast, setCast] = useState([]);
  const [crew, setCrew] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [similar, setSimilar] = useState([]);

  // Add this new style object at the top of the component
  const buttonClasses = {
    base: `flex items-center gap-2 p-4 rounded-full shadow-lg transition-all duration-300
      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#02c39a] relative z-[60]`,
    default: `bg-[#02c39a] text-white hover:bg-[#00a896] transform hover:scale-105
      hover:shadow-xl active:scale-95`,
    active: `bg-[#c3022b] text-white hover:bg-[#a80016]`
  };

  const handleSourceChange = (source) => {
    setVideoSource(source);
    setStoredVideoSource(source); // Save to storage when source changes
    setIsVideoReady(false);
    // Small delay to ensure iframe reloads
    setTimeout(() => setIsVideoReady(true), 100);
  };

  // Add effect to sync source with storage on mount
  useEffect(() => {
    const savedSource = getStoredVideoSource();
    if (savedSource) {
      setVideoSource(savedSource);
    }
  }, []);

  // Move progress loading to earlier in the component and update season fetching
  useEffect(() => {
    let savedProgress = null;
    
    const fetchSeasonsAndSetProgress = async () => {
      if (type === 'tv' && id) {
        try {
          // Get saved progress first
          savedProgress = getTVProgress(id);
          
          // Fetch seasons
          const response = await fetch(`${BASE_URL}/tv/${id}?api_key=${API_KEY}`);
          const data = await response.json();
          setSeasons(data.seasons || []);
          
          if (savedProgress) {
            // Use saved progress if available
            setMediaData(prev => ({
              ...prev,
              season: savedProgress.season,
              episodeNo: savedProgress.episode
            }));
          } else if (data.seasons?.length > 0) {
            // Fall back to first season if no saved progress
            setMediaData(prev => ({
              ...prev,
              season: data.seasons[0].season_number.toString()
            }));
          }
          
          // Set video ready after setting up season/episode
          setIsVideoReady(true);
        } catch (error) {
          console.error('Error fetching seasons:', error);
        }
      }
    };

    fetchSeasonsAndSetProgress();
  }, [type, id]); // Remove the separate progress loading effect

  // User Features
  const {
    watchlist,
    favorites,
    watchHistory,
    addToWatchlist,
    removeFromWatchlist,
    addToFavorites,
    removeFromFavorites,
    addToWatchHistory
    //removeFromWatchHistory
  } = useUserFeatures();

  // Check if item is in user lists
  const isInWatchlist = watchlist?.some(i => i.id === Number(id));
  const isInFavorites = favorites?.some(i => i.id === Number(id));

  useEffect(() => {
    const fetchDetailsAndRecommendations = async () => {
      try {
        // Fetch basic details
        const response = await fetch(`${BASE_URL}/${type}/${id}?api_key=${API_KEY}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        data.media_type = type;
        setItem(data);
        
        // Fetch detailed information including longer overview
        const detailsResponse = await fetch(
          `${BASE_URL}/${type}/${id}?api_key=${API_KEY}&append_to_response=keywords,reviews,translations`
        );
        const detailsData = await detailsResponse.json();
        
        // Get English overview from translations if available
        const englishTranslation = detailsData.translations?.translations?.find(
          t => t.iso_639_1 === 'en'
        );
        
        // Combine overview with additional details
        let fullOverview = data.overview || '';
        
        if (englishTranslation?.data?.overview) {
          fullOverview = englishTranslation.data.overview;
        }
        
        // Add keywords as topics if available
        if (detailsData.keywords?.keywords || detailsData.keywords?.results) {
          const keywords = detailsData.keywords?.keywords || detailsData.keywords?.results || [];
          if (keywords.length > 0) {
            fullOverview += '\n\nTopics: ' + keywords.map(k => k.name).join(', ');
          }
        }
        
        // Add a selected review if available
        if (detailsData.reviews?.results?.length > 0) {
          const topReview = detailsData.reviews.results.find(r => r.content.length > 100);
          if (topReview) {
            fullOverview += '\n\nCritic Review:\n"' + topReview.content.slice(0, 500) + 
              (topReview.content.length > 500 ? '..."' : '"') +
              `\n- ${topReview.author}`;
          }
        }
        
        setDetailedOverview(fullOverview);
        
        setMediaData(prevData => ({
          ...prevData,
          seriesId: type === 'tv' ? id : '',
          movieId: type === 'movie' ? id : '',
        }));

        // Fetch recommendations
        const recommendationsData = await getRecommendations(type, id);
        setRecommendations(recommendationsData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load content. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    if (type && id) {
      fetchDetailsAndRecommendations();
    }
  }, [id, type]);

  // Fetch seasons for TV shows
  useEffect(() => {
    const fetchSeasons = async () => {
      if (type === 'tv' && id) {
        try {
          const response = await fetch(`${BASE_URL}/tv/${id}?api_key=${API_KEY}`);
          const data = await response.json();
          setSeasons(data.seasons || []);
          if (data.seasons?.length > 0) {
            setMediaData(prevData => ({ 
              ...prevData, 
              season: data.seasons[0].season_number.toString() 
            }));
          }
        } catch (error) {
          console.error('Error fetching seasons:', error);
        }
      }
    };

    fetchSeasons();
  }, [type, id]);

  // Update episodes fetching logic with correct dependencies and prevent infinite loops
  useEffect(() => {
    fetchEpisodes(type, id, mediaData, setMediaData, setEpisodes, setIsVideoReady, BASE_URL, API_KEY);
  }, [type, id, mediaData]); // Include mediaData in dependencies

  // Handle user actions
  const handleWatchlistToggle = async () => {
    if (isInWatchlist) {
      await removeFromWatchlist(item);
    } else {
      await addToWatchlist({...item, media_type: type});
    }
  };

  const handleFavoritesToggle = async () => {
    if (isInFavorites) {
      await removeFromFavorites(item);
    } else {
      await addToFavorites({...item, media_type: type});
    }
  };

   // Update handleSubmit to ensure progress is saved when playing
   const handleSubmit = (e) => {
    e.preventDefault();
    setIsVideoReady(true);
    if (item) {
      addToWatchHistory({...item, media_type: type});
      if (type === 'tv') {
        saveTVProgress(id, mediaData.season, mediaData.episodeNo);
      }
    }
  };

  const handleListItemClick = async (item) => {
    setShowUserLists(false); // Close the sidebar
    
    // Add to watch history before navigating
    try {
      if (!currentUser) return; // Add check for currentUser

      // Create history item with required fields
      const historyItem = {
        id: item.id,
        title: item.title || item.name,
        media_type: item.media_type,
        poster_path: item.poster_path,
        overview: item.overview
      };

      // For TV shows, add episode info and use it in addToWatchHistory call
      if (item.media_type === 'tv') {
        const episodeInfo = {
          season: '1',
          episode: '1',
          name: item.name
        };
        await addToWatchHistory({...historyItem}, episodeInfo);
      } else {
        await addToWatchHistory({...historyItem});
      }
      
      console.log('Added to watch history from recommendations');
    } catch (error) {
      console.error('Error adding to watch history:', error);
    }

    // Navigate to the new item
    navigate(`/watch/${item.media_type}/${item.id}`);
    
    // Reload the page if we're already on the same item but with different parameters
    if (item.id === Number(id)) {
      window.location.reload();
    }
  };

  // Add this new function after the handleFavoritesToggle function
  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    
    // Update mediaData with the new value
    setMediaData(prev => ({
      ...prev,
      [name]: value
    }));

    // Reset video ready state
    setIsVideoReady(false);

    // If changing season, reset episode to 1
    if (name === 'season') {
      setMediaData(prev => ({
        ...prev,
        episodeNo: '1'
      }));
      
      // Fetch episodes for the new season
      try {
        const response = await fetch(
          `${BASE_URL}/tv/${id}/season/${value}?api_key=${API_KEY}`
        );
        const data = await response.json();
        setEpisodes(data.episodes || []);
      } catch (error) {
        console.error('Error fetching episodes:', error);
      }
    }

    // Update progress in storage for TV shows
    if (type === 'tv') {
      saveTVProgress(id, 
        name === 'season' ? value : mediaData.season,
        name === 'episodeNo' ? value : mediaData.episodeNo
      );
    }

    // Add to watch history
    if (item) {
      addToWatchHistory({
        ...item,
        media_type: type,
        season: name === 'season' ? value : mediaData.season,
        episode: name === 'episodeNo' ? value : mediaData.episodeNo
      });
    }

    // Set video ready after a short delay
    setTimeout(() => setIsVideoReady(true), 100);
  };

  // Update the episodes useEffect to use mediaData.season
  useEffect(() => {
    if (type === 'tv' && id && mediaData.season) {
      const fetchEpisodesData = async () => {
        try {
          const response = await fetch(
            `${BASE_URL}/tv/${id}/season/${mediaData.season}?api_key=${API_KEY}`
          );
          const data = await response.json();
          setEpisodes(data.episodes || []);
          setIsVideoReady(true);
        } catch (error) {
          console.error('Error fetching episodes:', error);
        }
      };

      fetchEpisodesData();
    }
  }, [type, id, mediaData.season]);

  // Track scroll position for quick actions
  useEffect(() => {
    const handleScroll = () => {
      if (contentRef.current) {
        const scrollPosition = window.scrollY;
        setShowQuickActions(scrollPosition > 200);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Add this effect to fetch cast, crew, and reviews
  useEffect(() => {
    const fetchAdditionalData = async () => {
      if (!type || !id) return;
      
      try {
        // Fetch credits (cast & crew)
        const creditsResponse = await fetch(
          `${BASE_URL}/${type}/${id}/credits?api_key=${API_KEY}`
        );
        const creditsData = await creditsResponse.json();
        setCast(creditsData.cast?.slice(0, 20) || []);
        setCrew(creditsData.crew?.slice(0, 20) || []);

        // Fetch reviews
        const reviewsResponse = await fetch(
          `${BASE_URL}/${type}/${id}/reviews?api_key=${API_KEY}`
        );
        const reviewsData = await reviewsResponse.json();
        setReviews(reviewsData.results || []);

        // Fetch similar content
        const similarResponse = await fetch(
          `${BASE_URL}/${type}/${id}/similar?api_key=${API_KEY}`
        );
        const similarData = await similarResponse.json();
        const similarWithType = similarData.results?.slice(0, 12).map(item => ({
          ...item,
          media_type: type // Add the same media_type as the current content
        })) || [];
        setSimilar(similarWithType);
      } catch (error) {
        console.error('Error fetching additional data:', error);
      }
    };

    fetchAdditionalData();
  }, [type, id]);

  if (isLoading) {
    return <Skeleton isDarkMode={isDarkMode} />;
  }

  if (error) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${isDarkMode ? 'bg-[#000e14] text-white' : 'bg-gray-50 text-black'}`}>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 max-w-md w-full mx-4 transform transition-all hover:scale-105">
          <div className="text-center">
            <div className="bg-red-100 dark:bg-red-900 rounded-full p-3 w-16 h-16 mx-auto mb-4">
              <svg className="w-10 h-10 text-red-500 dark:text-red-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Oops! Something went wrong</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg
                hover:from-blue-600 hover:to-blue-700 transition-all duration-200 
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                transform hover:-translate-y-0.5"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Replace the content section with tabbed interface
  const renderContentTabs = () => (
    <Tab.Group>
      <Tab.List className="flex space-x-1 rounded-xl bg-gray-100 dark:bg-gray-800 p-1">
        {['Overview', 'Cast & Crew', 'Reviews', 'Similar'].map((tab) => (
          <Tab
            key={tab}
            className={({ selected }) =>
              `w-full rounded-lg py-2.5 text-sm font-medium leading-5
              ${selected 
                ? 'bg-white dark:bg-gray-700 shadow text-blue-600 dark:text-blue-400'
                : 'hover:bg-gray-200 dark:hover:bg-gray-600'}`
            }
          >
            {tab}
          </Tab>
        ))}
      </Tab.List>
      <Tab.Panels className="mt-4">
        <Tab.Panel>
          {/* Overview content */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="prose dark:prose-invert max-w-none"
          >
            <div className="relative">
              <p className="text-gray-600 dark:text-gray-300">
                {showFullOverview 
                  ? detailedOverview 
                  : (detailedOverview?.length > 300 
                      ? `${detailedOverview.slice(0, 300)}...` 
                      : detailedOverview)}
              </p>
              {detailedOverview?.length > 300 && (
                <button
                  onClick={() => setShowFullOverview(!showFullOverview)}
                  className="mt-2 text-blue-500 hover:text-blue-600 dark:text-blue-400 
                    dark:hover:text-blue-300 font-medium transition-colors duration-200"
                >
                  {showFullOverview ? 'Show Less' : 'Read More'}
                </button>
              )}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {item?.genres?.map((genre) => (
                <motion.span
                  key={genre.id}
                  whileHover={{ scale: 1.05 }}
                  className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm
                    cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  title={`View more ${genre.name} content`}
                >
                  {genre.name}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </Tab.Panel>
        <Tab.Panel>
          <div className="space-y-6">
            {/* Cast Section */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Cast</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {cast.map((person) => (
                  <motion.div
                    key={person.id}
                    whileHover={{ scale: 1.05 }}
                    className="bg-white dark:bg-gray-700 rounded-lg overflow-hidden shadow-md"
                  >
                    {person.profile_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w185${person.profile_path}`}
                        alt={person.name}
                        className="w-full h-40 object-cover"
                      />
                    ) : (
                      <div className="w-full h-40 bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                        <User className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                    <div className="p-2 text-center">
                      <p className="font-medium text-sm">{person.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{person.character}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Crew Section */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Crew</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {crew.map((person) => (
                  <motion.div
                    key={`${person.id}-${person.job}`}
                    whileHover={{ scale: 1.05 }}
                    className="bg-white dark:bg-gray-700 rounded-lg overflow-hidden shadow-md"
                  >
                    {person.profile_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w185${person.profile_path}`}
                        alt={person.name}
                        className="w-full h-40 object-cover"
                      />
                    ) : (
                      <div className="w-full h-40 bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                        <User className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                    <div className="p-2 text-center">
                      <p className="font-medium text-sm">{person.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{person.job}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </Tab.Panel>

        <Tab.Panel>
          <div className="space-y-6">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-gray-700 rounded-lg p-4 shadow-md"
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                        <User className="w-6 h-6 text-gray-400" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">{review.author}</h4>
                        {review.author_details?.rating && (
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-400 mr-1" />
                            <span>{review.author_details.rating}/10</span>
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                        {review.content.length > 300
                          ? `${review.content.slice(0, 300)}...`
                          : review.content}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        {new Date(review.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                No reviews available yet.
              </div>
            )}
          </div>
        </Tab.Panel>

        <Tab.Panel>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {similar.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ scale: 1.05 }}
                className="cursor-pointer"
                onClick={() => handleListItemClick(item)}
              >
                <div className="relative rounded-lg overflow-hidden">
                  <img
                    src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                    alt={item.title || item.name}
                    className="w-full h-auto"
                    onError={(e) => {
                      e.target.src = '/path-to-fallback-image.jpg'; // Add a fallback image
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 p-3">
                      <h4 className="text-white font-semibold">{item.title || item.name}</h4>
                      <p className="text-gray-200 text-sm">
                        {new Date(item.release_date || item.first_air_date).getFullYear()}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Tab.Panel>
      </Tab.Panels>
    </Tab.Group>
  );

  // Update the renderQuickActions function with improved button styling
  const renderQuickActions = () => (
    <AnimatePresence>
      {showQuickActions && (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          className="fixed bottom-20 left-1/2 transform -translate-x-1/2 
            bg-white dark:bg-gray-800 rounded-full shadow-lg px-6 py-3
            flex items-center space-x-4 z-50"
        >
          <motion.button
            onClick={handleWatchlistToggle}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className={`p-2 rounded-full transition-colors duration-200
              ${isInWatchlist 
                ? 'bg-blue-500 text-white hover:bg-blue-600' 
                : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            aria-label={isInWatchlist ? "Remove from watchlist" : "Add to watchlist"}
          >
            <List 
              className={`w-5 h-5 ${isInWatchlist ? 'fill-current' : ''}`}
              data-active={isInWatchlist}
            />
          </motion.button>
          <motion.button
            onClick={handleFavoritesToggle}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className={`p-2 rounded-full transition-colors duration-200
              ${isInFavorites 
                ? 'bg-red-500 text-white hover:bg-red-600' 
                : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            aria-label={isInFavorites ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart 
              className={`w-5 h-5 ${isInFavorites ? 'fill-current' : ''}`}
              data-active={isInFavorites}
            />
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Enhanced season/episode selection for TV shows
  const renderEpisodeGrid = () => (
    type === 'tv' && (
      <div className="mt-6 bg-white dark:bg-[#000e14] rounded-xl shadow-lg p-6">
        {/* Add season selector */}
        <div className="mb-4">
          <select
            value={mediaData.season}
            onChange={(e) => handleInputChange({
              target: { name: 'season', value: e.target.value }
            })}
            className="w-full md:w-auto px-4 py-2 rounded-lg border dark:bg-gray-700 
              dark:border-gray-600 dark:text-white"
          >
            {seasons.map((season) => (
              <option key={season.season_number} value={season.season_number}>
                Season {season.season_number}
              </option>
            ))}
          </select>
        </div>
        
        {/* Existing episode grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {episodes.map((episode) => (
            <motion.div
              key={episode.id}
              whileHover={{ scale: 1.02 }}
              className="relative rounded-lg overflow-hidden cursor-pointer"
              onClick={() => handleInputChange({
                target: { name: 'episodeNo', value: episode.episode_number.toString() }
              })}
            >
              {/* Episode card content */}
              <div className="relative aspect-video">
                <img
                  src={`https://image.tmdb.org/t/p/w500${episode.still_path}`}
                  alt={episode.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
              <div className="absolute bottom-0 p-3 text-white">
                <h4 className="font-semibold">{episode.name}</h4>
                <p className="text-sm opacity-90">Episode {episode.episode_number}</p>
              </div>
              {/* Episode progress indicator */}
              <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-green-500" />
            </motion.div>
          ))}
        </div>
      </div>
    )
  );

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-[#000e14] text-white' : 'bg-gray-50 text-black'}`}>
      <ErrorBoundary>
        <div ref={contentRef} className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mobile:grid-cols-1">
            <div className="lg:col-span-2">
              <SourceSelector 
                videoSource={videoSource} 
                handleSourceChange={handleSourceChange}
                showSourceMenu={showSourceMenu} 
                setShowSourceMenu={setShowSourceMenu} 
              />
              
              {/* Video Section */}
              <div className="relative">
                <VideoSection
                  ref={videoSectionRef}
                  mediaData={{ ...mediaData, apiType: videoSource }}
                  isVideoReady={isVideoReady}
                  onSubmit={handleSubmit}
                  iframeRef={iframeRef}
                  allowFullscreen={true}
                  onSourceChange={handleSourceChange}
                />
              </div>

              {/* Tabbed Content Interface */}
              {item && (
                <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                  {renderContentTabs()}
                </div>
              )}

              {/* Enhanced Episode Grid for TV Shows */}
              {type === 'tv' && renderEpisodeGrid()}
            </div>

            {/* Recommendations Section */}
            <div className="lg:col-span-1">
              <div className="sticky top-6">
                <Recommendations 
                  recommendations={recommendations} 
                  handleListItemClick={handleListItemClick} 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        {renderQuickActions()}
        
        {/* User Lists Sidebar and Button */}
        <div className="fixed bottom-6 left-6 z-[60]">
          <motion.button
            onClick={() => setShowUserLists(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`${buttonClasses.base} ${showUserLists ? buttonClasses.active : buttonClasses.default}
              group relative`}
            aria-label="Open user lists"
          >
            <div className="relative flex items-center">
              <motion.svg 
                animate={{ rotate: showUserLists ? 90 : 0 }}
                className="w-6 h-6"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M4 6h16M4 12h16M4 18h16" />
              </motion.svg>
              <span className="hidden sm:inline ml-2 whitespace-nowrap">
                My Lists
              </span>
            </div>
          </motion.button>
        </div>

        {/* Update overlay with proper z-index */}
        <AnimatePresence>
          {showUserLists && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-[65]"
              onClick={() => setShowUserLists(false)}
            />
          )}
        </AnimatePresence>

        {/* Render sidebar */}
        <UserListsSidebar 
          showUserLists={showUserLists} 
          setShowUserLists={setShowUserLists}
          watchHistory={watchHistory}
          watchlist={watchlist}
          favorites={favorites}
          handleListItemClick={handleListItemClick}
        />
      </ErrorBoundary>
    </div>
  );
}

export default WatchPage;
