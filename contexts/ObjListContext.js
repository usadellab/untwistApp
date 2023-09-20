// contexts/TokenContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useTokenContext } from './TokenContext';
import { useApiContext } from "../contexts/ApiEndPoint";

const ObjListContext = createContext();

export const useObjListContext = () => useContext(ObjListContext);

export const ObjListProvider = ({ children }) => {
  const apiEndpoint = useApiContext().apiEndpoint;

  const [objList, setObjList] = useState(null);
  const token = useTokenContext()

  useEffect(() => {
    axios.post(`${apiEndpoint}/getBucketObjectList/?token=${token.apiToken}`)
        .then(response => {
            setObjList(response.data)
        })
        .catch(error => {
        alert('Error fetching MinIO token:', error);
        });
    },[]); 

  const contextValue = { objList  };

  return (
    <ObjListContext.Provider value={contextValue}>{children}</ObjListContext.Provider>
  );
};
