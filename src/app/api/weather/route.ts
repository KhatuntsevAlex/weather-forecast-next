import { NextRequest, NextResponse } from "next/server";
import {
  owmCurrent,
  owmForecast,
  transformCurrentWeather,
  transformForecast,
} from "@/entities/weather/api/transformers";
import { weatherQuerySchema } from "./schema";
import { checkRateLimit, getClientKey, RATE_LIMIT } from "./rateLimit";

const BASE_URL = "https://api.openweathermap.org/data/2.5";

// Same-origin only: reject requests whose Origin header doesn't match the app host.
// Requests without an Origin header (same-origin GETs from the browser, curl, SSR)
// are allowed through — they can't be forged cross-site by a browser.
function isAllowedOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    const originHost = new URL(origin).host;
    const reqHost = request.headers.get("host") ?? request.nextUrl.host;
    return originHost === reqHost;
  } catch {
    return false;
  }
}

export async function GET(request: NextRequest) {
  if (!isAllowedOrigin(request)) {
    return NextResponse.json({ error: "Cross-origin requests are not allowed" }, { status: 403 });
  }

  const apiKey = process.env.OPENWEATHER_API_KEY;
  const baseUrl = process.env.OPENWEATHER_BASE_URL || BASE_URL;

  if (!apiKey || apiKey === "your_openweathermap_api_key_here") {
    return NextResponse.json(
      { error: "Weather API key is not configured. Set OPENWEATHER_API_KEY in .env.local" },
      { status: 500 },
    );
  }

  // Rate limit by client IP (skipped in tests for determinism).
  if (process.env.NODE_ENV !== "test") {
    const rl = checkRateLimit(getClientKey(request));
    if (!rl.ok) {
      const retryAfter = Math.max(1, Math.ceil((rl.resetAt - Date.now()) / 1000));
      return NextResponse.json(
        { error: "Too many requests. Please slow down." },
        {
          status: 429,
          headers: {
            "Retry-After": String(retryAfter),
            "X-RateLimit-Limit": String(RATE_LIMIT.MAX_REQUESTS),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": String(Math.ceil(rl.resetAt / 1000)),
          },
        },
      );
    }
  }

  const { searchParams } = request.nextUrl;
  const parsed = weatherQuerySchema.safeParse(Object.fromEntries(searchParams));

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid query parameters", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { type, city, lat, lon, units } = parsed.data;

  if (!city && (lat == null || lon == null)) {
    return NextResponse.json(
      { error: "Provide either 'city' or 'lat' and 'lon' parameters" },
      { status: 400 },
    );
  }

  const endpoint = type === "current" ? "weather" : "forecast";
  const locationParams = city ? `q=${encodeURIComponent(city)}` : `lat=${lat}&lon=${lon}`;

  const url = `${baseUrl}/${endpoint}?${locationParams}&units=${units}&appid=${apiKey}`;

  try {
    const response = await fetch(url, { next: { revalidate: 300 } });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      const message = data?.message || "Failed to fetch weather data";
      return NextResponse.json({ error: message }, { status: response.status === 404 ? 404 : 502 });
    }

    const raw = await response.json();

    if (type === "current") {
      const validated = owmCurrent.safeParse(raw);
      if (!validated.success) {
        return NextResponse.json(
          { error: "Unexpected response shape from weather service" },
          { status: 502 },
        );
      }
      return NextResponse.json(transformCurrentWeather(validated.data));
    }

    const validated = owmForecast.safeParse(raw);
    if (!validated.success) {
      return NextResponse.json(
        { error: "Unexpected response shape from weather service" },
        { status: 502 },
      );
    }
    return NextResponse.json(transformForecast(validated.data));
  } catch {
    return NextResponse.json({ error: "Failed to connect to weather service" }, { status: 502 });
  }
}
