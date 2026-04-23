"use client";

import dynamic from "next/dynamic";
import { SearchWeather, SearchHistory } from "@/features/search-weather";
import { WeatherDisplay } from "@/features/weather-display";
import { LocationButton } from "@/features/geolocation";
import { FavoriteToggle } from "@/features/favorites";
import { useWeatherStore } from "@/entities/weather";
import { useCurrentCity } from "@/shared/lib";
import { Card, ErrorBoundary } from "@/shared/ui";

// Reserved heights must match the components' own skeleton/loaded states so
// that the dynamic() placeholder → skeleton → final content transition does
// not shift layout. See each component file for the matching class string.
const FORECAST_RESERVED = "min-h-[640px] sm:min-h-[260px]";
const CHART_RESERVED = "min-h-[334px]";

const ForecastDisplay = dynamic(
  () => import("@/features/forecast-display/ui/ForecastDisplay").then((m) => m.ForecastDisplay),
  { loading: () => <Card animation="pulse" className={FORECAST_RESERVED} /> },
);

const HourlyTemperatureChart = dynamic(
  () =>
    import("@/features/weather-charts/ui/HourlyTemperatureChart").then(
      (m) => m.HourlyTemperatureChart,
    ),
  { loading: () => <Card animation="pulse" className={CHART_RESERVED} /> },
);

const RainChanceChart = dynamic(
  () => import("@/features/weather-charts/ui/RainChanceChart").then((m) => m.RainChanceChart),
  { loading: () => <Card animation="pulse" className={CHART_RESERVED} /> },
);

interface WeatherDashboardProps {
  initialCity?: string;
}

export function WeatherDashboard({ initialCity = "" }: WeatherDashboardProps) {
  const urlCity = useCurrentCity();
  const currentCity = urlCity || initialCity;
  const coords = useWeatherStore((s) => s.coords);
  const locationError = useWeatherStore((s) => s.locationError);

  const hasQuery = Boolean(currentCity || coords);

  return (
    <div className="mx-auto max-w-4xl px-3 py-4 sm:px-4 sm:py-8">
      <div className="mb-5 text-center sm:mb-8">
        <h1 className="mb-1 bg-gradient-to-r from-cyan-500 to-purple-500 bg-clip-text text-2xl font-bold text-transparent sm:mb-2 sm:text-4xl">
          Weather Forecast
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Get real-time weather updates for any city in the world
        </p>
      </div>

      <section
        aria-label="Search"
        className="mb-4 flex flex-wrap items-start justify-center gap-2 sm:gap-3"
      >
        <div className="basis-full sm:max-w-xl sm:flex-1 sm:basis-auto">
          <SearchWeather />
        </div>
        <LocationButton />
        <FavoriteToggle />
      </section>

      <div className="mb-6 flex justify-center sm:mb-8">
        <SearchHistory />
      </div>

      {locationError && (
        <Card animation="none" className="mb-6 border-red-500/30 p-4 text-center" role="alert">
          <p className="text-red-400">
            <span aria-hidden="true">📍 </span>
            {locationError}
          </p>
        </Card>
      )}

      {hasQuery && (
        <section aria-label="Weather details" className="flex flex-col gap-4 sm:gap-6">
          <ErrorBoundary>
            <WeatherDisplay />
          </ErrorBoundary>
          <ErrorBoundary>
            <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
              <HourlyTemperatureChart />
              <RainChanceChart />
            </div>
          </ErrorBoundary>
          <ErrorBoundary>
            <ForecastDisplay />
          </ErrorBoundary>
        </section>
      )}

      {!hasQuery && !locationError && (
        <div className="animate-fade-in py-10 text-center sm:py-16">
          <p className="mb-4 text-6xl sm:mb-6 sm:text-7xl" aria-hidden="true">
            🌤️
          </p>
          <h2 className="text-foreground mb-2 text-xl font-semibold sm:text-2xl">Welcome!</h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            Enter a city name or use geolocation to get started
          </p>
        </div>
      )}
    </div>
  );
}
