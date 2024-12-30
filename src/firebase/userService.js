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
export const addToWatchHistory = async (userId, mediaItem, episodeInfo = null) => {
  try {
    const userRef = doc(db, 'users', userId);
    const itemWithType = ensureMediaType(mediaItem);
    
    // Create a simpler history item structure
    const historyItem = {
      id: mediaItem.id,
      title: mediaItem.title || mediaItem.name,
      media_type: itemWithType.media_type,
      poster_path: mediaItem.poster_path,
      watchedAt: new Date(),
      overview: mediaItem.overview || '',
    };

    // Add TV show specific information if available
    if (episodeInfo && itemWithType.media_type === 'tv') {
      historyItem.season = episodeInfo.season;
      historyItem.episode = episodeInfo.episode;
      historyItem.episodeName = episodeInfo.name;
    }

    console.log('Adding to watch history:', historyItem); // Debug log

    // Get current history
    const docSnap = await getDoc(userRef);
    const currentHistory = docSnap.data()?.watchHistory || [];

    // Remove duplicate entries
    const filteredHistory = currentHistory.filter(
      item => item.id !== mediaItem.id || 
        (item.media_type === 'tv' && 
         (item.season !== episodeInfo?.season || 
          item.episode !== episodeInfo?.episode))
    );

    // Add new item at the beginning
    const newHistory = [historyItem, ...filteredHistory].slice(0, 100);

    // Update the document
    await updateDoc(userRef, {
      watchHistory: newHistory
    });

    console.log('Watch history updated successfully'); // Debug log
    return true;
  } catch (error) {
    console.error('Error adding to watch history:', error);
    throw error;
  }
};

export const getWatchHistory = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const docSnap = await getDoc(userRef);
    const history = docSnap.data()?.watchHistory || [];
    
    // Ensure all items have required fields
    return history.map(item => ({
      ...item,
      title: item.title || item.name || 'Unknown Title',
      media_type: item.media_type || 'movie',
      watchedAt: item.watchedAt || new Date()
    }));
  } catch (error) {
    console.error('Error getting watch history:', error);
    return [];
  }
};

// Add these new exports for watch history management
export const removeFromWatchHistory = async (userId, historyItem) => {
  try {
    const userRef = doc(db, 'users', userId);
    const docSnap = await getDoc(userRef);
    const currentHistory = docSnap.data()?.watchHistory || [];
    
    // Filter out the item to remove
    const newHistory = currentHistory.filter(item => 
      !(item.id === historyItem.id && 
        item.media_type === historyItem.media_type &&
        item.season === historyItem.season &&
        item.episode === historyItem.episode)
    );
    
    await updateDoc(userRef, {
      watchHistory: newHistory
    });
    
    return true;
  } catch (error) {
    console.error('Error removing from watch history:', error);
    throw error;
  }
};

export const clearWatchHistory = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      watchHistory: []
    });
    return true;
  } catch (error) {
    console.error('Error clearing watch history:', error);
    throw error;
  }
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
