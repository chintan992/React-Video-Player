// src/components/Search.js
import React, { useState, useCallback, useEffect } from 'react';
import { useDarkMode } from './DarkModeContext';
import MediaDetail from './MediaDetail';
import MediaItem from './MediaItem';
import useInfiniteScroll from '../hooks/useInfiniteScroll';
import { searchMedia, getMediaDetails } from '../api/tmdbApi';
import './Search.css';

function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [page, setPage] = useState(1);
  const { isDarkMode } = useDarkMode();

  // Fetch data function
  const fetchData = useCallback(async (searchQuery, pageNum) => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const newResults = await searchMedia(searchQuery, pageNum);
      setResults(prevResults => {
        if (pageNum === 1) return newResults;
        // Filter out duplicates based on id
        const existingIds = new Set(prevResults.map(item => item.id));
        const uniqueNewResults = newResults.filter(item => !existingIds.has(item.id));
        return [...prevResults, ...uniqueNewResults];
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('An error occurred while fetching data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Handle search input changes with debounce
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query.trim()) {
        setPage(1);
        setResults([]);
        fetchData(query, 1);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query, fetchData]);

  // Handle infinite scroll
  const loadMore = useCallback(() => {
    if (!isLoading && query.trim()) {
      fetchData(query, page + 1);
      setPage(prev => prev + 1);
    }
  }, [query, page, isLoading, fetchData]);

  const { lastElementRef } = useInfiniteScroll(loadMore);

  // Handle item selection
  const handleItemClick = async (item) => {
    try {
      const detailData = await getMediaDetails(item.media_type, item.id);
      setSelectedItem({ ...item, ...detailData });
    } catch (error) {
      console.error('Error fetching detail data:', error);
      setError('Error loading item details. Please try again.');
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e, item) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleItemClick(item);
    }
  };

  return (
    <div className={`search-container ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="search-form">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for movies and TV shows..."
          className="search-input"
          aria-label="Search for movies and TV shows"
        />
      </div>

      {error && (
        <div className="error-message" role="alert">
          {error}
        </div>
      )}

      <div className="results-container">
        {results.map((item, index) => (
          <MediaItem
            key={`${item.id}-${index}`}
            item={item}
            onClick={() => handleItemClick(item)}
            onKeyDown={(e) => handleKeyDown(e, item)}
            ref={index === results.length - 1 ? lastElementRef : null}
          />
        ))}
      </div>

      {isLoading && (
        <div className="loading-indicator">
          <div className="spinner"></div>
          <span>Loading...</span>
        </div>
      )}

      {!isLoading && query && results.length === 0 && (
        <div className="no-results">
          No results found for "{query}"
        </div>
      )}

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