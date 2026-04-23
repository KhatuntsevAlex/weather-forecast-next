import { test, expect } from "../fixtures";

test.describe("Search history", () => {
  test("shows recent searches after a search", async ({ home }) => {
    await home.goto();

    await home.search("London");
    await home.expectWeatherFor("London");

    await expect(home.recentSearchesHeading()).toBeVisible();
    await expect(home.historyItem("London").first()).toBeVisible();
  });
});
