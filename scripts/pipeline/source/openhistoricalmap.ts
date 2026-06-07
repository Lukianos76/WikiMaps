import { parseOhmDate } from '../lib/ohm-date';
import type { TemporalTerritoryProperties } from '../types';

/**
 * Source adapter for OpenHistoricalMap (CC0).
 *
 * Like the Historical Basemaps adapter, this is the only OHM-aware module: it
 * builds the Overpass query, fetches, and maps OSM tags → our year-precise
 * `TemporalTerritoryProperties`. OHM admin boundaries carry `name` / `name:xx`,
 * `start_date` / `end_date` and a `wikidata` QID — a near 1:1 fit for our model.
 */
export const SOURCE_NAME = 'OpenHistoricalMap';
export const SOURCE_URL = 'https://www.openhistoricalmap.org';

const OVERPASS_URL = 'https://overpass-api.openhistoricalmap.org/api/interpreter';
const USER_AGENT = 'wikimaps-data-pipeline (https://github.com/Lukianos76/WikiMaps)';

/** Europe bounding box [south, west, north, east] — Iceland to the Urals/Anatolia edge. */
export const EUROPE_BBOX: [number, number, number, number] = [34, -25, 72, 45];

export type OsmTags = Record<string, string>;
export interface OsmJson {
  elements: { type: string; id: number; tags?: OsmTags }[];
}

/**
 * Admin boundaries within a bbox whose validity overlaps [windowStart, windowEnd],
 * with full geometry. The time window is essential: querying all of history at
 * once exceeds Node's max string size. OHM dates are zero-padded ISO, so the
 * bounds compare lexicographically (pass 4-digit year strings, e.g. "1400").
 */
export function buildBoundaryQuery(
  bbox: [number, number, number, number],
  adminLevel: number,
  windowStart: string,
  windowEnd: string
): string {
  const [s, w, n, e] = bbox;
  const overlap =
    `(if: (!is_tag("start_date") || t["start_date"] <= "${windowEnd}") && ` +
    `(!is_tag("end_date") || t["end_date"] >= "${windowStart}"))`;
  return (
    `[out:json][timeout:300];` +
    `rel["boundary"="administrative"]["admin_level"="${adminLevel}"](${s},${w},${n},${e})${overlap};` +
    `out geom;`
  );
}

/**
 * Admin boundaries active AT a single year within a bbox (a detailed snapshot),
 * with full geometry. Bounded in size — unlike the all-versions range query,
 * which is too large to buffer. `year` is a zero-padded year string ("1600").
 */
export function buildSnapshotQuery(
  bbox: [number, number, number, number],
  adminLevel: number,
  year: string
): string {
  const [s, w, n, e] = bbox;
  const activeAt =
    `(if: (!is_tag("start_date") || t["start_date"] <= "${year}") && ` +
    `(!is_tag("end_date") || t["end_date"] > "${year}"))`;
  return (
    `[out:json][timeout:180];` +
    `rel["boundary"="administrative"]["admin_level"="${adminLevel}"](${s},${w},${n},${e})${activeAt};` +
    `out geom;`
  );
}

export async function fetchOverpass(query: string): Promise<OsmJson> {
  const response = await fetch(OVERPASS_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': USER_AGENT
    },
    body: new URLSearchParams({ data: query }).toString()
  });
  if (!response.ok) {
    throw new Error(`OHM Overpass ${response.status} ${response.statusText}`);
  }
  return (await response.json()) as OsmJson;
}

function collectNames(tags: OsmTags): Record<string, string> {
  const names: Record<string, string> = {};
  for (const [key, value] of Object.entries(tags)) {
    if (key.startsWith('name:') && value) names[key.slice(5)] = value;
  }
  // Default `name` (often the local/Latin form) backs up English.
  if (!names.en && tags.name) names.en = tags.name;
  return names;
}

/**
 * Map OSM tags + a fallback id (e.g. osmtogeojson's `relation/123`) to our
 * year-precise properties. Returns null when there is no usable name.
 */
export function tagsToTemporal(
  tags: OsmTags,
  fallbackId: string
): TemporalTerritoryProperties | null {
  const names = collectNames(tags);
  if (Object.keys(names).length === 0) return null;

  const wikidata = /^Q\d+$/.test(tags.wikidata ?? '') ? tags.wikidata : null;
  const adminLevel = tags.admin_level ? Number.parseInt(tags.admin_level, 10) : null;

  return {
    id: wikidata ?? `ohm-${fallbackId.replace('/', '-')}`,
    names,
    from: parseOhmDate(tags.start_date),
    to: parseOhmDate(tags.end_date),
    wikidata,
    adminLevel: Number.isFinite(adminLevel) ? adminLevel : null,
    source: SOURCE_NAME,
    sourceUrl: SOURCE_URL
  };
}
