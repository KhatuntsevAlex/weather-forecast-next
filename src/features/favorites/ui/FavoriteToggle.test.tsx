import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { navState } from "@/__tests__/setup";
import { useWeatherStore } from "@/entities/weather";
import { useFavoritesStore } from "@/features/favorites/model/favoritesStore";
import { FavoriteToggle } from "@/features/favorites/ui/FavoriteToggle";

describe("FavoriteToggle", () => {
  beforeEach(() => {
    navState.city = "";
    useWeatherStore.setState({ coords: null, units: "metric" });
    useFavoritesStore.setState({ favorites: [] });
  });

  afterEach(() => {
    cleanup();
  });

  it("renders nothing when no city is selected", () => {
    const { container } = render(<FavoriteToggle />);

    expect(container.firstChild).toBeNull();
  });

  it("shows empty heart when city is not favorited", () => {
    navState.city = "London";

    render(<FavoriteToggle />);

    expect(screen.getByLabelText("Add to favorites")).toBeInTheDocument();
    expect(screen.getByText("🤍")).toBeInTheDocument();
  });

  it("shows filled heart when city is favorited", () => {
    navState.city = "London";
    useFavoritesStore.setState({ favorites: ["London"] });

    render(<FavoriteToggle />);

    expect(screen.getByLabelText("Remove from favorites")).toBeInTheDocument();
    expect(screen.getByText("❤️")).toBeInTheDocument();
  });

  it("adds city to favorites on click", async () => {
    const user = userEvent.setup();
    navState.city = "London";
    render(<FavoriteToggle />);

    await user.click(screen.getByLabelText("Add to favorites"));

    expect(useFavoritesStore.getState().favorites).toContain("London");
  });

  it("removes city from favorites on click", async () => {
    const user = userEvent.setup();
    navState.city = "London";
    useFavoritesStore.setState({ favorites: ["London"] });
    render(<FavoriteToggle />);

    await user.click(screen.getByLabelText("Remove from favorites"));

    expect(useFavoritesStore.getState().favorites).not.toContain("London");
  });
});
