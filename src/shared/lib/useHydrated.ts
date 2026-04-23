"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

/**
 * Returns `false` on the server and during the initial client render, then
 * `true` once the component has mounted on the client. Use this to gate UI
 * that depends on client-only state (e.g. zustand persist) and would
 * otherwise cause an SSR/CSR hydration mismatch.
 *
 * Implemented with `useSyncExternalStore` so it does not require a
 * `useEffect` + `setState`, which React 19 flags as a cascading render.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
