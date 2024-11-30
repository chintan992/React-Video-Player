// src/api/tmdbApi.js

// API credentials and base URL for The Movie Database (TMDB) API
const API_KEY = process.env.REACT_APP_TMDB_API_KEY;  // Your TMDB API key from environment
const BASE_URL = process.env.REACT_APP_TMDB_BASE_URL || 'https://api.themoviedb.org/3'; // TMDB API base URL from environment

// Validate API configuration
const validateConfig = () => {
  if (!API_KEY) {
    throw new Error('TMDB API key is not configured. Please check your environment variables.');
  }
};

/**
 * Search for movies and TV shows using the TMDB API
 * @param {string} query - What the user is searching for (e.g., "Batman", "Friends")
 * @param {number} page - Which page of results to fetch (default: 1)
 * @returns {Promise<Array>} - Array of movies and TV shows matching the search
 */
export const searchMedia = async (query, page = 1) => {
  try {
    validateConfig();
    
    // Make API request to search for both movies and TV shows
    const response = await fetch(
      `${BASE_URL}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`
    );
    
    // Check if the request was successful
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.status_message || 'Failed to fetch search results');
    }
    
    // Parse the JSON response
    const data = await response.json();
    
    // Filter results to only include movies and TV shows (exclude other media types)
    return data.results.filter(item => item.media_type === 'movie' || item.media_type === 'tv');
  } catch (error) {
    // Log and re-throw any errors that occur
    console.error('Error searching media:', error);
    throw new Error('Failed to search media. Please check your API configuration and try again.');
  }
};

/**
 * Get detailed information about a specific movie or TV show
 * @param {string} mediaType - Whether it's a 'movie' or 'tv' show
 * @param {number} id - The unique identifier for the media item
 * @returns {Promise<Object>} - Detailed information about the movie or TV show
 */
export const getMediaDetails = async (mediaType, id) => {
  try {
    validateConfig();
    
    // Make API request to get detailed information about the specific media item
    const response = await fetch(
      `${BASE_URL}/${mediaType}/${id}?api_key=${API_KEY}`
    );
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.status_message || 'Failed to fetch media details');
    }
    
    // Return the parsed JSON response
    return await response.json();
  } catch (error) {
    console.error('Error fetching media details:', error);
    throw new Error('Failed to fetch media details. Please try again later.');
  }
};

/**
 * Get a list of currently popular movies
 * @param {number} page - Which page of results to fetch (default: 1)
 * @returns {Promise<Array>} - Array of popular movies
 */
export const getPopularMovies = async (page = 1) => {
  try {
    validateConfig();
    
    // Make API request to get popular movies
    const response = await fetch(
      `${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${page}`
    );
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.status_message || 'Failed to fetch popular movies');
    }
    
    const data = await response.json();
    return data.results;  // Return just the array of movies
  } catch (error) {
    console.error('Error fetching popular movies:', error);
    throw new Error('Failed to fetch popular movies. Please try again later.');
  }
};

/**
 * Get a list of currently popular TV shows
 * @param {number} page - Which page of results to fetch (default: 1)
 * @returns {Promise<Array>} - Array of popular TV shows
 */
export const getPopularTVShows = async (page = 1) => {
  try {
    validateConfig();
    
    // Make API request to get popular TV shows
    const response = await fetch(
      `${BASE_URL}/tv/popular?api_key=${API_KEY}&page=${page}`
    );
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.status_message || 'Failed to fetch popular TV shows');
    }
    
    const data = await response.json();
    return data.results;  // Return just the array of TV shows
  } catch (error) {
    console.error('Error fetching popular TV shows:', error);
    throw new Error('Failed to fetch popular TV shows. Please try again later.');
  }
};
