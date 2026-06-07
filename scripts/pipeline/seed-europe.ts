import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

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
  SOURCE_NAME,
  buildSnapshotQuery,
  fetchOverpass,
  tagsToTemporal,
  type OsmTags
} from './source/openhistoricalmap';
import type { TemporalTerritoryProperties } from './types';

const OUT_DIR = path.join(ROOT, 'data', 'europe');

// MVP starting region (France and neighbours) and demo years. A single all-time
// query exceeds Node's max string size, so we seed bounded per-year detailed
// snapshots (~5 MB each). Scaling to all of Europe / a fine cadence needs vector
// tiles or geometry simplification (tracked as a follow-up issue).
const MVP_BBOX: [number, number, number, number] = [42, -5, 51, 9];
const YEARS = [1600, 1900];
const COORD_DECIMALS = 4; // ~11 m precision — plenty for a continental atlas

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

async function seedYear(year: number): Promise<void> {
  const yearStr = String(year).padStart(4, '0');
  console.log(
    `Querying ${SOURCE_NAME} admin_level=2 @ ${year} (bbox ${MVP_BBOX.join(',')})…`
  );
  const osm = await fetchOverpass(buildSnapshotQuery(MVP_BBOX, 2, yearStr));
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
      geometry: roundGeometry(feature.geometry),
      properties: props
    });
  }

  const fc: FeatureCollection = { type: 'FeatureCollection', features: out };
  const file = path.join(OUT_DIR, `admin2-${year}.geojson`);
  await writeFile(file, JSON.stringify(fc) + '\n', 'utf8');

  const withFr = out.filter((f) => f.properties.names.fr).length;
  const withQid = out.filter((f) => f.properties.wikidata).length;
  console.log(
    `  ${out.length} territories → ${path.basename(file)} (${withFr} FR, ${withQid} QID)`
  );
}

async function main(): Promise<void> {
  await mkdir(OUT_DIR, { recursive: true });
  for (const year of YEARS) {
    await seedYear(year);
  }
  console.log('\nDone.');
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
