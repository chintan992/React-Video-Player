import React, { useState } from 'react';
import { useDarkMode } from './DarkModeContext';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'zh', name: 'Chinese' },
  { code: 'hi', name: 'Hindi' },
  { code: 'ru', name: 'Russian' }
];

const genres = [
  { id: 28, name: 'Action' },
  { id: 12, name: 'Adventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' },
  { id: 99, name: 'Documentary' },
  { id: 18, name: 'Drama' },
  { id: 10751, name: 'Family' },
  { id: 14, name: 'Fantasy' },
  { id: 36, name: 'History' },
  { id: 27, name: 'Horror' },
  { id: 10402, name: 'Music' },
  { id: 9648, name: 'Mystery' },
  { id: 10749, name: 'Romance' },
  { id: 878, name: 'Science Fiction' },
  { id: 10770, name: 'TV Movie' },
  { id: 53, name: 'Thriller' },
  { id: 10752, name: 'War' },
  { id: 37, name: 'Western' }
];

const currentYear = new Date().getFullYear();
const yearOptions = Array.from({ length: 50 }, (_, i) => currentYear - i);

function AdvancedSearchForm({ onSearch, onClose }) {
  const { isDarkMode } = useDarkMode();
  const [filters, setFilters] = useState({
    query: '',
    genre: '',
    yearFrom: '',
    yearTo: '',
    rating: '',
    language: '',
    mediaType: 'all',
    runtime: '',
    sortBy: 'popularity.desc'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Scroll to top before performing search
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    onSearch(filters);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className={`p-6 rounded-lg shadow-lg ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2">Search Query</label>
          <input
            type="text"
            name="query"
            value={filters.query}
            onChange={handleChange}
            className={`w-full p-2 rounded border ${
              isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
            }`}
            placeholder="Enter keywords..."
          />
        </div>

        <div>
          <label className="block mb-2">Genre</label>
          <select
            name="genre"
            value={filters.genre}
            onChange={handleChange}
            className={`w-full p-2 rounded border ${
              isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
            }`}
          >
            <option value="">All Genres</option>
            {genres.map(genre => (
              <option key={genre.id} value={genre.id}>
                {genre.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-2">Release Year Range</label>
          <div className="flex gap-2">
            <select
              name="yearFrom"
              value={filters.yearFrom}
              onChange={handleChange}
              className={`w-1/2 p-2 rounded border ${
                isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
              }`}
            >
              <option value="">From Year</option>
              {yearOptions.map(year => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            <select
              name="yearTo"
              value={filters.yearTo}
              onChange={handleChange}
              className={`w-1/2 p-2 rounded border ${
                isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
              }`}
            >
              <option value="">To Year</option>
              {yearOptions.map(year => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block mb-2">Media Type</label>
          <select
            name="mediaType"
            value={filters.mediaType}
            onChange={handleChange}
            className={`w-full p-2 rounded border ${
              isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
            }`}
          >
            <option value="all">All Types</option>
            <option value="movie">Movies Only</option>
            <option value="tv">TV Shows Only</option>
          </select>
        </div>

        <div>
          <label className="block mb-2">Language</label>
          <select
            name="language"
            value={filters.language}
            onChange={handleChange}
            className={`w-full p-2 rounded border ${
              isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
            }`}
          >
            <option value="">All Languages</option>
            {languages.map(lang => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-2">Runtime (Minutes)</label>
          <select
            name="runtime"
            value={filters.runtime}
            onChange={handleChange}
            className={`w-full p-2 rounded border ${
              isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
            }`}
          >
            <option value="">Any Length</option>
            <option value="0,60">Under 1 hour</option>
            <option value="60,90">1-1.5 hours</option>
            <option value="90,120">1.5-2 hours</option>
            <option value="120,180">2-3 hours</option>
            <option value="180,">Over 3 hours</option>
          </select>
        </div>

        <div>
          <label className="block mb-2">Minimum Rating</label>
          <select
            name="rating"
            value={filters.rating}
            onChange={handleChange}
            className={`w-full p-2 rounded border ${
              isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
            }`}
          >
            <option value="">Any Rating</option>
            <option value="7">7+ ⭐</option>
            <option value="8">8+ ⭐</option>
            <option value="9">9+ ⭐</option>
          </select>
        </div>

        <div>
          <label className="block mb-2">Sort By</label>
          <select
            name="sortBy"
            value={filters.sortBy}
            onChange={handleChange}
            className={`w-full p-2 rounded border ${
              isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
            }`}
          >
            <option value="popularity.desc">Popularity (High to Low)</option>
            <option value="vote_average.desc">Rating (High to Low)</option>
            <option value="release_date.desc">Release Date (Newest)</option>
            <option value="release_date.asc">Release Date (Oldest)</option>
          </select>
        </div>

        <div className="flex justify-between pt-4">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Search
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
          >
            Close
          </button>
        </div>
      </form>
    </div>
  );
}

export default AdvancedSearchForm;
