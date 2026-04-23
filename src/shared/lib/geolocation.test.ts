import { describe, it, expect, vi, afterEach } from "vitest";
import { getPosition } from "@/shared/lib/geolocation";

describe("getPosition", () => {
  const originalGeolocation = navigator.geolocation;

  afterEach(() => {
    Object.defineProperty(navigator, "geolocation", {
      value: originalGeolocation,
      configurable: true,
    });
  });

  it("rejects when geolocation is unsupported", async () => {
    Object.defineProperty(navigator, "geolocation", { value: undefined, configurable: true });

    await expect(getPosition()).rejects.toThrow("Geolocation is not supported by your browser");
  });

  it("resolves to coords on success", async () => {
    const getCurrentPosition = vi.fn((success: PositionCallback) => {
      success({
        coords: { latitude: 51.5, longitude: -0.12 },
      } as GeolocationPosition);
    });
    Object.defineProperty(navigator, "geolocation", {
      value: { getCurrentPosition },
      configurable: true,
    });

    const result = await getPosition();

    expect(result).toEqual({ lat: 51.5, lon: -0.12 });
  });

  const errorCases: Array<[number, string]> = [
    [1, "Location permission denied. Please enable location access."],
    [2, "Location information is unavailable."],
    [3, "Location request timed out."],
    [99, "An unknown error occurred."],
  ];

  errorCases.forEach(([code, message]) => {
    it(`rejects with a helpful message for error code ${code}`, async () => {
      const getCurrentPosition = vi.fn(
        (_success: PositionCallback, error: PositionErrorCallback) => {
          error({
            code,
            message: "err",
            PERMISSION_DENIED: 1,
            POSITION_UNAVAILABLE: 2,
            TIMEOUT: 3,
          } as GeolocationPositionError);
        },
      );
      Object.defineProperty(navigator, "geolocation", {
        value: { getCurrentPosition },
        configurable: true,
      });

      await expect(getPosition()).rejects.toThrow(message);
    });
  });
});
