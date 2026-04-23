"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UnitToggle } from "@/features/unit-toggle";
import { ThemeToggle } from "@/features/theme-toggle";
import { cn } from "@/shared/lib";

export function Header() {
  const pathname = usePathname();

  const navLink = (active: boolean) =>
    cn(
      "text-sm font-medium transition-colors",
      active
        ? "text-cyan-500 underline underline-offset-4"
        : "text-muted-foreground hover:text-foreground",
    );

  return (
    <header className="bg-background/80 border-border sticky top-0 isolate z-50 border-b backdrop-blur-xl will-change-[backdrop-filter]">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-2 px-3 sm:px-4">
        <Link href="/" className="group flex min-w-0 items-center gap-2">
          <span className="text-xl" aria-hidden="true">
            🌤️
          </span>
          <span className="text-foreground truncate font-bold transition-colors group-hover:text-cyan-500">
            <span className="hidden sm:inline">WeatherApp</span>
            <span className="sm:hidden">Weather</span>
          </span>
        </Link>

        <nav aria-label="Main navigation" className="flex items-center gap-2 sm:gap-4">
          <Link
            href="/"
            aria-current={pathname === "/" ? "page" : undefined}
            className={navLink(pathname === "/")}
          >
            Home
          </Link>
          <Link
            href="/favorites"
            aria-current={pathname === "/favorites" ? "page" : undefined}
            className={navLink(pathname === "/favorites")}
          >
            Favorites
          </Link>
          <UnitToggle />
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
