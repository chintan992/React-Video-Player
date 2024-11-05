// src/api/tmdbApi.js

// API credentials and base URL for The Movie Database (TMDB) API
const API_KEY = '297f1b91919bae59d50ed815f8d2e14c';  // Your TMDB API key
const BASE_URL = 'https://api.themoviedb.org/3';      // TMDB API base URL

/**
 * Search for movies and TV shows using the TMDB API
 * @param {string} query - What the user is searching for (e.g., "Batman", "Friends")
 * @param {number} page - Which page of results to fetch (default: 1)
 * @returns {Promise<Array>} - Array of movies and TV shows matching the search
 */
export const searchMedia = async (query, page = 1) => {
  try {
    // Make API request to search for both movies and TV shows
    const response = await fetch(
      `${BASE_URL}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`
    );
    
    // Check if the request was successful
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    // Parse the JSON response
    const data = await response.json();
    
    // Filter results to only include movies and TV shows (exclude other media types)
    return data.results.filter(item => item.media_type === 'movie' || item.media_type === 'tv');
  } catch (error) {
    // Log and re-throw any errors that occur
    console.error('Error searching media:', error);
    throw error;
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
    // Make API request to get detailed information about the specific media item
    const response = await fetch(
      `${BASE_URL}/${mediaType}/${id}?api_key=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    // Return the parsed JSON response
    return await response.json();
  } catch (error) {
    console.error('Error fetching media details:', error);
    throw error;
  }
};

/**
 * Get a list of currently popular movies
 * @param {number} page - Which page of results to fetch (default: 1)
 * @returns {Promise<Array>} - Array of popular movies
 */
export const getPopularMovies = async (page = 1) => {
  try {
    // Make API request to get popular movies
    const response = await fetch(
      `${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${page}`
    );
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    const data = await response.json();
    return data.results;  // Return just the array of movies
  } catch (error) {
    console.error('Error fetching popular movies:', error);
    throw error;
  }
};

/**
 * Get a list of currently popular TV shows
 * @param {number} page - Which page of results to fetch (default: 1)
 * @returns {Promise<Array>} - Array of popular TV shows
 */
export const getPopularTVShows = async (page = 1) => {
  try {
    // Make API request to get popular TV shows
    const response = await fetch(
      `${BASE_URL}/tv/popular?api_key=${API_KEY}&page=${page}`
    );
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    const data = await response.json();
    return data.results;  // Return just the array of TV shows
  } catch (error) {
    console.error('Error fetching popular TV shows:', error);
    throw error;
  }
};