import type { Geometry } from 'geojson';

import type { TargetLang } from './config';

/**
 * Raw per-feature properties as published by Historical Basemaps.
 * Every field is nullable in the upstream data.
 *
 * Source-specific — only the source adapter should read this shape.
 */
export interface HistoricalBasemapsProperties {
  NAME: string | null;
  ABBREVN: string | null;
  INFO_UR: string | null;
  SUBJECTO: string | null;
  BORDERPRECISION: number | null;
  PARTOF: string | null;
}

/**
 * Source-agnostic intermediate produced by a source adapter.
 * The transform stage consumes only this, so swapping the upstream source
 * means writing a new adapter, not touching the transform.
 */
export interface NormalizedFeature {
  /** Primary territory name in the source language (English for HB). */
  name: string | null;
  /** Colonial/sovereign power exercising authority, or the region itself. */
  subjectTo: string | null;
  /** Larger cultural area this region belongs to, if any. */
  partOf: string | null;
  /** Border fuzziness: 1 = approximate, 2 = moderate, 3 = legally determined. */
  borderPrecision: number | null;
  geometry: Geometry | null;
}

/** One historical snapshot file discovered in the source. */
export interface SnapshotRef {
  /** e.g. `world_1000.geojson`. */
  fileName: string;
  /** e.g. `1000` or `bc1000`. */
  yearToken: string;
  /** Numeric year, negative for BC. */
  year: number;
}

/** Manifest written by the fetch stage for offline reuse downstream. */
export interface FetchManifest {
  source: string;
  sourceUrl: string;
  fetchedAtIso: string;
  snapshots: SnapshotRef[];
}

export type LocalizedNames = Record<TargetLang, string>;
export type WikipediaLinks = Partial<Record<TargetLang, string>>;

/** One resolved entry in the committed Wikidata cache, keyed by source NAME. */
export interface WikidataEntry {
  /** Wikidata QID, or null when no confident match was found. */
  qid: string | null;
  /** Localized labels for the target languages, when available. */
  labels: Partial<Record<TargetLang, string>>;
  /** Localized Wikipedia article URLs, when available. */
  wikipedia: WikipediaLinks;
}

export type WikidataCache = Record<string, WikidataEntry>;

/** Output GeoJSON feature properties — the WikiMaps territory schema (V1). */
export interface TerritoryProperties {
  /** Slug of `name`, unique within the snapshot file. Not stable across years. */
  id: string;
  /** Original source NAME (English). */
  name: string;
  /** Localized names; `fr` falls back to `en` when unmatched. */
  names: LocalizedNames;
  subjectTo: string | null;
  partOf: string | null;
  borderPrecision: number | null;
  /** Wikidata QID, or null. */
  wikidata: string | null;
  /** Localized Wikipedia URLs, or null when none resolved. */
  wikipedia: WikipediaLinks | null;
  /** Numeric year of the snapshot, negative for BC. */
  year: number;
  source: string;
  sourceUrl: string;
}
