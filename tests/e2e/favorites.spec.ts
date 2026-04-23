import { test } from "../fixtures";

test.describe("Favorites", () => {
  test("adds a city to favorites and opens favorites page", async ({ home, favorites }) => {
    await home.goto();
    await home.search("London");
    await home.expectWeatherFor("London");

    await home.addToFavorites();
    await favorites.openFromNav();

    await favorites.expectCard("London");
  });

  test("removes a city from favorites", async ({ home }) => {
    await home.goto();
    await home.search("London");
    await home.expectWeatherFor("London");
    await home.addToFavorites();

    await home.removeFromFavorites();
  });
});
