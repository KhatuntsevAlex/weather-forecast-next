// Shared constants + writer for the units cookie.
//
// We persist the user's temperature unit choice in a cookie (in addition to
// the zustand store) so the RSC page loader can see it and SSR-fetch weather
// with the right units — mirrors the theme-cookie pattern used in the
// layout. Kept intentionally tiny; no dependencies.

export const UNITS_COOKIE = "units";
export type Units = "metric" | "imperial";

const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

export function writeUnitsCookie(units: Units) {
  if (typeof document === "undefined") return;
  document.cookie = `${UNITS_COOKIE}=${units}; path=/; max-age=${COOKIE_MAX_AGE}; samesite=lax`;
}

export function parseUnitsCookie(value: string | undefined): Units {
  return value === "imperial" ? "imperial" : "metric";
}
