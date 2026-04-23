"use client";

import { useWeatherStore } from "@/entities/weather/model/weatherStore";
import { fetcher, swrConfig } from "@/entities/weather/api/fetcher";
import { buildWeatherUrl } from "@/entities/weather/lib/buildWeatherUrl";
import { useCurrentCity } from "@/shared/lib";
import type { CurrentWeather, Forecast } from "@/entities/weather/model/types";
import useSWR from "swr";

export function useCurrentWeather() {
  const currentCity = useCurrentCity();
  const coords = useWeatherStore((s) => s.coords);
  const units = useWeatherStore((s) => s.units);
  const url = buildWeatherUrl("current", {
    city: currentCity,
    lat: coords?.lat,
    lon: coords?.lon,
    units,
  });

  return useSWR<CurrentWeather>(url, fetcher, swrConfig);
}

export function useForecast() {
  const currentCity = useCurrentCity();
  const coords = useWeatherStore((s) => s.coords);
  const units = useWeatherStore((s) => s.units);
  const url = buildWeatherUrl("forecast", {
    city: currentCity,
    lat: coords?.lat,
    lon: coords?.lon,
    units,
  });

  return useSWR<Forecast>(url, fetcher, swrConfig);
}
