# 📋 WikiMaps — PRD V1

## Context

This PRD covers **WikiMaps V1**: an interactive world map centered on a single layer — historical borders with a time slider. The goal is to prove the concept and ship something beautiful and functional.

→ Vision Document: [WikiMaps — Vision Document](./VISION.md)

---

## V1 Goal

Allow anyone to open WikiMaps and explore the evolution of the world's political borders throughout history, entirely through the map.

**Success criterion**: a user can move from year 1 to 2024 by dragging a slider, watch the territories change, and identify any state at any period.

---

## Target Users

A single profile for V1: **the non-expert curious user** — someone who loves history or geography but does not use GIS or technical tools.

---

## User Stories

### Map Navigation

- As a user, **I open the app and immediately see the world map** — no landing screen, no menu.
- As a user, **I can zoom in, zoom out, and pan** across the map freely.
- As a user, **the map fills the entire screen** — no UI element encroaches on the map except the essential controls.

### Time Slider

- As a user, **I see a slider at the bottom of the screen** showing the current year.
- As a user, **I can drag the slider** to change the year and watch the borders update.
- As a user, **I can type a year directly** into the field next to the slider.
- As a user, **I can start an animation** that automatically scrolls through the years.
- As a user, **the covered time range is clearly indicated** (e.g., 500 BC to 2024).

### Historical Layer

- As a user, **I see the political borders** for the selected year, with territories colored by political entity.
- As a user, **I can hover over a territory** to see its name displayed.
- As a user, **I can click on a territory** to see a panel: name, period of existence, link to the source.
- As a user, **the borders animate smoothly** as I move the slider.

### Sources & Attribution

- As a user, **I can see the data source** used for each territory.
- As a user, **I see a link to the license** of the displayed data.

---

## Functional Requirements

| ID  | Feature                                 | Priority |
| --- | --------------------------------------- | -------- |
| F01 | Full-screen interactive world map       | Must     |
| F02 | Native zoom & pan                       | Must     |
| F03 | Time slider (drag + manual input)       | Must     |
| F04 | Historical borders layer (GeoJSON)      | Must     |
| F05 | Hover territory → tooltip with name     | Must     |
| F06 | Click territory → detail panel + source | Must     |
| F07 | Auto-animation of the slider            | Should   |
| F08 | Coloring of territories by entity       | Must     |
| F09 | Visible source attribution              | Must     |
| F10 | Link to raw data / license              | Should   |

---

## Non-Functional Requirements

- **Performance**: smooth rendering (60fps) even with complex GeoJSON
- **Compatibility**: Chrome, Firefox, Safari — desktop first
- **Accessibility**: baseline WCAG AA level (contrast, keyboard navigation)
- **Open source**: code under the MIT license
- **Lightweight**: initial load \< 3s on a standard connection

---

## Out of Scope for V1

- ❌ Contribution / user-editing system
- ❌ Other data layers (statistics, climate, languages…)
- ❌ User accounts
- ❌ Native mobile version
- ❌ Real-time data
- ❌ Search by place or entity
- ❌ Comparison mode (two dates side by side)

---

## Target Data Source

To be validated in the _Data Sources_ document, but the main candidates for V1:

- **Georeferencer / CARTO Historical Boundaries** — historical border data in GeoJSON
- **Historical Borders project** (GitHub) — open source, well maintained
- **Natural Earth** — for the basemap

---

## Open Questions

- [x] **V1 time range** → AD 1 to 2024
- [x] **Slider granularity** → Depends on the source data. The _Historical Basemaps_ project (the primary candidate) covers roughly every 100 years — so the slider will be **per century**, with possible interpolation between two known states.
- [x] **Multiple names depending on the era** → Display the name corresponding to the selected era in the tooltip. In the detail panel: an elegant timeline of successive names (e.g., "Gaul → Francia → France").
- [x] **Mapping library** → To be evaluated in the Technical Architecture; the main constraint is open source and performant with WebGL.
- [x] **Hosting** → Dockerized from the start. Goal: AWS deployment (ECS/Fargate) eventually. V1: Nginx container on a VPS or AWS.

---

## Added Cross-Cutting Requirements

### Internationalization (i18n)

- Multilingual support is a **V1 requirement**, not a future option.
- The UI is translated from the start (English + French at minimum).
- Territory names are stored in multiple languages within the data.
- Wikipedia links point to the version in the user's active language.
- The language is detected automatically (Accept-Language) with the option to switch manually.

---

## V1 Acceptance Criteria

- [ ] The map opens directly without an intermediate screen
- [ ] The slider covers at least 10 centuries of data
- [ ] Each territory is clickable and displays its source
- [ ] The slider animation is smooth on a standard laptop
- [ ] The code is public on GitHub under the MIT license
