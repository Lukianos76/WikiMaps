# 🗺️ WikiMaps

> Interactive, open-source and free world atlas — **the map is the interface**.

WikiMaps lets you explore how the world's political borders evolved throughout
history, directly on a full-screen map, via a time slider.
Inspiration: the map-filter system of Europa Universalis / Paradox games.

> **English-first project.** Code, comments, docs, commits, PRs, branches and
> issues are all in English. The app itself ships localized in **English + French**.

## Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript** strict
- **MapLibre GL JS** (WebGL rendering) — _Phase 2 integration_
- **Tailwind CSS v4** (off-map UI only)
- **next-intl 4** (native EN/FR i18n)
- **Docker** multi-stage (Node 24 → Nginx) + **docker-compose**
- **GitHub Actions** → GHCR

## Getting started

### Local (development)

```bash
npm install
npm run dev
# → http://localhost:3000 (redirects to /en or /fr)
```

### With Docker (static build served by Nginx)

```bash
docker compose up --build
# → http://localhost:3000
```

## Scripts

| Command                | Description                            |
| ---------------------- | -------------------------------------- |
| `npm run dev`          | Next.js development server             |
| `npm run build`        | Build + static export (→ `out/`)       |
| `npm run lint`         | ESLint (flat config, next + TS strict) |
| `npm test`             | Unit tests (Vitest)                    |
| `npm run test:watch`   | Tests in watch mode                    |
| `npm run format`       | Format the code with Prettier          |
| `npm run format:check` | Check formatting (used in CI)          |

## i18n architecture

- Localized routes: `/en` and `/fr` (prefix always present), English-first.
- Since the static export is served by Nginx, **Accept-Language detection and
  the `/` → `/en | /fr` redirect are handled by Nginx** (see
  [`nginx.conf`](./nginx.conf)); Next middleware is unavailable in export mode.
- Language toggle in the UI, persisted in `localStorage`.

## Structure

```
wikimaps/
├── app/[locale]/        # Localized routes (page = the map)
├── components/          # Map, LanguageSwitcher, Attribution…
├── i18n/                # routing + request config (next-intl)
├── messages/            # en.json, fr.json
├── data/                # historical GeoJSON (Phase 1)
├── docs/                # project documentation
├── Dockerfile           # multi-stage → Nginx
├── docker-compose.yml
└── nginx.conf
```

## Documentation

- [Vision](./docs/VISION.md) · [PRD](./docs/PRD.md) · [Architecture](./docs/ARCHITECTURE.md)
- [Roadmap](./docs/ROADMAP.md) · [UX & Design](./docs/UX_DESIGN.md) · [Data Sources](./docs/DATA_SOURCES.md)
- [Contributing](./CONTRIBUTING.md)

## Quality, CI/CD & observability

- **CI** ([`ci.yml`](./.github/workflows/ci.yml)): lint + test + format + build,
  then build & push the Docker image to GHCR on `main`.
- **CodeQL** ([`codeql.yml`](./.github/workflows/codeql.yml)): security analysis (push, PR, weekly).
- **Dependabot** ([`dependabot.yml`](./.github/dependabot.yml)): weekly updates (npm, GitHub Actions, Docker).
- **Tests**: Vitest + Testing Library (`*.test.tsx` next to components).
- **Commits**: Conventional Commits **enforced** by commitlint (`commit-msg` hook),
  with the project types `data:` and `i18n:`.
- **Consistency**: `.editorconfig` + `.gitattributes` (LF line endings).
- **Deployment** ([`deploy.yml`](./.github/workflows/deploy.yml)): VPS skeleton (pull from GHCR over SSH),
  manual and disabled until secrets / `vars.DEPLOY_ENABLED=true` are set.
- **Observability** (enable in Phase 6): variables prepared in [`.env.example`](./.env.example)
  (Sentry for client errors, Plausible for analytics).

## Data sources

- Historical borders: [Historical Basemaps](https://github.com/aourednik/historical-basemaps) — CC BY-SA 4.0
- Multilingual metadata: [Wikidata](https://www.wikidata.org) — CC0
- Basemap: [Natural Earth](https://www.naturalearthdata.com) — public domain

## Contributing

Contributions (code, data, translations) are welcome — see [CONTRIBUTING.md](./CONTRIBUTING.md).
Commits follow [Conventional Commits](https://www.conventionalcommits.org/):
`feat:`, `fix:`, `data:`, `i18n:`, `docs:`, `chore:`.

## License

[MIT](./LICENSE) © WikiMaps contributors
