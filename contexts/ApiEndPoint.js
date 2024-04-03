import React, { createContext, useContext, useState, useEffect } from 'react';

const ApiContext = createContext({ apiEndpoint: '/api' });

export const useApiContext = () => useContext(ApiContext);

export const ApiContextProvider = ({ children }) => {
    const [apiEndpoint, setApiEndpoint] = useState('/api')
    const contextValue = { apiEndpoint };
  return (
    <ApiContext.Provider value={contextValue}>{children}</ApiContext.Provider>
  );
};
