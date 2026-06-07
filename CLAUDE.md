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

**Phase 1 — Data pipeline**

- [ ] Evaluate/select the main source (Historical Basemaps) + check granularity/coverage
- [ ] Transformation script → enriched GeoJSON (multilingual names, sources, years)
- [ ] Validate data quality (gaps, geometry errors)
- [ ] Enrich multilingual names via Wikidata
- [ ] Store the GeoJSON in `/data/borders/`

Exit criterion: GeoJSON available for ≥ 20 centuries, names in EN + FR.

> **Phase 0 — Setup & Foundations: complete ✅**
> Next 16 + EN/FR i18n + Docker + green CI, image published to GHCR.
> `docker compose up` runs the app. Remaining manual step: VPS deploy.

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
