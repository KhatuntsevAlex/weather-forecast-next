import { describe, it, expect, afterEach, vi, beforeEach } from "vitest";
import { render, screen, cleanup, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider, useTheme } from "@/features/theme-toggle/model/ThemeProvider";
import { ThemeToggle } from "@/features/theme-toggle/ui/ThemeToggle";

type MqListener = (e: { matches: boolean }) => void;

function stubMatchMedia(matches: boolean) {
  const listeners = new Set<MqListener>();
  const mql = {
    matches,
    media: "(prefers-color-scheme: dark)",
    addEventListener: (_type: string, cb: MqListener) => listeners.add(cb),
    removeEventListener: (_type: string, cb: MqListener) => listeners.delete(cb),
    dispatchEvent: () => true,
    addListener: () => {},
    removeListener: () => {},
    onchange: null,
  };
  Object.defineProperty(window, "matchMedia", {
    value: () => mql,
    configurable: true,
    writable: true,
  });
  return { mql, listeners };
}

describe("ThemeProvider", () => {
  beforeEach(() => {
    document.documentElement.className = "";
    document.cookie = "theme=; path=/; max-age=0";
    document.cookie = "theme-resolved=; path=/; max-age=0";
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("applies the initial resolved theme to the <html> element", () => {
    stubMatchMedia(false);

    render(
      <ThemeProvider initialTheme="dark" initialResolvedTheme="dark">
        <div />
      </ThemeProvider>,
    );

    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("resolves `system` to the current media query value", () => {
    stubMatchMedia(true);

    render(
      <ThemeProvider initialTheme="system" initialResolvedTheme="light">
        <ThemeToggle />
      </ThemeProvider>,
    );

    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("setTheme updates the DOM class and writes a cookie", async () => {
    stubMatchMedia(false);
    const user = userEvent.setup();

    function Harness() {
      const { theme, setTheme } = useTheme();
      return (
        <div>
          <span>current:{theme}</span>
          <button onClick={() => setTheme("dark")}>go dark</button>
        </div>
      );
    }

    render(
      <ThemeProvider initialTheme="light" initialResolvedTheme="light">
        <Harness />
      </ThemeProvider>,
    );

    await user.click(screen.getByText("go dark"));

    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(document.cookie).toContain("theme=dark");
  });

  it("useTheme throws when used outside provider", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});

    function Consumer() {
      useTheme();
      return null;
    }

    expect(() => render(<Consumer />)).toThrow(/useTheme must be used within a ThemeProvider/);
  });
});

describe("ThemeToggle", () => {
  beforeEach(() => {
    document.documentElement.className = "";
  });

  afterEach(() => {
    cleanup();
  });

  it("renders a placeholder on the server-rendered output (before hydration is detected)", () => {
    // useHydrated uses useSyncExternalStore; in tests the client snapshot
    // returns true immediately, so the button is present.
    stubMatchMedia(false);

    render(
      <ThemeProvider initialTheme="light" initialResolvedTheme="light">
        <ThemeToggle />
      </ThemeProvider>,
    );

    expect(screen.getByRole("button", { name: /switch to dark mode/i })).toBeInTheDocument();
  });

  it("toggles theme on click", async () => {
    stubMatchMedia(false);
    const user = userEvent.setup();

    render(
      <ThemeProvider initialTheme="light" initialResolvedTheme="light">
        <ThemeToggle />
      </ThemeProvider>,
    );

    const btn = screen.getByRole("button", { name: /switch to dark mode/i });

    await act(async () => {
      await user.click(btn);
    });

    expect(screen.getByRole("button", { name: /switch to light mode/i })).toBeInTheDocument();
  });
});
