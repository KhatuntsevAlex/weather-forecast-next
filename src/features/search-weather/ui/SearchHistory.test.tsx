import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { routerMock } from "@/__tests__/setup";
import { useHistoryStore } from "@/features/search-weather/model/historyStore";
import { SearchHistory } from "@/features/search-weather/ui/SearchHistory";

// Stub ResizeObserver (jsdom doesn't provide one).
class MockRO {
  observe = vi.fn();
  disconnect = vi.fn();
  unobserve = vi.fn();
}

describe("SearchHistory", () => {
  beforeEach(() => {
    vi.stubGlobal("ResizeObserver", MockRO);
    useHistoryStore.setState({
      history: [
        { city: "London", timestamp: 1 },
        { city: "Paris", timestamp: 2 },
      ],
      removedStack: [],
    });
    routerMock.push.mockClear();
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it("renders nothing when history is empty", () => {
    useHistoryStore.setState({ history: [], removedStack: [] });

    const { container } = render(<SearchHistory />);

    expect(container.firstChild).toBeNull();
  });

  it("renders a list item for each history entry", () => {
    render(<SearchHistory />);

    expect(screen.getByRole("button", { name: "London" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Paris" })).toBeInTheDocument();
  });

  it("navigates to city when clicked", async () => {
    const user = userEvent.setup();
    render(<SearchHistory />);

    await user.click(screen.getByRole("button", { name: "London" }));

    expect(routerMock.push).toHaveBeenCalledWith(
      expect.stringContaining("city=London"),
      expect.any(Object),
    );
  });

  it("removes a city from history", async () => {
    const user = userEvent.setup();
    render(<SearchHistory />);

    await user.click(screen.getByRole("button", { name: /remove london/i }));

    expect(useHistoryStore.getState().history.find((h) => h.city === "London")).toBeUndefined();
    expect(useHistoryStore.getState().removedStack[0]?.city).toBe("London");
  });

  it("exposes scroll controls", () => {
    render(<SearchHistory />);

    expect(screen.getByRole("button", { name: /scroll history left/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /scroll history right/i })).toBeInTheDocument();
  });
});
