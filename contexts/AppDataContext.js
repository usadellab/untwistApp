// contexts/AppDataContext.js
import React, { createContext, useContext, useState } from 'react';

// Create a context with a default value (initial state)
const AppDataContext = createContext();

// Create a context provider component
export const AppDataContextProvider = ({ children }) => {
const [pcaData, setPCAData] = useState(null);
const [plinkResults, setPlinkResults] = useState([]);
  const [manhattanPlotData, setManhattanPlotData] = useState(null);

  const [startGWAS, setStartGwas] = useState(false);
  const [startMDS, setStartMDS] = useState(false);
  const [isGwasDone, setIsGwasDone] = useState(false);
  const [qqData, setQqData] = useState(null);
  const [qqIsDone, setQQisDone] = useState(false);
  const [manhattanIsDone, setManhattanIsDone] = useState(false);
  const [plinkGenes, setPlinkGenes] = useState([]);
  const [pValThreshold, setPValThreshold] = useState("10\u207B\u2078");
  const [annotationsDone, setAnnotationsDone] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [updateAnnotations, setUpdateAnnotations] = useState(false);
  const [chosenFile, setChosenFile] = React.useState("");
  const [inputFiles, setInputFiles] = React.useState([]);
  const [isToggled, setPlotIsToggled] = useState(false);
  const [mdsData, setMdsData] = useState(null);


  const contextValue = {
    pcaData,setPCAData,
    plinkResults,setPlinkResults,
    manhattanIsDone, setManhattanIsDone,
    manhattanPlotData, setManhattanPlotData,
    isGwasDone, setIsGwasDone,
    plinkGenes, setPlinkGenes,
    plinkGenes, setPlinkGenes,
    pValThreshold, setPValThreshold,
    annotationsDone, setAnnotationsDone,
    tabValue, setTabValue,
    updateAnnotations, setUpdateAnnotations,
    startGWAS, setStartGwas,
    startMDS, setStartMDS,
    qqData, setQqData,
    qqIsDone, setQQisDone,
    chosenFile, setChosenFile,
    inputFiles, setInputFiles,
    isToggled, setPlotIsToggled,
    mdsData, setMdsData

  };

  return <AppDataContext.Provider value={contextValue}>{children}</AppDataContext.Provider>;
};

// Custom hook to consume the context
export const useAppDataContext = () => {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error('useAppDataContext must be used within an AppDataContextProvider');
  }
  return context;
};

