/// <reference lib="webworker" />
import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { Serwist, StaleWhileRevalidate, ExpirationPlugin } from "serwist";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope & typeof globalThis;

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: [
    // API weather data: serve stale, revalidate in background
    {
      matcher: ({ url }) => url.pathname.startsWith("/api/weather"),
      handler: new StaleWhileRevalidate({
        cacheName: "weather-api-cache",
        plugins: [
          new ExpirationPlugin({
            maxEntries: 50,
            maxAgeSeconds: 60 * 10, // 10 minutes
          }),
        ],
      }),
    },
    // Keep Serwist defaults for everything else
    ...defaultCache,
  ],
});

serwist.addEventListeners();
