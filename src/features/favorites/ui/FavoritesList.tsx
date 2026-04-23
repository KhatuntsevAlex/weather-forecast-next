"use client";

import { useFavoritesStore } from "@/features/favorites/model/favoritesStore";
import { useWeatherStore, fetcher, swrConfig } from "@/entities/weather";
import { useHydrated } from "@/shared/lib";
import { useNavigateToCity } from "@/features/search-weather";
import type { CurrentWeather } from "@/entities/weather";
import { getWeatherIconUrl, capitalizeFirst } from "@/shared/lib";
import Image from "next/image";
import Link from "next/link";
import useSWR from "swr";
import { buttonClass } from "@/shared/ui";

function FavoriteCityCard({ city }: { city: string }) {
  const units = useWeatherStore((s) => s.units);
  const navigateToCity = useNavigateToCity();
  const removeFavorite = useFavoritesStore((s) => s.removeFavorite);

  const url = `/api/weather?type=current&city=${encodeURIComponent(city)}&units=${units}`;
  const { data: weather, isLoading, error } = useSWR<CurrentWeather>(url, fetcher, swrConfig);

  const handleNavigate = (e: React.MouseEvent) => {
    e.preventDefault();
    navigateToCity(city);
  };

  if (isLoading) {
    return (
      <div
        className="glass-panel animate-pulse p-4 sm:p-6"
        role="status"
        aria-label="Loading city weather"
      >
        <span className="sr-only">Loading…</span>
        <div className="bg-surface-hover mb-3 h-6 w-32 rounded" />
        <div className="bg-surface-hover h-10 w-20 rounded" />
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className="glass-panel border-red-500/20 p-4 sm:p-6">
        <div className="flex items-start justify-between">
          <span className="text-foreground font-medium">{city}</span>
          <button
            onClick={() => removeFavorite(city)}
            className="text-muted cursor-pointer transition-colors hover:text-red-400"
            aria-label={`Remove ${city}`}
          >
            ×
          </button>
        </div>
        <p className="mt-2 text-sm text-red-400/70">Failed to load</p>
      </div>
    );
  }

  return (
    <Link
      href={`/?city=${encodeURIComponent(city)}`}
      onClick={handleNavigate}
      className="glass-panel group hover:bg-surface-hover hover:border-border block p-4 transition-[background-color,border-color,box-shadow] duration-200 hover:shadow-[0_8px_16px_rgba(0,0,0,0.2)] sm:p-6"
    >
      <div className="mb-3 flex items-start justify-between gap-2">
        <h3 className="text-foreground min-w-0 truncate font-semibold">
          {weather.city}, {weather.country}
        </h3>
        <p className="shrink-0 bg-gradient-to-r from-cyan-500 to-purple-500 bg-clip-text text-2xl font-bold text-transparent sm:text-3xl">
          {Math.round(weather.temperature)}°
        </p>
      </div>
      <div className="mb-3 flex items-center gap-2">
        <Image
          src={getWeatherIconUrl(weather.weather[0].icon)}
          alt={weather.weather[0].description}
          width={40}
          height={40}
        />
        <span className="text-muted-foreground text-sm">
          {capitalizeFirst(weather.weather[0].description)}
        </span>
      </div>
      <div className="text-muted-foreground flex gap-4 text-sm">
        <span>
          <span aria-hidden="true">💧</span> {weather.humidity}%
        </span>
        <span>
          <span aria-hidden="true">💨</span> {weather.windSpeed}{" "}
          {units === "metric" ? "m/s" : "mph"}
        </span>
      </div>
    </Link>
  );
}

export function FavoritesList() {
  const favorites = useFavoritesStore((s) => s.favorites);
  // Zustand persist rehydrates on the client only — render nothing until
  // mounted to avoid an SSR/CSR mismatch on the favorites list.
  const hydrated = useHydrated();

  if (!hydrated || !favorites.length) {
    return (
      <div className="py-20 text-center">
        <p className="mb-4 text-6xl" aria-hidden="true">
          💔
        </p>
        <h2 className="text-foreground mb-2 text-2xl font-semibold">No favorites yet</h2>
        <p className="text-muted-foreground mb-6">
          Search for a city and tap the heart icon to add it here
        </p>
        <Link href="/" className={buttonClass("primary", "md")}>
          Search Weather
        </Link>
      </div>
    );
  }

  return (
    <section aria-labelledby="favorites-heading">
      <h2 id="favorites-heading" className="sr-only">
        Your favorite cities
      </h2>
      <ul className="m-0 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3">
        {favorites.map((city) => (
          <li key={city}>
            <FavoriteCityCard city={city} />
          </li>
        ))}
      </ul>
    </section>
  );
}
