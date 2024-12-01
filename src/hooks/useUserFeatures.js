import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import * as userService from '../firebase/userService';

export const useUserFeatures = (mediaId) => {
  const { currentUser } = useAuth();
  const [watchlist, setWatchlist] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [watchHistory, setWatchHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch initial data
  useEffect(() => {
    const fetchUserData = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        await userService.initializeUserDocument(
          currentUser.uid,
          currentUser.displayName,
          currentUser.email
        );

        const [
          watchlistData,
          favoritesData,
          watchHistoryData
        ] = await Promise.all([
          userService.getWatchlist(currentUser.uid),
          userService.getFavorites(currentUser.uid),
          userService.getWatchHistory(currentUser.uid)
        ]);

        setWatchlist(watchlistData);
        setFavorites(favoritesData);
        setWatchHistory(watchHistoryData);
        setError(null);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [currentUser]);

  // Fetch media-specific data if mediaId is provided
  useEffect(() => {
    const fetchMediaData = async () => {
      if (!mediaId) return;

      try {
        const [mediaRatings, mediaReviews] = await Promise.all([
          userService.getMediaRatings(mediaId),
          userService.getMediaReviews(mediaId)
        ]);

        setRatings(mediaRatings);
        setReviews(mediaReviews);
        setError(null);
      } catch (err) {
        console.error('Error fetching media data:', err);
        setError(err.message);
      }
    };

    fetchMediaData();
  }, [mediaId]);

  // Watchlist actions
  const addToWatchlist = useCallback(async (mediaItem) => {
    if (!currentUser) return;
    try {
      await userService.addToWatchlist(currentUser.uid, mediaItem);
      setWatchlist(prev => [...prev, mediaItem]);
      setError(null);
    } catch (err) {
      console.error('Error adding to watchlist:', err);
      setError(err.message);
    }
  }, [currentUser]);

  const removeFromWatchlist = useCallback(async (mediaItem) => {
    if (!currentUser) return;
    try {
      await userService.removeFromWatchlist(currentUser.uid, mediaItem);
      setWatchlist(prev => prev.filter(item => item.id !== mediaItem.id));
      setError(null);
    } catch (err) {
      console.error('Error removing from watchlist:', err);
      setError(err.message);
    }
  }, [currentUser]);

  // Favorites actions
  const addToFavorites = useCallback(async (mediaItem) => {
    if (!currentUser) return;
    try {
      await userService.addToFavorites(currentUser.uid, mediaItem);
      setFavorites(prev => [...prev, mediaItem]);
      setError(null);
    } catch (err) {
      console.error('Error adding to favorites:', err);
      setError(err.message);
    }
  }, [currentUser]);

  const removeFromFavorites = useCallback(async (mediaItem) => {
    if (!currentUser) return;
    try {
      await userService.removeFromFavorites(currentUser.uid, mediaItem);
      setFavorites(prev => prev.filter(item => item.id !== mediaItem.id));
      setError(null);
    } catch (err) {
      console.error('Error removing from favorites:', err);
      setError(err.message);
    }
  }, [currentUser]);

  // Watch History actions
  const addToWatchHistory = useCallback(async (mediaItem) => {
    if (!currentUser) return;
    try {
      const historyItem = { ...mediaItem, watchedAt: new Date() };
      await userService.addToWatchHistory(currentUser.uid, historyItem);
      const updatedHistory = await userService.getWatchHistory(currentUser.uid);
      setWatchHistory(updatedHistory);
      setError(null);
    } catch (err) {
      console.error('Error adding to watch history:', err);
      setError(err.message);
    }
  }, [currentUser]);

  const removeFromWatchHistory = useCallback(async (historyItem) => {
    if (!currentUser) return;
    try {
      await userService.removeFromWatchHistory(currentUser.uid, historyItem);
      setWatchHistory(prev => prev.filter(item => 
        !(item.id === historyItem.id && 
          item.watchedAt.seconds === historyItem.watchedAt.seconds)
      ));
      setError(null);
    } catch (err) {
      console.error('Error removing from watch history:', err);
      setError(err.message);
    }
  }, [currentUser]);

  // Rating and review actions
  const addRating = useCallback(async (rating) => {
    if (!currentUser || !mediaId) return;
    try {
      await userService.addRating(currentUser.uid, mediaId, rating);
      const updatedRatings = await userService.getMediaRatings(mediaId);
      setRatings(updatedRatings);
      setError(null);
    } catch (err) {
      console.error('Error adding rating:', err);
      setError(err.message);
    }
  }, [currentUser, mediaId]);

  const addReview = useCallback(async (review) => {
    if (!currentUser || !mediaId) return;
    try {
      await userService.addReview(currentUser.uid, mediaId, review);
      const updatedReviews = await userService.getMediaReviews(mediaId);
      setReviews(updatedReviews);
      setError(null);
    } catch (err) {
      console.error('Error adding review:', err);
      setError(err.message);
    }
  }, [currentUser, mediaId]);

  return {
    watchlist,
    favorites,
    ratings,
    reviews,
    watchHistory,
    loading,
    error,
    addToWatchlist,
    removeFromWatchlist,
    addToFavorites,
    removeFromFavorites,
    addRating,
    addReview,
    addToWatchHistory,
    removeFromWatchHistory
  };
};