# WikiMaps — CLAUDE.md

## Projet

WikiMaps est un atlas mondial interactif, open source et gratuit.
La carte EST l'interface — pas de menu séparé, tout se passe sur la carte.
L'utilisateur active des couches thématiques (V1 : frontières historiques + slider temporel).
Inspiration principale : système de filtres de carte d'Europa Universalis / jeux Paradox.

## Documentation complète dans Notion

Lis ces documents AVANT de coder quoi que ce soit :

- Vision : https://app.notion.com/p/3784ec28aa1c81fc84a9d54e1b5db7b7
- PRD V1 : https://app.notion.com/p/3784ec28aa1c81fcb189f0bb093da2c3
- Architecture Technique : https://app.notion.com/p/3784ec28aa1c816eb2a5e2e3256395a4
- Roadmap : https://app.notion.com/p/3784ec28aa1c81b1a905e85a1c8f28d1
- UX & Design Principles : https://app.notion.com/p/3784ec28aa1c8163925ed997cbb367a0
- Sources de données : https://app.notion.com/p/3784ec28aa1c81708ecdc0dd8a720eb7
- Contributing Guide : https://app.notion.com/p/3784ec28aa1c81ea8065f87a7e2472e2

## Stack

- Next.js 14+ (App Router) + TypeScript strict
- MapLibre GL JS (rendu WebGL)
- Tailwind CSS (UI hors-carte uniquement)
- next-intl (i18n FR/EN natif dès le début)
- Docker multi-stage (Nginx) + docker-compose
- GitHub Actions → GHCR

## Règles non négociables

- TypeScript strict — pas de `any` sans commentaire justificatif
- Multilingue natif : tout texte visible passe par next-intl, jamais de string hardcodée
- Map-first : la carte occupe 100vw x 100vh, les composants UI sont superposés
- Chaque composant dans son dossier : `components/NomComposant/index.tsx`
- Commits en Conventional Commits : `feat:`, `fix:`, `data:`, `i18n:`, `docs:`

## Phase actuelle

**Phase 0 — Setup & Fondations**

- [ ] Initialiser Next.js 14 + TypeScript + Tailwind
- [ ] Configurer next-intl (routing /fr /en, fichiers messages/fr.json + messages/en.json)
- [ ] Écrire le Dockerfile multi-stage + docker-compose.yml + nginx.conf
- [ ] Configurer GitHub Actions (build + lint + push GHCR)
- [ ] ESLint + Prettier + Husky

Critère de sortie : `docker-compose up` lance l'app, GitHub Actions passe au vert.

## Structure cible du projet

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
│   ├── fr.json
│   └── en.json
├── public/
├── Dockerfile
├── docker-compose.yml
└── nginx.conf
```