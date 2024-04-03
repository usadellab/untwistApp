// untwistThemeContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';

const UntwistThemeContext = createContext({isDarkMode : false});

export const useUntwistThemeContext = () => {
  const context = useContext(UntwistThemeContext);

  // if (!context) {
  //   throw new Error('useUntwistThemeContext must be used within an UntwistThemeProvider');
  // }

  return context;
};

export const UntwistThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // console.log(isDarkMode)

  const toggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  
  const themeContextValue = {
    isDarkMode,
    toggleTheme,
  };

  return (
    <UntwistThemeContext.Provider value={themeContextValue}>
      {children}
    </UntwistThemeContext.Provider>
  );
};