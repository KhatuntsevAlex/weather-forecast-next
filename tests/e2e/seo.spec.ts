import { test, expect } from "../fixtures";

test.describe("SEO", () => {
  test("robots.txt is accessible and blocks /api/", async ({ page }) => {
    const response = await page.goto("/robots.txt");

    expect(response?.status()).toBe(200);
    const text = await response?.text();
    expect(text).toContain("User-agent: *");
    expect(text).toContain("Disallow: /api/");
  });
});
