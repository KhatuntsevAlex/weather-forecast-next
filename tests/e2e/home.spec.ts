import { test, expect } from "../fixtures";

test.describe("Home page", () => {
  test("loads homepage with title", async ({ home }) => {
    await home.goto();

    await expect(
      home.page.getByRole("heading", { name: "Weather Forecast", level: 1 }),
    ).toBeVisible();
  });

  test("searches for a city and displays weather", async ({ home }) => {
    await home.goto();

    await home.search("London");

    await home.expectWeatherFor("London");
    await expect(home.page.getByText("scattered clouds", { exact: false })).toBeVisible();
  });

  test("validates empty search input", async ({ home }) => {
    await home.goto();

    await home.search("");

    await home.expectValidationError();
  });
});
