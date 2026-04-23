import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, cleanup, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { routerMock } from "@/__tests__/setup";
import { useWeatherStore } from "@/entities/weather";
import { LocationButton } from "@/features/geolocation/ui/LocationButton";

describe("LocationButton", () => {
  const originalGeolocation = navigator.geolocation;

  beforeEach(() => {
    useWeatherStore.setState({
      coords: null,
      isLoadingLocation: false,
      locationError: null,
      units: "metric",
    });
    routerMock.push.mockClear();
    routerMock.replace.mockClear();
  });

  afterEach(() => {
    cleanup();
    Object.defineProperty(navigator, "geolocation", {
      value: originalGeolocation,
      configurable: true,
    });
  });

  it("sets coords and replaces route on success", async () => {
    const getCurrentPosition = vi.fn((success: PositionCallback) => {
      success({ coords: { latitude: 10, longitude: 20 } } as GeolocationPosition);
    });
    Object.defineProperty(navigator, "geolocation", {
      value: { getCurrentPosition },
      configurable: true,
    });
    const user = userEvent.setup();
    render(<LocationButton />);

    await user.click(screen.getByRole("button", { name: /use my location/i }));

    await waitFor(() => {
      expect(useWeatherStore.getState().coords).toEqual({ lat: 10, lon: 20 });
    });
    expect(routerMock.replace).toHaveBeenCalledWith("/", { scroll: false });
  });

  it("stores an error message when geolocation fails", async () => {
    Object.defineProperty(navigator, "geolocation", {
      value: undefined,
      configurable: true,
    });
    const user = userEvent.setup();
    render(<LocationButton />);

    await user.click(screen.getByRole("button", { name: /use my location/i }));

    await waitFor(() => {
      expect(useWeatherStore.getState().locationError).toMatch(/not supported/i);
    });
  });

  it("is disabled while loading", () => {
    useWeatherStore.setState({ isLoadingLocation: true });
    render(<LocationButton />);

    expect(screen.getByRole("button", { name: /use my location/i })).toBeDisabled();
  });
});
