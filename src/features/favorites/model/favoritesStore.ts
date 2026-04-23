"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { citiesMatch } from "@/shared/lib";

interface FavoritesState {
  favorites: string[];
  addFavorite: (city: string) => void;
  removeFavorite: (city: string) => void;
  isFavorite: (city: string) => boolean;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],

      addFavorite: (city) =>
        set((state) => {
          const normalized = city.trim();
          if (state.favorites.some((c) => citiesMatch(c, normalized))) {
            return state;
          }
          return { favorites: [...state.favorites, normalized] };
        }),

      removeFavorite: (city) =>
        set((state) => ({
          favorites: state.favorites.filter((c) => !citiesMatch(c, city)),
        })),

      isFavorite: (city) => get().favorites.some((c) => citiesMatch(c, city)),
    }),
    { name: "weather-favorites" },
  ),
);
