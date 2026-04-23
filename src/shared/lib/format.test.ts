import { describe, it, expect } from "vitest";
import {
  formatTemperature,
  formatDate,
  capitalizeFirst,
  windDirection,
  getWeatherIconUrl,
} from "@/shared/lib/format";

describe("formatTemperature", () => {
  it("formats metric temperature", () => {
    expect(formatTemperature(23.7, "metric")).toBe("24°C");
  });

  it("formats imperial temperature", () => {
    expect(formatTemperature(75.2, "imperial")).toBe("75°F");
  });

  it("rounds negative temperatures", () => {
    expect(formatTemperature(-3.4, "metric")).toBe("-3°C");
  });
});

describe("formatDate", () => {
  it("formats a unix timestamp to readable date", () => {
    const result = formatDate(1736899200);

    expect(result).toContain("Jan");
    expect(result).toContain("15");
  });
});

describe("capitalizeFirst", () => {
  it("capitalizes first letter", () => {
    expect(capitalizeFirst("cloudy sky")).toBe("Cloudy sky");
  });

  it("handles single character", () => {
    expect(capitalizeFirst("a")).toBe("A");
  });

  it("handles empty string", () => {
    expect(capitalizeFirst("")).toBe("");
  });
});

describe("windDirection", () => {
  it("returns N for 0 degrees", () => {
    expect(windDirection(0)).toBe("N");
  });

  it("returns E for 90 degrees", () => {
    expect(windDirection(90)).toBe("E");
  });

  it("returns S for 180 degrees", () => {
    expect(windDirection(180)).toBe("S");
  });

  it("returns W for 270 degrees", () => {
    expect(windDirection(270)).toBe("W");
  });

  it("returns NE for 45 degrees", () => {
    expect(windDirection(45)).toBe("NE");
  });
});

describe("getWeatherIconUrl", () => {
  it("builds correct URL", () => {
    expect(getWeatherIconUrl("01d")).toBe("https://openweathermap.org/img/wn/01d@2x.png");
  });
});
