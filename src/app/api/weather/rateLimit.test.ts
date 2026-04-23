import { describe, it, expect, beforeEach } from "vitest";
import {
  checkRateLimit,
  getClientKey,
  RATE_LIMIT,
  __resetRateLimit,
} from "@/app/api/weather/rateLimit";

describe("checkRateLimit", () => {
  beforeEach(() => {
    __resetRateLimit();
  });

  it("allows the first request and decrements remaining", () => {
    const now = 1_000_000;
    const result = checkRateLimit("ip-a", now);

    expect(result.ok).toBe(true);
    expect(result.remaining).toBe(RATE_LIMIT.MAX_REQUESTS - 1);
    expect(result.resetAt).toBe(now + RATE_LIMIT.WINDOW_MS);
  });

  it("blocks when the per-IP limit is exceeded", () => {
    const now = 1_000_000;
    for (let i = 0; i < RATE_LIMIT.MAX_REQUESTS; i += 1) {
      checkRateLimit("ip-a", now);
    }

    const result = checkRateLimit("ip-a", now);

    expect(result.ok).toBe(false);
    expect(result.remaining).toBe(0);
  });

  it("resets the counter after the window passes", () => {
    const first = checkRateLimit("ip-a", 1_000);
    const second = checkRateLimit("ip-a", 1_000 + RATE_LIMIT.WINDOW_MS + 1);

    expect(first.ok).toBe(true);
    expect(second.ok).toBe(true);
    expect(second.remaining).toBe(RATE_LIMIT.MAX_REQUESTS - 1);
  });

  it("tracks separate IPs independently", () => {
    const now = 1_000_000;
    for (let i = 0; i < RATE_LIMIT.MAX_REQUESTS; i += 1) {
      checkRateLimit("ip-a", now);
    }

    const blocked = checkRateLimit("ip-a", now);
    const fresh = checkRateLimit("ip-b", now);

    expect(blocked.ok).toBe(false);
    expect(fresh.ok).toBe(true);
  });
});

describe("getClientKey", () => {
  it("returns the first IP from x-forwarded-for", () => {
    const req = new Request("http://localhost", {
      headers: { "x-forwarded-for": "203.0.113.1, 10.0.0.1" },
    });

    expect(getClientKey(req)).toBe("203.0.113.1");
  });

  it("falls back to x-real-ip", () => {
    const req = new Request("http://localhost", {
      headers: { "x-real-ip": "203.0.113.9" },
    });

    expect(getClientKey(req)).toBe("203.0.113.9");
  });

  it('returns "unknown" without identifying headers', () => {
    const req = new Request("http://localhost");

    expect(getClientKey(req)).toBe("unknown");
  });
});
