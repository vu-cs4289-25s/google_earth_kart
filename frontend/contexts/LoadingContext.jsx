// frontend/contexts/LoadingContext.jsx (New File)
import React, { createContext, useState, useContext, useMemo } from 'react';

const LoadingContext = createContext({
    isCityDownloaded: false, // Renamed for clarity
    setCityDownloaded: (loaded) => {},
    parsedCityScene: null,   // New state for the parsed scene
    setParsedCityScene: (scene) => {}, // Function to set the scene
  });

// 2. Create a custom hook for easy access
export const useLoading = () => useContext(LoadingContext);

// 3. Create the Provider component
export const LoadingProvider = ({ children }) => {
    const [isCityDownloaded, setCityDownloaded] = useState(false);
    const [parsedCityScene, setParsedCityScene] = useState(null);

    const value = useMemo(() => ({
        isCityDownloaded,
        setCityDownloaded,
        parsedCityScene,
        setParsedCityScene,
      }), [isCityDownloaded, parsedCityScene]);

  return (
    <LoadingContext.Provider value={value}>
      {children}
    </LoadingContext.Provider>
  );
};