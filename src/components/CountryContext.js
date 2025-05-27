// This file provides a React context for managing and accessing the selected country information.

import React, { createContext, useState, useContext } from 'react';

// Create a context for country data
const CountryContext = createContext(undefined);

export const useCountry = () => {
  const context = useContext(CountryContext);
  if (context === undefined) {
    throw new Error('useCountry must be used within a CountryProvider');
  }
  return context;
};

export const CountryProvider = ({ children }) => {
  const [selectedCountry, setSelectedCountry] = useState({
    code: 'GB',
    name: 'United Kingdom',
    currency: 'GBP'
  });

  return (
    <CountryContext.Provider value={{ selectedCountry, setSelectedCountry }}>
      {children}
    </CountryContext.Provider>
  );
};

export default CountryContext;
