import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

import type { FeatureCollection } from 'geojson';

import { PATHS } from './config';
import { readJson, readJsonIfExists } from './lib/io';
import { buildTerritoryFeatures, type TerritoryFeature } from './mapper';
import { normalizeSnapshot } from './source/historical-basemaps';
import type { FetchManifest, WikidataCache } from './types';

async function main(): Promise<void> {
  const manifest = await readJson<FetchManifest>(PATHS.manifest).catch(() => {
    throw new Error('No manifest found. Run `npm run data:fetch` first.');
  });
  const cache = await readJsonIfExists<WikidataCache>(PATHS.wikidataCache, {});

  await mkdir(PATHS.bordersOut, { recursive: true });

  let totalIn = 0;
  let totalOut = 0;

  for (const snapshot of manifest.snapshots) {
    const raw = await readJson<FeatureCollection>(
      path.join(PATHS.cacheDir, snapshot.fileName)
    );
    const normalized = normalizeSnapshot(raw);
    const features: TerritoryFeature[] = buildTerritoryFeatures(
      normalized,
      snapshot.year,
      cache
    );

    const out: FeatureCollection = { type: 'FeatureCollection', features };
    await writeFile(
      path.join(PATHS.bordersOut, snapshot.fileName),
      JSON.stringify(out) + '\n',
      'utf8'
    );

    totalIn += raw.features.length;
    totalOut += features.length;
    console.log(
      `  ${snapshot.fileName.padEnd(24)} ${String(features.length).padStart(4)} territories ` +
        `(${raw.features.length - features.length} dropped)`
    );
  }

  console.log(
    `\nTransformed ${manifest.snapshots.length} snapshots → ${PATHS.bordersOut}` +
      `\n  ${totalOut} territories kept, ${totalIn - totalOut} features dropped (null name/geometry).`
  );
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
