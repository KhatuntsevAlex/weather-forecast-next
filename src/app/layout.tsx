import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { cookies } from "next/headers";
import {
  ThemeProvider,
  THEME_COOKIE,
  THEME_RESOLVED_COOKIE,
  type Theme,
  type ResolvedTheme,
} from "@/features/theme-toggle";
import { Header } from "@/widgets/header";
import { InstallPrompt } from "@/features/pwa";
import { AppToaster } from "@/shared/ui";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#0f1621",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://weather-forecast.app"),
  title: {
    default: "Weather Forecast",
    template: "%s — Weather Forecast",
  },
  description:
    "Real-time weather forecasts for any city in the world. Search, save favorites, and track weather with beautiful charts.",
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    title: "Weather Forecast",
    description: "Real-time weather forecasts for any city in the world",
    siteName: "Weather Forecast",
  },
  twitter: {
    card: "summary",
    title: "Weather Forecast",
    description: "Real-time weather forecasts for any city in the world",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Read theme from cookies so the server can render the correct <html>
  // class on first paint — no inline bootstrap script, no FOUC, and no
  // React 19 "Encountered a script tag" warning.
  const cookieStore = await cookies();
  const storedTheme = cookieStore.get(THEME_COOKIE)?.value;
  const storedResolved = cookieStore.get(THEME_RESOLVED_COOKIE)?.value;
  const initialTheme: Theme =
    storedTheme === "light" || storedTheme === "dark" || storedTheme === "system"
      ? storedTheme
      : "dark";
  const initialResolvedTheme: ResolvedTheme =
    storedResolved === "light"
      ? "light"
      : storedResolved === "dark"
        ? "dark"
        : initialTheme === "light"
          ? "light"
          : "dark";

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${initialResolvedTheme} h-full antialiased`}
      style={{ colorScheme: initialResolvedTheme }}
      suppressHydrationWarning
    >
      {/* Preconnect to the OpenWeatherMap icon CDN so the TLS handshake for
          the first weather icon is not in the critical path of LCP. */}
      <link rel="preconnect" href="https://openweathermap.org" crossOrigin="" />
      <link rel="dns-prefetch" href="https://openweathermap.org" />
      <body className="bg-background text-foreground flex min-h-full flex-col">
        <ThemeProvider initialTheme={initialTheme} initialResolvedTheme={initialResolvedTheme}>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:rounded-lg focus:bg-cyan-500 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white"
          >
            Skip to content
          </a>
          <Header />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <footer className="border-border text-muted-foreground mt-auto border-t py-4 text-center text-xs">
            <p>
              &copy; {new Date().getFullYear()} Weather Forecast &middot; Data from{" "}
              <a
                href="https://openweathermap.org"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground underline"
              >
                OpenWeatherMap
              </a>
            </p>
          </footer>
          <InstallPrompt />
          <AppToaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
