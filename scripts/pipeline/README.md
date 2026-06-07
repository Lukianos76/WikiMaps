# WikiMaps data pipeline

Turns the upstream historical-border source into the enriched GeoJSON served by the
app (`data/borders/`). Phase 1 deliverable — see [`docs/DATA_SOURCES.md`](../../docs/DATA_SOURCES.md).

## Stages

| Stage     | Command                  | Input → Output                                          |
| --------- | ------------------------ | ------------------------------------------------------- |
| Fetch     | `npm run data:fetch`     | Source API → `.cache/historical-basemaps/` (+ manifest) |
| Enrich    | `npm run data:enrich`    | Distinct names → Wikidata → `wikidata-cache.json`       |
| Transform | `npm run data:transform` | Cache + raw → `data/borders/world_*.geojson`            |
| Validate  | `npm run data:validate`  | Output → quality report + exit-criterion assertion      |
| **All**   | `npm run data:build`     | fetch → enrich → transform → validate                   |

`.cache/` is gitignored (re-fetchable). Only the transformed `data/borders/` and the
committed `wikidata-cache.json` are versioned.

## Layout

```
config.ts                     Paths, target languages, exit-criterion threshold
types.ts                      Source props, normalized intermediate, output schema
lib/{slug,year,io,pool}.ts    Pure helpers (unit-tested where it matters)
lib/wikidata.ts               Wikidata client (search + batch labels/sitelinks)
source/historical-basemaps.ts ISOLATED source adapter — the only source-aware module
mapper.ts                     Pure raw→output mapping (snapshot-scoped)
fetch.ts / enrich-wikidata.ts / transform.ts / validate.ts   Stage entry points
overrides.json                Manual NAME → QID pins for tricky matches
wikidata-cache.json           Committed resolution cache (reproducible, incremental)
```

## Notes

- **Source isolation.** Everything upstream-specific lives in `source/historical-basemaps.ts`,
  which emits a source-agnostic `NormalizedFeature[]`. Swapping to OpenHistoricalMap (CC0)
  later means adding a sibling adapter — nothing else changes.
- **V1 = snapshots only.** The source has no stable entity ids across periods, so `id` is a
  per-file slug (unique within a snapshot, not across years). Cross-period `name_history` is
  post-V1.
- **Wikidata matching is precision-first.** A non-confident name resolves to `null` and the
  French name falls back to English, rather than risk a wrong entity. Fix individual cases in
  `overrides.json` (`{ "Some Name": "Q1234" }`) then re-run `data:enrich` + `data:transform`.
- **Enrichment is resumable.** The cache is checkpointed every 200 names and re-runs only
  resolve names absent from the cache. `--pilot` resolves 5 sample entities without writing.
- **Licensing.** Source data is GPL-3.0 / ambiguous — see [`data/NOTICE`](../../data/NOTICE).
  Must be resolved before any public launch.
