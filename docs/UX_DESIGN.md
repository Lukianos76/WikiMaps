# 🎨 WikiMaps — UX & Design Principles

## Philosophy

WikiMaps is not an app with a map inside it. **WikiMaps is a map** — everything else exists to serve that experience. Every design decision must reinforce the cartographic immersion and reduce the friction between the user and the data.

---

## Reference inspirations

| Source                    | What we take from it                                                                   |
| ------------------------- | -------------------------------------------------------------------------------------- |
| **Europa Universalis IV** | Map filter system, per-entity color palette, time slider integrated into the interface |
| **Victoria 3 / CK3**      | Thematic layers (political, cultural, religious), smooth transitions between modes     |
| **Google Maps**           | Smoothness of zoom and pan, perceived performance                                      |
| **Our World in Data**     | Data legibility, clear tooltips, systematic attribution                                |
| **The True Size Of**      | Total immersion — no chrome, just the map                                              |

---

## Principle 1 — Map-First

The map is the interface. There is no separate menu, no permanent sidebar, no header.

**Rules:**

- The map fills 100% of the window (`width: 100vw; height: 100vh`)
- UI elements (slider, toggles, panel) are **overlaid on the map**, never placed beside it
- Every UI element must be closable / collapsible to free up the view
- On mobile, UI elements fold away into drawers at the bottom of the screen

---

## Principle 2 — Progressive Disclosure

Information appears only when the user asks for it. Nothing is forced on them.

**Levels of information:**

1. **Resting view** — map + slider visible. Nothing else.
2. **Territory hover** — minimal tooltip: territory name in the active language
3. **Territory click** — side panel: name, period, history of names, Wikipedia link
4. **Source click** — attribution details and a link to the raw data

---

## Principle 3 — Temporal fluidity

Moving from one era to another should be an experience, not an operation.

**Rules:**

- Transitions between two map states are **animated** (fade or morphing depending on complexity)
- The slider responds **immediately** to dragging (no perceptible wait)
- The displayed year changes in **real time** while dragging
- The auto-play animation advances at a readable pace: ~1 century/second by default

---

## Principle 4 — Color as language

Colors identify political entities; they don't decorate.

**Rules:**

- Each entity has a color that stays stable over time (the Roman Empire always has the same color)
- Neighboring colors on the map must be contrasted enough to be distinguishable
- Palette: **desaturated, cartographic** colors — inspired by printed atlases, not modern dataviz
- Map background: neutral and understated (light natural terrain or sand tones)
- Dark mode available (targeted for post-V1)

---

## Principle 5 — Discreet controls

The UI must never compete with the map for attention.

**Rules:**

- UI component colors: neutral (white, gray, semi-transparent black)
- Light drop shadows to separate the UI from the map background
- Button size: minimum 44x44px (touch accessibility)
- Typography: a discreet serif for territory names, sans-serif for the UI

---

## Element layout

```javascript
┌────────────────────────────────────────┐
│                                        │
│            MAP (100vw x 100vh)         │
│                                        │
│   [Language switch]      [+ zoom]      │
│   top left              top right      │
│                                        │
│   [Territory panel ← click]            │
│   left, overlaid, closable             │
│                                        │
│  [◄ |►  Time slider          2024 ]   │
│          bottom, full width            │
└────────────────────────────────────────┘
```

---

## Interaction behaviors

| Element         | Action            | Result                                  |
| --------------- | ----------------- | --------------------------------------- |
| Map             | Scroll / pinch    | Zoom                                    |
| Map             | Drag              | Pan                                     |
| Territory       | Hover             | Tooltip (name)                          |
| Territory       | Click             | Detail panel                            |
| Panel           | Click outside     | Close                                   |
| Slider          | Drag              | Year change + map update                |
| Slider          | Click play        | Automatic animation                     |
| Slider          | Double-click year | Manual entry                            |
| Language switch | Click             | Toggle EN/FR, persisted in localStorage |

---

## Accessibility (WCAG AA)

- Text/background contrast: minimum ratio of 4.5:1
- Keyboard navigation: slider accessible via arrow keys, panel via Tab/Escape
- Visible focus on all interactive elements
- Alternative text on icon elements
- The map is not accessible to screen readers (visual by nature) — acceptable in V1

---

## Post-V1 evolutions

- Dark mode (dark map)
- Layer selector (an EU4-style layers panel)
- Navigation minimap
- Fullscreen / presentation mode
- Sharing a link with a specific year and map position

---

## Related documents

- [Vision](./VISION.md)
- [PRD](./PRD.md)
- [Architecture](./ARCHITECTURE.md)
- [Roadmap](./ROADMAP.md)
- [UX & Design](./UX_DESIGN.md)
- [Data Sources](./DATA_SOURCES.md)
- [Contributing](../CONTRIBUTING.md)
