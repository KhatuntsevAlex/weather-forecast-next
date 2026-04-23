import type { Page, Locator } from "@playwright/test";
import { mockCurrentWeather, mockForecast } from "../data/mockWeather";

/**
 * Installs a default `/api/weather` mock on the given page and exposes a
 * couple of helpers for per-test overrides.
 */
export class WeatherApiMock {
  constructor(private readonly page: Page) {}

  async install(
    overrides: {
      current?: Partial<typeof mockCurrentWeather>;
      forecast?: Partial<typeof mockForecast>;
    } = {},
  ) {
    await this.page.route("**/api/weather**", async (route) => {
      const url = new URL(route.request().url());
      const type = url.searchParams.get("type");
      if (type === "current") {
        await route.fulfill({ json: { ...mockCurrentWeather, ...overrides.current } });
      } else {
        await route.fulfill({ json: { ...mockForecast, ...overrides.forecast } });
      }
    });
  }

  /** Return a 404 for the next matching request (e.g. to test "city not found"). */
  async respondNotFound(match: RegExp | string = "**/api/weather**") {
    await this.page.route(match, async (route) => {
      await route.fulfill({ status: 404, json: { error: "city not found" } });
    });
  }
}

/**
 * Shared test-id / accessible-name locators for the header chrome.
 * Exposed as a small helper so spec files can keep assertions concise.
 */
export function headerLocators(page: Page): {
  favoritesLink: Locator;
  homeLink: Locator;
  unitToggle: Locator;
  themeToggle: Locator;
} {
  return {
    favoritesLink: page.getByRole("link", { name: "Favorites" }),
    homeLink: page.getByRole("link", { name: /weather forecast/i }),
    unitToggle: page.getByRole("button", { name: /switch to (fahrenheit|celsius)/i }),
    themeToggle: page.getByRole("button", { name: /switch to (light|dark) mode/i }),
  };
}
