import type { Theme, ResolvedTheme } from "./ThemeProvider";

const THEMES: readonly Theme[] = ["light", "dark", "system"];
const RESOLVED_THEMES: readonly ResolvedTheme[] = ["light", "dark"];

export const DEFAULT_THEME: Theme = "dark";
export const DEFAULT_RESOLVED_THEME: ResolvedTheme = "dark";

export function parseTheme(value: string | undefined): Theme {
  return (THEMES as readonly string[]).includes(value ?? "") ? (value as Theme) : DEFAULT_THEME;
}

export function parseResolvedTheme(value: string | undefined, fallbackFrom: Theme): ResolvedTheme {
  if ((RESOLVED_THEMES as readonly string[]).includes(value ?? "")) {
    return value as ResolvedTheme;
  }
  return fallbackFrom === "light" ? "light" : DEFAULT_RESOLVED_THEME;
}
