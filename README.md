# 🗺️ WikiMaps

> Atlas mondial interactif, open source et gratuit — **la carte est l'interface**.

WikiMaps permet d'explorer l'évolution des frontières politiques mondiales à travers
l'histoire, directement sur une carte plein écran, via un slider temporel.
Inspiration : le système de filtres de carte d'Europa Universalis / des jeux Paradox.

## Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript** strict
- **MapLibre GL JS** (rendu WebGL) — _intégration Phase 2_
- **Tailwind CSS v4** (UI hors-carte uniquement)
- **next-intl 4** (i18n FR/EN natif)
- **Docker** multi-stage (Node 24 → Nginx) + **docker-compose**
- **GitHub Actions** → GHCR

## Démarrage

### En local (développement)

```bash
npm install
npm run dev
# → http://localhost:3000 (redirige vers /fr ou /en)
```

### Avec Docker (build statique servi par Nginx)

```bash
docker compose up --build
# → http://localhost:3000
```

## Scripts

| Commande               | Description                            |
| ---------------------- | -------------------------------------- |
| `npm run dev`          | Serveur de développement Next.js       |
| `npm run build`        | Build + export statique (→ `out/`)     |
| `npm run lint`         | ESLint (flat config, next + TS strict) |
| `npm test`             | Tests unitaires (Vitest)               |
| `npm run test:watch`   | Tests en mode watch                    |
| `npm run format`       | Formate le code avec Prettier          |
| `npm run format:check` | Vérifie le formatage (utilisé en CI)   |

## Architecture i18n

- Routes localisées : `/fr` et `/en` (préfixe toujours présent).
- L'export statique étant servi par Nginx, **la détection `Accept-Language`
  et la redirection `/` → `/fr | /en` sont assurées par Nginx** (voir
  [`nginx.conf`](./nginx.conf)), le middleware Next n'étant pas disponible
  en mode export.
- Bascule de langue dans l'UI, persistée en `localStorage`.

## Structure

```
wikimaps/
├── app/[locale]/        # Routes localisées (page = la carte)
├── components/          # Map, LanguageSwitcher, Attribution…
├── i18n/                # routing + request config (next-intl)
├── messages/            # fr.json, en.json
├── data/                # GeoJSON historiques (Phase 1)
├── Dockerfile           # multi-stage → Nginx
├── docker-compose.yml
└── nginx.conf
```

## Qualité, CI/CD & observabilité

- **CI** ([`ci.yml`](./.github/workflows/ci.yml)) : lint + test + format + build, puis
  build & push de l'image Docker vers GHCR sur `main`.
- **CodeQL** ([`codeql.yml`](./.github/workflows/codeql.yml)) : analyse de sécurité (push, PR, hebdo).
- **Dependabot** ([`dependabot.yml`](./.github/dependabot.yml)) : mises à jour hebdo (npm, GitHub Actions, Docker).
- **Tests** : Vitest + Testing Library (`*.test.tsx` à côté des composants).
- **Commits** : Conventional Commits **imposés** par commitlint (hook `commit-msg`),
  avec les types projet `data:` et `i18n:`.
- **Cohérence** : `.editorconfig` + `.gitattributes` (fins de ligne LF).
- **Déploiement** ([`deploy.yml`](./.github/workflows/deploy.yml)) : squelette VPS (pull GHCR via SSH),
  manuel et désactivé tant que les secrets / `vars.DEPLOY_ENABLED=true` ne sont pas définis.
- **Observabilité** (à activer Phase 6) : variables prévues dans [`.env.example`](./.env.example)
  (Sentry pour les erreurs client, Plausible pour l'analytics). _Branch protection_ recommandée
  une fois passé en flux par PR.

## Sources de données

- Frontières historiques : [Historical Basemaps](https://github.com/aourednik/historical-basemaps) — CC BY-SA 4.0
- Métadonnées multilingues : [Wikidata](https://www.wikidata.org) — CC0
- Fond de carte : [Natural Earth](https://www.naturalearthdata.com) — domaine public

## Contribuer

Les contributions (code, données, traductions) sont les bienvenues.
Commits en [Conventional Commits](https://www.conventionalcommits.org/) :
`feat:`, `fix:`, `data:`, `i18n:`, `docs:`.

## Licence

[MIT](./LICENSE) © WikiMaps contributors
