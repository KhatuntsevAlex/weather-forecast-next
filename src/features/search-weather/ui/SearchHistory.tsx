"use client";

import { useRef, useState } from "react";
import { useHistoryStore } from "@/features/search-weather/model/historyStore";
import { useNavigateToCity } from "@/features/search-weather/hooks/useNavigateToCity";
import { cn, useHydrated } from "@/shared/lib";
import { toast } from "sonner";

const SCROLL_STEP = 240;

export function SearchHistory() {
  const history = useHistoryStore((s) => s.history);
  const removeCity = useHistoryStore((s) => s.removeCity);
  const undoRemove = useHistoryStore((s) => s.undoRemove);
  const navigateToCity = useNavigateToCity();

  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const roRef = useRef<ResizeObserver | null>(null);
  const animRef = useRef(0);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  // Avoid SSR/CSR mismatch: zustand persist rehydrates history on the
  // client. Render nothing until mounted so the first client render
  // matches the (empty) server render.
  const hydrated = useHydrated();

  const updateArrows = () => {
    const el = scrollerRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 1);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  const scrollerCb = (el: HTMLDivElement | null) => {
    scrollerRef.current = el;
    roRef.current?.disconnect();
    if (!el) return;
    const ro = new ResizeObserver(updateArrows);
    ro.observe(el);
    if (el.firstElementChild) ro.observe(el.firstElementChild);
    roRef.current = ro;
    updateArrows();
  };

  if (!hydrated || !history.length) return null;

  const handleRemove = (e: React.MouseEvent, city: string) => {
    e.stopPropagation();
    removeCity(city);
    toast("City removed from history", {
      action: {
        label: "Undo",
        onClick: () => undoRemove(),
      },
      duration: 5000,
    });
  };

  const scrollBy = (delta: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    cancelAnimationFrame(animRef.current);
    const start = el.scrollLeft;
    const target = Math.max(0, Math.min(start + delta, el.scrollWidth - el.clientWidth));
    const duration = 300;
    let t0: number;
    const step = (ts: number) => {
      if (!t0) t0 = ts;
      const progress = Math.min((ts - t0) / duration, 1);
      const ease = 1 - (1 - progress) ** 3; // easeOutCubic
      el.scrollLeft = start + (target - start) * ease;
      if (progress < 1) animRef.current = requestAnimationFrame(step);
    };
    animRef.current = requestAnimationFrame(step);
  };

  return (
    <div className="w-full">
      <h2
        id="search-history-heading"
        className="text-muted-foreground mb-2 text-center text-sm font-medium"
      >
        Recent searches
      </h2>
      <div className="relative flex justify-center">
        {/* Left arrow */}
        <button
          type="button"
          onClick={() => scrollBy(-SCROLL_STEP)}
          aria-label="Scroll history left"
          aria-controls="search-history-list"
          className={cn(
            "absolute top-1/2 left-1 z-10 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full",
            "bg-surface/90 border-border text-muted-foreground border backdrop-blur",
            "hover:bg-surface-hover hover:text-foreground hover:border-border-hover",
            "cursor-pointer transition-all duration-200",
            canLeft ? "opacity-100" : "pointer-events-none opacity-0",
          )}
        >
          ‹
        </button>
        <div
          ref={scrollerCb}
          onScroll={updateArrows}
          className="max-w-full overflow-x-auto px-10 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          style={{
            maskImage: `linear-gradient(to right, ${canLeft ? "transparent 0%, rgba(0,0,0,0.3) 8%, black 20%" : "black 0%"}, black ${canRight ? "80%" : "100%"}${canRight ? ", rgba(0,0,0,0.3) 92%, transparent 100%" : ""})`,
            WebkitMaskImage: `linear-gradient(to right, ${canLeft ? "transparent 0%, rgba(0,0,0,0.3) 8%, black 20%" : "black 0%"}, black ${canRight ? "80%" : "100%"}${canRight ? ", rgba(0,0,0,0.3) 92%, transparent 100%" : ""})`,
            transition: "mask-image 200ms, -webkit-mask-image 200ms",
          }}
        >
          <ul
            id="search-history-list"
            aria-labelledby="search-history-heading"
            className="m-0 flex w-max list-none gap-2 p-0"
          >
            {history.map((item) => (
              <li
                key={item.city}
                className="group bg-surface border-border text-muted-foreground hover:bg-surface-hover hover:text-foreground hover:border-border-hover flex shrink-0 items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm whitespace-nowrap transition-colors duration-150"
              >
                <button
                  onClick={() => navigateToCity(item.city)}
                  className="cursor-pointer border-none bg-transparent p-0 text-inherit"
                >
                  {item.city}
                </button>
                <button
                  onClick={(e) => handleRemove(e, item.city)}
                  className="text-muted ml-1 flex h-5 w-5 cursor-pointer items-center justify-center rounded-full border-none bg-transparent p-0 text-base leading-none transition-colors hover:bg-red-500/10 hover:text-red-400"
                  aria-label={`Remove ${item.city}`}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        </div>
        {/* Right arrow */}
        <button
          type="button"
          onClick={() => scrollBy(SCROLL_STEP)}
          aria-label="Scroll history right"
          aria-controls="search-history-list"
          className={cn(
            "absolute top-1/2 right-1 z-10 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full",
            "bg-surface/90 border-border text-muted-foreground border backdrop-blur",
            "hover:bg-surface-hover hover:text-foreground hover:border-border-hover",
            "cursor-pointer transition-all duration-200",
            canRight ? "opacity-100" : "pointer-events-none opacity-0",
          )}
        >
          ›
        </button>
      </div>
    </div>
  );
}
