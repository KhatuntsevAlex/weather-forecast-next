import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, waitFor, cleanup } from "@testing-library/react";
import { SWRConfig } from "swr";
import { http, HttpResponse } from "msw";
import { server } from "@/__tests__/mocks/server";
import { navState } from "@/__tests__/setup";
import { useWeatherStore } from "@/entities/weather";
import { useHistoryStore } from "@/features/search-weather";
import { WeatherDisplay } from "@/features/weather-display/ui/WeatherDisplay";

vi.mock("next/image", () => ({
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0 }}>{children}</SWRConfig>
  );
}

describe("WeatherDisplay", () => {
  beforeEach(() => {
    navState.city = "";
    useWeatherStore.setState({ coords: null, units: "metric" });
    useHistoryStore.setState({ history: [], removedStack: [] });
  });

  afterEach(() => {
    cleanup();
  });

  it("renders nothing when no city is set", () => {
    const { container } = render(<WeatherDisplay />, { wrapper: Wrapper });

    expect(container.firstChild).toBeNull();
  });

  it("fetches and displays weather data for a city", async () => {
    navState.city = "London";

    render(<WeatherDisplay />, { wrapper: Wrapper });

    await waitFor(() => {
      expect(screen.getByText("London, GB")).toBeInTheDocument();
    });
    expect(screen.getByText(/scattered clouds/i)).toBeInTheDocument();
    expect(screen.getByText(/16°C/)).toBeInTheDocument();
    expect(screen.getByText(/13°C \/ 17°C/)).toBeInTheDocument();
    expect(screen.getByText(/4\.5 m\/s SW/)).toBeInTheDocument();
    expect(screen.getByText("72%")).toBeInTheDocument();
  });

  it("shows imperial units when toggled", async () => {
    navState.city = "London";
    useWeatherStore.setState({ units: "imperial" });

    render(<WeatherDisplay />, { wrapper: Wrapper });

    await waitFor(() => {
      expect(screen.getByText("London, GB")).toBeInTheDocument();
    });
    expect(screen.getByText(/16°F/)).toBeInTheDocument();
    expect(screen.getByText(/mph/)).toBeInTheDocument();
  });

  it("shows error state when city not found", async () => {
    server.use(
      http.get("/api/weather", () =>
        HttpResponse.json({ error: "City not found" }, { status: 404 }),
      ),
    );
    navState.city = "NoSuchCity";

    render(<WeatherDisplay />, { wrapper: Wrapper });

    await waitFor(() => {
      expect(screen.getByText("City not found")).toBeInTheDocument();
    });
  });

  it("shows error on server failure", async () => {
    server.use(
      http.get("/api/weather", () =>
        HttpResponse.json({ error: "Internal server error" }, { status: 500 }),
      ),
    );
    navState.city = "London";

    render(<WeatherDisplay />, { wrapper: Wrapper });

    await waitFor(() => {
      expect(screen.getByText("Internal server error")).toBeInTheDocument();
    });
  });
});
