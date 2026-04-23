export interface WeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface CurrentWeather {
  city: string;
  country: string;
  temperature: number;
  feelsLike: number;
  tempMin: number;
  tempMax: number;
  pressure: number;
  humidity: number;
  visibility: number;
  windSpeed: number;
  windDirection: number;
  cloudiness: number;
  weather: WeatherCondition[];
  sunrise: number;
  sunset: number;
  timezone: number;
  dt: number;
}

export interface ForecastItem {
  dt: number;
  temperature: number;
  feelsLike: number;
  tempMin: number;
  tempMax: number;
  pressure: number;
  humidity: number;
  weather: WeatherCondition[];
  windSpeed: number;
  cloudiness: number;
  pop: number;
  dateTime: string;
}

export interface Forecast {
  city: string;
  country: string;
  timezone: number;
  forecast: ForecastItem[];
}
