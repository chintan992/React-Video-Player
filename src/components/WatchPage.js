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
import fetchEpisodes from '../utils/fetchEpisodes';
import Skeleton from './Skeleton';
import { motion, AnimatePresence } from 'framer-motion';
import ErrorBoundary from './ErrorBoundaryWatchPage';
import EpisodeNavigation from './EpisodeNavigation';
import ContentTabs from './ContentTabs';
import QuickActions from './QuickActions';
import EpisodeGrid from './EpisodeGrid';
import UserListsSidebar from './UserListsSidebar';

const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const BASE_URL = process.env.REACT_APP_TMDB_BASE_URL;

const WatchPage = () => {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
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
  const [episodes, setEpisodes] = useState([]);
  const [seasons, setSeasons] = useState([]); // new state for seasons list
  const [mediaData, setMediaData] = useState({
    type: type === 'movie' ? 'movie' : 'series',
    seriesId: type === 'tv' ? id : '',
    episodeNo: type === 'tv' ? '1' : '',
    season: type === 'tv' ? '1' : '0', // default season to '0' temporarily
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
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [currentEpisode, setCurrentEpisode] = useState(null);

  const buttonClasses = {
    base: `flex items-center gap-2 p-4 rounded-full shadow-lg transition-all duration-300
      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#02c39a] relative z-[60]`,
    default: `bg-[#02c39a] text-white hover:bg-[#00a896] transform hover:scale-105
      hover:shadow-xl active:scale-95`,
    active: `bg-[#c3022b] text-white hover:bg-[#a80016]`
  };

  const handleSourceChange = (source) => {
    setVideoSource(source);
    setStoredVideoSource(source);
    setIsVideoReady(false);
    setTimeout(() => setIsVideoReady(true), 100);
  };

  useEffect(() => {
    const savedSource = getStoredVideoSource();
    if (savedSource) {
      setVideoSource(savedSource);
    }
  }, []);

  useEffect(() => {
    let savedProgress = null;

    const fetchSeasonsAndSetProgress = async () => {
      if (type === 'tv' && id) {
        try {
          savedProgress = getTVProgress(id);

          const tvResponse = await fetch(`${BASE_URL}/tv/${id}?api_key=${API_KEY}`);
          const tvData = await tvResponse.json();

          if (savedProgress) {
            setMediaData(prev => ({
              ...prev,
              season: savedProgress.season,
              episodeNo: savedProgress.episode
            }));
          } else if (tvData.seasons?.length > 0) {
            setMediaData(prev => ({
              ...prev,
              season: tvData.seasons[0].season_number.toString()
            }));
          }

          setSeasons(tvData.seasons || []); // Store seasons data
          setIsVideoReady(true);
        } catch (error) {
          console.error('Error fetching seasons:', error);
        }
      }
    };

    fetchSeasonsAndSetProgress();
  }, [type, id]);

  const {
    watchlist,
    favorites,
    watchHistory,
    addToWatchlist,
    removeFromWatchlist,
    addToFavorites,
    removeFromFavorites,
    addToWatchHistory
  } = useUserFeatures();

  const isInWatchlist = watchlist?.some(i => i.id === Number(id));
  const isInFavorites = favorites?.some(i => i.id === Number(id));

  useEffect(() => {
    const fetchDetailsAndRecommendations = async () => {
      try {
        const response = await fetch(`${BASE_URL}/${type}/${id}?api_key=${API_KEY}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        data.media_type = type;
        setItem(data);

        const detailsResponse = await fetch(
          `${BASE_URL}/${type}/${id}?api_key=${API_KEY}&append_to_response=keywords,reviews,translations`
        );
        const detailsData = await detailsResponse.json();

        let fullOverview = data.overview || '';

        const englishTranslation = detailsData.translations?.translations?.find(
          t => t.iso_639_1 === 'en'
        );

        if (englishTranslation?.data?.overview) {
          fullOverview = englishTranslation.data.overview;
        }

        if (detailsData.keywords?.keywords || detailsData.keywords?.results) {
          const keywords = detailsData.keywords?.keywords || detailsData.keywords?.results || [];
          if (keywords.length > 0) {
            fullOverview += '\n\nTopics: ' + keywords.map(k => k.name).join(', ');
          }
        }

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

        const tvDetailsResponse = await fetch(`${BASE_URL}/tv/${id}?api_key=${API_KEY}`);
        const tvDetailsData = await tvDetailsResponse.json();
        setSeasons(tvDetailsData.seasons || []); // Fetch and store seasons here as well

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


  useEffect(() => {
    fetchEpisodes(type, id, mediaData, setMediaData, setEpisodes, setIsVideoReady, BASE_URL, API_KEY);
  }, [type, id, mediaData]);

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
    if (item) {
      addToWatchHistory({...item, media_type: type});
      if (type === 'tv') {
        saveTVProgress(id, mediaData.season, mediaData.episodeNo);
      }
    }
  };

  const handleListItemClick = async (item) => {
    setShowUserLists(false);

    try {
      if (!currentUser) return;

      const historyItem = {
        id: item.id,
        title: item.title || item.name,
        media_type: item.media_type,
        poster_path: item.poster_path,
        overview: item.overview
      };

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

    navigate(`/watch/${item.media_type}/${item.id}`);

    if (item.id === Number(id)) {
      window.location.reload();
    }
  };

  const handleInputChange = async (e) => {
    const { name, value } = e.target;

    setMediaData(prev => ({
      ...prev,
      [name]: value
    }));

    setIsVideoReady(false);

    if (name === 'episodeNo') {
      const episode = episodes.find(ep => ep.episode_number.toString() === value);
      setCurrentEpisode(episode);
    }

    if (name === 'season') {
      setMediaData(prev => ({
        ...prev,
        episodeNo: '1'
      }));

      try {
        const response = await fetch(
          `${BASE_URL}/tv/${id}/season/${value}?api_key=${API_KEY}`
        );
        const data = await response.json();
        setEpisodes(data.episodes || []);
        if (data.episodes?.[0]) {
          setCurrentEpisode(data.episodes[0]);
        }
      } catch (error) {
        console.error('Error fetching episodes:', error);
      }
    }

    if (type === 'tv') {
      saveTVProgress(id,
        name === 'season' ? value : mediaData.season,
        name === 'episodeNo' ? value : mediaData.episodeNo
      );
    }

    if (item) {
      addToWatchHistory({
        ...item,
        media_type: type,
        season: name === 'season' ? value : mediaData.season,
        episode: name === 'episodeNo' ? value : mediaData.episodeNo
      });
    }

    setTimeout(() => setIsVideoReady(true), 100);
  };

  useEffect(() => {
    if (episodes.length > 0 && mediaData.episodeNo) {
      const episode = episodes.find(ep => ep.episode_number.toString() === mediaData.episodeNo);
      setCurrentEpisode(episode);
    }
  }, [episodes, mediaData.episodeNo]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
      setShowQuickActions(window.scrollY > 200);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchAdditionalData = async () => {
      if (!type || !id) return;

      try {
        const creditsResponse = await fetch(
          `${BASE_URL}/${type}/${id}/credits?api_key=${API_KEY}`
        );
        const creditsData = await creditsResponse.json();
        setCast(creditsData.cast?.slice(0, 20) || []);
        setCrew(creditsData.crew?.slice(0, 20) || []);

        const reviewsResponse = await fetch(
          `${BASE_URL}/${type}/${id}/reviews?api_key=${API_KEY}`
        );
        const reviewsData = await reviewsResponse.json();
        setReviews(reviewsData.results || []);

        const similarResponse = await fetch(
          `${BASE_URL}/${type}/${id}/similar?api_key=${API_KEY}`
        );
        const similarData = await similarResponse.json();
        const similarWithType = similarData.results?.slice(0, 12).map(item => ({
          ...item,
          media_type: type
        })) || [];
        setSimilar(similarWithType);
      } catch (error) {
        console.error('Error fetching additional data:', error);
      }
    };

    fetchAdditionalData();
  }, [type, id]);

  if (isLoading) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-[#0a1118]' : 'bg-gray-50'}`}>
        <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6 max-w-[1920px] animate-pulse">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-8">
            <div className="xl:col-span-2 space-y-4">
              <div className="h-12 bg-gray-200 dark:bg-gray-800/40 rounded-lg"></div>
              <div className="aspect-video bg-gray-300 dark:bg-gray-800/60 rounded-lg"></div>
              <div className="h-32 bg-gray-200 dark:bg-gray-800/40 rounded-lg"></div>
            </div>
            <div className="hidden xl:block">
              <div className="h-96 bg-gray-200 dark:bg-gray-800/40 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-4 ${isDarkMode ? 'bg-[#0a1118]' : 'bg-gray-50'}`}>
        <div className="bg-white dark:bg-[#1a2634] rounded-xl shadow-lg dark:shadow-black/50 p-8 max-w-md w-full mx-4 
          transform transition-all hover:scale-105 border border-gray-100/10 backdrop-blur-sm">
          <div className="text-center">
            <div className="bg-red-100/10 dark:bg-red-900/20 rounded-full p-3 w-16 h-16 mx-auto mb-4 
              backdrop-blur-sm border border-red-500/20">
              <svg className="w-10 h-10 text-red-500 dark:text-red-400 mx-auto animate-pulse" 
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Oops! Something went wrong</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="w-full px-6 py-3 bg-gradient-to-r from-[#02c39a] to-[#00a896] dark:from-[#00edb8] dark:to-[#00c39a] 
                text-white rounded-lg hover:from-[#00a896] hover:to-[#019485] dark:hover:from-[#00c39a] dark:hover:to-[#00a896] 
                transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#02c39a] 
                dark:focus:ring-[#00edb8] transform hover:-translate-y-0.5 shadow-lg dark:shadow-black/50"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-[#0a1118] text-gray-100' : 'bg-gray-50 text-black'}`}>
      <ErrorBoundary>
        <div ref={contentRef} className="container mx-auto px-2 sm:px-4 py-4 sm:py-6 max-w-[1920px]">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-8">
            <div className="xl:col-span-2 space-y-4">
              <div className="mb-2 sm:mb-4 bg-white/5 dark:bg-gray-800/40 backdrop-blur-sm rounded-lg p-2">
                <SourceSelector
                  videoSource={videoSource}
                  handleSourceChange={handleSourceChange}
                  showSourceMenu={showSourceMenu}
                  setShowSourceMenu={setShowSourceMenu}
                />
              </div>

              <div className="relative rounded-lg overflow-hidden bg-[#000000] shadow-xl dark:shadow-black/50">
                {isVideoReady ? (
                  <VideoSection
                    ref={videoSectionRef}
                    mediaData={{ ...mediaData, apiType: videoSource }}
                    isVideoReady={isVideoReady}
                    onSubmit={handleSubmit}
                    iframeRef={iframeRef}
                    allowFullscreen={true}
                    onSourceChange={handleSourceChange}
                  />
                ) : (
                  <div className="relative rounded-lg overflow-hidden bg-[#000000] shadow-xl dark:shadow-black/50 
                    aspect-video flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#02c39a] border-t-transparent"></div>
                  </div>
                )}
              </div>

              {type === 'tv' && (
                <div className="w-full overflow-x-auto bg-white/5 dark:bg-gray-800/40 backdrop-blur-sm rounded-lg p-2
                  hover:bg-white/10 dark:hover:bg-gray-800/60 transition-colors duration-200">
                  <EpisodeNavigation
                    episodes={episodes}
                    currentEpisodeNo={mediaData.episodeNo}
                    currentEpisode={currentEpisode}
                    season={mediaData.season}
                    onEpisodeChange={(newEpisodeNo) => handleInputChange({
                      target: { name: 'episodeNo', value: newEpisodeNo.toString() }
                    })}
                    isDarkMode={isDarkMode}
                    isLoading={!isVideoReady}
                  />
                </div>
              )}

              {item && (
                <div className="mt-4 sm:mt-6 bg-white dark:bg-[#1a2634] rounded-xl shadow-lg dark:shadow-black/50 
                  p-3 sm:p-6 border border-gray-100/10 transition-all duration-200 
                  hover:shadow-xl dark:hover:shadow-black/70">
                  <ContentTabs
                    item={item}
                    detailedOverview={detailedOverview}
                    showFullOverview={showFullOverview}
                    setShowFullOverview={setShowFullOverview}
                    cast={cast}
                    crew={crew}
                    reviews={reviews}
                    similar={similar}
                    handleListItemClick={handleListItemClick}
                  />
                </div>
              )}

              {type === 'tv' && (
                <div className="mt-4 sm:mt-6 bg-white/5 dark:bg-gray-800/40 backdrop-blur-sm rounded-lg p-4">
                  <EpisodeGrid
                    type={type}
                    mediaData={mediaData}
                    episodes={episodes}
                    seasons={seasons}
                    currentEpisode={currentEpisode}
                    handleInputChange={handleInputChange}
                  />
                </div>
              )}
            </div>

            <div className="xl:col-span-1">
              <div className="sticky top-6 space-y-4">
                <div className="hidden sm:block lg:hidden xl:block">
                  <div className="bg-white/5 dark:bg-gray-800/40 backdrop-blur-sm rounded-lg p-4">
                    <Recommendations
                      recommendations={recommendations}
                      handleListItemClick={handleListItemClick}
                    />
                  </div>
                </div>
                <div className="block sm:hidden lg:block xl:hidden">
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 bg-white/5 dark:bg-gray-800/40 backdrop-blur-sm rounded-lg p-4">
                    {recommendations.slice(0, 6).map((item) => (
                      <div key={item.id} 
                        className="flex flex-col items-center group hover:scale-105 transition-transform duration-200"
                        onClick={() => handleListItemClick(item)}
                      >
                        <div className="relative overflow-hidden rounded-lg shadow-lg dark:shadow-black/30">
                          <img
                            src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                            alt={item.title || item.name}
                            className="w-24 h-36 object-cover transform group-hover:scale-110 transition-transform duration-200"
                          />
                        </div>
                        <p className="text-center text-sm mt-2 text-gray-200 group-hover:text-[#02c39a] transition-colors">
                          {item.title || item.name}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 z-[60] p-4 sm:p-6 bg-gradient-to-t from-[#0a1118] to-transparent">
          <QuickActions
            isInWatchlist={isInWatchlist}
            isInFavorites={isInFavorites}
            handleWatchlistToggle={handleWatchlistToggle}
            handleFavoritesToggle={handleFavoritesToggle}
            showQuickActions={showQuickActions}
          />
        </div>

        <div className="fixed bottom-6 left-4 sm:left-6 z-[60]">
          <motion.button
            onClick={() => setShowUserLists(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`${buttonClasses.base} ${
              showUserLists 
                ? 'bg-[#c3022b] text-white hover:bg-[#a80016] dark:bg-[#ff0336] dark:hover:bg-[#d4002d]' 
                : 'bg-[#02c39a] text-white hover:bg-[#00a896] dark:bg-[#00edb8] dark:hover:bg-[#00c39a]'
            } group relative text-sm sm:text-base backdrop-blur-sm shadow-lg dark:shadow-black/50`}
            aria-label="Open user lists"
          >
            <div className="relative flex items-center">
              <motion.svg
                animate={{ rotate: showUserLists ? 90 : 0 }}
                className="w-5 h-5 sm:w-6 sm:h-6"
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

        <AnimatePresence>
          {showUserLists && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[65]"
              onClick={() => setShowUserLists(false)}
            />
          )}
        </AnimatePresence>

        <UserListsSidebar
          showUserLists={showUserLists}
          setShowUserLists={setShowUserLists}
          watchHistory={watchHistory}
          watchlist={watchlist}
          favorites={favorites}
          handleListItemClick={handleListItemClick}
        />

        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="fixed bottom-24 right-4 sm:right-6 z-[60] p-3 rounded-full bg-[#02c39a] dark:bg-[#00edb8] 
                text-white shadow-lg dark:shadow-black/50 hover:scale-110 transition-transform duration-200
                backdrop-blur-sm"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </motion.button>
          )}
        </AnimatePresence>
      </ErrorBoundary>
    </div>
  );
};

export default WatchPage;
