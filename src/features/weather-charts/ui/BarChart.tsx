"use client";

import { useState } from "react";
import { H, INNER_H, INNER_W, PAD_L, PAD_R, PAD_T, W, type Point } from "./chartConstants";
import { gridLines } from "./chartUtils";
import { Tooltip } from "./Tooltip";

interface BarChartProps {
  data: Point[];
  colorFor: (v: number) => string;
  formatValue: (v: number) => string;
  ariaLabel: string;
  domainMax: number;
}

export function BarChart({ data, colorFor, formatValue, ariaLabel, domainMax }: BarChartProps) {
  const [hover, setHover] = useState<number | null>(null);
  if (!data.length) return null;

  const slot = INNER_W / data.length;
  const barWidth = slot * 0.7;
  const x = (i: number) => PAD_L + i * slot;
  const y = (v: number) => PAD_T + INNER_H - (v / domainMax) * INNER_H;

  const tooltipLeft = hover !== null ? x(hover) + slot / 2 : 0;
  const visible = hover !== null;

  return (
    <div role="img" aria-label={ariaLabel} className="relative w-full">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        height="240"
        className="block"
        preserveAspectRatio="none"
        onMouseLeave={() => setHover(null)}
      >
        {gridLines(0, domainMax).map((v) => (
          <g key={v}>
            <line
              x1={PAD_L}
              x2={W - PAD_R}
              y1={y(v)}
              y2={y(v)}
              stroke="var(--chart-grid)"
              strokeDasharray="3 3"
            />
            <text
              x={PAD_L - 6}
              y={y(v)}
              dy="0.35em"
              textAnchor="end"
              fontSize="11"
              fill="var(--chart-axis)"
            >
              {formatValue(Math.round(v))}
            </text>
          </g>
        ))}
        {/* Per-bar full-height highlight — no transition, shown only when cursor is in range */}
        {hover !== null && (
          <rect
            x={x(hover) + (slot - barWidth) / 2 - barWidth * 0.15}
            y={PAD_T}
            width={barWidth * 1.3}
            height={INNER_H}
            rx="3"
            fill="currentColor"
            pointerEvents="none"
            style={{ color: "var(--chart-axis)", opacity: 0.12 }}
          />
        )}
        {data.map((d, i) => {
          const bx = x(i) + (slot - barWidth) / 2;
          const by = y(d.value);
          const bh = PAD_T + INNER_H - by;
          return (
            <g key={i}>
              <rect
                x={bx}
                y={by}
                width={barWidth}
                height={bh}
                fill={colorFor(d.value)}
                rx="3"
                pointerEvents="none"
              />
              {/* Full-height hit area for this column */}
              <rect
                x={x(i)}
                y={PAD_T}
                width={slot}
                height={INNER_H}
                fill="transparent"
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
                style={{ cursor: "default" }}
              />
              <text
                x={x(i) + slot / 2}
                y={H - 10}
                textAnchor="middle"
                fontSize="11"
                fill="var(--chart-axis)"
              >
                {d.value > 0 || i % 2 === 0 ? d.label : ""}
              </text>
            </g>
          );
        })}
      </svg>
      <Tooltip
        leftPct={(tooltipLeft / W) * 100}
        label={hover !== null ? data[hover].label : ""}
        value={hover !== null ? formatValue(data[hover].value) : ""}
        visible={visible}
      />
    </div>
  );
}
