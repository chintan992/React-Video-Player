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

              {type === 'tv' && (
                <EpisodeNavigation
                  episodes={episodes}
                  currentEpisodeNo={mediaData.episodeNo}
                  season={mediaData.season}
                  onEpisodeChange={(newEpisodeNo) => handleInputChange({
                    target: { name: 'episodeNo', value: newEpisodeNo.toString() }
                  })}
                  isDarkMode={isDarkMode}
                  isLoading={!isVideoReady}
                />
              )}

              {item && (
                <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
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
                <EpisodeGrid
                  type={type}
                  mediaData={mediaData}
                  episodes={episodes}
                  seasons={seasons} // Pass seasons data to EpisodeGrid
                  handleInputChange={handleInputChange}
                />
              )}
            </div>

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

        <QuickActions
          isInWatchlist={isInWatchlist}
          isInFavorites={isInFavorites}
          handleWatchlistToggle={handleWatchlistToggle}
          handleFavoritesToggle={handleFavoritesToggle}
          showQuickActions={showQuickActions}
        />

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
};

export default WatchPage;
