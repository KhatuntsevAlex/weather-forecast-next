import { describe, it, expect, beforeAll, afterAll, vi, afterEach } from "vitest";
import { NextRequest } from "next/server";
import { GET } from "@/app/api/weather/route";

const rawCurrent = {
  name: "London",
  sys: { country: "GB", sunrise: 1, sunset: 2 },
  main: { temp: 10, feels_like: 9, temp_min: 8, temp_max: 12, pressure: 1013, humidity: 70 },
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
      main: { temp: 10, feels_like: 9, temp_min: 8, temp_max: 12, pressure: 1013, humidity: 70 },
      weather: [{ id: 500, main: "Rain", description: "light rain", icon: "10d" }],
      clouds: { all: 40 },
      wind: { speed: 5 },
      pop: 0.5,
      dt_txt: "2023-11-14 12:00:00",
    },
  ],
};

describe("Weather API Route", () => {
  const originalEnv = process.env;

  beforeAll(() => {
    process.env = { ...originalEnv, OPENWEATHER_API_KEY: "test_key_12345" };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns 400 for missing location parameters", async () => {
    const req = new NextRequest("http://localhost:3000/api/weather?type=current&units=metric");

    const res = await GET(req);

    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBeDefined();
  });

  it("returns 400 for invalid type", async () => {
    const req = new NextRequest("http://localhost:3000/api/weather?type=invalid&city=London");

    const res = await GET(req);

    expect(res.status).toBe(400);
  });

  it("returns transformed current weather on success", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify(rawCurrent), { status: 200 }),
    );

    const req = new NextRequest(
      "http://localhost:3000/api/weather?type=current&city=London&units=metric",
    );
    const res = await GET(req);

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toMatchObject({ city: "London", temperature: 10 });
  });

  it("returns transformed forecast on success", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify(rawForecast), { status: 200 }),
    );

    const req = new NextRequest(
      "http://localhost:3000/api/weather?type=forecast&lat=51&lon=-0.1&units=metric",
    );
    const res = await GET(req);

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.forecast).toHaveLength(1);
  });

  it("returns 404 when OWM says city not found", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ message: "city not found" }), { status: 404 }),
    );

    const req = new NextRequest(
      "http://localhost:3000/api/weather?type=current&city=Nowhere&units=metric",
    );
    const res = await GET(req);

    expect(res.status).toBe(404);
    expect((await res.json()).error).toBe("city not found");
  });

  it("returns 502 when OWM returns an unexpected shape", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ unexpected: true }), { status: 200 }),
    );

    const req = new NextRequest(
      "http://localhost:3000/api/weather?type=current&city=London&units=metric",
    );
    const res = await GET(req);

    expect(res.status).toBe(502);
  });

  it("returns 502 when forecast upstream returns an unexpected shape", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ unexpected: true }), { status: 200 }),
    );

    const req = new NextRequest(
      "http://localhost:3000/api/weather?type=forecast&city=London&units=metric",
    );
    const res = await GET(req);

    expect(res.status).toBe(502);
  });

  it("returns 502 when fetch throws", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("network"));

    const req = new NextRequest(
      "http://localhost:3000/api/weather?type=current&city=London&units=metric",
    );
    const res = await GET(req);

    expect(res.status).toBe(502);
  });

  it("returns 500 when API key is a placeholder value", async () => {
    const prev = process.env.OPENWEATHER_API_KEY;
    process.env.OPENWEATHER_API_KEY = "your_openweathermap_api_key_here";

    const req = new NextRequest(
      "http://localhost:3000/api/weather?type=current&city=London&units=metric",
    );
    const res = await GET(req);

    expect(res.status).toBe(500);
    process.env.OPENWEATHER_API_KEY = prev;
  });
});

describe("Weather API Route — missing key", () => {
  const originalEnv = process.env;

  beforeAll(() => {
    process.env = { ...originalEnv };
    delete process.env.OPENWEATHER_API_KEY;
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it("returns 500 when API key not configured", async () => {
    const req = new NextRequest(
      "http://localhost:3000/api/weather?type=current&city=London&units=metric",
    );

    const res = await GET(req);

    expect(res.status).toBe(500);
  });
});
