import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDarkMode } from './DarkModeContext';
import { useUserFeatures } from '../hooks/useUserFeatures';
import { getVideos, getRecommendations } from '../api/tmdbApi';

const MediaDetail = ({ item, onClose }) => {
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode();
  const [message, setMessage] = useState('');
  const [trailers, setTrailers] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [selectedTrailer, setSelectedTrailer] = useState(null);
  const { 
    addToWatchlist, 
    addToFavorites, 
    addToWatchHistory,
    watchlist,
    favorites,
    watchHistory,
    error 
  } = useUserFeatures();

  useEffect(() => {
    const fetchTrailersAndRecommendations = async () => {
      try {
        const [videosData, recommendationsData] = await Promise.all([
          getVideos(item.media_type, item.id),
          getRecommendations(item.media_type, item.id)
        ]);
        setTrailers(videosData);
        setRecommendations(recommendationsData);
      } catch (err) {
        console.error('Error fetching media data:', err);
      }
    };

    fetchTrailersAndRecommendations();
  }, [item.media_type, item.id]);

  const handleShare = async () => {
    const shareData = {
      title: item.title || item.name,
      text: `Check out ${item.title || item.name} on Let's Stream!`,
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        setMessage('Link copied to clipboard!');
        setTimeout(() => setMessage(''), 2000);
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  const handleWatchNow = async () => {
    try {
      // Add to watch history when clicking Watch Now
      await addToWatchHistory(item);
      navigate(`/watch/${item.media_type}/${item.id}`);
      onClose();
    } catch (err) {
      setMessage('Failed to update watch history');
    }
  };

  const handleAddToWatchlist = async () => {
    try {
      await addToWatchlist(item);
      setMessage('Added to watchlist');
      setTimeout(() => setMessage(''), 2000);
    } catch (err) {
      setMessage('Failed to add to watchlist');
    }
  };

  const handleAddToFavorites = async () => {
    try {
      await addToFavorites(item);
      setMessage('Added to favorites');
      setTimeout(() => setMessage(''), 2000);
    } catch (err) {
      setMessage('Failed to add to favorites');
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const isInWatchlist = watchlist?.some(i => i.id === item.id);
  const isInFavorites = favorites?.some(i => i.id === item.id);
  const isInHistory = watchHistory?.some(i => i.id === item.id);

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50"
      onClick={handleOverlayClick}
    >
      {selectedTrailer && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex justify-center items-center z-50 p-4">
          <div className="relative w-full max-w-4xl aspect-video">
            <button 
              className="absolute -top-8 right-0 sm:right-0 w-8 h-8 flex items-center justify-center rounded-full bg-opacity-50 bg-gray-800 text-white"
              onClick={() => setSelectedTrailer(null)}
            >
              ×
            </button>
            <div className="relative pb-[56.25%] h-0">
              <iframe
                className="absolute top-0 left-0 w-full h-full rounded-lg"
                src={`https://www.youtube.com/embed/${selectedTrailer}`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
      <div className={`rounded-lg shadow-lg p-3 sm:p-4 max-w-full w-full sm:max-w-4xl h-[95vh] sm:h-[90vh] overflow-y-auto transition-all duration-300 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
        <button 
          className="text-2xl absolute top-2 right-2 sm:top-4 sm:right-4 w-8 h-8 flex items-center justify-center rounded-full bg-opacity-50 bg-gray-800 text-white" 
          onClick={onClose}
        >
          ×
        </button>
        
        {message && (
          <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded ${
            error ? 'bg-red-500' : 'bg-green-500'
          } text-white z-50`}>
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-4">
            <img
              src={item.poster_path 
                ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                : 'https://via.placeholder.com/500x750?text=No+Image'}
              alt={item.title || item.name}
              className="rounded-lg shadow-md w-full h-auto object-cover"
            />
            
            {trailers.length > 0 && (
              <button
                onClick={() => setSelectedTrailer(trailers[0].key)}
                className={`w-full px-4 py-2 rounded flex items-center justify-center gap-2 ${
                  isDarkMode ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'
                } text-white`}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Watch Trailer
              </button>
            )}
          </div>
          <div className="media-detail-info space-y-4">
            <h2 className="text-2xl font-semibold">{item.title || item.name}</h2>
            <p className="mt-2"><strong>Type:</strong> {item.media_type === 'movie' ? 'Movie' : 'TV Show'}</p>
            <p><strong>Rating:</strong> {item.vote_average}/10</p>
            <p><strong>Release Date:</strong> {item.release_date || item.first_air_date || 'N/A'}</p>
            <p><strong>Overview:</strong> {item.overview || 'No overview available.'}</p>
            {item.media_type === 'tv' && (
              <>
                <p><strong>Number of Seasons:</strong> {item.number_of_seasons || 'N/A'}</p>
                <p><strong>Number of Episodes:</strong> {item.number_of_episodes || 'N/A'}</p>
              </>
            )}
            
            <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
              <button 
                onClick={handleWatchNow} 
                className={`px-4 py-2 rounded transition duration-200 flex-1 sm:flex-none ${
                  isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
                } text-white`}
              >
                {isInHistory ? 'Watch Again' : 'Watch Now'}
              </button>
              
              <button 
                onClick={handleAddToWatchlist}
                disabled={isInWatchlist}
                className={`px-4 py-2 rounded transition duration-200 flex-1 sm:flex-none ${
                  isInWatchlist
                    ? 'bg-gray-400 cursor-not-allowed'
                    : isDarkMode
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-green-500 hover:bg-green-600'
                } text-white`}
              >
                {isInWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
              </button>
              
              <button 
                onClick={handleAddToFavorites}
                disabled={isInFavorites}
                className={`px-4 py-2 rounded transition duration-200 flex-1 sm:flex-none ${
                  isInFavorites
                    ? 'bg-gray-400 cursor-not-allowed'
                    : isDarkMode
                      ? 'bg-yellow-600 hover:bg-yellow-700'
                      : 'bg-yellow-500 hover:bg-yellow-600'
                } text-white`}
              >
                {isInFavorites ? 'In Favorites' : 'Add to Favorites'}
              </button>

              <button 
                onClick={handleShare}
                className={`px-4 py-2 rounded transition duration-200 flex-1 sm:flex-none ${
                  isDarkMode ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-500 hover:bg-purple-600'
                } text-white`}
              >
                Share
              </button>
            </div>
          </div>
        </div>

        {/* Recommendations Section */}
        {recommendations.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">You might also like</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-4">
              {recommendations.slice(0, 5).map(recommendation => (
                <div 
                  key={recommendation.id}
                  className="cursor-pointer transition-transform hover:scale-105"
                  onClick={() => {
                    onClose();
                    navigate(`/watch/${recommendation.media_type}/${recommendation.id}`);
                  }}
                >
                  <img
                    src={recommendation.poster_path 
                      ? `https://image.tmdb.org/t/p/w200${recommendation.poster_path}`
                      : 'https://via.placeholder.com/200x300?text=No+Image'}
                    alt={recommendation.title || recommendation.name}
                    className="rounded-lg shadow-md w-full h-auto"
                  />
                  <p className="mt-2 text-sm font-medium truncate">
                    {recommendation.title || recommendation.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaDetail;
