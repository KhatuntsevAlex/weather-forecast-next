import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, waitFor, cleanup } from "@testing-library/react";
import { SWRConfig } from "swr";
import { navState } from "@/__tests__/setup";
import { useWeatherStore } from "@/entities/weather";
import { ForecastDisplay } from "@/features/forecast-display/ui/ForecastDisplay";

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

describe("ForecastDisplay", () => {
  beforeEach(() => {
    navState.city = "";
    useWeatherStore.setState({ coords: null, units: "metric" });
  });

  afterEach(() => {
    cleanup();
  });

  it("renders a reserved-size placeholder when no city is set", () => {
    const { container } = render(<ForecastDisplay />, { wrapper: Wrapper });

    // The component renders an empty Card to reserve layout space and avoid
    // CLS. It must not contain any forecast content.
    expect(container.firstChild).not.toBeNull();
    expect(screen.queryByText("5-Day Forecast")).not.toBeInTheDocument();
  });

  it("shows loading skeleton when fetching", () => {
    navState.city = "London";

    const { container } = render(<ForecastDisplay />, { wrapper: Wrapper });

    expect(container.querySelector(".animate-pulse")).toBeInTheDocument();
  });

  it("renders 5-day forecast heading after data loads", async () => {
    navState.city = "London";

    render(<ForecastDisplay />, { wrapper: Wrapper });

    await waitFor(() => {
      expect(screen.getByText("5-Day Forecast")).toBeInTheDocument();
    });
  });
});
