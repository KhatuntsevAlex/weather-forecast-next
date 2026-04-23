export function buildWeatherUrl(
  type: "current" | "forecast",
  params: { city?: string; lat?: number; lon?: number; units: string },
): string | null {
  if (!params.city && (params.lat == null || params.lon == null)) return null;

  const sp = new URLSearchParams({ type, units: params.units });
  if (params.city) {
    sp.set("city", params.city);
  } else {
    sp.set("lat", String(params.lat));
    sp.set("lon", String(params.lon));
  }
  return `/api/weather?${sp.toString()}`;
}
