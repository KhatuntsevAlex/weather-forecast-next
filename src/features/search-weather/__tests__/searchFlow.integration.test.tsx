import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SWRConfig } from "swr";
import { navState, routerMock } from "@/__tests__/setup";
import { useWeatherStore } from "@/entities/weather";
import { useHistoryStore } from "@/features/search-weather/model/historyStore";
import { SearchWeather } from "@/features/search-weather/ui/SearchWeather";
import { SearchHistory } from "@/features/search-weather/ui/SearchHistory";

function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0 }}>{children}</SWRConfig>
  );
}

describe("SearchWeather + SearchHistory (integration)", () => {
  beforeEach(() => {
    navState.city = "";
    routerMock.push.mockClear();
    routerMock.replace.mockClear();
    useWeatherStore.setState({ coords: null, units: "metric" });
    useHistoryStore.setState({ history: [], removedStack: [] });
  });

  afterEach(() => {
    cleanup();
  });

  it("adds searched city to history and navigates via URL", async () => {
    const user = userEvent.setup();
    render(
      <Wrapper>
        <SearchWeather />
        <SearchHistory />
      </Wrapper>,
    );

    await user.type(screen.getByPlaceholderText("Enter city name..."), "Paris");
    await user.click(screen.getByRole("button", { name: "Search" }));

    await waitFor(() => {
      expect(screen.getByText("Recent searches")).toBeInTheDocument();
    });
    expect(screen.getByText("Paris")).toBeInTheDocument();
    expect(routerMock.push).toHaveBeenCalledWith(
      "/?city=Paris",
      expect.objectContaining({ scroll: false }),
    );
  });

  it("clicking a history item navigates via URL", async () => {
    const user = userEvent.setup();
    useHistoryStore.setState({
      history: [
        { city: "Berlin", timestamp: Date.now() },
        { city: "Tokyo", timestamp: Date.now() - 1000 },
      ],
    });

    render(
      <Wrapper>
        <SearchHistory />
      </Wrapper>,
    );

    await user.click(screen.getByText("Tokyo"));

    expect(routerMock.push).toHaveBeenCalledWith(
      "/?city=Tokyo",
      expect.objectContaining({ scroll: false }),
    );
  });

  it("validates empty search input", async () => {
    const user = userEvent.setup();
    render(
      <Wrapper>
        <SearchWeather />
      </Wrapper>,
    );

    await user.click(screen.getByRole("button", { name: "Search" }));

    expect(screen.getByText("Please enter a city name")).toBeInTheDocument();
  });

  it("skips history duplication when searching for the same city case-insensitively", async () => {
    const user = userEvent.setup();
    navState.city = "London";
    useHistoryStore.setState({
      history: [{ city: "London", timestamp: Date.now() }],
    });

    render(
      <Wrapper>
        <SearchWeather />
        <SearchHistory />
      </Wrapper>,
    );

    const input = screen.getByPlaceholderText("Enter city name...");
    await user.clear(input);
    await user.type(input, "LONDON");
    await user.click(screen.getByRole("button", { name: "Search" }));

    // History should still have the original entry, not a duplicate
    const { history } = useHistoryStore.getState();
    expect(history).toHaveLength(1);
    expect(history[0].city).toBe("London");
  });
});
