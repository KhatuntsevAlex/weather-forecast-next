import type { Page, Locator } from "@playwright/test";
import { expect } from "@playwright/test";

export class FavoritesPage {
  constructor(readonly page: Page) {}

  async goto() {
    await this.page.goto("/favorites");
  }

  async openFromNav() {
    await this.page.getByRole("link", { name: "Favorites" }).click();
  }

  cardFor(city: string): Locator {
    return this.page.getByRole("link", { name: new RegExp(city, "i") });
  }

  async expectCard(city: string, country = "GB") {
    await expect(this.page.getByText(`${city}, ${country}`)).toBeVisible({ timeout: 10_000 });
  }

  async expectEmpty() {
    await expect(this.page.getByText("No favorites yet")).toBeVisible();
  }
}
