import { describe, it, expect } from "vitest";
import {
  transformCurrentWeather,
  transformForecast,
  owmCurrent,
  owmForecast,
} from "@/entities/weather/api/transformers";

const rawCurrent = {
  name: "London",
  sys: { country: "GB", sunrise: 1, sunset: 2 },
  main: {
    temp: 10,
    feels_like: 9,
    temp_min: 8,
    temp_max: 12,
    pressure: 1013,
    humidity: 70,
  },
  wind: { speed: 5, deg: 180 },
  clouds: { all: 40 },
  visibility: 10000,
  weather: [{ id: 800, main: "Clear", description: "clear sky", icon: "01d" }],
  timezone: 0,
  dt: 1700000000,
};

const rawForecast = {
  city: { name: "London", country: "GB", timezone: 0 },
  list: [
    {
      dt: 1700000000,
      main: {
        temp: 10,
        feels_like: 9,
        temp_min: 8,
        temp_max: 12,
        pressure: 1013,
        humidity: 70,
      },
      weather: [{ id: 500, main: "Rain", description: "light rain", icon: "10d" }],
      clouds: { all: 40 },
      wind: { speed: 5 },
      pop: 0.5,
      dt_txt: "2023-11-14 12:00:00",
    },
  ],
};

describe("transformers", () => {
  it("validates and transforms OWM current weather", () => {
    const parsed = owmCurrent.parse(rawCurrent);

    const result = transformCurrentWeather(parsed);

    expect(result).toMatchObject({
      city: "London",
      country: "GB",
      temperature: 10,
      feelsLike: 9,
      tempMin: 8,
      tempMax: 12,
      humidity: 70,
      windSpeed: 5,
      windDirection: 180,
      cloudiness: 40,
      visibility: 10000,
    });
    expect(result.weather[0]).toEqual({
      id: 800,
      main: "Clear",
      description: "clear sky",
      icon: "01d",
    });
  });

  it("validates and transforms OWM forecast", () => {
    const parsed = owmForecast.parse(rawForecast);

    const result = transformForecast(parsed);

    expect(result.city).toBe("London");
    expect(result.country).toBe("GB");
    expect(result.forecast).toHaveLength(1);
    expect(result.forecast[0]).toMatchObject({
      temperature: 10,
      feelsLike: 9,
      tempMin: 8,
      tempMax: 12,
      humidity: 70,
      windSpeed: 5,
      cloudiness: 40,
      pop: 0.5,
      dateTime: "2023-11-14 12:00:00",
    });
    expect(result.forecast[0]!.weather[0]).toEqual({
      id: 500,
      main: "Rain",
      description: "light rain",
      icon: "10d",
    });
  });

  it("rejects malformed responses at validation time", () => {
    expect(() =>
      owmCurrent.parse({ ...rawCurrent, main: { ...rawCurrent.main, temp: "hot" } }),
    ).toThrow();
  });
});
