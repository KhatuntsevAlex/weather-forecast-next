"use client";

import { useSearchParams } from "next/navigation";

/**
 * Single source of truth for the current city is the URL's `?city=` param.
 * Client components read it via this hook; updates happen through
 * `router.push("/?city=...")` (see `useNavigateToCity`).
 */
export function useCurrentCity(): string {
  return useSearchParams().get("city") ?? "";
}
