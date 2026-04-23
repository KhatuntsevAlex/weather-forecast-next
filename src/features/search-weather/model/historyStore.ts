"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { citiesMatch } from "@/shared/lib";

interface HistoryItem {
  city: string;
  timestamp: number;
}

interface HistoryState {
  history: HistoryItem[];
  removedStack: HistoryItem[];
  addCity: (city: string) => void;
  removeCity: (city: string) => void;
  undoRemove: () => void;
  clearHistory: () => void;
}

const MAX_HISTORY = 10;
const MAX_UNDO = 20;

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set) => ({
      history: [],
      removedStack: [],

      addCity: (city) =>
        set((state) => {
          const normalized = city.trim();
          const filtered = state.history.filter((h) => !citiesMatch(h.city, normalized));
          return {
            history: [{ city: normalized, timestamp: Date.now() }, ...filtered].slice(
              0,
              MAX_HISTORY,
            ),
          };
        }),

      removeCity: (city) =>
        set((state) => {
          const item = state.history.find((h) => citiesMatch(h.city, city));
          return {
            history: state.history.filter((h) => !citiesMatch(h.city, city)),
            removedStack: item
              ? [item, ...state.removedStack].slice(0, MAX_UNDO)
              : state.removedStack,
          };
        }),

      undoRemove: () =>
        set((state) => {
          const [last, ...rest] = state.removedStack;
          if (!last) return state;
          // Avoid duplicates if user re-added the city manually
          const dedup = state.history.filter((h) => !citiesMatch(h.city, last.city));
          return {
            history: [last, ...dedup].slice(0, MAX_HISTORY),
            removedStack: rest,
          };
        }),

      clearHistory: () => set({ history: [], removedStack: [] }),
    }),
    {
      name: "search-history",
      partialize: (state) => ({ history: state.history }),
    },
  ),
);
