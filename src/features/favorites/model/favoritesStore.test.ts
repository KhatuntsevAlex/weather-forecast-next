import { describe, it, expect, beforeEach } from "vitest";
import { useFavoritesStore } from "@/features/favorites/model/favoritesStore";

describe("favoritesStore", () => {
  beforeEach(() => {
    useFavoritesStore.setState({ favorites: [] });
  });

  it("adds a city to favorites", () => {
    useFavoritesStore.getState().addFavorite("London");

    expect(useFavoritesStore.getState().favorites).toContain("London");
  });

  it("prevents duplicate favorites (case-insensitive)", () => {
    useFavoritesStore.getState().addFavorite("London");

    useFavoritesStore.getState().addFavorite("LONDON");

    expect(useFavoritesStore.getState().favorites).toHaveLength(1);
  });

  it("removes a city from favorites", () => {
    useFavoritesStore.getState().addFavorite("London");
    useFavoritesStore.getState().addFavorite("Paris");

    useFavoritesStore.getState().removeFavorite("London");

    const { favorites } = useFavoritesStore.getState();
    expect(favorites).toHaveLength(1);
    expect(favorites[0]).toBe("Paris");
  });
});
