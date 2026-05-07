import { z } from "zod";

const envSchema = z.object({
  OPENWEATHER_API_KEY: z.string().min(1, "OPENWEATHER_API_KEY must be set").optional(),
  OPENWEATHER_BASE_URL: z
    .url("OPENWEATHER_BASE_URL must be a valid URL")
    .default("https://api.openweathermap.org/data/2.5"),
  SITE_URL: z.url("SITE_URL must be a valid URL").optional(),
  NEXT_PUBLIC_SITE_URL: z.url("NEXT_PUBLIC_SITE_URL must be a valid URL").optional(),
  TRUST_PROXY: z.enum(["0", "1"]).default("0"),
  VERCEL: z.enum(["0", "1"]).optional(),
  VERCEL_URL: z.string().optional(),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

export type Env = z.infer<typeof envSchema>;

export function getValidatedEnv(env = process.env): Env {
  return envSchema.parse(env);
}

export function getSiteUrl(env = getValidatedEnv()): string {
  return (
    env.SITE_URL ??
    env.NEXT_PUBLIC_SITE_URL ??
    (env.VERCEL_URL ? `https://${env.VERCEL_URL}` : "http://localhost:3000")
  );
}

export function shouldTrustProxy(env = getValidatedEnv()): boolean {
  return env.TRUST_PROXY === "1" || env.VERCEL === "1" || env.NODE_ENV === "test";
}
