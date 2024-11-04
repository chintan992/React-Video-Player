// src/api/tmdbApi.js

const API_KEY = '297f1b91919bae59d50ed815f8d2e14c';
const BASE_URL = 'https://api.themoviedb.org/3';

/**
 * Search for movies and TV shows
 * @param {string} query - The search query
 * @param {number} page - The page number of results to fetch
 * @returns {Promise<Array>} - A promise that resolves to an array of media items
 */
export const searchMedia = async (query, page = 1) => {
  try {
    const response = await fetch(`${BASE_URL}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data.results.filter(item => item.media_type === 'movie' || item.media_type === 'tv');
  } catch (error) {
    console.error('Error searching media:', error);
    throw error;
  }
};

/**
 * Get detailed information about a specific movie or TV show
 * @param {string} mediaType - The type of media ('movie' or 'tv')
 * @param {number} id - The ID of the media item
 * @returns {Promise<Object>} - A promise that resolves to the detailed media item data
 */
export const getMediaDetails = async (mediaType, id) => {
  try {
    const response = await fetch(`${BASE_URL}/${mediaType}/${id}?api_key=${API_KEY}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching media details:', error);
    throw error;
  }
};

/**
 * Get popular movies
 * @param {number} page - The page number of results to fetch
 * @returns {Promise<Array>} - A promise that resolves to an array of popular movies
 */
export const getPopularMovies = async (page = 1) => {
  try {
    const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${page}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error fetching popular movies:', error);
    throw error;
  }
};

/**
 * Get popular TV shows
 * @param {number} page - The page number of results to fetch
 * @returns {Promise<Array>} - A promise that resolves to an array of popular TV shows
 */
export const getPopularTVShows = async (page = 1) => {
  try {
    const response = await fetch(`${BASE_URL}/tv/popular?api_key=${API_KEY}&page=${page}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error fetching popular TV shows:', error);
    throw error;
  }
};