# 🗄️ WikiMaps — Data Sources

## Objective

Inventory the open source data sources usable for WikiMaps, and assess their quality, temporal coverage, license, and technical compatibility.

---

## Primary source — Historical borders

### Historical Basemaps (aourednik)

| Field       | Value                                                                                                |
| ----------- | ---------------------------------------------------------------------------------------------------- |
| URL         | [https://github.com/aourednik/historical-basemaps](https://github.com/aourednik/historical-basemaps) |
| Format      | GeoJSON / Shapefile                                                                                  |
| Coverage    | ~1000 BC → 2023                                                                                      |
| Granularity | Roughly every 100 years (to be confirmed)                                                            |
| License     | CC BY-SA 4.0                                                                                         |
| Maintenance | Active, open contributions                                                                           |
| Quality     | Good for large entities, less precise for ancient periods                                            |

**Status**: ✅ Candidate selected for V1 — to be validated technically

**Items to verify**:

- [ ] Exact granularity per period
- [ ] Worldwide coverage or Europe-centric?
- [ ] Name format (English only?)
- [ ] Presence of stable identifiers per entity

---

### Alternatives evaluated

| Source            | URL                                                                    | Format      | License                | Note                |
| ----------------- | ---------------------------------------------------------------------- | ----------- | ---------------------- | ------------------- |
| HGIS (Harvard)    | [https://hgis.fas.harvard.edu](https://hgis.fas.harvard.edu)           | Shapefile   | Academic / restrictive | ❌ Non-free license |
| Pleiades          | [https://pleiades.stoa.org](https://pleiades.stoa.org)                 | GeoJSON     | CC BY 3.0              | Antiquity only      |
| GeaCron           | [https://geacron.com](https://geacron.com)                             | Proprietary | Non-free               | ❌ Not open source  |
| Omniatlas         | [https://omniatlas.com](https://omniatlas.com)                         | Proprietary | Non-free               | ❌ Not open source  |
| OpenHistoricalMap | [https://www.openhistoricalmap.org](https://www.openhistoricalmap.org) | OSM/GeoJSON | ODbL                   | 🟡 Very incomplete  |

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

| Criterion           | Historical Basemaps | OpenHistoricalMap |
| ------------------- | ------------------- | ----------------- |
| Worldwide coverage  | ✅                  | 🟡 Partial        |
| Temporal coverage   | ✅ ~3000 years      | 🟡 Variable       |
| Free license        | ✅ CC BY-SA         | ✅ ODbL           |
| GeoJSON format      | ✅                  | ✅                |
| Native multilingual | ❌ (EN only)        | 🟡 Partial        |
| Active maintenance  | ✅                  | 🟡                |
| Data quality        | ✅ Good             | 🟡 Uneven         |

**Conclusion**: Historical Basemaps + Wikidata enrichment = V1 data stack.

---

## Legal obligations & attribution

- **CC BY-SA 4.0** (Historical Basemaps): mandatory attribution + share-alike under the same terms
- **CC0** (Wikidata): no obligation, free to use
- **Public domain** (Natural Earth): no obligation

**Attribution required in the app**:

> Historical data: [Historical Basemaps](https://github.com/aourednik/historical-basemaps) (CC BY-SA 4.0) · Metadata: [Wikidata](https://www.wikidata.org) (CC0) · Basemap: [Natural Earth](https://www.naturalearthdata.com)

---

## Actions to carry out (Phase 1 Roadmap)

- [ ] Clone Historical Basemaps and analyze the actual file structure
- [ ] Verify the precise temporal granularity
- [ ] Write a test script to load a GeoJSON into MapLibre
- [ ] Test the Wikidata query to enrich 5 pilot entities
- [ ] Assess the size of the GeoJSON files (performance impact)
