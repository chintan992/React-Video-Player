// src/components/Search.js
import React, { useState, useCallback } from 'react';
import { useDarkMode } from './DarkModeContext';
import MediaDetail from './MediaDetail';
import './Search.css';

const API_KEY = '297f1b91919bae59d50ed815f8d2e14c';
const BASE_URL = 'https://api.themoviedb.org/3';

function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const { isDarkMode } = useDarkMode();

  const searchMedia = useCallback(async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const [movieResponse, tvResponse] = await Promise.all([
        fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}`),
        fetch(`${BASE_URL}/search/tv?api_key=${API_KEY}&query=${query}`)
      ]);

      const [movieData, tvData] = await Promise.all([
        movieResponse.json(),
        tvResponse.json()
      ]);

      const combinedResults = [
        ...movieData.results.map(item => ({ ...item, media_type: 'movie' })),
        ...tvData.results.map(item => ({ ...item, media_type: 'tv' }))
      ];

      setResults(combinedResults);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('An error occurred while fetching data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [query]);

  const handleItemClick = async (item) => {
    setIsLoading(true);
    try {
      const detailResponse = await fetch(
        `${BASE_URL}/${item.media_type === 'movie' ? 'movie' : 'tv'}/${item.id}?api_key=${API_KEY}`
      );
      const detailData = await detailResponse.json();
      setSelectedItem({ ...item, ...detailData });
    } catch (error) {
      console.error('Error fetching detail data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`search-container ${isDarkMode ? 'dark-mode' : ''}`}>
      <form onSubmit={searchMedia} className="search-form">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for movies and TV shows"
          className="search-input"
        />
        <button type="submit" className="search-button">Search</button>
      </form>
      {isLoading && <p className="loading">Loading...</p>}
      {error && <p className="error">{error}</p>}
      <div className="results-container">
        {results.map((item) => (
          <div key={item.id} className="media-item" onClick={() => handleItemClick(item)}>
            <img
              src={item.poster_path 
                ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                : 'https://via.placeholder.com/500x750?text=No+Image'}
              alt={item.title || item.name}
              className="media-poster"
            />
            <div className="media-info">
              <h3>{item.title || item.name}</h3>
              <p className="media-type">{item.media_type === 'movie' ? 'Movie' : 'TV Show'}</p > <p className="media-rating">Rating: {item.vote_average}</p>
              <p className="media-year">{item.release_date || item.first_air_date}</p>
            </div>
          </div>
        ))}
      </div>
      {selectedItem && (
        <MediaDetail
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </div>
  );
}

export default Search;