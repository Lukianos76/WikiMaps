import type { Feature, Geometry } from 'geojson';

import { SOURCE_NAME, SOURCE_URL } from './source/historical-basemaps';
import { makeUniqueSlug, slugify } from './lib/slug';
import { TARGET_LANGS } from './config';
import type {
  LocalizedNames,
  NormalizedFeature,
  TerritoryProperties,
  WikidataCache,
  WikipediaLinks
} from './types';

export type TerritoryFeature = Feature<Geometry, TerritoryProperties>;

function buildNames(
  sourceName: string,
  cacheLabels: Partial<LocalizedNames>
): LocalizedNames {
  // English is the source language; other targets fall back to it when unmatched.
  const en = cacheLabels.en?.trim() || sourceName;
  const names = { en } as LocalizedNames;
  for (const lang of TARGET_LANGS) {
    if (lang === 'en') continue;
    names[lang] = cacheLabels[lang]?.trim() || en;
  }
  return names;
}

function nonEmptyWikipedia(links: WikipediaLinks | undefined): WikipediaLinks | null {
  if (!links) return null;
  const entries = Object.entries(links).filter(([, url]) => Boolean(url));
  return entries.length > 0 ? (Object.fromEntries(entries) as WikipediaLinks) : null;
}

/**
 * Pure raw→output mapping for one snapshot. Source-agnostic: consumes the
 * normalized intermediate plus the Wikidata cache, emits territory features.
 *
 * Features without a name or geometry are dropped (not labelable territories).
 * Slugs are made unique within the snapshot but are NOT stable across years.
 */
export function buildTerritoryFeatures(
  normalized: NormalizedFeature[],
  year: number,
  cache: WikidataCache
): TerritoryFeature[] {
  const usedSlugs = new Set<string>();
  const features: TerritoryFeature[] = [];

  for (const item of normalized) {
    if (!item.name || !item.geometry) continue;

    const entry = cache[item.name];
    const id = makeUniqueSlug(slugify(item.name), usedSlugs);

    const properties: TerritoryProperties = {
      id,
      name: item.name,
      names: buildNames(item.name, entry?.labels ?? {}),
      subjectTo: item.subjectTo,
      partOf: item.partOf,
      borderPrecision: item.borderPrecision,
      wikidata: entry?.qid ?? null,
      wikipedia: nonEmptyWikipedia(entry?.wikipedia),
      year,
      source: SOURCE_NAME,
      sourceUrl: SOURCE_URL
    };

    features.push({ type: 'Feature', geometry: item.geometry, properties });
  }

  return features;
}
