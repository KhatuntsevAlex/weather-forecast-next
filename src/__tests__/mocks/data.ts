import type { CurrentWeather, Forecast } from "@/entities/weather";

export const mockCurrentWeather: CurrentWeather = {
  city: "London",
  country: "GB",
  temperature: 15.5,
  feelsLike: 14.2,
  tempMin: 13.0,
  tempMax: 17.0,
  pressure: 1013,
  humidity: 72,
  visibility: 10000,
  windSpeed: 4.5,
  windDirection: 220,
  cloudiness: 75,
  weather: [{ id: 802, main: "Clouds", description: "scattered clouds", icon: "03d" }],
  sunrise: 1700000000,
  sunset: 1700040000,
  timezone: 0,
  dt: 1700020000,
};

export const mockForecast: Forecast = {
  city: "London",
  country: "GB",
  timezone: 0,
  forecast: Array.from({ length: 40 }, (_, i) => ({
    dt: 1700020000 + i * 10800,
    temperature: 15 + Math.sin(i) * 3,
    feelsLike: 14 + Math.sin(i) * 3,
    tempMin: 13,
    tempMax: 17,
    pressure: 1013,
    humidity: 72,
    weather: [{ id: 802, main: "Clouds", description: "scattered clouds", icon: "03d" }],
    windSpeed: 4.5,
    cloudiness: 75,
    pop: 0.3,
    dateTime: new Date((1700020000 + i * 10800) * 1000)
      .toISOString()
      .replace("T", " ")
      .slice(0, 19),
  })),
};
