# Weather Forecast

A production-ready PWA for real-time weather forecasts. Search any city, save favorites, view 5-day forecasts with interactive charts, and install on your device for offline access.

## Tech Stack

| Layer             | Tool                                                                                                        | Why                                                                                                                                                                                                                                                                 |
| ----------------- | ----------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Framework**     | [Next.js 16](https://nextjs.org) (App Router)                                                               | Server components, file-based routing, API routes, built-in image optimization, ISR — a single framework covers SSR, SSG, and API needs without a separate backend                                                                                                  |
| **Bundler**       | [Turbopack](https://turbo.build/pack)                                                                       | Ships with Next.js 16 as the default dev bundler; instant HMR and significantly faster cold starts than webpack                                                                                                                                                     |
| **Language**      | [TypeScript 5](https://www.typescriptlang.org)                                                              | Strict mode catches entire categories of bugs at compile time; first-class Next.js support                                                                                                                                                                          |
| **Styling**       | [Tailwind CSS 4](https://tailwindcss.com)                                                                   | Utility-first approach eliminates naming bikeshedding, produces minimal CSS via tree-shaking, v4 `@theme inline` collocates design tokens with styles                                                                                                               |
| **Data fetching** | [SWR 2](https://swr.vercel.app)                                                                             | Stale-while-revalidate out of the box, request deduplication, focus revalidation, and a tiny bundle (~4 kB) — ideal for client-side data that updates periodically                                                                                                  |
| **State**         | [Zustand 5](https://zustand.docs.pmnd.rs)                                                                   | Minimal boilerplate vs Redux, no providers/context needed, built-in `persist` middleware for localStorage — keeps weather, history, and favorites stores independent                                                                                                |
| **Validation**    | [Zod 4](https://zod.dev)                                                                                    | Runtime schema validation for API route query params; infers TypeScript types from schemas so the contract is defined once                                                                                                                                          |
| **Charts**        | Hand-rolled SVG                                                                                             | Two compact charts (`HourlyTemperatureChart`, `RainChanceChart`) are implemented as ~200 lines of pure SVG + React; lazy-loaded via `next/dynamic` so they stay out of the initial bundle. Avoids pulling in a ~200 kB charting library for a few dozen data points |
| **Toasts**        | [Sonner](https://sonner.emilkowal.dev)                                                                      | Accessible, animated toast notifications with zero config; used for undo on history removal                                                                                                                                                                         |
| **Fonts**         | [Geist](https://vercel.com/font) via `next/font`                                                            | Automatically self-hosted and subset by Next.js — no layout shift, no external requests                                                                                                                                                                             |
| **PWA**           | [Serwist 9](https://serwist.pages.dev) (`@serwist/next`)                                                    | Generates a service worker from a TypeScript source file; `StaleWhileRevalidate` caches `/api/weather` responses (10 min, 50 entries), `defaultCache` covers static assets; disabled in dev to avoid Turbopack conflicts                                            |
| **Unit tests**    | [Vitest 4](https://vitest.dev) + [Testing Library](https://testing-library.com) + [MSW 2](https://mswjs.io) | Vitest runs on the same Vite pipeline the project uses — fast, native ESM, compatible with jsdom. Testing Library enforces accessible queries. MSW intercepts `fetch` at the network level so API tests don't need manual mocking                                   |
| **E2E tests**     | [Playwright 1](https://playwright.dev)                                                                      | Cross-browser, auto-waits, API route interception, parallel test execution, built-in HTML reporter                                                                                                                                                                  |

### Why these tools (and not the usual alternatives)

Short rationale for the tools above, plus the dev/CI tooling. Every choice is **free or free for personal use** and MIT/Apache-2.0 licensed.

**Framework & build**

- **Next.js 16** over **Remix / Astro / Vite+React**: needed a full-stack framework with built-in API routes to proxy the OpenWeatherMap key server-side. Remix lacks first-class PWA/ISR helpers; Astro's React story is client-islands-oriented; plain Vite would require bolting on a separate backend.
- **Turbopack** over **webpack / Vite**: ships as the Next.js 16 default, faster cold starts, no config. Vite isn't an option inside Next.
- **TypeScript** over **Flow / JSDoc types**: strict mode + ecosystem support. Flow is effectively abandoned; JSDoc works but loses refinements and generics ergonomics.

**Styling & UI**

- **Tailwind v4** over **CSS Modules / styled-components / shadcn**: utility classes avoid naming bikeshedding, v4's `@theme inline` keeps tokens near styles, zero runtime. styled-components adds runtime cost and SSR friction; CSS Modules require more boilerplate for design tokens.
- **Sonner** over **react-hot-toast / react-toastify**: smallest bundle, best a11y defaults, native animations.
- **Geist via `next/font`** over **Google Fonts CDN / `@fontsource`**: self-hosted, subset automatically, no CLS, no third-party request.

**State & data**

- **Zustand** over **Redux Toolkit / Jotai / React Context**: no providers, tiny runtime, built-in `persist`. Redux Toolkit is overkill for 3 small stores; Jotai's atom model is overhead for non-atomic state; Context re-renders everything.
- **SWR** over **TanStack Query / Apollo / plain `fetch`**: smaller than React Query for the features we use (dedupe, focus revalidate, stale-while-revalidate). Apollo is GraphQL-specific. Plain `fetch` would reinvent caching/revalidation.
- **Zod** over **Yup / Valibot / io-ts**: best TS inference, largest ecosystem, Next.js's own examples use it. Valibot is lighter but less mature; io-ts has steeper syntax.

**PWA**

- **Serwist** over **next-pwa / workbox directly / Vite PWA**: `next-pwa` is unmaintained and webpack-only; Serwist is its maintained successor with native Turbopack support, TS-first, and the same Workbox strategies under the hood.

**Tests**

- **Vitest** over **Jest**: native ESM, same Vite pipeline as the app, faster, drop-in Jest-compatible API. Jest requires a Babel/SWC bridge and is slower cold.
- **Testing Library** over **Enzyme**: Enzyme is dead for React 18+; Testing Library forces accessibility-friendly queries.
- **MSW** over **`vi.mock("fetch")` / nock**: intercepts at the network layer so the code under test runs exactly like in production; reusable between Vitest and Playwright if needed.
- **Playwright** over **Cypress / WebdriverIO**: multi-browser in one runner, first-class API mocking (`page.route`), auto-waiting, parallel execution, free for OSS. Cypress requires paid dashboard for parallel runs and historically one-browser-per-run.

**Dev tooling**

- **Prettier** over **dprint / Biome formatter**: most battle-tested, tight Tailwind plugin, universal editor support. Biome is promising but its Tailwind support and plugin ecosystem lag.
- **ESLint (next-core-web-vitals)** over **Biome linter / xo**: Biome still lacks a chunk of React/Next rules; Next's own ESLint config ships Core Web Vitals checks.
- **eslint-plugin-boundaries** over **eslint-plugin-import (`no-restricted-paths`) / dependency-cruiser / nx-enforce-module-boundaries**: purpose-built for layered/sliced architectures with a declarative `from/allow` model; `no-restricted-paths` requires hand-written glob pairs per direction; `dependency-cruiser` is a separate binary with its own config; `nx-enforce-module-boundaries` is Nx-only.
- **husky** over **simple-git-hooks / lefthook**: widest docs, every contributor will recognise it. `simple-git-hooks` is lighter but drops multi-hook convenience; lefthook is fine but Go-based (extra runtime).
- **lint-staged** over **pretty-quick / git-format-staged**: actively maintained, matches husky's idiom, per-glob commands.
- **commitlint + @commitlint/config-conventional** over **gitlint / conform**: the de-facto standard, pairs naturally with release-please. gitlint is Python (extra runtime); conform is heavier.
- **Conventional Commits** as the commit grammar: produces deterministic changelogs and version bumps.
- **release-please** over **semantic-release / changesets**: no extra runtime config, uses a GitHub-native "Release PR" flow, zero secrets beyond `GITHUB_TOKEN`. `semantic-release` requires maintaining config + npm publish credentials; `changesets` is great for monorepos but adds per-PR `.changeset` files.
- **`next experimental-analyze`** (built-in Next 16 Turbopack analyzer) over **@next/bundle-analyzer / source-map-explorer**: `@next/bundle-analyzer` is webpack-only and silently no-ops under Turbopack (Next 16's default builder); the native command ships with Next, requires zero config, and serves an interactive UI (or writes to disk with `--output`).
- **Lighthouse CI (@lhci/cli)** over **PageSpeed Insights API / Calibre / SpeedCurve**: free, local+CI, budgets in JSON, no account needed. Calibre/SpeedCurve are paid SaaS.
- **GitHub CodeQL** over **Snyk / SonarCloud / Semgrep Cloud**: free for public repos, no extra service. Snyk free tier has scan limits; SonarCloud requires account setup; Semgrep rules available but CodeQL is zero-config on GitHub.
- **Dependabot** over **Renovate**: built into GitHub, no app install, grouped updates now supported. Renovate is more flexible but requires installing a GitHub App.
- **GitHub Actions** over **CircleCI / GitLab CI / Jenkins**: unlimited minutes on public repos, tight integration with release-please, CodeQL, Dependabot, and branch protection.

## Project Structure

The codebase follows [Feature-Sliced Design](https://feature-sliced.github.io/documentation/): layers are ordered `shared → entities → features → widgets → app`, and each layer may only import from layers below it. These boundaries are **enforced in CI** via [`eslint-plugin-boundaries`](https://www.jsboundaries.dev/) (see the `boundaries/dependencies` rule in [eslint.config.mjs](eslint.config.mjs)), so a cross-layer import fails the lint step:

| From \ To  | `app` | `widgets` | `features` | `entities` | `shared` |
| ---------- | :---: | :-------: | :--------: | :--------: | :------: |
| `app`      |  ✅   |    ✅     |     ✅     |     ✅     |    ✅    |
| `widgets`  |  ❌   |    ✅     |     ✅     |     ✅     |    ✅    |
| `features` |  ❌   |    ❌     |     ✅     |     ✅     |    ✅    |
| `entities` |  ❌   |    ❌     |     ❌     |     ✅     |    ✅    |
| `shared`   |  ❌   |    ❌     |     ❌     |     ❌     |    ✅    |

Test files (`*.test.ts(x)`, `__tests__/**`) are exempt — they legitimately render multiple layers together.

**Slice public API.** Every slice exposes its public surface through an `index.ts` barrel (e.g. [src/features/favorites/index.ts](src/features/favorites/index.ts)). Code outside a slice imports through that barrel (`@/features/favorites`) rather than reaching into `/ui`, `/model`, or `/api` directly. There is deliberately **no layer-level barrel** (`features/index.ts`, `entities/index.ts`) — those would defeat per-slice isolation, hurt tree-shaking, and blur the "where does this come from?" signal. Deep imports inside the same slice are fine; `next/dynamic` import paths are a documented exception (code-splitting needs the concrete module path).

```
src/
├── app/                            # Next.js App Router entry points
│   ├── layout.tsx                  # Root layout: fonts, Header, PWA components, Toaster
│   ├── page.tsx                    # Home → WeatherDashboard (server component)
│   ├── error.tsx                   # Route-level error boundary
│   ├── globals.css                 # Tailwind imports, theme tokens, glassmorphism, a11y
│   ├── sw.ts                       # Serwist service worker source
│   ├── favorites/page.tsx          # Favorites page with own metadata
│   └── api/weather/
│       ├── route.ts                # GET handler: rate limit → Zod → OWM → transform
│       ├── route.test.ts           # Co-located unit tests
│       ├── schema.ts               # Shared Zod schema for query params
│       └── rateLimit.ts            # Sliding-window IP rate limiter
├── entities/
│   └── weather/                    # Weather domain: types, SWR hooks, server loaders
│       ├── api/fetcher.ts             #   Shared fetcher + SWR config
│       ├── api/fetchWeatherServer.ts  #   Server-only OWM fetch that seeds the SWR cache for SSR
│       ├── api/SwrFallbackProvider.tsx#   Client wrapper over <SWRConfig fallback> used by the RSC page
│       ├── api/transformers.ts        #   OWM → app-shape Zod transformers (server-only)
│       ├── api/useWeather.ts          #   useCurrentWeather, useForecast
│       ├── lib/buildWeatherUrl.ts     #   API URL builder (also used server-side so SWR keys match)
│       └── model/                     #   types.ts + weatherStore (units + coords) + unitsCookie
├── features/
│   ├── favorites/                  # FavoriteToggle, FavoritesList, favoritesStore
│   ├── forecast-display/           # 5-day forecast grid
│   ├── geolocation/                # LocationButton
│   ├── pwa/                        # InstallPrompt
│   ├── search-weather/             # SearchWeather, SearchHistory, historyStore, useNavigateToCity
│   ├── theme-toggle/               # ThemeToggle + in-house ThemeProvider
│   ├── unit-toggle/                # °C / °F toggle
│   ├── weather-charts/             # HourlyTemperatureChart, RainChanceChart (SVG, lazy)
│   └── weather-display/            # Current weather card (priority LCP image)
├── widgets/│   ├── header/Header.tsx            # Sticky nav bar│   └── weather-dashboard/          # Composes features into the dashboard layout
├── shared/
│   ├── lib/                        # format, geolocation, cn, useCurrentCity
│   └── ui/                         # Button, Card, Input, IconButton, ErrorBoundary, …
└── __tests__/
    ├── setup.ts                    # MSW + localStorage + next/navigation mocks
    └── mocks/                      # handlers, server, fixtures
tests/
├── data/mockWeather.ts             # Shared weather response fixtures
├── fixtures/
│   ├── mockApi.ts                  # WeatherApiMock class (page.route installer)
│   └── index.ts                    # Extended Playwright test with api/home/favorites fixtures
├── pages/
│   ├── HomePage.ts                 # Page object: locators + user-intent actions
│   └── FavoritesPage.ts            # Page object for the favorites route
└── e2e/                            # Playwright specs, one file per flow
    ├── home.spec.ts
    ├── history.spec.ts
    ├── favorites.spec.ts
    ├── units.spec.ts
    └── seo.spec.ts
```

## Getting Started

### Prerequisites

- Node.js 20+ (see [.nvmrc](.nvmrc))
- An [OpenWeatherMap](https://openweathermap.org/api) API key (free tier works)

### Setup

```bash
npm install
```

Create `.env.local`:

```
OPENWEATHER_API_KEY=your_api_key_here
```

### Development

```bash
npm run dev          # Next.js dev server with Turbopack on http://localhost:3000
```

### Build & Production

```bash
npm run build        # Production build (also generates the service worker)
npm start            # Serve production build
```

## Scripts

| Script                  | Description                                             |
| ----------------------- | ------------------------------------------------------- |
| `npm run dev`           | Start dev server (Turbopack)                            |
| `npm run build`         | Production build                                        |
| `npm start`             | Serve production build                                  |
| `npm run lint`          | ESLint                                                  |
| `npm run typecheck`     | TypeScript compile check (`tsc --noEmit`)               |
| `npm run format`        | Prettier write                                          |
| `npm run format:check`  | Prettier check (used by CI)                             |
| `npm test`              | Run unit tests once (Vitest)                            |
| `npm run test:watch`    | Run tests in watch mode                                 |
| `npm run test:coverage` | Run tests with coverage report (70% threshold)          |
| `npm run test:e2e`      | Run Playwright E2E tests                                |
| `npm run test:e2e:ui`   | Run Playwright with interactive UI                      |
| `npm run analyze`       | Build with `@next/bundle-analyzer` (opens HTML reports) |

## Commit Convention

This repo uses [Conventional Commits](https://www.conventionalcommits.org), enforced locally by `commitlint` (via husky `commit-msg` hook) and in CI. Release notes and version bumps are automated via [release-please](https://github.com/googleapis/release-please-action) — merging the "Release PR" opened on `main` publishes a new version, updates `CHANGELOG.md`, and creates a GitHub Release.

Common types: `feat`, `fix`, `chore`, `docs`, `refactor`, `perf`, `test`, `ci`, `build`. Breaking changes: add `!` after the type or a `BREAKING CHANGE:` footer.

## Git Hooks

Managed by [husky](https://typicode.github.io/husky):

- **pre-commit** → `lint-staged` (ESLint + Prettier on staged files)
- **commit-msg** → commitlint (Conventional Commits)
- **pre-push** → `typecheck` + unit tests

Bypass in emergencies: `git commit --no-verify` / `git push --no-verify`.

## Continuous Integration

GitHub Actions workflows under `.github/workflows/`:

- **ci.yml** — on every PR and push to `main`: `format:check` → `lint` → `typecheck` → `test:coverage` → `build` → `npm audit`. Separate jobs run `commitlint` on PRs, Playwright E2E, and a bundle-analyzer report uploaded as an artifact.
- **lighthouse.yml** — builds and serves the app, then runs [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci) against configured budgets (performance ≥ 70, a11y / best-practices / SEO ≥ 95).
- **codeql.yml** — GitHub's static analysis for JS/TS with `security-and-quality` queries, runs on push, PR, and weekly schedule.
- **release-please.yml** — [release-please](https://github.com/googleapis/release-please-action) opens a rolling "Release PR" based on Conventional Commits; merging it bumps the version, updates `CHANGELOG.md`, and tags a GitHub Release.
- **dependabot.yml** — weekly updates for npm dependencies (grouped dev/prod) and GitHub Actions.

Required repository secrets: `OPENWEATHER_API_KEY`.

## Testing Strategy

**Unit tests** are co-located next to source files (`*.test.ts` / `*.test.tsx`). **Cross-component integration tests** live under the relevant feature's `__tests__/` folder (e.g. `src/features/search-weather/__tests__/searchFlow.integration.test.tsx`). Shared test infrastructure (MSW setup, mocks, fixtures) lives under `src/__tests__/`.

- **Stores** — tested directly via `getState()` / `setState()`, no rendering needed
- **Components** — rendered with Testing Library inside an `SWRConfig` wrapper that disables cache between tests; MSW intercepts API calls at the network level
- **API route** — the Next.js `GET` handler is called directly with `NextRequest`; `process.env` is swapped in `beforeAll`/`afterAll`
- **AAA pattern** — every test follows Arrange → Act → Assert with blank-line separation
- **Coverage thresholds** — 70% lines / branches / functions / statements, enforced by `@vitest/coverage-v8`

**E2E tests** use the [Page Object Model](https://playwright.dev/docs/pom) with Playwright test fixtures:

- **Page objects** (`tests/pages/`) expose semantic locators (`getByRole`, `getByLabel`, `getByPlaceholder`) and user-intent actions (`search`, `addToFavorites`, `toggleUnits`) — specs never touch raw CSS selectors
- **API fixture** (`tests/fixtures/mockApi.ts`) installs `page.route` handlers for `/api/weather*` so tests run deterministically without hitting OpenWeatherMap
- **Test fixtures** (`tests/fixtures/index.ts`) extend Playwright's `test` with `api`, `home`, and `favorites` so specs receive pre-wired objects
- Specs are split by user flow (home, history, favorites, units, seo) rather than one monolithic file

## Architecture Decisions

- **No custom backend** — Next.js API routes proxy OpenWeatherMap, keeping the API key server-side and the deployment to a single service
- **`fetch` with `next: { revalidate: 300 }`** — the API route uses Next.js ISR to cache upstream responses for 5 minutes, reducing OpenWeatherMap calls
- **Service worker caching** — Serwist adds a second layer: `StaleWhileRevalidate` serves cached weather data instantly while refreshing in the background (10 min expiry, 50 entries)
- **Serwist disabled in dev** — `disable: process.env.NODE_ENV !== "production"` avoids the Turbopack compatibility warning; the SW only runs in production builds
- **Charts lazy-loaded** — `next/dynamic` keeps the charting code out of the initial JS bundle
- **LCP optimization** — the main weather icon uses `priority` on `next/image` and loads above the fold
- **SSR-seeded SWR cache** — when the URL carries `?city=…`, [src/app/page.tsx](src/app/page.tsx) fetches the current-weather payload on the server and passes it to a `<SwrFallbackProvider>` so the client's `useCurrentWeather` hits the fallback synchronously on the first render. The LCP element (city name + gradient temperature) ends up in the initial HTML; no loading skeleton, no client-side round-trip. Charts / forecast stay client-fetched (not the LCP element, and their skeletons already reserve the final height to avoid CLS)
- **Units cookie** — the user's °C/°F choice is mirrored from the zustand store into a cookie (same pattern as the theme cookie) so the server loader above can build an SWR key that matches the client and the seed hits the cache for both unit systems. See [src/entities/weather/model/unitsCookie.ts](src/entities/weather/model/unitsCookie.ts) and [src/features/unit-toggle/ui/UnitToggle.tsx](src/features/unit-toggle/ui/UnitToggle.tsx)
- **Reserved heights on lazy/skeleton cards** — the forecast and both charts share a `min-h-*` value between the `next/dynamic` placeholder, the data-loading skeleton, and the loaded card, so all three render states occupy the same box (CLS ≈ 0.02)
- **Hydration-safe date formatting** — `formatDate` pins `timeZone: "UTC"` so server and client produce identical day labels regardless of host time zone
- **Reduced motion** — `@media (prefers-reduced-motion: reduce)` disables `backdrop-filter` blur and animations
- **`robots.txt`** — allows crawling of pages but blocks `/api/` routes
- **Shared fetcher** — a single `fetcher` + `swrConfig` in `src/entities/weather/api/fetcher.ts` is used by all SWR consumers (DRY)
- **`useNavigateToCity` hook** — centralizes the "search → fetch → navigate → commit-to-history" flow so UI components stay thin (SRP / DIP). The route itself (parsed via `useCurrentCity`) is the single source of truth for the active city; the hook never writes to a "current city" store
- **Single fetch per navigation** — the hook uses SWR's [`preload`](https://swr.vercel.app/docs/prefetching#programmatically-prefetch) to kick off the request and store the in-flight promise in SWR's cache _before_ `router.push` fires; the `useCurrentWeather` hook mounted on the new route dedupes against that promise instead of firing its own request
- **History only on success** — a city is added to search history _after_ the weather fetch resolves, so invalid cities (404) never pollute history
- **`citiesMatch` utility** — centralizes case-insensitive city comparison used by both stores (DRY)
- **No redundant data subscriptions** — `WeatherDashboard` only reads store state for layout decisions; child components own their own SWR subscriptions (SRP)

## Security

Defense-in-depth measures baked into the app:

- **Server-side API key** — `OPENWEATHER_API_KEY` is only read in the Next.js API route; the client bundle never sees it
- **Zod query validation** — `/api/weather` validates every param (strict city regex forbids CR/LF + control chars, lat/lon bounded, enums only)
- **Zod response validation** — upstream OpenWeatherMap payloads are parsed with `owmCurrent` / `owmForecast` before being transformed; malformed responses return 502 instead of propagating junk to clients
- **Same-origin API** — `/api/weather` rejects cross-origin requests by comparing the `Origin` header's host against the request host (403 on mismatch)
- **IP-based rate limiting** — sliding-window limiter (60 req / min / IP) with memory cap; `x-forwarded-for` / `x-real-ip` are only trusted when `TRUST_PROXY=1`, `VERCEL=1`, or `NODE_ENV=test` to prevent forged-header bypass
- **Security response headers** — set in `next.config.ts`:
  - Strict `Content-Security-Policy` (`default-src 'self'`, images limited to self + `openweathermap.org`, `frame-ancestors 'none'`, `object-src 'none'`)
  - `Strict-Transport-Security: max-age=2y; includeSubDomains; preload`
  - `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy` disables camera/mic/FLoC; keeps geolocation
- **Secret scanning** — [gitleaks](https://github.com/gitleaks/gitleaks) runs on every push/PR plus weekly cron (`.github/workflows/gitleaks.yml`); an optional local `pre-commit` hook runs `gitleaks protect --staged` when the CLI is installed
- **CodeQL** — GitHub's `security-and-quality` queries run on push, PR, and weekly schedule
- **`npm audit`** — runs as a CI step on every PR
- **Dependabot** — weekly grouped updates for npm deps and GitHub Actions

## SEO

- Metadata with Open Graph and Twitter cards in root layout
- Per-page `title` via the `template` pattern (`"%s — Weather Forecast"`)
- `metadataBase` set for canonical URLs
- `viewport` export with `themeColor` (separated from `metadata` per Next.js 16 API)

## PWA

The app is installable on mobile and desktop:

- `public/manifest.json` with SVG + PNG icons (192×192, 512×512, maskable)
- `InstallPrompt` component listens for `beforeinstallprompt` and shows an install button
- `RegisterSW` defers service worker registration until after `window.load` to avoid blocking first paint
- Offline-capable: static assets cached by default, API responses cached via StaleWhileRevalidate

## Accessibility

- **Skip-to-content link** — keyboard users can bypass the header/nav
- **Global `focus-visible` outline** — cyan ring on all focusable elements as a safety net
- **Semantic HTML** — `<header>`, `<nav>`, `<main>`, `<form>`, `<button>` used throughout
- **`aria-label`** on all icon-only buttons (search, location, favorite, install, unit toggle)
- **`aria-pressed`** on toggle buttons (`FavoriteToggle`, `UnitToggle`)
- **`aria-current="page"`** on active nav link + underline (not color-only)
- **`aria-invalid` + `aria-describedby`** on search input with `role="alert"` on error messages
- **`role="status"`** with `sr-only` text on all loading skeletons
- **`role="alert"`** on error messages (weather, location, API)
- **`aria-hidden="true"`** on all decorative emojis and SVG icons
- **`role="img"` + `aria-label`** on chart containers with data summaries for screen readers
- **`sr-only` labels** for forecast high/low temperatures and humidity/wind values
- **`prefers-reduced-motion`** — disables blur and animations
- **`.glass-panel:focus-within`** — panels respond to keyboard focus, not just hover
