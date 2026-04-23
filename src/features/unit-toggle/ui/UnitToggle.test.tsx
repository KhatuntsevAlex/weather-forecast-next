import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useWeatherStore } from "@/entities/weather";
import { UnitToggle } from "@/features/unit-toggle/ui/UnitToggle";

describe("UnitToggle", () => {
  beforeEach(() => {
    useWeatherStore.setState({ units: "metric" });
  });

  afterEach(() => {
    cleanup();
  });

  it("renders °C when metric", () => {
    render(<UnitToggle />);

    expect(screen.getByRole("button")).toHaveTextContent("°C");
    expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "false");
  });

  it("renders °F when imperial", () => {
    useWeatherStore.setState({ units: "imperial" });

    render(<UnitToggle />);

    expect(screen.getByRole("button")).toHaveTextContent("°F");
    expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "true");
  });

  it("toggles units when clicked", async () => {
    const user = userEvent.setup();
    render(<UnitToggle />);

    await user.click(screen.getByRole("button"));

    expect(useWeatherStore.getState().units).toBe("imperial");

    await user.click(screen.getByRole("button"));

    expect(useWeatherStore.getState().units).toBe("metric");
  });
});
