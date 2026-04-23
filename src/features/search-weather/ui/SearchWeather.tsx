"use client";

import { useState } from "react";
import { useNavigateToCity } from "@/features/search-weather/hooks/useNavigateToCity";
import { useCurrentCity, cn } from "@/shared/lib";
import { Button, Input, FieldError } from "@/shared/ui";

export function SearchWeather() {
  const currentCity = useCurrentCity();
  const navigateToCity = useNavigateToCity();
  const [error, setError] = useState("");
  // Reset the error during render when the URL city changes externally
  // (e.g. history/favorite click). Avoids a useEffect + cascading render.
  // https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
  const [prevCity, setPrevCity] = useState(currentCity);
  if (prevCity !== currentCity) {
    setPrevCity(currentCity);
    setError("");
  }

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const trimmed = String(formData.get("city") ?? "").trim();
    if (!trimmed) {
      setError("Please enter a city name");
      return;
    }
    setError("");
    await navigateToCity(trimmed);
  };

  return (
    <form
      onSubmit={handleSubmit}
      onInput={() => {
        if (error) setError("");
      }}
      role="search"
      aria-label="City weather search"
      className="flex w-full gap-2 sm:gap-3"
    >
      <div className="relative min-w-0 flex-1">
        <label htmlFor="city-search" className="sr-only">
          City name
        </label>
        <Input
          // Remount the uncontrolled input so `defaultValue` re-applies when
          // the URL city changes externally (history/favorite click).
          key={currentCity}
          id="city-search"
          name="city"
          type="text"
          defaultValue={currentCity}
          placeholder="Enter city name..."
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? "search-error" : undefined}
          className={cn(error && "border-red-500/50")}
        />
        <FieldError id="search-error" message={error} />
      </div>
      <Button type="submit" variant="primary" size="lg" className="shrink-0 px-4 sm:px-6">
        <span className="sr-only sm:not-sr-only">Search</span>
        <span aria-hidden="true" className="text-lg sm:hidden">
          🔍
        </span>
      </Button>
    </form>
  );
}
