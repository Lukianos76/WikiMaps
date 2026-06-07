# WikiMaps — Vision Document

WikiMaps is a free, open-source interactive world atlas where **the map is the interface**. Rather than navigating through menus, users explore the world directly on the map and choose what they want to see by toggling data layers on and off.

The ambition: to do for geography and global data what Wikipedia did for knowledge — make everything freely accessible to anyone.

---

## Problem

Geographic and global data exists in abundance, but it is:

- **Scattered** — spread across Wikipedia, Our World in Data, OpenStreetMap, and academic databases
- **Ugly** — existing tools (Omniatlas, GIS tools) are functional but off-putting to a general audience
- **Siloed** — each tool shows only a single type of data
- **Non-interactive** — paper atlases and static websites don't allow for free exploration

---

## Solution

A single world map where users toggle **thematic layers** on demand:

- Historical borders with a **time slider** (inspiration: Europa Universalis / Paradox games)
- Statistical data (population, climate, economy, health, etc.)
- Cultural data (languages, religions, ethnic groups, etc.)
- Real-time data (eventually)

The map is not an element on the page — **it is the entire page**. No separate menu. Everything happens on the map.

---

## Principles

| Principle              | Description                                                      |
| ---------------------- | ---------------------------------------------------------------- |
| **Map-first**          | The map is the primary interface, not just one widget among many |
| **Layered**            | Everything is a layer that can be toggled on or off              |
| **Contributive**       | Data is added and verified by the community, like Wikipedia      |
| **Sourced**            | Every piece of data is linked to its primary source              |
| **Free & open source** | No paywall, public code, open data                               |
| **Beautiful**          | Aesthetics are a feature, not a bonus                            |

---

## Target Audience

**Primary**: The curious, students, history and geography enthusiasts, journalists — anyone who wants to _understand the world_ visually.

**Secondary**: Teachers, researchers, content creators.

---

## Inspiration

- **Europa Universalis / Paradox games** — map filter system, time slider
- **Wikipedia** — contributive, sourced, free model
- **Our World in Data** — accessible global data
- **OpenStreetMap** — open source, community-driven

---

## What WikiMaps Is Not

- ❌ A navigation tool (not Google Maps)
- ❌ An analytics dashboard (not Kepler.gl)
- ❌ A game (even though the inspiration comes from one)
- ❌ A commercial product

---

## V1 — Scope

The first version focuses on **a single layer** to prove the concept:

> **Global historical borders with a time slider**

Why this choice:

- Maximum differentiation from existing tools
- Visually spectacular and shareable
- Demonstrates the entire UX vision (map-as-interface, layers, slider)
- Existing open-source data is available to work with

---

## Linked Documents

- [ ] [PRD (Product Requirements Document)](./PRD.md)
- [ ] [Technical Architecture](./ARCHITECTURE.md)
- [ ] [Roadmap](./ROADMAP.md)
- [ ] [UX / Design Principles](./UX_DESIGN.md)
- [ ] [Data Sources](./DATA_SOURCES.md)
- [ ] [Contributing Guide](../CONTRIBUTING.md)
