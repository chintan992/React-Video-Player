import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useSearch } from '../context/SearchContext';
import { useDarkMode } from './DarkModeContext';
import MediaDetail from './MediaDetail';
import MediaItem from './MediaItem';
import AdvancedSearchForm from './AdvancedSearchForm';
import useInfiniteScroll from '../hooks/useInfiniteScroll';
import { searchMedia, getMediaDetails, advancedSearch } from '../api/tmdbApi';

function Search() {
  const { query, setQuery, results, setResults, advancedFilters, setAdvancedFilters } = useSearch();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [page, setPage] = useState(1);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const { isDarkMode } = useDarkMode();
  
  const inputRef = useRef(null);

  const fetchData = useCallback(async (searchQuery, pageNum) => {
    if ((!searchQuery || !searchQuery.trim()) && !advancedFilters) return;

    setIsLoading(true);
    setError(null);

    try {
      if (!process.env.REACT_APP_TMDB_API_KEY) {
        throw new Error('API configuration is missing. Please check your settings.');
      }

      let newResults;
      if (advancedFilters) {
        newResults = await advancedSearch({ ...advancedFilters, query: searchQuery }, pageNum);
      } else {
        newResults = await searchMedia(searchQuery, pageNum);
      }
      
      if (!newResults || newResults.length === 0) {
        if (pageNum === 1) {
          setError('No results found. Please try different search criteria.');
          setResults([]);
          return;
        }
      }

      setResults(prevResults => {
        if (pageNum === 1) return newResults;
        const existingIds = new Set(prevResults.map(item => item.id));
        const uniqueNewResults = newResults.filter(item => !existingIds.has(item.id));
        return [...prevResults, ...uniqueNewResults];
      });
    } catch (error) {
      console.error('Error fetching search results:', error);
      setError(
        error.message === 'API configuration is missing. Please check your settings.'
          ? error.message
          : 'Failed to fetch search results. Please try again later.'
      );
      if (pageNum === 1) setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, [advancedFilters, setResults]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query.trim() || advancedFilters) {
        setPage(1);
        fetchData(query, 1);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query, advancedFilters, fetchData]);

  const loadMore = useCallback(() => {
    if (!isLoading && (query.trim() || advancedFilters)) {
      fetchData(query, page + 1);
      setPage(prev => prev + 1);
    }
  }, [query, page, isLoading, fetchData, advancedFilters]);

  const { lastElementRef } = useInfiniteScroll(loadMore);

  const handleItemClick = async (item) => {
    try {
      if (!process.env.REACT_APP_TMDB_API_KEY) {
        throw new Error('API configuration is missing. Please check your settings.');
      }

      setIsLoading(true);
      const detailData = await getMediaDetails(item.media_type, item.id);
      setSelectedItem({ ...item, ...detailData });
      setError(null);
    } catch (error) {
      console.error('Error fetching item details:', error);
      setError(
        error.message === 'API configuration is missing. Please check your settings.'
          ? error.message
          : 'Failed to load item details. Please try again later.'
      );
    } finally {
      setIsLoading(false);
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

  const handleAdvancedSearch = (filters) => {
    setAdvancedFilters(filters);
    setQuery(filters.query || '');
    setShowAdvanced(false);
  };

  return (
    <div className={`flex flex-col items-center p-8 transition-all ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      <div className="w-full max-w-md mb-4 space-y-2">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for movies and TV shows..."
            className={`flex-1 p-2 border border-gray-300 rounded-md 
                      ${isDarkMode ? 'bg-gray-800 text-white placeholder-gray-500' : 'bg-white text-black placeholder-gray-400'}`}
            aria-label="Search for movies and TV shows"
          />
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`px-4 py-2 rounded-md transition-colors
                      ${isDarkMode 
                        ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                        : 'bg-gray-200 hover:bg-gray-300 text-black'}`}
            aria-label="Toggle advanced search"
          >
            {showAdvanced ? 'Basic' : 'Advanced'}
          </button>
        </div>

        {showAdvanced && (
          <div className="mt-4">
            <AdvancedSearchForm
              onSearch={handleAdvancedSearch}
              onClose={() => setShowAdvanced(false)}
            />
          </div>
        )}
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100 rounded-lg" role="alert">
          <p className="font-medium">{error}</p>
          {error !== 'No results found. Please try a different search term.' && (
            <button 
              onClick={() => fetchData(query, page)} 
              className="mt-2 px-4 py-2 bg-red-200 dark:bg-red-800 rounded-md hover:bg-red-300 dark:hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          )}
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