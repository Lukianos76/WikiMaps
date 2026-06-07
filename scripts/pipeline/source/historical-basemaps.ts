import type { Feature, FeatureCollection } from 'geojson';

import { fileNameToYearToken, parseYearToken } from '../lib/year';
import type {
  HistoricalBasemapsProperties,
  NormalizedFeature,
  SnapshotRef
} from '../types';

/**
 * Source adapter for Historical Basemaps (aourednik/historical-basemaps).
 *
 * This is the ONLY module that knows the upstream schema and layout. Swapping
 * to another source (e.g. OpenHistoricalMap) means writing a sibling adapter
 * that produces the same `NormalizedFeature[]`; nothing downstream changes.
 *
 * License note: the repo ships a GPL-3.0 LICENSE and states no explicit data
 * license. See `data/NOTICE` and `docs/DATA_SOURCES.md`.
 */
export const SOURCE_NAME = 'Historical Basemaps';
export const SOURCE_URL = 'https://github.com/aourednik/historical-basemaps';

const REPO = 'aourednik/historical-basemaps';
const BRANCH = 'master';
const GEOJSON_DIR = 'geojson';

interface GitHubContentEntry {
  name: string;
  type: string;
  download_url: string | null;
}

/** Snapshot files look like `world_1000.geojson` / `world_bc1000.geojson`. */
const SNAPSHOT_RE = /^world_.+\.geojson$/i;

/** Discover every snapshot file in the upstream `geojson/` directory. */
export async function listSnapshots(): Promise<SnapshotRef[]> {
  const url = `https://api.github.com/repos/${REPO}/contents/${GEOJSON_DIR}?ref=${BRANCH}`;
  const response = await fetch(url, {
    headers: {
      Accept: 'application/vnd.github+json',
      'User-Agent': 'wikimaps-data-pipeline'
    }
  });

  if (!response.ok) {
    throw new Error(
      `GitHub API listing failed (${response.status} ${response.statusText}). ` +
        'Unauthenticated requests are rate-limited to 60/hour — retry later.'
    );
  }

  const entries = (await response.json()) as GitHubContentEntry[];

  return entries
    .filter((e) => e.type === 'file' && SNAPSHOT_RE.test(e.name))
    .map((e) => {
      const yearToken = fileNameToYearToken(e.name);
      return {
        fileName: e.name,
        yearToken,
        year: parseYearToken(yearToken)
      } satisfies SnapshotRef;
    })
    .sort((a, b) => a.year - b.year);
}

/** Raw download URL for a snapshot file (not API rate-limited). */
export function rawUrl(fileName: string): string {
  return `https://raw.githubusercontent.com/${REPO}/${BRANCH}/${GEOJSON_DIR}/${fileName}`;
}

function asText(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function asPrecision(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

/** Map one raw upstream feature to the source-agnostic intermediate. */
function normalizeFeature(feature: Feature): NormalizedFeature {
  const props = (feature.properties ?? {}) as Partial<HistoricalBasemapsProperties>;
  return {
    name: asText(props.NAME),
    subjectTo: asText(props.SUBJECTO),
    partOf: asText(props.PARTOF),
    borderPrecision: asPrecision(props.BORDERPRECISION),
    geometry: feature.geometry ?? null
  };
}

/** Normalize a whole raw snapshot FeatureCollection. */
export function normalizeSnapshot(raw: FeatureCollection): NormalizedFeature[] {
  return raw.features.map(normalizeFeature);
}
