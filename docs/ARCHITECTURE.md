# ⚙️ WikiMaps — Technical Architecture

## Context

This document describes the technical choices for WikiMaps V1. The main constraints are: **open source**, **containerized from day one** (AWS as the eventual target), **multilingual by design**, and WebGL performance for map rendering.

---

## Selected Stack

| Layer            | Technology                      | Rationale                                                       |
| ---------------- | ------------------------------- | --------------------------------------------------------------- |
| UI Framework     | **Next.js 16 (App Router)**     | SSG/static export, native i18n, React ecosystem, TypeScript     |
| Language         | **TypeScript (strict, TS 6)**   | Type safety, long-term maintainability                          |
| UI Library       | **React 19**                    | Latest React features, concurrent rendering                     |
| Map              | **MapLibre GL JS**              | Open source fork of Mapbox GL, WebGL, high performance, PMTiles |
| Styles           | **Tailwind CSS v4 (CSS-first)** | Lightweight UI for off-map elements (slider, tooltip, panel)    |
| i18n             | **next-intl 4**                 | Best integration with the Next.js App Router                    |
| Data Format      | **GeoJSON / TopoJSON**          | Open standard, compatible with MapLibre                         |
| Containerization | **Docker (multi-stage)**        | Nginx serving the static build                                  |
| CI/CD            | **GitHub Actions**              | Lint + test + build, then push image to GHCR                    |
| V1 Hosting       | **Docker on a VPS or AWS ECS**  | Path toward Fargate/EKS without a rewrite                       |

---

## Why MapLibre GL JS

- Open source (BSD-3) — no token required, unlike Mapbox GL JS v2+
- WebGL rendering: smooth even with complex GeoJSON
- Native support for **PMTiles** (a self-hosted tile archive format, ideal for AWS S3)
- API identical to Mapbox GL — easy migration if ever needed
- Active community, maintained by the Linux Foundation

---

## Overall V1 Architecture

```
┌───────────────────────────────────┐
│         Browser (Client)              │
│                                        │
│  Next.js App (static export)           │
│  ├── MapLibre GL JS (WebGL)            │
│  ├── Historical GeoJSON layer          │
│  ├── Timeline Slider                   │
│  ├── Territory Panel (detail card)     │
│  └── next-intl (FR/EN)                 │
└───────────────────────────────────┘
          ↓
┌───────────────────────────────────┐
│     Docker Container (Nginx)           │
│     Serves the static Next.js build    │
│     + GeoJSON files                    │
└───────────────────────────────────┘
          ↓ (future)
┌───────────────────────────────────┐
│  AWS ECS Fargate + CloudFront + S3     │
│  (tile data + assets)                  │
└───────────────────────────────────┘
```

---

## Project Structure

```
wikimaps/
├── app/                    # Next.js App Router
│   ├── [locale]/           # Localized routes (fr, en)
│   │   └── page.tsx        # Main page (the map)
│   └── layout.tsx
├── components/
│   ├── Map/               # MapLibre wrapper
│   ├── TimelineSlider/    # Time slider
│   ├── TerritoryPanel/    # Territory detail card
│   └── Tooltip/           # Hover tooltip
├── data/
│   ├── borders/           # GeoJSON per century
│   └── territories/       # Entity metadata
├── messages/              # i18n files
│   ├── fr.json
│   └── en.json
├── public/
├── Dockerfile
├── docker-compose.yml
└── nginx.conf
```

---

## Data Model — Territory

Each territory is an enriched GeoJSON Feature:

```json
{
  "type": "Feature",
  "geometry": { "..." },
  "properties": {
    "id": "roman_empire",
    "names": {
      "fr": "Empire romain",
      "en": "Roman Empire",
      "la": "Imperium Romanum"
    },
    "name_history": [
      { "name": { "fr": "République romaine", "en": "Roman Republic" }, "from": -509, "to": -27 },
      { "name": { "fr": "Empire romain", "en": "Roman Empire" }, "from": -27, "to": 476 }
    ],
    "start_year": -27,
    "end_year": 476,
    "color": "#8B0000",
    "source": "Historical Basemaps",
    "source_url": "https://github.com/aourednik/historical-basemaps",
    "wikipedia": {
      "fr": "https://fr.wikipedia.org/wiki/Empire_romain",
      "en": "https://en.wikipedia.org/wiki/Roman_Empire"
    }
  }
}
```

---

## Internationalization

- **Library**: `next-intl` (v4)
- **V1 languages**: French (FR) + English (EN)
- **Detection**: automatic via `Accept-Language`, with a manual switch in the UI. Because the app uses Next.js static export (`output: 'export'`), Next middleware is unavailable — so `Accept-Language` detection and the `/` → `/fr|/en` redirect are handled by **Nginx**, not the next-intl middleware.
- **URLs**: `wikimaps.io/fr` and `wikimaps.io/en`
- **Data**: territory names and Wikipedia links are localized within the GeoJSON
- **Evolution**: adding a language = a new `messages/[locale].json` file + data

---

## Containerization

### Dockerfile (multi-stage)

```docker
# Stage 1 — Build
FROM node:24-alpine AS builder
WORKDIR /app
COPY . .
RUN npm ci && npm run build

# Stage 2 — Serve
FROM nginx:alpine
COPY --from=builder /app/out /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
```

### docker-compose.yml (local dev)

```yaml
services:
  app:
    build: .
    ports:
      - '3000:80'
    volumes:
      - ./data:/usr/share/nginx/html/data
```

---

## CI/CD — GitHub Actions

```
push main
  → lint + test + build (Vitest)
  → build Docker image
  → push to GHCR (ghcr.io/[user]/wikimaps)
  → deploy to VPS (SSH) or AWS ECS (future)
```

Tooling around the pipeline:

- **ESLint** (flat config) + **Prettier** for linting and formatting
- **Husky** + **lint-staged** for pre-commit checks, with **commitlint** enforcing Conventional Commits
- **Vitest** for unit tests
- **Dependabot** for dependency updates
- **CodeQL** for static security analysis

---

## Evolution Toward AWS (post-V1)

| Component     | V1              | AWS Target      |
| ------------- | --------------- | --------------- |
| Compute       | VPS / container | ECS Fargate     |
| Assets & data | Served by Nginx | S3 + CloudFront |
| Vector tiles  | Static GeoJSON  | PMTiles on S3   |
| DNS           | Manual          | Route 53        |
| HTTPS         | Let's Encrypt   | ACM             |

---

## Decisions to Validate

- [ ] Confirm _Historical Basemaps_ as the primary source (see [Data Sources](./DATA_SOURCES.md))
- [ ] Validate the actual granularity of the available data
- [x] **RESOLVED** — Next.js static export chosen (served by Nginx). Consequence: no Next middleware → `Accept-Language` detection and the `/` → `/fr|/en` redirect are handled by Nginx.
- [ ] Define the domain name

---

## Related Documents

- [Vision](./VISION.md)
- [PRD](./PRD.md)
- [Roadmap](./ROADMAP.md)
- [UX & Design Principles](./UX_DESIGN.md)
- [Data Sources](./DATA_SOURCES.md)
- [Contributing Guide](../CONTRIBUTING.md)
