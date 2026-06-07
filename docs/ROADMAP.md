# 🗺️ WikiMaps — Roadmap

## Principle

The roadmap is organized into **sequential phases**. Each phase delivers something functional and testable. Estimates are based on a solo developer working part-time (weekends + evenings).

---

## Overview

| Phase | Name                 | Estimated duration | Deliverable                                    |
| ----- | -------------------- | ------------------ | ---------------------------------------------- |
| 0     | Setup & foundations  | 1 week             | Public repo, Docker, CI/CD, Next.js + i18n     |
| 1     | Data pipeline        | 2 weeks            | Ready-to-use historical GeoJSON                |
| 2     | Base map             | 2 weeks            | Interactive world map with colored territories |
| 3     | Timeline slider      | 1 week             | Working navigation through time                |
| 4     | Territory panel      | 1 week             | Tooltip + detail panel + name history          |
| 5     | Internationalization | 1 week             | Full FR/EN, language switch                    |
| 6     | Polish & V1 launch   | 1 week             | Performance, a11y, README, public announcement |

**Estimated V1 total: ~9 weeks**

---

## Phase 0 — Setup & Foundations

**✅ Done.** Phase 0 is complete: Next.js 16 + i18n + Docker, green CI, and the image is published on GHCR. The only remaining manual step is the VPS deployment.

**Goal**: lay solid technical foundations before writing a single line of feature code.

- [x] Create the GitHub repo (public, MIT)
- [x] Initialize Next.js 16 + TypeScript + Tailwind
- [x] Configure next-intl (FR/EN, /fr /en routing)
- [x] Write the multi-stage Dockerfile + docker-compose.yml
- [x] Configure GitHub Actions (build + lint + push to GHCR)
- [ ] Deploy a containerized "Hello World" on a VPS
- [x] Set up ESLint, Prettier, Husky

**Exit criterion**: `docker-compose up` launches the local app, GitHub Actions passes green.

---

## Phase 1 — Data Pipeline

**Goal**: have the historical data ready, validated, and servable.

- [ ] Evaluate and select the primary source (Historical Basemaps vs. others)
- [ ] Verify the actual temporal coverage and granularity
- [ ] Write the transformation script → enriched GeoJSON format (multilingual names, sources, years)
- [ ] Validate data quality (gaps, geometry errors)
- [ ] Integrate Wikidata to enrich multilingual names
- [ ] Store the GeoJSON in `/data/borders/`

**Exit criterion**: GeoJSON files available for at least 20 centuries, with names in FR + EN.

---

## Phase 2 — Base Map

**Goal**: display the map with colored territories for a given year.

- [ ] Integrate MapLibre GL JS into Next.js
- [ ] Display the basemap (Natural Earth)
- [ ] Load and display the GeoJSON layer for a fixed year
- [ ] Color territories by political entity
- [ ] The map fills the entire screen (map-first)
- [ ] Zoom, pan, basic interactions

**Exit criterion**: the year 1000 AD is shown with the correct territories colored.

---

## Phase 3 — Timeline Slider

**Goal**: navigate through time via the slider.

- [ ] TimelineSlider component (drag + direct input)
- [ ] Real-time update of the GeoJSON layer based on the year
- [ ] Auto animation (play/pause)
- [ ] Smooth transitions between two temporal states
- [ ] Display of the current year

**Exit criterion**: dragging the slider from year 1 to 2024 shows the borders evolving.

---

## Phase 4 — Territory Panel

**Goal**: make each territory informative and sourced.

- [ ] Tooltip on hover (name in the active language)
- [ ] Side panel on click: name, period, timeline of names
- [ ] Wikipedia link in the active language
- [ ] Data source attribution
- [ ] Panel closing (click outside or close button)

**Exit criterion**: clicking on "Roman Empire" displays its panel with the name history.

---

## Phase 5 — Internationalization

**Goal**: UI and data fully bilingual FR/EN.

- [ ] Translate all UI text (slider, tooltips, panel, navigation)
- [ ] Verify that all territory names have FR + EN
- [ ] Language switch in the UI
- [ ] Automatic detection via Accept-Language
- [ ] Localized URLs (/fr, /en)

**Exit criterion**: the app is 100% functional in both French and English.

---

## Phase 6 — Polish & V1 Launch

**Goal**: make the app presentable and announce it publicly.

- [ ] Performance optimization (lazy loading GeoJSON, compression)
- [ ] Basic a11y (contrast, keyboard navigation on the slider)
- [ ] Complete README on GitHub (demo GIF, stack, how to contribute)
- [ ] SEO metadata (og:image, description)
- [ ] Stable deployment on a public domain
- [ ] Announcement (Reddit, HackerNews, Twitter/X)

**Exit criterion**: shareable public URL, load time < 3s, complete README.

---

## After V1 — Backlog

- Community contribution system
- New layers: statistical data (population, GDP, etc.)
- Languages / religions / cultures layer
- Migration to PMTiles on S3 + CloudFront
- Comparison mode (two dates side by side)
- Search by territory or year
- Optimized mobile version
- Public API for the data

---

## Related documents

- [Vision](./VISION.md)
- [PRD](./PRD.md)
- [Architecture](./ARCHITECTURE.md)
- [Roadmap](./ROADMAP.md)
- [UX & Design](./UX_DESIGN.md)
- [Data Sources](./DATA_SOURCES.md)
- [Contributing](../CONTRIBUTING.md)
