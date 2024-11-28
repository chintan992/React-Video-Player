import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useDarkMode } from './DarkModeContext';
import MediaDetail from './MediaDetail';
import MediaItem from './MediaItem';
import useInfiniteScroll from '../hooks/useInfiniteScroll';
import { searchMedia, getMediaDetails } from '../api/tmdbApi';

function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [page, setPage] = useState(1);
  const { isDarkMode } = useDarkMode();
  
  const inputRef = useRef(null);

  const fetchData = useCallback(async (searchQuery, pageNum) => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const newResults = await searchMedia(searchQuery, pageNum);
      setResults(prevResults => {
        if (pageNum === 1) return newResults;
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

  const loadMore = useCallback(() => {
    if (!isLoading && query.trim()) {
      fetchData(query, page + 1);
      setPage(prev => prev + 1);
    }
  }, [query, page, isLoading, fetchData]);

  const { lastElementRef } = useInfiniteScroll(loadMore);

  const handleItemClick = async (item) => {
    try {
      const detailData = await getMediaDetails(item.media_type, item.id);
      setSelectedItem({ ...item, ...detailData });
    } catch (error) {
      console.error('Error fetching detail data:', error);
      setError('Error loading item details. Please try again.');
    }
  };

  const handleKeyDown = (e, item) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleItemClick(item);
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <div className={`flex flex-col items-center p-8 transition-all ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      <div className="w-full max-w-md mb-4">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for movies and TV shows..."
          className={`w-full p-2 border border-gray-300 rounded-md 
                      ${isDarkMode ? 'bg-gray-800 text-white placeholder-gray-500' : 'bg-white text-black placeholder-gray-400'}`}
          aria-label="Search for movies and TV shows"
        />
      </div>

      {error && (
        <div className="mb-4 text-red-500" role="alert">
          {error}
          <button onClick={() => fetchData(query, page)} className="ml-2 text-blue-500 underline">Retry</button>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
        {results.map(( item, index) => (
          <MediaItem
            key={`${item.id}-${index}`}
            item={item}
            onClick={() => handleItemClick(item)}
            onKeyDown={(e) => handleKeyDown(e, item)}
            ref={index === results.length - 1 ? lastElementRef : null}
            className={`transition-transform transform hover:scale-105 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-4`}
          />
        ))}
      </div>

      {isLoading && <div className="mt-4">Loading...</div>}

      {results.length === 0 && !isLoading && (
        <div className="mt-4 text-gray-500">No results found. Please try a different search.</div>
      )}

      {selectedItem && (
        <MediaDetail item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
    </div>
  );
}

export default Search;
