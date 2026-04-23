import { test, expect } from "../fixtures";

test.describe("Temperature units", () => {
  test("toggles between Celsius and Fahrenheit", async ({ home }) => {
    await home.goto();
    await home.search("London");
    await home.expectWeatherFor("London");

    await expect(home.page.getByText(/°C/).first()).toBeVisible();

    await home.toggleUnits();

    await expect(home.page.getByText(/°F/).first()).toBeVisible();
  });
});
