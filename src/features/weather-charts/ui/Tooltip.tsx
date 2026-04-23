"use client";

import { cn } from "@/shared/lib";
import { SMOOTH_MS } from "./chartConstants";

interface TooltipProps {
  leftPct: number;
  label: string;
  value: string;
  visible: boolean;
  instant?: boolean;
}

export function Tooltip({ leftPct, label, value, visible, instant = false }: TooltipProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute top-0 -translate-x-1/2",
        "rounded-md px-2 py-1 text-xs font-medium whitespace-nowrap shadow-lg",
        "border border-[var(--chart-tooltip-border)] bg-[var(--chart-tooltip-bg)]",
        "text-[var(--chart-tooltip-color)]",
      )}
      style={{
        left: `${leftPct}%`,
        opacity: visible ? 1 : 0,
        transition: instant
          ? `opacity ${SMOOTH_MS}ms`
          : `left ${SMOOTH_MS}ms cubic-bezier(0.4,0,0.2,1), opacity ${SMOOTH_MS}ms`,
      }}
    >
      <div className="opacity-70">{label}</div>
      <div>{value}</div>
    </div>
  );
}
