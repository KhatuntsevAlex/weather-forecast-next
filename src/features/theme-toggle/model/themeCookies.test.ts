import { describe, expect, it } from "vitest";
import {
  DEFAULT_RESOLVED_THEME,
  DEFAULT_THEME,
  parseResolvedTheme,
  parseTheme,
} from "./themeCookies";

describe("parseTheme", () => {
  it.each(["light", "dark", "system"] as const)("accepts %s", (value) => {
    expect(parseTheme(value)).toBe(value);
  });

  it.each([undefined, "", "bogus", "LIGHT", " dark "])(
    "falls back to the default for %p",
    (value) => {
      expect(parseTheme(value)).toBe(DEFAULT_THEME);
    },
  );
});

describe("parseResolvedTheme", () => {
  it.each(["light", "dark"] as const)("accepts %s regardless of fallback", (value) => {
    expect(parseResolvedTheme(value, "system")).toBe(value);
    expect(parseResolvedTheme(value, "light")).toBe(value);
    expect(parseResolvedTheme(value, "dark")).toBe(value);
  });

  it("derives 'light' from the Theme when the cookie is missing and theme is 'light'", () => {
    expect(parseResolvedTheme(undefined, "light")).toBe("light");
  });

  it.each(["dark", "system"] as const)(
    "falls back to the default when the cookie is missing and theme is %s",
    (theme) => {
      expect(parseResolvedTheme(undefined, theme)).toBe(DEFAULT_RESOLVED_THEME);
    },
  );

  it("rejects invalid cookie values and uses the fallback", () => {
    expect(parseResolvedTheme("system", "light")).toBe("light");
    expect(parseResolvedTheme("bogus", "system")).toBe(DEFAULT_RESOLVED_THEME);
    expect(parseResolvedTheme("", "dark")).toBe(DEFAULT_RESOLVED_THEME);
  });
});
