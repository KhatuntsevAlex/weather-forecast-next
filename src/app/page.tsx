import { cookies } from "next/headers";
import { WeatherDashboard } from "@/widgets/weather-dashboard";
import { SwrFallbackProvider, UNITS_COOKIE, parseUnitsCookie } from "@/entities/weather";
import { fetchCurrentWeatherServer } from "@/entities/weather/api/fetchWeatherServer";

interface PageProps {
  searchParams: Promise<{ city?: string }>;
}

export default async function Home({ searchParams }: PageProps) {
  const { city } = await searchParams;
  const trimmedCity = city?.trim() ?? "";

  // Read the user's unit choice from a cookie so the SWR key we build on the
  // server matches the one the client's `useSWR` will produce (see
  // entities/weather/model/unitsCookie + features/unit-toggle).
  const cookieStore = await cookies();
  const units = parseUnitsCookie(cookieStore.get(UNITS_COOKIE)?.value);

  // Server-fetch current weather in parallel with the shell render so the
  // LCP element (city + temperature) is in the initial HTML. Forecast /
  // charts stay client-fetched — they aren't the LCP element and already
  // have reserved-space skeletons that avoid CLS.
  //
  // Caveat: `useWeatherStore` always initializes `units: "metric"` on both
  // server and client, so the SWR key built on the client matches the seed
  // key only when the cookie also says metric. Imperial users still get the
  // same (correct) client-fetched flow as before — no hydration mismatch,
  // but no LCP win until the store is made cookie-aware in a follow-up.
  const seed =
    trimmedCity && units === "metric"
      ? await fetchCurrentWeatherServer({ city: trimmedCity, units })
      : null;

  const dashboard = <WeatherDashboard initialCity={trimmedCity} />;

  if (!seed) return dashboard;

  return (
    <SwrFallbackProvider fallback={{ [seed.key]: seed.data }}>{dashboard}</SwrFallbackProvider>
  );
}
