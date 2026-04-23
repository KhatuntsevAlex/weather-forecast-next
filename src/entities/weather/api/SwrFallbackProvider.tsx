"use client";

import { SWRConfig } from "swr";

interface SwrFallbackProviderProps {
  fallback: Record<string, unknown>;
  children: React.ReactNode;
}

/**
 * Client-side wrapper that seeds SWR's cache with server-fetched data. The
 * RSC page renders this with fallback keyed by the same URL `useSWR` will
 * request, so the first client render returns data synchronously — no
 * loading skeleton, and the LCP element is already in the initial HTML.
 */
export function SwrFallbackProvider({ fallback, children }: SwrFallbackProviderProps) {
  return <SWRConfig value={{ fallback }}>{children}</SWRConfig>;
}
