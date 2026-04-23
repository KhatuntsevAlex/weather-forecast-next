import "server-only";
import { owmCurrent, transformCurrentWeather } from "./transformers";
import { buildWeatherUrl } from "../lib/buildWeatherUrl";
import type { CurrentWeather } from "../model/types";
import type { Units } from "../model/unitsCookie";

const BASE_URL = "https://api.openweathermap.org/data/2.5";

interface SeedResult<T> {
  /** SWR cache key — identical to the URL the client's useSWR will request. */
  key: string;
  data: T;
}

/**
 * Server-only OWM current-weather fetch used by the RSC page to seed SWR's
 * fallback cache. Bypasses our /api/weather route (no localhost round-trip),
 * but reuses the same schema and transformer for consistency.
 *
 * Returns `null` on any failure — caller should render the client dashboard
 * without a fallback so SWR handles retries and error UI as usual.
 */
export async function fetchCurrentWeatherServer(params: {
  city: string;
  units: Units;
}): Promise<SeedResult<CurrentWeather> | null> {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  const baseUrl = process.env.OPENWEATHER_BASE_URL || BASE_URL;
  if (!apiKey || apiKey === "your_openweathermap_api_key_here") return null;

  const key = buildWeatherUrl("current", { city: params.city, units: params.units });
  if (!key) return null;

  const owmUrl = `${baseUrl}/weather?q=${encodeURIComponent(params.city)}&units=${params.units}&appid=${apiKey}`;

  try {
    // Same 5-minute revalidate window as the API route — Next dedupes these
    // two fetches so we don't double-hit OWM.
    const response = await fetch(owmUrl, { next: { revalidate: 300 } });
    if (!response.ok) return null;
    const raw = await response.json();
    const validated = owmCurrent.safeParse(raw);
    if (!validated.success) return null;
    return { key, data: transformCurrentWeather(validated.data) };
  } catch {
    return null;
  }
}
