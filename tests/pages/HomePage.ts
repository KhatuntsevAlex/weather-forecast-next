import type { Page, Locator } from "@playwright/test";
import { expect } from "@playwright/test";

/**
 * Encapsulates locators and user-intent actions for the home page.
 * Action methods wait for the next relevant state so specs don't need
 * to sprinkle explicit timeouts.
 */
export class HomePage {
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly favoriteButton: Locator;
  readonly unfavoriteButton: Locator;

  constructor(readonly page: Page) {
    this.searchInput = page.getByPlaceholder("Enter city name...");
    this.searchButton = page.getByRole("button", { name: "Search" });
    this.favoriteButton = page.getByLabel("Add to favorites");
    this.unfavoriteButton = page.getByLabel("Remove from favorites");
  }

  async goto() {
    await this.page.goto("/");
  }

  async search(city: string) {
    await this.searchInput.fill(city);
    await this.searchButton.click();
  }

  async expectWeatherFor(city: string, country = "GB") {
    await expect(this.page.getByText(`${city}, ${country}`)).toBeVisible({ timeout: 10_000 });
  }

  async addToFavorites() {
    await this.favoriteButton.click();
    await expect(this.unfavoriteButton).toBeVisible();
  }

  async removeFromFavorites() {
    await this.unfavoriteButton.click();
    await expect(this.favoriteButton).toBeVisible();
  }

  async toggleUnits() {
    await this.page.getByRole("button", { name: /switch to (fahrenheit|celsius)/i }).click();
  }

  async expectValidationError(message = "Please enter a city name") {
    await expect(this.page.getByText(message)).toBeVisible();
  }

  historyItem(city: string): Locator {
    return this.page.getByRole("listitem").filter({ hasText: city });
  }

  recentSearchesHeading(): Locator {
    return this.page.getByText("Recent searches");
  }
}
