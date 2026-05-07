import { shouldTrustProxy } from "@/shared/lib";

// Simple in-memory sliding-window rate limiter keyed by client identifier.
// Suitable for a single Node process / small deployment; replace with
// Redis/Upstash for multi-instance production use.

const WINDOW_MS = 60_000;
const MAX_REQUESTS = 60; // per IP per minute
const MAX_KEYS = 10_000; // bound memory

type Entry = { count: number; resetAt: number };
const buckets = new Map<string, Entry>();

export interface RateLimitResult {
  ok: boolean;
  remaining: number;
  resetAt: number;
}

export function checkRateLimit(key: string, now = Date.now()): RateLimitResult {
  // Opportunistic cleanup when the map grows too large.
  if (buckets.size > MAX_KEYS) {
    for (const [k, v] of buckets) {
      if (v.resetAt <= now) buckets.delete(k);
    }
  }

  const entry = buckets.get(key);
  if (!entry || entry.resetAt <= now) {
    const resetAt = now + WINDOW_MS;
    buckets.set(key, { count: 1, resetAt });
    return { ok: true, remaining: MAX_REQUESTS - 1, resetAt };
  }

  if (entry.count >= MAX_REQUESTS) {
    return { ok: false, remaining: 0, resetAt: entry.resetAt };
  }

  entry.count += 1;
  return { ok: true, remaining: MAX_REQUESTS - entry.count, resetAt: entry.resetAt };
}

export function getClientKey(request: Request): string {
  if (shouldTrustProxy()) {
    const fwd = request.headers.get("x-forwarded-for");
    if (fwd) return fwd.split(",")[0]!.trim();
    const real = request.headers.get("x-real-ip");
    if (real) return real.trim();
  }
  return "unknown";
}

// Test-only helper
export function __resetRateLimit() {
  buckets.clear();
}

export const RATE_LIMIT = { WINDOW_MS, MAX_REQUESTS };
