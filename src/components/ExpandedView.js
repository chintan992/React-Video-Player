// src/components/ExpandedView.js
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useDarkMode } from '../components/DarkModeContext';
import MediaItem from './MediaItem';
import './ExpandedView.css';

const API_KEY = '297f1b91919bae59d50ed815f8d2e14c';
const BASE_URL = 'https://api.themoviedb.org/3';

function ExpandedView() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode();
  const { type, category, title, streamingService } = location.state || {};

  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [error, setError] = useState(null);
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/genre/${type}/list?api_key=${API_KEY}`
        );
        if (!response.ok) throw new Error('Failed to fetch genres');
        const data = await response.json();
        setGenres(data.genres);
      } catch (error) {
        console.error('Error fetching genres:', error);
        setError('Failed to load genres');
      }
    };

    fetchGenres();
  }, [type]);

  const getEndpoint = useCallback((pageNum) => {
    let endpoint = '';
    
    if (streamingService) {
      endpoint = `${BASE_URL}/discover/${type}?api_key=${API_KEY}&with_watch_providers=${streamingService}&watch_region=US&page=${pageNum}`;
    } else {
      switch (category) {
        case 'latest':
          endpoint = type === 'movie'
            ? `${BASE_URL}/movie/now_playing?api_key=${API_KEY}&page=${pageNum}`
            : `${BASE_URL}/tv/on_the_air?api_key=${API_KEY}&page=${pageNum}`;
          break;
        case 'trending':
          endpoint = `${BASE_URL}/trending/${type}/week?api_key=${API_KEY}&page=${pageNum}`;
          break;
        default:
          endpoint = `${BASE_URL}/${type}/popular?api_key=${API_KEY}&page=${pageNum}`;
      }
    }

    return endpoint;
  }, [type, category, streamingService]);

  const fetchData = useCallback(async (pageNum) => {
    if (isLoading) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const endpoint = getEndpoint(pageNum);
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      if (data.results.length === 0) {
        setHasMore(false);
      } else {
        const newItems = data.results.map(item => ({
          ...item,
          media_type: type
        }));
        setItems(prevItems => [...prevItems, ...newItems]);
        setPage(prevPage => prevPage + 1);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load data. Please try again later.');
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, getEndpoint, type]);

  useEffect(() => {
    fetchData(1);
  }, [fetchData]);

  const filteredItems = useMemo(() => {
    if (selectedGenre === 'all') {
      return items;
    }
    return items.filter(item => 
      item.genre_ids && item.genre_ids.includes(Number(selectedGenre))
    );
  }, [items, selectedGenre]);

  const handleGenreChange = (genreId) => {
    setSelectedGenre(genreId);
  };

  const handleMediaItemClick = (item) => {
    navigate(`/watch/${type}/${item.id}`);
  };

  const handleMediaItemKeyDown = (event, item) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleMediaItemClick(item);
    }
  };

  if (error) {
    return (
      <div className={`expanded-view ${isDarkMode ? 'dark-mode' : ''}`}>
        <div className="error-message">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={() => fetchData(1)}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className={`expanded-view ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="expanded-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <h1>{title}</h1>
        <div className="filter-buttons">
          <button
            className={`filter-button ${selectedGenre === 'all' ? 'active' : ''}`}
            onClick={() => handleGenreChange('all')}
          >
            All Genres
          </button>
          {genres.map((genre) => (
            <button
              key={genre.id}
              className={`filter-button ${selectedGenre === genre.id ? 'active' : ''}`}
              onClick={() => handleGenreChange(genre.id)}
            >
              {genre.name}
            </button>
          ))}
        </div>
      </div>

      <InfiniteScroll
        dataLength={filteredItems.length}
        next={() => fetchData(page)}
        hasMore={hasMore}
        loader={<div className="loading-spinner"></div>}
        endMessage={
          <p className="end-message">
            You've reached the end!
          </p>
        }
      >
        <div className="media-grid">
          {filteredItems.map((item) => (
            <MediaItem
              key={item.id}
              item={item}
              onClick={() => handleMediaItemClick(item)}
              onKeyDown={(e) => handleMediaItemKeyDown(e, item)}
            />
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
}

export default ExpandedView;