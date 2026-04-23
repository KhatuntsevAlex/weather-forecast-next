"use client";

import { useForecast, useWeatherStore } from "@/entities/weather";
import { formatTemperature, formatDate, getWeatherIconUrl, capitalizeFirst } from "@/shared/lib";
import Image from "next/image";
import { Card } from "@/shared/ui";

// Keep this string identical to FORECAST_RESERVED in WeatherDashboard.tsx so
// the dynamic loader placeholder, data-loading skeleton, and the loaded card
// all occupy the same box — eliminates CLS.
const RESERVED_HEIGHT = "min-h-[640px] sm:min-h-[260px]";

export function ForecastDisplay() {
  const units = useWeatherStore((s) => s.units);
  const { data: forecast, error, isLoading } = useForecast();

  if (isLoading) {
    return (
      <Card
        animation="pulse"
        role="status"
        aria-label="Loading forecast"
        className={RESERVED_HEIGHT}
      >
        <span className="sr-only">Loading forecast…</span>
        <div className="bg-surface-hover mb-4 h-6 w-40 rounded" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-surface-hover h-40 rounded-xl sm:h-44" />
          ))}
        </div>
      </Card>
    );
  }

  if (error || !forecast) return <Card animation="none" className={RESERVED_HEIGHT} />;

  // Pick one entry per local date — the slot closest to 12:00.
  const byDate = new Map<string, (typeof forecast.forecast)[number]>();
  for (const item of forecast.forecast) {
    const d = new Date(item.dateTime);
    const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    const existing = byDate.get(key);
    if (
      !existing ||
      Math.abs(d.getHours() - 12) < Math.abs(new Date(existing.dateTime).getHours() - 12)
    ) {
      byDate.set(key, item);
    }
  }
  if (!byDate.size) return null;

  const dailyForecast = Array.from(byDate.values()).slice(0, 5);

  return (
    <Card className={RESERVED_HEIGHT}>
      <h2 className="text-foreground mb-3 text-base font-semibold sm:mb-4 sm:text-lg">
        5-Day Forecast
      </h2>
      <ol className="m-0 grid list-none grid-cols-2 gap-2 p-0 sm:grid-cols-5 sm:gap-3">
        {dailyForecast.map((item) => (
          <li
            key={item.dt}
            className="bg-surface hover:bg-surface-hover flex cursor-default flex-col items-center rounded-xl border border-transparent p-3 transition-colors duration-150 hover:border-cyan-500 sm:p-4"
          >
            <time
              dateTime={new Date(item.dt * 1000).toISOString()}
              className="text-muted-foreground mb-1 text-sm"
            >
              {formatDate(item.dt)}
            </time>
            <Image
              src={getWeatherIconUrl(item.weather[0].icon)}
              alt={item.weather[0].description}
              width={48}
              height={48}
            />
            <p className="text-foreground font-semibold">
              <span className="sr-only">High: </span>
              {formatTemperature(item.tempMax, units)}
            </p>
            <p className="text-muted-foreground text-sm">
              <span className="sr-only">Low: </span>
              {formatTemperature(item.tempMin, units)}
            </p>
            <p className="text-muted mt-1 text-center text-xs">
              {capitalizeFirst(item.weather[0].description)}
            </p>
            <div className="text-muted mt-2 flex gap-2 text-xs">
              <span>
                <span aria-hidden="true">💧</span>
                <span className="sr-only">Humidity </span>
                {item.humidity}%
              </span>
              <span>
                <span aria-hidden="true">💨</span>
                <span className="sr-only">Wind </span>
                {item.windSpeed}
              </span>
            </div>
          </li>
        ))}
      </ol>
    </Card>
  );
}
