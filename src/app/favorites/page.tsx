import type { Metadata } from "next";
import { FavoritesList } from "@/features/favorites";

export const metadata: Metadata = {
  title: "Favorites",
  description: "Your saved favorite cities with live weather updates",
};

export default function FavoritesPage() {
  return (
    <div className="mx-auto max-w-4xl px-3 py-4 sm:px-4 sm:py-8">
      <h1 className="text-foreground mb-4 text-2xl font-bold sm:mb-6 sm:text-3xl">
        Favorite Cities
      </h1>
      <FavoritesList />
    </div>
  );
}
