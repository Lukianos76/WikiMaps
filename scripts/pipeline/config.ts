import path from 'node:path';

/**
 * Shared configuration for the WikiMaps data pipeline.
 *
 * All pipeline scripts are launched via npm (`npm run data:*`), so the process
 * working directory is always the repository root — we anchor every path on it.
 */
export const ROOT = process.cwd();

const PIPELINE_DIR = path.join(ROOT, 'scripts', 'pipeline');

export const PATHS = {
  /** Raw upstream snapshots, gitignored — re-fetched via `npm run data:fetch`. */
  cacheDir: path.join(ROOT, '.cache', 'historical-basemaps'),
  /** Manifest written by fetch, consumed offline by the later stages. */
  manifest: path.join(ROOT, '.cache', 'historical-basemaps', 'manifest.json'),
  /** Committed, transformed output served by the app. */
  bordersOut: path.join(ROOT, 'data', 'borders'),
  /** Committed Wikidata resolution cache (reproducible, offline-friendly). */
  wikidataCache: path.join(PIPELINE_DIR, 'wikidata-cache.json'),
  /** Manual NAME -> QID overrides; win over auto-matching. */
  overrides: path.join(PIPELINE_DIR, 'overrides.json')
} as const;

/** Target languages for localized names (V1: English + French). */
export const TARGET_LANGS = ['en', 'fr'] as const;
export type TargetLang = (typeof TARGET_LANGS)[number];

/** Phase 1 exit criterion: at least this many snapshots must carry EN+FR names. */
export const MIN_SNAPSHOTS_WITH_NAMES = 20;
