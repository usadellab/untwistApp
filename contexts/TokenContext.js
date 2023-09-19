// contexts/TokenContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useApiContext } from "../contexts/ApiEndPoint";
const TokenContext = createContext();

export const useTokenContext = () => useContext(TokenContext);
export const TokenProvider = ({ children }) => {
  const [apiToken, setApiToken] = useState(null);
  const apiEndpoint = useApiContext().apiEndpoint;

  useEffect(() => {
    var token = "";
    fetch(`${apiEndpoint}/token`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((responseData) => {
        token = responseData.access_token;
        setApiToken(token);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  const contextValue = { apiToken };

  return (
    <TokenContext.Provider value={contextValue}>
      {children}
    </TokenContext.Provider>
  );
};
