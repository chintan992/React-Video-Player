import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDarkMode } from './DarkModeContext';
import { useUserFeatures } from '../hooks/useUserFeatures';
import { getRecommendations } from '../api/tmdbApi';
import { getStoredVideoSource, setStoredVideoSource, saveTVProgress, getTVProgress } from '../utils/storage';
import VideoSection from './VideoSection';
import { VIDEO_SOURCES } from '../api';
import { useAuth } from '../context/AuthContext'; // Add this import

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
    const fetchEpisodes = async () => {
      if (type === 'tv' && id && mediaData.season) {
        try {
          const response = await fetch(
            `${BASE_URL}/tv/${id}/season/${mediaData.season}?api_key=${API_KEY}`
          );
          const data = await response.json();
          setEpisodes(data.episodes || []);
          
          // Only set episode to 1 if there's no saved episode number and episodes exist
          if (data.episodes?.length > 0 && !mediaData.episodeNo) {
            // Use a state updater to ensure we have the latest state
            setMediaData(prevData => {
              // Only update if we still don't have an episode number
              if (!prevData.episodeNo) {
                setIsVideoReady(false);
                setTimeout(() => setIsVideoReady(true), 100);
                return { 
                  ...prevData, 
                  episodeNo: '1' 
                };
              }
              return prevData;
            });
          }
        } catch (error) {
          console.error('Error fetching episodes:', error);
        }
      }
    };

    fetchEpisodes();
  }, [type, id, mediaData.season, mediaData.episodeNo]); // Include episodeNo in dependencies

  // Update handleInputChange to automatically trigger video play
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMediaData(prevData => {
      const newData = { ...prevData, [name]: value };
      
      // Save progress for both season and episode changes
      if (type === 'tv') {
        saveTVProgress(id, 
          name === 'season' ? value : newData.season,
          name === 'episodeNo' ? value : newData.episodeNo
        );
        addToWatchHistory({...item, media_type: type});
      }
      
      return newData;
    });

    // Automatically trigger video load
    setIsVideoReady(false);
    setTimeout(() => setIsVideoReady(true), 100);
  };

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

  const renderSourceSelector = () => (
    <div className="mb-4">
      <div className="relative">
        <button
          onClick={() => setShowSourceMenu(!showSourceMenu)}
          className="w-full bg-white dark:bg-gray-800 px-4 py-2 rounded-lg flex items-center justify-between shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <span className="flex items-center gap-2">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            {VIDEO_SOURCES[videoSource].name}
            <span className="text-xs text-gray-500 dark:text-gray-400">
              ({VIDEO_SOURCES[videoSource].quality})
            </span>
          </span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {showSourceMenu && (
          <>
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
              onClick={() => setShowSourceMenu(false)}
            />
            <div className="absolute mt-2 w-full rounded-lg bg-white dark:bg-gray-800 shadow-lg z-50">
              {Object.entries(VIDEO_SOURCES).map(([key, { name, quality }]) => (
                <button
                  key={key}
                  onClick={() => {
                    handleSourceChange(key);
                    setShowSourceMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex justify-between items-center"
                >
                  <span>{name}</span>
                  <span className="text-xs text-gray-500">{quality}</span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-black'}`}>
        <div className="flex flex-col items-center space-y-4 p-8 rounded-lg bg-opacity-50 backdrop-blur-sm">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="flex flex-col items-center">
            <p className="text-xl font-medium">Loading content</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Please wait a moment...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-black'}`}>
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

  const renderUserListsSidebar = () => (
    <div 
      className={`fixed right-0 top-0 h-full w-80 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} 
        shadow-lg transform transition-all duration-300 ease-in-out ${showUserLists ? 'translate-x-0' : 'translate-x-full'} 
        z-50 overflow-hidden`}
    >
      <div className="h-full flex flex-col">
        <div className="p-4 border-b dark:border-gray-700">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">My Lists</h2>
            <button 
              onClick={() => setShowUserLists(false)}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
              aria-label="Close sidebar"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Watch History */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Watch History</h3>
            <div className="space-y-2">
              {watchHistory?.length > 0 ? (
                watchHistory.map((item) => (
                  <div
                    key={`${item.id}-${item.watchedAt?.seconds}`}
                    onClick={() => handleListItemClick(item)}
                    className="flex items-center p-2 rounded-lg cursor-pointer
                      hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                  >
                    <img
                      src={`https://image.tmdb.org/t/p/w92${item.poster_path}`}
                      alt={item.title || item.name}
                      className="w-12 h-16 object-cover rounded"
                    />
                    <div className="ml-3 flex-1">
                      <p className="font-medium text-gray-800 dark:text-white line-clamp-2">
                        {item.title || item.name}
                      </p>
                      <div className="flex flex-col text-sm text-gray-500 dark:text-gray-400">
                        <span>{item.media_type === 'movie' ? 'Movie' : 'TV Series'}</span>
                        <span>Watched: {new Date(item.watchedAt?.seconds * 1000).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-sm">No watch history</p>
              )}
            </div>
          </div>

          {/* Watchlist */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Watchlist</h3>
            <div className="space-y-2">
              {watchlist?.length > 0 ? (
                watchlist.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleListItemClick(item)}
                    className="flex items-center p-2 rounded-lg cursor-pointer
                      hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                  >
                    <img
                      src={`https://image.tmdb.org/t/p/w92${item.poster_path}`}
                      alt={item.title || item.name}
                      className="w-12 h-16 object-cover rounded"
                    />
                    <div className="ml-3 flex-1">
                      <p className="font-medium text-gray-800 dark:text-white line-clamp-2">
                        {item.title || item.name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {item.media_type === 'movie' ? 'Movie' : 'TV Series'}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-sm">No items in watchlist</p>
              )}
            </div>
          </div>

          {/* Favorites */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Favorites</h3>
            <div className="space-y-2">
              {favorites?.length > 0 ? (
                favorites.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleListItemClick(item)}
                    className="flex items-center p-2 rounded-lg cursor-pointer
                      hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                  >
                    <img
                      src={`https://image.tmdb.org/t/p/w92${item.poster_path}`}
                      alt={item.title || item.name}
                      className="w-12 h-16 object-cover rounded"
                    />
                    <div className="ml-3 flex-1">
                      <p className="font-medium text-gray-800 dark:text-white line-clamp-2">
                        {item.title || item.name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {item.media_type === 'movie' ? 'Movie' : 'TV Series'}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-sm">No favorite items</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-black'}`}>
      <ErrorBoundary>
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {renderSourceSelector()}
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
              
              {/* Season and Episode Selection for TV Shows */}
              {type === 'tv' && (
                <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                  <h2 className="text-lg font-semibold mb-4">Episode Selection</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="season" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                        Season
                      </label>
                      <select 
                        id="season" 
                        name="season" 
                        value={mediaData.season} 
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 rounded-lg border transition-colors duration-200 focus:ring-2 focus:ring-offset-2 
                          bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 
                          text-gray-900 dark:text-white focus:ring-blue-500"
                      >
                        {seasons.map(season => (
                          <option key={season.season_number} value={season.season_number}>
                            {season.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="episodeNo" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                        Episode
                      </label>
                      <select 
                        id="episodeNo" 
                        name="episodeNo" 
                        value={mediaData.episodeNo} 
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 rounded-lg border transition-colors duration-200 focus:ring-2 focus:ring-offset-2 
                          bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 
                          text-gray-900 dark:text-white focus:ring-blue-500"
                      >
                        {episodes.map(episode => (
                          <option key={episode.episode_number} value={episode.episode_number}>
                            {episode.name || `Episode ${episode.episode_number}`}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {item && (
                <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h1 className="text-2xl font-bold">{item.title || item.name}</h1>
                    <div className="flex space-x-2">
                      <button
                        onClick={handleWatchlistToggle}
                        className={`p-2 rounded-full transition-colors duration-200
                          ${isInWatchlist 
                            ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300' 
                            : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                        aria-label={isInWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
                      >
                        <svg className="w-6 h-6" fill={isInWatchlist ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      </button>
                      <button
                        onClick={handleFavoritesToggle}
                        className={`p-2 rounded-full transition-colors duration-200
                          ${isInFavorites 
                            ? 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300' 
                            : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                        aria-label={isInFavorites ? 'Remove from favorites' : 'Add to favorites'}
                      >
                        <svg className="w-6 h-6" fill={isInFavorites ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  <div className="prose dark:prose-invert max-w-none">
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
                      {item.genres?.map((genre) => (
                        <span
                          key={genre.id}
                          className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm"
                        >
                          {genre.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-bold mb-4">Recommendations</h2>
                  <div className="space-y-4">
                    {recommendations.slice(0, 5).map((rec) => (
                      <div
                        key={rec.id}
                        onClick={() => handleListItemClick(rec)}
                        className="flex items-center space-x-3 p-2 rounded-lg cursor-pointer
                          hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                      >
                        <img
                          src={`https://image.tmdb.org/t/p/w92${rec.poster_path}`}
                          alt={rec.title || rec.name}
                          className="w-16 h-20 object-cover rounded"
                        />
                        <div>
                          <h3 className="font-medium line-clamp-2">{rec.title || rec.name}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Rating: {rec.vote_average.toFixed(1)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ErrorBoundary>

      {/* Floating action buttons */}
      <div className="fixed bottom-6 left-6 space-y-4">
        {/* Open user lists button */}
        <button
          onClick={() => setShowUserLists(true)}
          className="p-4 bg-blue-600 text-white rounded-full shadow-lg
            hover:bg-blue-700 transition-colors duration-200 z-40 flex items-center gap-2"
          aria-label="Open user lists"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <span className="hidden sm:inline">My Lists</span>
        </button>
      </div>

      {/* User lists sidebar */}
      {renderUserListsSidebar()}

      {/* Overlay when sidebar is open */}
      {showUserLists && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setShowUserLists(false)}
        />
      )}
    </div>
  );
}

export default WatchPage;