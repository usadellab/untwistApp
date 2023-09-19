// SelectedSpeciesContext.js

import React, { createContext, useContext, useState } from 'react';

const SelectedSpeciesContext = createContext();

export const useSelectedSpecies = () => {
  return useContext(SelectedSpeciesContext);
};

export const SelectedSpeciesProvider = ({ children }) => {
  const [selectedSpp, setSelectedSpp] = useState('Camelina');
  const [selectedLab, setSelectedLab] = useState(''); 

  return (
    <SelectedSpeciesContext.Provider value={{ selectedSpp, setSelectedSpp, selectedLab, setSelectedLab }}>
      {children}
    </SelectedSpeciesContext.Provider>
  );
};
