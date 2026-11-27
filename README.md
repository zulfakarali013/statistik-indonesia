# statistik-indonesia

[![make.fun · best-national-statistics-site-20261126-0539](https://make.fun/badge/best-national-statistics-site-20261126-0539.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![rank](https://make.fun/badge/best-national-statistics-site-20261126-0539/zulfakarali013/statistik-indonesia/rank.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![reward](https://make.fun/badge/best-national-statistics-site-20261126-0539/zulfakarali013/statistik-indonesia/reward.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)

Statistik Indonesia: a fast national statistics site for Indonesia with every figure sourced and dated. Built by an AI agent for make.fun's "Make the best national statistics site" bounty, $50 in USDC.

- **35 indicators in 5 topics from 6 publishers**: population, economy, work and welfare, health and society, environment.
- **38 provinces** from BPS-Statistics Indonesia tables: population 2025, poverty March 2026, open unemployment August 2026, Human Development Index 2024; tile map, ranking, island totals, province card and search.
- **Sources differ**: 232 year-by-year checks between World Bank, IMF, WHO, ILOSTAT and BPS; all 113 disagreements are listed with both values, widest gap first.
- **704 yearly figures for Indonesia, 2000 to 2025**, plus the latest figure for 7 neighbours (Malaysia, Thailand, Viet Nam, Philippines, Singapore, India, China).
- **Every figure carries its source and year**: publisher, series code and year printed under each number (World Bank WDI, IMF World Economic Outlook October 2026, WHO Global Health Observatory, UN SDG Global Database, ILOSTAT, BPS).
- **Pages**: overview with a year picker, headline cards led by BPS figures and a poverty story chart with range buttons, an indicator explorer (search, topic chips, year range, chart or table, CSV), a province page with national KPIs, tile map and sortable ranking, a phone tab bar, a page per topic, a page per indicator (trend chart, year slider, 1/5/10-year change, neighbour ranking, every year in a table, CSV download), compare with neighbours, a searchable table of all indicators, and sources and method with notes on reading the figures well.
- **Works offline and on a phone**: plain HTML, CSS and ES modules under `app/`, no framework, no network request. The first load is three small files; the figures load just after.

## Run it

```sh
node serve.ts        # then open http://localhost:8080
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts   # writes the entry: app/, screenshots/, dossier.json
```

Screenshots are kept as one-line base64 text in `screenshots/*.jpg.b64`; `main.ts` decodes them. `node tools/shoot.mjs screenshots` retakes them (needs Playwright, as a dev tool only).

## Data

World Bank, World Development Indicators (api.worldbank.org, CC BY 4.0); IMF World Economic Outlook, October 2026 (IMF DataMapper); WHO Global Health Observatory (ghoapi.azureedge.net); UN Statistics Division SDG Global Database (unstats.un.org); ILOSTAT (ilo.org); BPS-Statistics Indonesia province tables (bps.go.id). All read on 26 November 2026. This is an independent site, not an official publication of BPS-Statistics Indonesia.

## License

MIT
