# Contributing to WikiMaps

## Welcome

WikiMaps is a community-driven open source project. Every contribution is welcome: code, data, translations, fixes, and suggestions. This guide explains how to take part.

> **English-first project.** Everything we produce around the project — code, comments, documentation, commit messages, pull requests, branch names, and issues — is written in English. The application itself, however, ships in both English and French locales (with more languages welcome).

For more context, see:

- Vision → [./docs/VISION.md](./docs/VISION.md)
- PRD → [./docs/PRD.md](./docs/PRD.md)
- Architecture → [./docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)
- Roadmap → [./docs/ROADMAP.md](./docs/ROADMAP.md)
- UX & Design → [./docs/UX_DESIGN.md](./docs/UX_DESIGN.md)
- Data Sources → [./docs/DATA_SOURCES.md](./docs/DATA_SOURCES.md)

---

## Types of contributions

| Type              | Description                                     |
| ----------------- | ----------------------------------------------- |
| **Code**          | Features, bug fixes, performance                |
| **Data**          | New historical entities, geographic corrections |
| **Translations**  | Territory names, UI strings in new languages    |
| **Documentation** | README, guides, examples                        |
| **Issues**        | Report a bug, suggest an improvement            |

---

## Code contributions

### Prerequisites

- Node.js 24+
- Docker + docker compose
- Git

### Workflow

1. **Fork** the repo on GitHub
2. **Clone** your fork locally
3. **Create a branch** from `main`: `git checkout -b feat/feature-name`
4. **Develop** using `docker compose up` for the local environment
5. **Test**: tests must pass (`npm test`)
6. **Commit** following the convention (see below)
7. **Open a Pull Request** against `main` with a clear description

### Commit convention

We use [Conventional Commits](https://www.conventionalcommits.org/), enforced by commitlint via a `commit-msg` Git hook. Allowed types include the standard set plus the project-specific `data:` and `i18n:`:

```
feat: add timeline slider animation
fix: correct tooltip on Safari
data: add Mongol Empire borders
i18n: add Spanish territory names
docs: update README
```

### Code standards

- TypeScript strict (`strict: true`) — no `any` without a justifying comment
- ESLint (flat config) + Prettier (config included in the repo)
- Functional React components only
- Vitest tests required for any business logic

---

## Data contributions

### Expected format

Any data added must follow the WikiMaps enriched GeoJSON schema:

```json
{
  "type": "Feature",
  "geometry": { "..." },
  "properties": {
    "id": "stable_snake_case_identifier",
    "names": {
      "fr": "Nom en français",
      "en": "Name in English"
    },
    "name_history": [
      {
        "name": { "fr": "Ancien nom", "en": "Old name" },
        "from": 800,
        "to": 1200
      }
    ],
    "start_year": 800,
    "end_year": 1453,
    "source": "Source name",
    "source_url": "https://...",
    "wikipedia": {
      "fr": "https://fr.wikipedia.org/wiki/...",
      "en": "https://en.wikipedia.org/wiki/..."
    }
  }
}
```

### Rules for data

- **Always cite your sources**: every entity must have a verifiable `source_url`
- **Bilingual names minimum**: FR + EN are required. Other languages are a bonus.
- **Stable identifier**: the `id` field must never change once added
- **No opinions**: WikiMaps shows documented historical facts, not interpretations
- **Contested borders**: flag them explicitly with `contested: true` and a note

### Validation process

1. Open an issue describing the territory or period concerned
2. Submit a PR with the modified GeoJSON files
3. A maintainer verifies the source and the geometric quality
4. Merge after validation

---

## Translation contributions

### Adding a UI language

1. Copy `messages/en.json` to `messages/[language-code].json`
2. Translate every key
3. Add the locale in `i18n.ts`
4. Open a PR

### Adding territory names

1. Find entities without a name in your language (incomplete `names` field)
2. Add the translations in the corresponding GeoJSON files
3. Cite the names (Wikipedia in the target language preferred)
4. Open a PR with the `i18n:` type

---

## Governance

- The project is maintained by its creator and active contributors
- Major decisions are discussed on **GitHub Discussions** before implementation
- PRs are reviewed within **7 business days**
- Anyone can comment; maintainers hold the merge

---

## Code of conduct

WikiMaps adopts the [Contributor Covenant](https://www.contributor-covenant.org/) v2.1. See [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md) for the full text.

In short: be respectful, inclusive, and constructive. Discussions about historical borders can be sensitive — stay factual and well-sourced.

---

## Reporting a bug

Open a GitHub issue with:

- A description of the observed behavior
- Steps to reproduce
- The browser and version
- A screenshot if relevant

---

## Thank you

Every contribution, however small, moves WikiMaps forward. The project exists because people like you believe that knowledge of the world should be beautiful and accessible.
