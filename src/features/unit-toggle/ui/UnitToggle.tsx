"use client";

import { useWeatherStore, writeUnitsCookie } from "@/entities/weather";
import { IconButton } from "@/shared/ui";

export function UnitToggle() {
  const units = useWeatherStore((s) => s.units);
  const setUnits = useWeatherStore((s) => s.setUnits);

  const toggle = () => {
    const next = units === "metric" ? "imperial" : "metric";
    setUnits(next);
    // Mirror the zustand store into a cookie so the RSC page loader can
    // SSR weather with the right units. See entities/weather/model/unitsCookie.
    writeUnitsCookie(next);
  };

  return (
    <IconButton
      onClick={toggle}
      className="text-muted-foreground hover:text-foreground text-sm font-medium"
      title={`Switch to ${units === "metric" ? "Fahrenheit" : "Celsius"}`}
      aria-pressed={units === "imperial"}
      aria-label={units === "metric" ? "°C — switch to Fahrenheit" : "°F — switch to Celsius"}
    >
      {units === "metric" ? "°C" : "°F"}
    </IconButton>
  );
}
