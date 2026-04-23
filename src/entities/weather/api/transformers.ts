import { z } from "zod";
import type { CurrentWeather, Forecast } from "@/entities/weather/model/types";

const owmWeatherItem = z.object({
  id: z.number(),
  main: z.string(),
  description: z.string(),
  icon: z.string(),
});

export const owmCurrent = z.object({
  name: z.string(),
  sys: z.object({
    country: z.string(),
    sunrise: z.number(),
    sunset: z.number(),
  }),
  main: z.object({
    temp: z.number(),
    feels_like: z.number(),
    temp_min: z.number(),
    temp_max: z.number(),
    pressure: z.number(),
    humidity: z.number(),
  }),
  wind: z.object({ speed: z.number(), deg: z.number() }),
  clouds: z.object({ all: z.number() }),
  visibility: z.number(),
  weather: z.array(owmWeatherItem),
  timezone: z.number(),
  dt: z.number(),
});

export const owmForecast = z.object({
  city: z.object({
    name: z.string(),
    country: z.string(),
    timezone: z.number(),
  }),
  list: z.array(
    z.object({
      dt: z.number(),
      main: z.object({
        temp: z.number(),
        feels_like: z.number(),
        temp_min: z.number(),
        temp_max: z.number(),
        pressure: z.number(),
        humidity: z.number(),
      }),
      weather: z.array(owmWeatherItem),
      clouds: z.object({ all: z.number() }),
      wind: z.object({ speed: z.number() }),
      pop: z.number(),
      dt_txt: z.string(),
    }),
  ),
});

export function transformCurrentWeather(raw: z.infer<typeof owmCurrent>): CurrentWeather {
  return {
    city: raw.name,
    country: raw.sys.country,
    temperature: raw.main.temp,
    feelsLike: raw.main.feels_like,
    tempMin: raw.main.temp_min,
    tempMax: raw.main.temp_max,
    pressure: raw.main.pressure,
    humidity: raw.main.humidity,
    visibility: raw.visibility,
    windSpeed: raw.wind.speed,
    windDirection: raw.wind.deg,
    cloudiness: raw.clouds.all,
    weather: raw.weather.map((w) => ({
      id: w.id,
      main: w.main,
      description: w.description,
      icon: w.icon,
    })),
    sunrise: raw.sys.sunrise,
    sunset: raw.sys.sunset,
    timezone: raw.timezone,
    dt: raw.dt,
  };
}

export function transformForecast(raw: z.infer<typeof owmForecast>): Forecast {
  return {
    city: raw.city.name,
    country: raw.city.country,
    timezone: raw.city.timezone,
    forecast: raw.list.map((item) => ({
      dt: item.dt,
      temperature: item.main.temp,
      feelsLike: item.main.feels_like,
      tempMin: item.main.temp_min,
      tempMax: item.main.temp_max,
      pressure: item.main.pressure,
      humidity: item.main.humidity,
      weather: item.weather.map((w) => ({
        id: w.id,
        main: w.main,
        description: w.description,
        icon: w.icon,
      })),
      windSpeed: item.wind.speed,
      cloudiness: item.clouds.all,
      pop: item.pop,
      dateTime: item.dt_txt,
    })),
  };
}
