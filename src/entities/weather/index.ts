export { useWeatherStore } from "./model/weatherStore";
export { UNITS_COOKIE, writeUnitsCookie, parseUnitsCookie, type Units } from "./model/unitsCookie";
export { useCurrentWeather, useForecast } from "./api/useWeather";
export { fetcher, swrConfig, FetchError } from "./api/fetcher";
export { SwrFallbackProvider } from "./api/SwrFallbackProvider";
// NOTE: Zod schemas (owmCurrent, owmForecast) and transformers live in
// ./api/transformers and are server-only. They are intentionally NOT
// re-exported from this barrel because doing so pulls Zod (~60 KiB) into
// every client bundle that imports anything from `@/entities/weather`.
// Server code (API routes) must import them directly:
//   import { ... } from "@/entities/weather/api/transformers";
export { buildWeatherUrl } from "./lib/buildWeatherUrl";
export type { CurrentWeather, Forecast, ForecastItem, WeatherCondition } from "./model/types";
