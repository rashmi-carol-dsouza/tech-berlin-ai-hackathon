import React, { createContext, useContext, useState } from "react";

export interface Coordinates{
  lat: number;
  long: number;
};

// Define the shape of the context
interface LocationContextType {
  coordinates: Coordinates;
  setCoordinates: (coords: { lat: number; long: number }) => void;
  getCoordinates: () => void;
}

const DEFAULT_COORDINATES_BERLIN_MITTE = { lat: 52.5373, long: 13.3603 }

// Create the context
const LocationContext = createContext<LocationContextType | undefined>(undefined);

// Provider component
export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [coordinates, setCoordinates] = useState(DEFAULT_COORDINATES_BERLIN_MITTE);

  const getCoordinates = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoordinates({
            lat: position.coords.latitude,
            long: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error fetching location:", error);
        }
      );
    } else {
      console.warn("Geolocation is not supported by this browser.");
    }
  };

  return (
    <LocationContext.Provider value={{ coordinates, setCoordinates, getCoordinates }}>
      {children}
    </LocationContext.Provider>
  );
};

// Custom hook to use the context
export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error("useLocation must be used within a LocationProvider");
  }
  return context;
};
