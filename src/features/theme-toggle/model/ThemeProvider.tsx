"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";

export type Theme = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export const THEME_COOKIE = "theme";
export const THEME_RESOLVED_COOKIE = "theme-resolved";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

function writeCookie(name: string, value: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=${value}; path=/; max-age=${COOKIE_MAX_AGE}; samesite=lax`;
}

function applyTheme(resolved: ResolvedTheme) {
  const root = document.documentElement;
  root.classList.remove("light", "dark");
  root.classList.add(resolved);
  root.style.colorScheme = resolved;
}

// ---- useSyncExternalStore bindings for prefers-color-scheme ---------------

const MEDIA = "(prefers-color-scheme: dark)";

function subscribeSystemTheme(onChange: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const mql = window.matchMedia(MEDIA);
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
}

function getSystemThemeSnapshot(): ResolvedTheme {
  return window.matchMedia(MEDIA).matches ? "dark" : "light";
}

// --------------------------------------------------------------------------

export function ThemeProvider({
  children,
  initialTheme,
  initialResolvedTheme,
}: {
  children: React.ReactNode;
  initialTheme: Theme;
  initialResolvedTheme: ResolvedTheme;
}) {
  const [theme, setThemeState] = useState<Theme>(initialTheme);

  // Read system preference through an external store. On the server the
  // server snapshot is used (the cookie-derived fallback); on the client
  // React picks up the real OS value on the first commit without needing
  // an effect that calls setState.
  const systemTheme = useSyncExternalStore(
    subscribeSystemTheme,
    getSystemThemeSnapshot,
    () => initialResolvedTheme,
  );

  const resolvedTheme: ResolvedTheme = theme === "system" ? systemTheme : theme;

  // Sync DOM class + resolved-theme cookie with the latest resolved value.
  // DOM and cookies are external systems, so this is the intended use of
  // an effect (no cascading React state updates).
  useEffect(() => {
    applyTheme(resolvedTheme);
    writeCookie(THEME_RESOLVED_COOKIE, resolvedTheme);
  }, [resolvedTheme]);

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
    writeCookie(THEME_COOKIE, next);
  }, []);

  const value = useMemo(
    () => ({ theme, resolvedTheme, setTheme }),
    [theme, resolvedTheme, setTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return ctx;
}
