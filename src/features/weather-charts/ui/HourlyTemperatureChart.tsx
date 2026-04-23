"use client";

import { useForecast, useWeatherStore } from "@/entities/weather";
import { Card } from "@/shared/ui";
import { AreaChart } from "./AreaChart";
import type { Point } from "./chartConstants";
import { formatChartTime } from "./chartUtils";

// Must match CHART_RESERVED in WeatherDashboard.tsx so the dynamic loader
// placeholder and the rendered card occupy the same box — avoids CLS.
const RESERVED_HEIGHT = "min-h-[334px]";

export function HourlyTemperatureChart() {
  const units = useWeatherStore((s) => s.units);
  const { data: forecast } = useForecast();

  if (!forecast) return <Card animation="pulse" className={RESERVED_HEIGHT} />;

  const data: Point[] = forecast.forecast.slice(0, 8).map((item) => ({
    label: formatChartTime(item.dateTime),
    value: Math.round(item.temperature),
  }));

  const unitLabel = units === "metric" ? "°C" : "°F";
  const temps = data.map((d) => d.value);

  return (
    <Card className={RESERVED_HEIGHT}>
      <h3 className="text-foreground mb-4 text-lg font-semibold">Temperature Trend (24h)</h3>
      <AreaChart
        data={data}
        stroke="#ffd700"
        fill="url(#tempGradient)"
        gradientId="tempGradient"
        formatValue={(v) => `${v}${unitLabel}`}
        ariaLabel={`Temperature chart for the next 24 hours. Temperatures range from ${Math.min(...temps)}${unitLabel} to ${Math.max(...temps)}${unitLabel}.`}
      />
    </Card>
  );
}
