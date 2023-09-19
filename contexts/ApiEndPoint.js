import React, { createContext, useContext, useState, useEffect } from 'react';

const ApiContext = createContext();

export const useApiContext = () => useContext(ApiContext);

export const ApiContextProvider = ({ children }) => {
    const [apiEndpoint, setApiEndpoint] = useState('default end point ')
    
    const contextValue = { apiEndpoint };
  return (
    <ApiContext.Provider value={contextValue}>{children}</ApiContext.Provider>
  );
};
