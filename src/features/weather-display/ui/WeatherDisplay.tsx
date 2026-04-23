"use client";

import { useCurrentWeather, useWeatherStore } from "@/entities/weather";
import {
  formatTemperature,
  formatTime,
  capitalizeFirst,
  getWeatherIconUrl,
  windDirection,
} from "@/shared/lib";
import Image from "next/image";
import { Card } from "@/shared/ui";
import { DetailItem } from "./DetailItem";

const DETAIL_SKELETONS = Array.from({ length: 6 }, (_, i) => (
  <div key={i} className="bg-surface-hover h-12 rounded" />
));

export function WeatherDisplay() {
  const units = useWeatherStore((s) => s.units);
  const { data: weather, error, isLoading } = useCurrentWeather();

  if (isLoading) {
    return (
      <Card animation="pulse" className="p-8" role="status" aria-label="Loading weather data">
        <span className="sr-only">Loading weather data…</span>
        <div className="bg-surface-hover mb-4 h-8 w-48 rounded" />
        <div className="bg-surface-hover mb-4 h-16 w-32 rounded" />
        <div className="grid grid-cols-2 gap-4">{DETAIL_SKELETONS}</div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card animation="none" className="border-red-500/30 text-center">
        <p className="text-red-400" role="alert">
          {(error as Error).message}
        </p>
      </Card>
    );
  }

  if (!weather) return null;

  const windUnit = units === "metric" ? "m/s" : "mph";

  return (
    <Card>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-foreground truncate text-xl font-bold sm:text-2xl">
            {weather.city}, {weather.country}
          </h2>
          <p className="text-muted-foreground text-sm">
            <time dateTime={new Date(weather.dt * 1000).toISOString()}>
              {formatTime(weather.dt, weather.timezone)}
            </time>
          </p>
        </div>
        <figure className="m-0 flex shrink-0 items-center">
          <Image
            src={getWeatherIconUrl(weather.weather[0].icon)}
            alt={weather.weather[0].description}
            width={64}
            height={64}
            priority
          />
        </figure>
      </div>

      <div className="mb-5 sm:mb-6">
        <p className="bg-gradient-to-r from-cyan-500 to-purple-500 bg-clip-text text-5xl font-bold text-transparent sm:text-6xl">
          {formatTemperature(weather.temperature, units)}
        </p>
        <p className="text-muted-foreground mt-1 text-sm sm:text-base">
          Feels like {formatTemperature(weather.feelsLike, units)} &middot;{" "}
          {capitalizeFirst(weather.weather[0].description)}
        </p>
      </div>

      <dl className="m-0 grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
        <DetailItem
          icon="🌡"
          label="Min / Max"
          value={`${formatTemperature(weather.tempMin, units)} / ${formatTemperature(weather.tempMax, units)}`}
        />
        <DetailItem
          icon="💨"
          label="Wind"
          value={`${weather.windSpeed} ${windUnit} ${windDirection(weather.windDirection)}`}
        />
        <DetailItem icon="💧" label="Humidity" value={`${weather.humidity}%`} />
        <DetailItem
          icon="👁"
          label="Visibility"
          value={`${(weather.visibility / 1000).toFixed(1)} km`}
        />
        <DetailItem
          icon="🌅"
          label="Sunrise"
          value={formatTime(weather.sunrise, weather.timezone)}
          time={new Date(weather.sunrise * 1000).toISOString()}
        />
        <DetailItem
          icon="🌇"
          label="Sunset"
          value={formatTime(weather.sunset, weather.timezone)}
          time={new Date(weather.sunset * 1000).toISOString()}
        />
      </dl>
    </Card>
  );
}
