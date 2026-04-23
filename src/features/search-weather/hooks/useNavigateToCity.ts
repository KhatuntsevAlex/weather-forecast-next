"use client";

import { useSWRConfig, preload } from "swr";
import { useRouter } from "next/navigation";
import { useWeatherStore, fetcher, buildWeatherUrl } from "@/entities/weather";
import { useHistoryStore } from "@/features/search-weather/model/historyStore";
import { citiesMatch } from "@/shared/lib";

// Rate limit: min interval between fetches (global floor + per-city floor)
const MIN_REFRESH_MS = 2000;
// Track in-flight + last successful fetch per city (module-level, survives re-renders)
const inFlightCities = new Set<string>();
const lastFetchAtByCity = new Map<string, number>();
let lastGlobalFetchAt = 0;

const normalizeCity = (city: string) => city.trim().toLowerCase();

// Test-only: reset module-level rate-limit state between tests.
export function __resetNavigateRateLimit() {
  inFlightCities.clear();
  lastFetchAtByCity.clear();
  lastGlobalFetchAt = 0;
}

export function useNavigateToCity() {
  const { cache } = useSWRConfig();
  const router = useRouter();
  const units = useWeatherStore((s) => s.units);
  const addCity = useHistoryStore((s) => s.addCity);
  const history = useHistoryStore((s) => s.history);

  return async (city: string) => {
    const cityKey = normalizeCity(city);
    const now = Date.now();

    // Hard block: already fetching this city
    if (inFlightCities.has(cityKey)) return;

    // Global rate limit: any two requests must be at least MIN_REFRESH_MS apart.
    if (now - lastGlobalFetchAt < MIN_REFRESH_MS) return;

    // Per-city rate limit: same city can't refresh faster than MIN_REFRESH_MS.
    const lastFetchAt = lastFetchAtByCity.get(cityKey) ?? 0;
    if (now - lastFetchAt < MIN_REFRESH_MS) return;

    const alreadyInHistory = history.some((h) => citiesMatch(h.city, city));

    const url = buildWeatherUrl("current", { city, units });
    if (!url) {
      router.push(`/?city=${encodeURIComponent(city)}`, { scroll: false });
      return;
    }

    inFlightCities.add(cityKey);
    lastGlobalFetchAt = now;
    try {
      // `preload` registers the fetch promise in SWR's cache for this key.
      // When `useCurrentWeather` mounts for the new city after navigation,
      // it sees the in-flight promise and dedupes instead of firing its
      // own request. `preload` returns the same promise so we can await
      // it here to know whether the city is valid before touching history.
      const pending = preload(url, fetcher);

      // Navigate (cheap, just updates URL); subscribers will find the
      // pending promise already in the SWR cache.
      router.push(`/?city=${encodeURIComponent(city)}`, { scroll: false });

      await pending;
      // Only add to history after the city is confirmed to exist.
      if (!alreadyInHistory) addCity(city);
      lastFetchAtByCity.set(cityKey, Date.now());
    } catch {
      // Fetch failed (e.g. 404 city-not-found) — history is left untouched.
      // Evict the failed entry so subsequent searches retry cleanly.
      cache.delete(url);
    } finally {
      inFlightCities.delete(cityKey);
    }
  };
}
