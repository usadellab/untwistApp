// contexts/TokenContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useTokenContext } from './TokenContext';

const apiEndpoint = 'http://134.94.65.182:5000' // 'http://127.0.0.1:10000'

const ObjListContext = createContext();

export const useObjListContext = () => useContext(ObjListContext);

export const ObjListProvider = ({ children }) => {
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
