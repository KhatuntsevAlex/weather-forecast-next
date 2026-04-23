import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, cleanup, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SWRConfig } from "swr";
import { routerMock } from "@/__tests__/setup";
import { useFavoritesStore } from "@/features/favorites/model/favoritesStore";
import { useHistoryStore } from "@/features/search-weather";
import { useWeatherStore } from "@/entities/weather";
import { FavoritesList } from "@/features/favorites/ui/FavoritesList";

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

describe("FavoritesList", () => {
  beforeEach(() => {
    useFavoritesStore.setState({ favorites: [] });
    useHistoryStore.setState({ history: [], removedStack: [] });
    useWeatherStore.setState({ coords: null, units: "metric" });
    routerMock.push.mockClear();
  });

  afterEach(() => {
    cleanup();
  });

  it("shows the empty state when no favorites", () => {
    render(
      <Wrapper>
        <FavoritesList />
      </Wrapper>,
    );

    expect(screen.getByText("No favorites yet")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /search weather/i })).toBeInTheDocument();
  });

  it("renders a card per favorite city", async () => {
    useFavoritesStore.setState({ favorites: ["London"] });

    render(
      <Wrapper>
        <FavoritesList />
      </Wrapper>,
    );

    await waitFor(() => {
      expect(screen.getByText(/London, GB/)).toBeInTheDocument();
    });
  });

  it("navigates when a favorite card is clicked", async () => {
    useFavoritesStore.setState({ favorites: ["London"] });
    const user = userEvent.setup();

    render(
      <Wrapper>
        <FavoritesList />
      </Wrapper>,
    );

    await waitFor(() => {
      expect(screen.getByText(/London, GB/)).toBeInTheDocument();
    });

    await user.click(screen.getByRole("link", { name: /London/i }));

    expect(routerMock.push).toHaveBeenCalled();
    expect(useHistoryStore.getState().history[0]?.city).toBe("London");
  });
});
