# Changelog

## [0.1.1](https://github.com/KhatuntsevAlex/weather-forecast-next/compare/weather-forecast-next-v0.1.0...weather-forecast-next-v0.1.1) (2026-04-23)


### Features

* **api:** add /api/weather proxy with Zod validation, rate limiting, CSP ([090bf8d](https://github.com/KhatuntsevAlex/weather-forecast-next/commit/090bf8dd658a29a97eb40297072461e47bf6806b))
* **app:** compose dashboard widget, header, service worker, and root layout ([8b6056a](https://github.com/KhatuntsevAlex/weather-forecast-next/commit/8b6056a6e55929c3d1d7ab765c84986398518f65))
* **charts:** add lazy-loaded SVG hourly temperature and rain chance charts ([923c1df](https://github.com/KhatuntsevAlex/weather-forecast-next/commit/923c1dfd2447a656139ea9f92367b9be3d60e25e))
* **favorites:** add favorite toggle, persisted list, and favorites page store ([4f58f85](https://github.com/KhatuntsevAlex/weather-forecast-next/commit/4f58f851338afa8d273388038708d7d3fe825ea0))
* **geolocation:** add LocationButton for browser geolocation lookup ([869b32e](https://github.com/KhatuntsevAlex/weather-forecast-next/commit/869b32e51cf1a01cd0f48794e97faffce735efd9))
* **pwa:** add InstallPrompt for beforeinstallprompt event ([b779575](https://github.com/KhatuntsevAlex/weather-forecast-next/commit/b779575a2d99c7427fd29b7a7c8554af6d4c25cc))
* **search:** add city search with history and useNavigateToCity hook ([d7d1178](https://github.com/KhatuntsevAlex/weather-forecast-next/commit/d7d11786620929b243701499014c3b8db48d52b2))
* **shared:** add UI primitives, format/geolocation/cn utils, ErrorBoundary ([13f3ad5](https://github.com/KhatuntsevAlex/weather-forecast-next/commit/13f3ad5b20094ddf77db5d7287f45db1c866bbfc))
* **theme:** add theme toggle with custom provider and persisted preference ([6974617](https://github.com/KhatuntsevAlex/weather-forecast-next/commit/69746178390939fd5a325444bb4d6e5c7bea6f14))
* **units:** add C/F toggle synced to cookie for SSR-consistent SWR keys ([1898144](https://github.com/KhatuntsevAlex/weather-forecast-next/commit/18981447a6c90d5924a893733149f2b832edd8a0))
* **weather-display:** add current weather card and 5-day forecast grid ([0ac92e8](https://github.com/KhatuntsevAlex/weather-forecast-next/commit/0ac92e8ac7c9d4c9de5822076e9b8e4bd1b6928b))
* **weather:** add weather entity with SWR hooks, server seed, units cookie ([dd2ff4a](https://github.com/KhatuntsevAlex/weather-forecast-next/commit/dd2ff4aac5a71bd12f74064c5616668f9aa9ea64))
