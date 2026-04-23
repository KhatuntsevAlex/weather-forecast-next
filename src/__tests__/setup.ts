import "@testing-library/jest-dom/vitest";
// Install localStorage mock FIRST so Zustand `persist` middleware captures
// the mocked storage when stores are imported below.
import "./localStorage";
import { afterAll, afterEach, beforeAll, beforeEach, vi } from "vitest";
import { server } from "./mocks/server";
import { __resetNavigateRateLimit } from "@/features/search-weather";

// ── next/navigation mock ─────────────────────────────────────
// Tests can mutate `navState.city` to simulate URL changes, and inspect
// `routerMock.push` / `routerMock.replace` to assert navigation.
export const navState: { city: string } = { city: "" };
export const routerMock = {
  push: vi.fn(),
  replace: vi.fn(),
  refresh: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
  prefetch: vi.fn(),
};

vi.mock("next/navigation", () => ({
  useRouter: () => routerMock,
  usePathname: () => "/",
  useSearchParams: () =>
    new URLSearchParams(navState.city ? `city=${encodeURIComponent(navState.city)}` : ""),
}));

// ── MSW ──────────────────────────────────────────────────────
beforeAll(() => server.listen({ onUnhandledRequest: "bypass" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Reset module-level rate-limit state in useNavigateToCity between tests.
beforeEach(() => {
  __resetNavigateRateLimit();
});

// ── localStorage mock is set up in ./localStorage (imported at top). ─────
