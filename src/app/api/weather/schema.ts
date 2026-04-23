import { z } from "zod";

// City names: letters (incl. unicode), spaces, hyphens, apostrophes, commas, dots.
// Forbid CR/LF and other control characters explicitly.
const CITY_REGEX = /^[\p{L}\p{M}][\p{L}\p{M}\s'’,.\-]{0,99}$/u;

export const citySchema = z.string().trim().min(1).max(100).regex(CITY_REGEX, "Invalid city name");

export const weatherQuerySchema = z.object({
  type: z.enum(["current", "forecast"]),
  city: citySchema.optional(),
  lat: z.coerce.number().min(-90).max(90).optional(),
  lon: z.coerce.number().min(-180).max(180).optional(),
  units: z.enum(["metric", "imperial"]).default("metric"),
});

export type WeatherQuery = z.infer<typeof weatherQuerySchema>;
