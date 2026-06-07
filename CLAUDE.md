# WikiMaps — CLAUDE.md

## Project

WikiMaps is an interactive, open-source and free world atlas.
The map IS the interface — no separate menu, everything happens on the map.
Users toggle thematic layers (V1: historical borders + time slider).
Main inspiration: the map-filter system of Europa Universalis / Paradox games.

## Documentation

Read these documents BEFORE writing any code:

- Vision: [docs/VISION.md](docs/VISION.md)
- PRD V1: [docs/PRD.md](docs/PRD.md)
- Technical Architecture: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
- Roadmap: [docs/ROADMAP.md](docs/ROADMAP.md)
- UX & Design Principles: [docs/UX_DESIGN.md](docs/UX_DESIGN.md)
- Data Sources: [docs/DATA_SOURCES.md](docs/DATA_SOURCES.md)
- Contributing Guide: [CONTRIBUTING.md](CONTRIBUTING.md)

## Stack

- Next.js 16 (App Router) + TypeScript strict (TS 6)
- React 19
- MapLibre GL JS (WebGL rendering)
- Tailwind CSS v4 (CSS-first, off-map UI only)
- next-intl 4 (native EN/FR i18n)
- Next.js static export served by Nginx (no middleware → Accept-Language handled by Nginx)
- Docker multi-stage (Node 24 → Nginx) + docker-compose
- GitHub Actions → GHCR
- Tooling: ESLint 9 (flat config `eslint.config.mjs`), Prettier, Husky + lint-staged, commitlint, Vitest

## Non-negotiable rules

- **English-first**: code, comments, docs, commits, PRs, branches, issues and all naming are in English.
  The app itself is localized (EN + FR) — only user-facing translated strings live in `messages/`.
- TypeScript strict — no `any` without a justifying comment
- Native multilingual: every visible string goes through next-intl, never a hardcoded string
- Map-first: the map fills 100vw x 100vh, UI components are overlaid
- Each component in its own folder: `components/ComponentName/index.tsx`
- Conventional Commits: `feat:`, `fix:`, `data:`, `i18n:`, `docs:`, `chore:` (enforced by commitlint)

## Current phase

**Data direction pivot — detailed, year-precise, curated (Europe-first).**

The original snapshot approach with Historical Basemaps proved too coarse/low-granularity.
New direction: a **detailed, year-precise** dataset **seeded from OpenHistoricalMap (CC0)**
and refined by hand over time, starting with **Europe over the last centuries**. Aim (long
term, via curation/crowdsourcing): Cottereau / Ollie Bye level detail — which is hand-made,
not a downloadable dataset.

- Data model: per-entity `from`/`to` validity + Wikidata QID + multilingual `names` (see
  `TemporalTerritoryProperties`). OHM is too densely versioned to bulk-download as one file,
  so the seed produces bounded per-year detailed snapshots (`data/europe/admin2-<year>.geojson`).
- Pipeline: `scripts/pipeline/source/openhistoricalmap.ts` + `seed-europe.ts`
  (`npm run data:seed-europe`).
- The app renders a fixed year from the snapshot; a time slider (Phase 3) will drive it.
- `data/borders/` (Historical Basemaps world snapshots) stays as a possible deep-time fallback
  but is unused by the app. See `docs/DATA_SOURCES.md` and `data/NOTICE`.

Deferred work is tracked as GitHub issues (full-Europe extraction, geometry simplification,
Wikidata multilingual backfill, name-history from OHM chronology relations, curation editor).

> **Phase 0 — Setup & Foundations: complete ✅** · **Phase 2 — Base map (MapLibre): done**
> (MapLibre + Natural Earth basemap, full-screen, zoom/pan). Remaining manual step: VPS deploy.

## Target project structure

```
wikimaps/
├── app/
│   └── [locale]/
│       └── page.tsx
├── components/
│   ├── Map/
│   ├── TimelineSlider/
│   ├── TerritoryPanel/
│   └── Tooltip/
├── data/
│   ├── borders/
│   └── territories/
├── messages/
│   ├── en.json
│   └── fr.json
├── docs/
├── public/
├── Dockerfile
├── docker-compose.yml
└── nginx.conf
```
