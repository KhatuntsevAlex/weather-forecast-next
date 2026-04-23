"use client";

import { useForecast } from "@/entities/weather";
import { Card } from "@/shared/ui";
import { BarChart } from "./BarChart";
import type { Point } from "./chartConstants";
import { formatChartTime } from "./chartUtils";

// Must match CHART_RESERVED in WeatherDashboard.tsx so the dynamic loader
// placeholder and the rendered card occupy the same box — avoids CLS.
const RESERVED_HEIGHT = "min-h-[334px]";

export function RainChanceChart() {
  const { data: forecast } = useForecast();

  if (!forecast) return <Card animation="pulse" className={RESERVED_HEIGHT} />;

  const data: Point[] = forecast.forecast.slice(0, 8).map((item) => ({
    label: formatChartTime(item.dateTime),
    value: Math.round(item.pop * 100),
  }));

  return (
    <Card className={RESERVED_HEIGHT}>
      <h3 className="text-foreground mb-4 text-lg font-semibold">Precipitation Chance (24h)</h3>
      <BarChart
        data={data}
        domainMax={100}
        colorFor={(v) => (v > 50 ? "#00bfff" : "#6495ed")}
        formatValue={(v) => `${v}%`}
        ariaLabel={`Precipitation chance chart. Highest chance is ${Math.max(...data.map((d) => d.value))}%.`}
      />
    </Card>
  );
}
