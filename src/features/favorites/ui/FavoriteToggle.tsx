"use client";

import { useFavoritesStore } from "@/features/favorites/model/favoritesStore";
import { useCurrentCity, useHydrated } from "@/shared/lib";
import { IconButton } from "@/shared/ui";

export function FavoriteToggle() {
  const currentCity = useCurrentCity();
  const addFavorite = useFavoritesStore((s) => s.addFavorite);
  const removeFavorite = useFavoritesStore((s) => s.removeFavorite);
  // Subscribe to favorites so the toggle re-renders when the list changes,
  // then derive via isFavorite for DRYness.
  const isFavRaw = useFavoritesStore((s) => s.isFavorite(currentCity));

  // Zustand persist rehydrates from localStorage on the client only, which
  // causes a hydration mismatch if the server rendered the unpersisted
  // default. Gate on mount so the first client render matches the server.
  const isFav = useHydrated() && isFavRaw;

  if (!currentCity) return null;

  const toggle = () => {
    if (isFav) {
      removeFavorite(currentCity);
    } else {
      addFavorite(currentCity);
    }
  };

  return (
    <IconButton
      onClick={toggle}
      size="lg"
      variant={isFav ? "danger" : "ghost"}
      aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
      aria-pressed={isFav}
      title={isFav ? "Remove from favorites" : "Add to favorites"}
    >
      <span className="text-base leading-none" aria-hidden="true">
        {isFav ? "❤️" : "🤍"}
      </span>
    </IconButton>
  );
}
