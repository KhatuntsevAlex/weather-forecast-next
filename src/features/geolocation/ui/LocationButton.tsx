"use client";

import { useRouter } from "next/navigation";
import { useWeatherStore } from "@/entities/weather";
import { getPosition } from "@/shared/lib";
import { IconButton } from "@/shared/ui";

export function LocationButton() {
  const isLoadingLocation = useWeatherStore((s) => s.isLoadingLocation);
  const setCoords = useWeatherStore((s) => s.setCoords);
  const setLoadingLocation = useWeatherStore((s) => s.setLoadingLocation);
  const setLocationError = useWeatherStore((s) => s.setLocationError);
  const router = useRouter();

  const handleClick = async () => {
    setLoadingLocation(true);
    setLocationError(null);
    try {
      const { lat, lon } = await getPosition();
      setCoords(lat, lon);
      // Clear city from URL — coords take over
      router.replace("/", { scroll: false });
    } catch (err) {
      setLocationError(err instanceof Error ? err.message : "Location failed");
    } finally {
      setLoadingLocation(false);
    }
  };

  return (
    <IconButton
      onClick={handleClick}
      disabled={isLoadingLocation}
      size="lg"
      title="Use my location"
      aria-label="Use my location"
    >
      {isLoadingLocation ? (
        <svg
          className="h-5 w-5 animate-spin text-cyan-400"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" opacity="0.3" />
          <path
            d="M12 2a10 10 0 0 1 10 10"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      ) : (
        <svg
          className="text-muted-foreground h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7z"
          />
          <circle cx="12" cy="9" r="2.5" />
        </svg>
      )}
    </IconButton>
  );
}
