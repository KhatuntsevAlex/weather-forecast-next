import { test as base } from "@playwright/test";
import { HomePage } from "../pages/HomePage";
import { FavoritesPage } from "../pages/FavoritesPage";
import { WeatherApiMock } from "./mockApi";

type Fixtures = {
  home: HomePage;
  favorites: FavoritesPage;
  api: WeatherApiMock;
};

/**
 * Extended Playwright `test` that auto-wires the API mock and page objects.
 * Each test receives a fresh set of fixtures; the API mock is installed
 * automatically so specs don't need a `beforeEach` for setup.
 */
export const test = base.extend<Fixtures>({
  api: async ({ page }, use) => {
    const api = new WeatherApiMock(page);
    await api.install();
    await use(api);
  },
  home: async ({ page, api }, use) => {
    // Ensure the API mock is installed before the first navigation.
    void api;
    await use(new HomePage(page));
  },
  favorites: async ({ page, api }, use) => {
    void api;
    await use(new FavoritesPage(page));
  },
});

export { expect } from "@playwright/test";
