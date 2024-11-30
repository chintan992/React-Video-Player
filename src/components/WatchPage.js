import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDarkMode } from './DarkModeContext';
import { useUserFeatures } from '../hooks/useUserFeatures';
import MediaForm from './MediaForm';
import VideoSection from './VideoSection';

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
  const [item, setItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isDarkMode } = useDarkMode();
  const videoSectionRef = useRef(null);
  const [showUserLists, setShowUserLists] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);

  // User Features
  const {
    watchlist,
    favorites,
    watchHistory,
    addToWatchlist,
    removeFromWatchlist,
    addToFavorites,
    removeFromFavorites,
    addToWatchHistory,
    removeFromWatchHistory
  } = useUserFeatures();

  const [mediaData, setMediaData] = useState({
    type: type === 'movie' ? 'movie' : 'series',
    apiType: 'multiembed',
    seriesId: type === 'tv' ? id : '',
    episodeNo: type === 'tv' ? '1' : '',
    season: type === 'tv' ? '1' : '',
    movieId: type === 'movie' ? id : '',
  });

  // Check if item is in user lists
  const isInWatchlist = watchlist?.some(i => i.id === Number(id));
  const isInFavorites = favorites?.some(i => i.id === Number(id));

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await fetch(`${BASE_URL}/${type}/${id}?api_key=${API_KEY}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        data.media_type = type; // Add media_type for proper navigation
        setItem(data);
        
        setMediaData(prevData => ({
          ...prevData,
          seriesId: type === 'tv' ? id : '',
          movieId: type === 'movie' ? id : '',
        }));
      } catch (err) {
        console.error('Error fetching detail data:', err);
        setError('Failed to load details. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    if (type && id) {
      fetchDetails();
    }
  }, [id, type]);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsVideoReady(true);
    // Add to watch history when starting to watch
    if (item) {
      addToWatchHistory({...item, media_type: type});
    }
  };

  const handleListItemClick = (item) => {
    setShowUserLists(false); // Close the sidebar
    navigate(`/watch/${item.media_type}/${item.id}`);
    // Reload the page if we're already on the same item but with different parameters
    if (item.id === Number(id)) {
      window.location.reload();
    }
  };

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-black'}`}>
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-lg font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-black'}`}>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <svg className="mx-auto h-12 w-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h2 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">Error</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-6 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const renderUserListsSidebar = () => (
    <div className={`fixed right-0 top-0 h-full w-80 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg transform transition-transform duration-300 ease-in-out ${showUserLists ? 'translate-x-0' : 'translate-x-full'} z-50`}>
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">My Lists</h2>
          <button 
            onClick={() => setShowUserLists(false)}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            ×
          </button>
        </div>
        
        <div className="space-y-6">
          {/* Watchlist */}
          <div>
            <h3 className="font-semibold mb-2">Watchlist</h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {watchlist?.map(item => (
                <div 
                  key={item.id} 
                  className="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer group"
                >
                  <span 
                    className="truncate flex-grow pr-2"
                    onClick={() => handleListItemClick(item)}
                  >
                    {item.title || item.name}
                  </span>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFromWatchlist(item);
                    }}
                    className="text-red-500 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Favorites */}
          <div>
            <h3 className="font-semibold mb-2">Favorites</h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {favorites?.map(item => (
                <div 
                  key={item.id} 
                  className="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer group"
                >
                  <span 
                    className="truncate flex-grow pr-2"
                    onClick={() => handleListItemClick(item)}
                  >
                    {item.title || item.name}
                  </span>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFromFavorites(item);
                    }}
                    className="text-red-500 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Watch History */}
          <div>
            <h3 className="font-semibold mb-2">Watch History</h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {watchHistory?.map(item => (
                <div 
                  key={`${item.id}-${item.watchedAt?.seconds}`} 
                  className="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer group"
                >
                  <div 
                    className="flex flex-col flex-grow pr-2"
                    onClick={() => handleListItemClick(item)}
                  >
                    <span className="truncate">{item.title || item.name}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(item.watchedAt.seconds * 1000).toLocaleDateString()}
                    </span>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFromWatchHistory(item);
                    }}
                    className="text-red-500 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className={`sticky top-0 z-10 bg-opacity-95 backdrop-blur-sm shadow-lg mb-6 
        ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <button 
            onClick={() => navigate(-1)} 
            className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium
              transition-colors duration-150 ease-in-out
              bg-blue-600 hover:bg-blue-700 text-white
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </button>

          <button
            onClick={() => setShowUserLists(!showUserLists)}
            className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium
              transition-colors duration-150 ease-in-out
              bg-purple-600 hover:bg-purple-700 text-white
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            My Lists
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="w-full md:w-1/3 lg:w-1/4">
                <div className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-lg">
                  <img
                    src={item?.poster_path 
                      ? `${process.env.REACT_APP_TMDB_IMAGE_BASE_URL || 'https://image.tmdb.org/t/p'}/w500${item.poster_path}`
                      : 'https://via.placeholder.com/500x750?text=No+Image'}
                    alt={item?.title || item?.name}
                    className="w-full h-full object-cover"
                    loading="eager"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/500x750?text=No+Image';
                    }}
                  />
                </div>

                {/* User action buttons */}
                <div className="mt-4 space-y-2">
                  <button
                    onClick={handleWatchlistToggle}
                    className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150
                      ${isInWatchlist 
                        ? 'bg-gray-600 hover:bg-gray-700' 
                        : 'bg-blue-600 hover:bg-blue-700'} text-white`}
                  >
                    {isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
                  </button>
                  <button
                    onClick={handleFavoritesToggle}
                    className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150
                      ${isInFavorites 
                        ? 'bg-gray-600 hover:bg-gray-700' 
                        : 'bg-yellow-600 hover:bg-yellow-700'} text-white`}
                  >
                    {isInFavorites ? 'Remove from Favorites' : 'Add to Favorites'}
                  </button>
                </div>
              </div>

              <div className="flex-1">
                <h1 className="text-4xl font-bold mb-4">{item?.title || item?.name}</h1>
                
                <div className="flex flex-wrap gap-4 mb-6">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                    bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                    {type === 'movie' ? 'Movie' : 'TV Show'}
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                    bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                    ★ {item?.vote_average?.toFixed(1)}/10
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                    bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200">
                    {item?.release_date || item?.first_air_date || 'N/A'}
                  </span>
                </div>

                <div className="prose dark:prose-invert max-w-none mb-6">
                  <p className="text-lg leading-relaxed">{item?.overview || 'No overview available.'}</p>
                </div>

                {type === 'tv' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <h3 className="text-lg font-semibold mb-2">Seasons</h3>
                      <p className="text-3xl font-bold">{item?.number_of_seasons || 'N/A'}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <h3 className="text-lg font-semibold mb-2">Episodes</h3>
                      <p className="text-3xl font-bold">{item?.number_of_episodes || 'N/A'}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden" ref={videoSectionRef}>
          <div className="p-6">
            <MediaForm
              mediaData={mediaData}
              setMediaData={setMediaData}
              handleSubmit={handleSubmit}
            />
            {isVideoReady && (
              <div className="mt-6">
                <ErrorBoundary>
                  <VideoSection mediaData={mediaData} />
                </ErrorBoundary>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* User Lists Sidebar */}
      {renderUserListsSidebar()}
    </div>
  );
}

export default WatchPage;
