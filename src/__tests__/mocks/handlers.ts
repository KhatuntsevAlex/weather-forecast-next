import { http, HttpResponse } from "msw";
import { mockCurrentWeather, mockForecast } from "./data";

export const handlers = [
  http.get("/api/weather", ({ request }) => {
    const url = new URL(request.url);
    const type = url.searchParams.get("type");
    const city = url.searchParams.get("city");

    if (!city && !url.searchParams.get("lat")) {
      return HttpResponse.json({ error: "City or coordinates required" }, { status: 400 });
    }

    if (city?.toLowerCase() === "invalidcity404") {
      return HttpResponse.json({ error: "City not found" }, { status: 404 });
    }

    if (type === "forecast") {
      return HttpResponse.json({
        ...mockForecast,
        city: city ?? mockForecast.city,
      });
    }

    return HttpResponse.json({
      ...mockCurrentWeather,
      city: city ?? mockCurrentWeather.city,
    });
  }),
];
