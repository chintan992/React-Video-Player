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
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-fadeIn"
      onClick={handleOverlayClick}
    >
      {selectedTrailer && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex justify-center items-center z-[60] p-4 animate-fadeIn">
          <div className="relative w-full max-w-5xl aspect-video">
            <button 
              className="absolute -top-10 right-0 p-2 hover:bg-white/10 rounded-full transition-colors"
              onClick={() => setSelectedTrailer(null)}
              aria-label="Close trailer"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="relative pb-[56.25%] h-0 rounded-xl overflow-hidden shadow-2xl">
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src={`https://www.youtube.com/embed/${selectedTrailer}?autoplay=1`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}

      <div className={`relative rounded-xl shadow-2xl w-full max-w-5xl h-[90vh] overflow-hidden transition-all duration-300 animate-slideUp
                    ${isDarkMode ? 'bg-[#000e14] text-white' : 'bg-white text-gray-900'}`}>
        <button 
          className="absolute top-4 right-4 p-2 hover:bg-black/10 rounded-full transition-colors z-10" 
          onClick={onClose}
          aria-label="Close details"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {message && (
          <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg animate-fadeIn
                        ${error ? 'bg-red-500' : 'bg-green-500'} text-white z-50`}>
            {message}
          </div>
        )}

        <div className="h-full overflow-y-auto">
          <div className="relative h-[40vh] md:h-[50vh] w-full">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-[1]" />
            <img
              src={item.backdrop_path 
                ? `https://image.tmdb.org/t/p/original${item.backdrop_path}`
                : (item.poster_path 
                  ? `https://image.tmdb.org/t/p/original${item.poster_path}`
                  : '/placeholder-backdrop.jpg')}
              alt=""
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 p-6 z-[2] text-white">
              <h2 className="text-4xl font-bold mb-2">{item.title || item.name}</h2>
              <div className="flex items-center gap-4 text-sm">
                <span className="px-2 py-1 bg-white/20 rounded">
                  {item.media_type === 'movie' ? 'Movie' : 'TV Show'}
                </span>
                {item.vote_average > 0 && (
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    {item.vote_average.toFixed(1)}
                  </span>
                )}
                <span>{new Date(item.release_date || item.first_air_date).getFullYear() || 'N/A'}</span>
              </div>
            </div>
          </div>

          <div className="px-6 py-8 grid md:grid-cols-[300px,1fr] gap-8">
            <div className="space-y-6">
              <img
                src={item.poster_path 
                  ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                  : '/placeholder-poster.png'}
                alt={item.title || item.name}
                className="w-full rounded-lg shadow-lg"
              />
              
              <div className="flex flex-col gap-3">
                {trailers.length > 0 && (
                  <button
                    onClick={() => setSelectedTrailer(trailers[0].key)}
                    className={`w-full px-4 py-3 rounded-lg flex items-center justify-center gap-2 
                              ${isDarkMode ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'}
                              text-white transition-colors`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Watch Trailer
                  </button>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={handleWatchNow}
                    className={`px-4 py-3 rounded-lg transition-colors flex items-center justify-center gap-2
                              ${isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} 
                              text-white`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    </svg>
                    {isInHistory ? 'Watch Again' : 'Watch Now'}
                  </button>

                  <button 
                    onClick={handleShare}
                    className={`px-4 py-3 rounded-lg transition-colors flex items-center justify-center gap-2
                              ${isDarkMode ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-500 hover:bg-purple-600'} 
                              text-white`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                    Share
                  </button>

                  <button 
                    onClick={handleAddToWatchlist}
                    disabled={isInWatchlist}
                    className={`px-4 py-3 rounded-lg transition-colors flex items-center justify-center gap-2
                              ${isInWatchlist
                                ? 'bg-gray-400 cursor-not-allowed'
                                : isDarkMode
                                  ? 'bg-green-600 hover:bg-green-700'
                                  : 'bg-green-500 hover:bg-green-600'}
                              text-white`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    {isInWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
                  </button>

                  <button 
                    onClick={handleAddToFavorites}
                    disabled={isInFavorites}
                    className={`px-4 py-3 rounded-lg transition-colors flex items-center justify-center gap-2
                              ${isInFavorites
                                ? 'bg-gray-400 cursor-not-allowed'
                                : isDarkMode
                                  ? 'bg-yellow-600 hover:bg-yellow-700'
                                  : 'bg-yellow-500 hover:bg-yellow-600'}
                              text-white`}
                  >
                    <svg className="w-5 h-5" fill={isInFavorites ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    {isInFavorites ? 'In Favorites' : 'Add to Favorites'}
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-semibold mb-4">Overview</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {item.overview || 'No overview available.'}
                </p>
              </div>

              {item.media_type === 'tv' && (
                <div>
                  <h3 className="text-xl font-semibold mb-3">Series Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Seasons</p>
                      <p className="text-2xl font-bold">{item.number_of_seasons || 'N/A'}</p>
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Episodes</p>
                      <p className="text-2xl font-bold">{item.number_of_episodes || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              )}

              {recommendations.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold mb-4">You might also like</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {recommendations.slice(0, 4).map(recommendation => (
                      <div 
                        key={recommendation.id}
                        onClick={() => {
                          onClose();
                          navigate(`/watch/${recommendation.media_type}/${recommendation.id}`);
                        }}
                        className="cursor-pointer transition-transform hover:scale-105"
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
        </div>
      </div>
    </div>
  );
};

export default MediaDetail;
