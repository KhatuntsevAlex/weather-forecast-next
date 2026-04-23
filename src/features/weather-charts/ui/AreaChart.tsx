"use client";

import { useRef, useState } from "react";
import { H, INNER_H, INNER_W, PAD_L, PAD_R, PAD_T, W, type Point } from "./chartConstants";
import { gridLines, niceRange, smoothLinePath } from "./chartUtils";
import { Tooltip } from "./Tooltip";

interface AreaChartProps {
  data: Point[];
  stroke: string;
  fill: string;
  gradientId: string;
  formatValue: (v: number) => string;
  ariaLabel: string;
}

export function AreaChart({
  data,
  stroke,
  fill,
  gradientId,
  formatValue,
  ariaLabel,
}: AreaChartProps) {
  const [hover, setHover] = useState<number | null>(null);
  const [cursor, setCursor] = useState<{ x: number; y: number } | null>(null);
  const pathRef = useRef<SVGPathElement | null>(null);

  if (!data.length) return null;

  const values = data.map((d) => d.value);
  const [lo, hi] = niceRange(Math.min(...values), Math.max(...values));
  const range = hi - lo;

  const x = (i: number) => PAD_L + (i * INNER_W) / Math.max(data.length - 1, 1);
  const y = (v: number) => PAD_T + INNER_H - ((v - lo) / range) * INNER_H;

  const coords = data.map((d, i) => ({ x: x(i), y: y(d.value) }));
  const linePath = smoothLinePath(coords);
  const areaPath = `${linePath} L${x(data.length - 1)},${PAD_T + INNER_H} L${x(0)},${PAD_T + INNER_H} Z`;

  // Binary-search the smooth path for the Y at a given target X.
  const yAtPathX = (targetX: number): number => {
    const p = pathRef.current;
    if (!p) return PAD_T + INNER_H / 2;
    const total = p.getTotalLength();
    let lo2 = 0;
    let hi2 = total;
    for (let i = 0; i < 20; i++) {
      const mid = (lo2 + hi2) / 2;
      const pt = p.getPointAtLength(mid);
      if (pt.x < targetX) lo2 = mid;
      else hi2 = mid;
    }
    return p.getPointAtLength((lo2 + hi2) / 2).y;
  };

  const onMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * W;
    const clampedPx = Math.max(PAD_L, Math.min(PAD_L + INNER_W, px));
    setCursor({ x: clampedPx, y: yAtPathX(clampedPx) });
    const i = Math.round(((px - PAD_L) / INNER_W) * (data.length - 1));
    setHover(Math.max(0, Math.min(data.length - 1, i)));
  };

  const onLeave = () => {
    setHover(null);
    setCursor(null);
  };

  const visible = cursor !== null;

  return (
    <div role="img" aria-label={ariaLabel} className="relative w-full">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        height="240"
        className="block"
        preserveAspectRatio="none"
        onMouseMove={onMove}
        onMouseLeave={onLeave}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={stroke} stopOpacity="0.5" />
            <stop offset="100%" stopColor={stroke} stopOpacity="0" />
          </linearGradient>
        </defs>
        {gridLines(lo, hi).map((v) => (
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
        <path d={areaPath} fill={fill} />
        <path
          ref={pathRef}
          d={linePath}
          fill="none"
          stroke={stroke}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {data.map((d, i) => (
          <text
            key={i}
            x={x(i)}
            y={H - 10}
            textAnchor="middle"
            fontSize="11"
            fill="var(--chart-axis)"
          >
            {d.label}
          </text>
        ))}
        {/* Vertical cursor line — follows cursor exactly, no transition */}
        {visible && (
          <line
            pointerEvents="none"
            x1={cursor!.x}
            x2={cursor!.x}
            y1={PAD_T}
            y2={PAD_T + INNER_H}
            stroke="var(--chart-axis)"
            strokeDasharray="2 2"
            opacity="0.5"
          />
        )}
        {/* Indicator dot — rides the curve at cursor X, no transition */}
        {visible && (
          <circle pointerEvents="none" cx={cursor!.x} cy={cursor!.y} r="4" fill={stroke} />
        )}
      </svg>
      <Tooltip
        leftPct={cursor !== null ? (cursor.x / W) * 100 : 0}
        label={hover !== null ? data[hover].label : ""}
        value={hover !== null ? formatValue(data[hover].value) : ""}
        visible={visible}
        instant
      />
    </div>
  );
}
