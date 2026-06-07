import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

import simplify from '@turf/simplify';
import type {
  Feature,
  FeatureCollection,
  Geometry,
  MultiPolygon,
  Polygon
} from 'geojson';
import osmtogeojson from 'osmtogeojson';

import { ROOT } from './config';
import {
  EUROPE_BBOX,
  SOURCE_NAME,
  buildSnapshotQuery,
  fetchOverpass,
  tagsToTemporal,
  type OsmTags
} from './source/openhistoricalmap';
import type { TemporalTerritoryProperties } from './types';

const OUT_DIR = path.join(ROOT, 'data', 'europe');

// Full-Europe detailed snapshots at a coarse cadence. A single all-history query
// is too large to buffer, but one year for all of Europe is ~49 MB (fine). Each
// snapshot is geometry-simplified + coordinate-rounded to stay committable. Finer
// cadence = just add years (watch the total committed size). See issue #17.
const YEARS = [1500, 1550, 1600, 1650, 1700, 1750, 1800, 1850, 1900, 1950, 2000];
const SIMPLIFY_TOLERANCE = 0.01; // degrees (~1 km) — crisp at continental zoom
const COORD_DECIMALS = 4; // ~11 m precision
const POLITE_DELAY_MS = 2000;

const sleep = (ms: number): Promise<void> => new Promise((r) => setTimeout(r, ms));

type Nested = number | Nested[];

function roundGeometry(g: Polygon | MultiPolygon): Polygon | MultiPolygon {
  const factor = 10 ** COORD_DECIMALS;
  const round = (v: Nested): Nested =>
    typeof v === 'number' ? Math.round(v * factor) / factor : v.map(round);
  if (g.type === 'Polygon') {
    return {
      ...g,
      coordinates: round(g.coordinates as Nested) as unknown as Polygon['coordinates']
    };
  }
  return {
    ...g,
    coordinates: round(g.coordinates as Nested) as unknown as MultiPolygon['coordinates']
  };
}

function isPolygonal(geometry: Geometry | null): geometry is Polygon | MultiPolygon {
  return geometry?.type === 'Polygon' || geometry?.type === 'MultiPolygon';
}

/** Simplify then round; fall back to the rounded original if simplify fails. */
function compactGeometry(g: Polygon | MultiPolygon): Polygon | MultiPolygon {
  try {
    const simplified = simplify(g, { tolerance: SIMPLIFY_TOLERANCE, highQuality: false });
    return roundGeometry(simplified);
  } catch {
    return roundGeometry(g);
  }
}

async function seedYear(year: number): Promise<void> {
  const yearStr = String(year).padStart(4, '0');
  console.log(`Querying ${SOURCE_NAME} admin_level=2 @ ${year} (Europe)…`);
  const osm = await fetchOverpass(buildSnapshotQuery(EUROPE_BBOX, 2, yearStr));
  const collection = osmtogeojson(osm) as FeatureCollection;

  const out: Feature<Geometry, TemporalTerritoryProperties>[] = [];
  for (const feature of collection.features) {
    if (!isPolygonal(feature.geometry)) continue;
    const props = tagsToTemporal(
      (feature.properties ?? {}) as OsmTags,
      String(feature.id ?? 'unknown')
    );
    if (!props) continue;
    out.push({
      type: 'Feature',
      geometry: compactGeometry(feature.geometry),
      properties: props
    });
  }

  const fc: FeatureCollection = { type: 'FeatureCollection', features: out };
  const file = path.join(OUT_DIR, `admin2-${year}.geojson`);
  await writeFile(file, JSON.stringify(fc) + '\n', 'utf8');

  const kb = Math.round(Buffer.byteLength(JSON.stringify(fc)) / 1024);
  const withFr = out.filter((f) => f.properties.names.fr).length;
  console.log(
    `  ${out.length} territories (${withFr} FR) → ${path.basename(file)} (${kb} KB)`
  );
}

async function main(): Promise<void> {
  await mkdir(OUT_DIR, { recursive: true });
  for (const [i, year] of YEARS.entries()) {
    await seedYear(year);
    if (i < YEARS.length - 1) await sleep(POLITE_DELAY_MS);
  }
  console.log('\nDone.');
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
