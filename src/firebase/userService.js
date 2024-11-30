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
export const addToWatchHistory = async (userId, mediaItem) => {
  const userRef = doc(db, 'users', userId);
  const itemWithType = ensureMediaType(mediaItem);
  const historyItem = {
    ...itemWithType,
    watchedAt: new Date()
  };
  await updateDoc(userRef, {
    watchHistory: arrayUnion(historyItem)
  });
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
  const userRef = doc(db, 'users', userId);
  const docSnap = await getDoc(userRef);
  
  if (!docSnap.exists()) {
    await setDoc(userRef, {
      displayName,
      email,
      watchlist: [],
      favorites: [],
      watchHistory: [],
      createdAt: new Date()
    });
  }
};
