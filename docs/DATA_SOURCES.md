# 🗄️ WikiMaps — Data Sources

> **⚠️ Direction update (2026-06).** Historical Basemaps proved too coarse. The active source
> is now **OpenHistoricalMap (CC0)** — detailed, **year-precise** (per-feature validity dates),
> with multilingual names and Wikidata QIDs — seeded into our own dataset and refined by hand,
> **Europe-first**. OHM is too densely versioned to bulk-download in one file, so the seed
> produces bounded per-year detailed snapshots (`data/europe/admin2-<year>.geojson`) via the
> OHM Overpass API (`scripts/pipeline/source/openhistoricalmap.ts`, `npm run data:seed-europe`).
> The Historical Basemaps material below is retained as a possible deep-time fallback (its GPL
> data-license ambiguity, issue #12, only matters if those files ship). CC0 sidesteps that.

## Objective

Inventory the open source data sources usable for WikiMaps, and assess their quality, temporal coverage, license, and technical compatibility.

---

## Primary source — Historical borders

### Historical Basemaps (aourednik)

| Field       | Value                                                                                                |
| ----------- | ---------------------------------------------------------------------------------------------------- |
| URL         | [https://github.com/aourednik/historical-basemaps](https://github.com/aourednik/historical-basemaps) |
| Format      | GeoJSON                                                                                              |
| Coverage    | bc123000 → 2010 (53 worldwide snapshots)                                                             |
| Granularity | ~every 100 years; finer near the modern era (1279, 1492, 1715, 1783, 1815, 1914, 1938, 1945, 1994…)  |
| License     | ⚠️ **GPL-3.0** (repo LICENSE). Data license **unstated** — ambiguous, to confirm with the author     |
| Maintenance | Active, open contributions                                                                           |
| Quality     | Good for large entities, less precise for ancient periods                                            |

**Status**: ✅ Selected for V1.

**Verified (2026-06)**:

- [x] Granularity — ~100-year steps, denser near modern times (see above).
- [x] Worldwide coverage — yes, global.
- [x] Name format — **English only** (`NAME`); multilingual names added via Wikidata.
- [x] Stable identifiers — **none**. Each file is an independent snapshot; there is no
      entity continuity across periods. V1 is therefore **snapshots-only** (per-file slug
      ids); cross-period `name_history` is deferred to post-V1.

**Per-feature properties** (upstream): `NAME`, `ABBREVN`, `INFO_UR`, `SUBJECTO` (sovereign
power / region), `BORDERPRECISION` (1 = approximate, 2 = moderate, 3 = legally determined),
`PARTOF` (larger cultural area). Many features have `NAME: null` (water / unclaimed) and are
dropped by the pipeline.

> **⚠️ License caveat** — Contrary to an earlier version of this document, the upstream repo
> is **not** CC BY-SA 4.0: its only LICENSE file is **GPL-3.0**, and neither the README nor
> CONTRIBUTING states a license for the data itself. Applying GPL-3.0 (a software license) to
> data is ambiguous. **Must be resolved before any public launch** (clarify with the author).
> Until then we treat the data as GPL-3.0: attribution + share-alike + preserve `data/NOTICE`.

---

### Alternatives evaluated

| Source            | URL                                                                    | Format      | License                | Note                |
| ----------------- | ---------------------------------------------------------------------- | ----------- | ---------------------- | ------------------- |
| HGIS (Harvard)    | [https://hgis.fas.harvard.edu](https://hgis.fas.harvard.edu)           | Shapefile   | Academic / restrictive | ❌ Non-free license |
| Pleiades          | [https://pleiades.stoa.org](https://pleiades.stoa.org)                 | GeoJSON     | CC BY 3.0              | Antiquity only      |
| GeaCron           | [https://geacron.com](https://geacron.com)                             | Proprietary | Non-free               | ❌ Not open source  |
| Omniatlas         | [https://omniatlas.com](https://omniatlas.com)                         | Proprietary | Non-free               | ❌ Not open source  |
| OpenHistoricalMap | [https://www.openhistoricalmap.org](https://www.openhistoricalmap.org) | OSM/GeoJSON | **CC0** (not ODbL)     | 🟡 Deep time sparse |
| CShapes 2.0       | [https://icr.ethz.ch/data/cshapes](https://icr.ethz.ch/data/cshapes)   | GeoJSON     | CC BY-NC-SA ❌ (NC)    | Only 1886→2019      |
| geoBoundaries     | [https://www.geoboundaries.org](https://www.geoboundaries.org)         | GeoJSON     | CC BY 4.0              | Present-day only    |

---

## Basemap (base layer)

### Natural Earth

| Field   | Value                                                                |
| ------- | -------------------------------------------------------------------- |
| URL     | [https://www.naturalearthdata.com](https://www.naturalearthdata.com) |
| Format  | Shapefile / GeoJSON                                                  |
| Content | Coastlines, terrain, oceans, present-day countries                   |
| License | Public domain                                                        |
| Usage   | Static basemap (coastlines, oceans)                                  |

**Status**: ✅ Selected for the basemap

---

## Enrichment — Territory metadata

### Wikidata

| Field   | Value                                                                 |
| ------- | --------------------------------------------------------------------- |
| URL     | [https://www.wikidata.org](https://www.wikidata.org)                  |
| Format  | SPARQL API / JSON                                                     |
| Content | Multilingual names, dates, Wikipedia links, stable identifiers        |
| License | CC0 (public domain)                                                   |
| Usage   | Territory names in FR/EN + other languages, localized Wikipedia links |

**Status**: ✅ Selected for multilingual enrichment

**Example SPARQL query** to retrieve the names of an empire:

```javascript
SELECT ?label WHERE {
  wd:Q1747689 rdfs:label ?label .
  FILTER(LANG(?label) IN ("fr", "en", "de", "es"))
}
```

---

## Decision matrix

| Criterion           | Historical Basemaps       | OpenHistoricalMap       |
| ------------------- | ------------------------- | ----------------------- |
| Worldwide coverage  | ✅                        | ✅ (uneven)             |
| Temporal coverage   | ✅ deep (bc123000 → 2010) | 🟡 ~last 5 centuries    |
| Free license        | ⚠️ GPL-3.0 (ambiguous)    | ✅ **CC0**              |
| GeoJSON format      | ✅                        | ✅                      |
| Native multilingual | ❌ (EN only)              | ✅ `name:xx` + Wikidata |
| Active maintenance  | ✅                        | ✅                      |
| Data quality        | ✅ Good                   | 🟡 Uneven               |

**Conclusion**: **Historical Basemaps + Wikidata enrichment = V1 data stack**, chosen for its
unique deep-time coverage (the only free source spanning ≥ 20 centuries). OpenHistoricalMap
(CC0, multilingual + Wikidata built in) is the leading **post-V1 alternative** — cleaner
license and richer metadata — once its deep-time coverage matures. The pipeline isolates the
source behind a single adapter (`scripts/pipeline/source/`) so switching later is cheap.

---

## Legal obligations & attribution

- **GPL-3.0 / unstated** (Historical Basemaps): treat as GPL-3.0 — attribution + share-alike +
  preserve the license notice. ⚠️ Data-license ambiguity **must be resolved before public
  launch** (see the caveat above and `data/NOTICE`).
- **CC0** (Wikidata): no obligation, free to use
- **Public domain** (Natural Earth): no obligation

**Attribution required in the app**:

> Historical data: [Historical Basemaps](https://github.com/aourednik/historical-basemaps) · Metadata: [Wikidata](https://www.wikidata.org) (CC0) · Basemap: [Natural Earth](https://www.naturalearthdata.com)

The canonical machine-readable attribution + license status lives in [`data/NOTICE`](../data/NOTICE).

---

## Actions to carry out (Phase 1 Roadmap)

- [x] Clone Historical Basemaps and analyze the actual file structure → `scripts/pipeline/`
- [x] Verify the precise temporal granularity (53 snapshots, see table above)
- [x] Test the Wikidata query to enrich 5 pilot entities → `npm run data:enrich -- --pilot`
- [ ] Load a transformed GeoJSON into MapLibre (deferred to Phase 2)
- [ ] Assess GeoJSON file sizes / performance (lazy loading, TopoJSON — post-V1)
