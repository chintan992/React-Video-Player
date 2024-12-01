import React, { createContext, useContext, useState } from 'react';

const SearchContext = createContext();

export const useSearch = () => {
  return useContext(SearchContext);
};

export const SearchProvider = ({ children }) => {
  const [results, setResults] = useState([]);
  const [query, setQuery] = useState('');
  const [advancedFilters, setAdvancedFilters] = useState(null);

  return (
    <SearchContext.Provider value={{ results, setResults, query, setQuery, advancedFilters, setAdvancedFilters }}>
      {children}
    </SearchContext.Provider>
  );
};
