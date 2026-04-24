"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WeatherState {
  coords: { lat: number; lon: number } | null;
  units: "metric" | "imperial";
  isLoadingLocation: boolean;
  locationError: string | null;
  setCoords: (lat: number, lon: number) => void;
  clearCoords: VoidFunction;
  setUnits: (units: "metric" | "imperial") => void;
  setLoadingLocation: (loading: boolean) => void;
  setLocationError: (error: string | null) => void;
}

export const useWeatherStore = create<WeatherState>()(
  persist(
    (set) => ({
      coords: null,
      units: "metric",
      isLoadingLocation: false,
      locationError: null,
      setCoords: (lat, lon) => set({ coords: { lat, lon }, locationError: null }),
      clearCoords: () => set({ coords: null }),
      setUnits: (units) => set({ units }),
      setLoadingLocation: (loading) => set({ isLoadingLocation: loading }),
      setLocationError: (error) => set({ locationError: error }),
    }),
    {
      name: "weather-storage",
      partialize: (state) => ({
        units: state.units,
        coords: state.coords,
      }),
    },
  ),
);
