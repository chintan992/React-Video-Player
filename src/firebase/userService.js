import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  arrayUnion, 
  arrayRemove,
  collection,
  addDoc,
  query,
  where,
  getDocs
} from 'firebase/firestore';
import { db } from './config';

// Helper function to ensure media_type is set
const ensureMediaType = (mediaItem) => {
  if (!mediaItem.media_type) {
    // If no media_type is set, try to determine it from the presence of certain fields
    if (mediaItem.first_air_date || mediaItem.number_of_seasons) {
      return { ...mediaItem, media_type: 'tv' };
    }
    return { ...mediaItem, media_type: 'movie' };
  }
  return mediaItem;
};

// Watchlist Functions
export const addToWatchlist = async (userId, mediaItem) => {
  const userRef = doc(db, 'users', userId);
  const itemWithType = ensureMediaType(mediaItem);
  await updateDoc(userRef, {
    watchlist: arrayUnion(itemWithType)
  });
};

export const removeFromWatchlist = async (userId, mediaItem) => {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, {
    watchlist: arrayRemove(mediaItem)
  });
};

export const getWatchlist = async (userId) => {
  const userRef = doc(db, 'users', userId);
  const docSnap = await getDoc(userRef);
  const watchlist = docSnap.data()?.watchlist || [];
  return watchlist.map(ensureMediaType);
};

// Favorites Functions
export const addToFavorites = async (userId, mediaItem) => {
  const userRef = doc(db, 'users', userId);
  const itemWithType = ensureMediaType(mediaItem);
  await updateDoc(userRef, {
    favorites: arrayUnion(itemWithType)
  });
};

export const removeFromFavorites = async (userId, mediaItem) => {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, {
    favorites: arrayRemove(mediaItem)
  });
};

export const getFavorites = async (userId) => {
  const userRef = doc(db, 'users', userId);
  const docSnap = await getDoc(userRef);
  const favorites = docSnap.data()?.favorites || [];
  return favorites.map(ensureMediaType);
};

// Watch History Functions
export const addToWatchHistory = async (userId, mediaItem, progress = 0) => {
  const userRef = doc(db, 'users', userId);
  const itemWithType = ensureMediaType(mediaItem);
  const historyItem = {
    ...itemWithType,
    watchedAt: new Date(),
    progress: progress, // Store progress as percentage (0-100)
    lastPlayedAt: new Date()
  };
  
  // Get current watch history
  const docSnap = await getDoc(userRef);
  const currentHistory = docSnap.data()?.watchHistory || [];
  
  // Remove any existing entry for this media item
  const filteredHistory = currentHistory.filter(
    item => !(item.id === mediaItem.id && item.media_type === mediaItem.media_type)
  );
  
  // Add new history item at the beginning
  await updateDoc(userRef, {
    watchHistory: [historyItem, ...filteredHistory]
  });
};

// Update watch progress
export const updateWatchProgress = async (userId, mediaItem, progress) => {
  const userRef = doc(db, 'users', userId);
  const docSnap = await getDoc(userRef);
  const currentHistory = docSnap.data()?.watchHistory || [];
  
  const updatedHistory = currentHistory.map(item => {
    if (item.id === mediaItem.id && item.media_type === mediaItem.media_type) {
      return {
        ...item,
        progress: progress,
        lastPlayedAt: new Date()
      };
    }
    return item;
  });
  
  await updateDoc(userRef, {
    watchHistory: updatedHistory
  });
};

// Get continue watching list (items with progress < 100%)
export const getContinueWatching = async (userId) => {
  const userRef = doc(db, 'users', userId);
  const docSnap = await getDoc(userRef);
  const history = docSnap.data()?.watchHistory || [];
  
  return history
    .filter(item => (item.progress || 0) < 100) // Only include unwatched or partially watched
    .sort((a, b) => b.lastPlayedAt - a.lastPlayedAt) // Sort by most recently played
    .slice(0, 10); // Limit to 10 items
};

export const removeFromWatchHistory = async (userId, historyItem) => {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, {
    watchHistory: arrayRemove(historyItem)
  });
};

export const getWatchHistory = async (userId) => {
  const userRef = doc(db, 'users', userId);
  const docSnap = await getDoc(userRef);
  const history = docSnap.data()?.watchHistory || [];
  return history.map(item => ({
    ...ensureMediaType(item),
    watchedAt: item.watchedAt
  }));
};

// Ratings and Reviews Functions
export const addRating = async (userId, mediaId, rating) => {
  const ratingsRef = collection(db, 'ratings');
  await addDoc(ratingsRef, {
    userId,
    mediaId,
    rating,
    timestamp: new Date()
  });
};

export const addReview = async (userId, mediaId, review) => {
  const reviewsRef = collection(db, 'reviews');
  await addDoc(reviewsRef, {
    userId,
    mediaId,
    review,
    timestamp: new Date()
  });
};

export const getMediaRatings = async (mediaId) => {
  const ratingsRef = collection(db, 'ratings');
  const q = query(ratingsRef, where('mediaId', '==', mediaId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => doc.data());
};

export const getMediaReviews = async (mediaId) => {
  const reviewsRef = collection(db, 'reviews');
  const q = query(reviewsRef, where('mediaId', '==', mediaId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => doc.data());
};

// Initialize User Document
export const initializeUserDocument = async (userId, displayName, email) => {
  try {
    if (!userId) {
      console.warn('No userId provided to initializeUserDocument');
      return;
    }

    const userRef = doc(db, 'users', userId);
    const docSnap = await getDoc(userRef);
    
    if (!docSnap.exists()) {
      const userData = {
        displayName: displayName || 'Anonymous User',
        email: email || '',
        watchlist: [],
        favorites: [],
        watchHistory: [],
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
      };

      await setDoc(userRef, userData);
      console.log('User document initialized successfully');
      return userData;
    }

    return docSnap.data();
  } catch (error) {
    console.error('Error initializing user document:', error);
    // Return a default user object if initialization fails
    return {
      displayName: displayName || 'Anonymous User',
      email: email || '',
      watchlist: [],
      favorites: [],
      watchHistory: [],
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    };
  }
};
