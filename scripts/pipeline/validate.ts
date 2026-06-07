import path from 'node:path';

import type { Feature, FeatureCollection } from 'geojson';

import { MIN_SNAPSHOTS_WITH_NAMES, PATHS } from './config';
import { readJson } from './lib/io';
import type { FetchManifest, TerritoryProperties } from './types';

interface SnapshotReport {
  fileName: string;
  territories: number;
  enriched: number; // wikidata QID present
  genuineFr: number; // names.fr distinct from names.en
}

function validateFeature(feature: Feature, fileName: string, index: number): string[] {
  const errors: string[] = [];
  const where = `${fileName}#${index}`;
  if (!feature.geometry) errors.push(`${where}: missing geometry`);

  const props = feature.properties as TerritoryProperties | null;
  if (!props) {
    errors.push(`${where}: missing properties`);
    return errors;
  }
  if (!props.id) errors.push(`${where}: missing id`);
  if (!props.names?.en) errors.push(`${where}: missing names.en`);
  if (!props.names?.fr) errors.push(`${where}: missing names.fr`);
  if (typeof props.year !== 'number') errors.push(`${where}: year is not a number`);
  return errors;
}

async function main(): Promise<void> {
  const manifest = await readJson<FetchManifest>(PATHS.manifest).catch(() => {
    throw new Error('No manifest found. Run `npm run data:fetch` first.');
  });

  const errors: string[] = [];
  const reports: SnapshotReport[] = [];

  for (const snapshot of manifest.snapshots) {
    const filePath = path.join(PATHS.bordersOut, snapshot.fileName);
    let fc: FeatureCollection;
    try {
      fc = await readJson<FeatureCollection>(filePath);
    } catch {
      errors.push(`${snapshot.fileName}: missing or unreadable (run data:transform)`);
      continue;
    }
    if (fc.type !== 'FeatureCollection' || !Array.isArray(fc.features)) {
      errors.push(`${snapshot.fileName}: not a FeatureCollection`);
      continue;
    }

    const ids = new Set<string>();
    let enriched = 0;
    let genuineFr = 0;
    fc.features.forEach((feature, i) => {
      errors.push(...validateFeature(feature, snapshot.fileName, i));
      const props = feature.properties as TerritoryProperties | null;
      if (!props) return;
      if (ids.has(props.id))
        errors.push(`${snapshot.fileName}: duplicate id "${props.id}"`);
      ids.add(props.id);
      if (props.wikidata) enriched += 1;
      if (props.names?.fr && props.names.fr !== props.names.en) genuineFr += 1;
    });

    reports.push({
      fileName: snapshot.fileName,
      territories: fc.features.length,
      enriched,
      genuineFr
    });
  }

  // Report
  const totalTerritories = reports.reduce((s, r) => s + r.territories, 0);
  const totalEnriched = reports.reduce((s, r) => s + r.enriched, 0);
  const snapshotsEnriched = reports.filter((r) => r.enriched > 0).length;
  const emptySnapshots = reports.filter((r) => r.territories === 0);

  console.log('Snapshot                  territories  wikidata  genuine-FR');
  for (const r of reports) {
    console.log(
      `  ${r.fileName.padEnd(24)} ${String(r.territories).padStart(6)} ` +
        `${String(r.enriched).padStart(9)} ${String(r.genuineFr).padStart(11)}`
    );
  }
  console.log(
    `\nTotals: ${reports.length} snapshots, ${totalTerritories} territories, ` +
      `${totalEnriched} Wikidata-matched.`
  );
  if (emptySnapshots.length > 0) {
    console.log(`Empty snapshots: ${emptySnapshots.map((r) => r.fileName).join(', ')}`);
  }

  if (errors.length > 0) {
    console.error(`\n✗ ${errors.length} structural error(s):`);
    for (const e of errors.slice(0, 30)) console.error(`  ${e}`);
    if (errors.length > 30) console.error(`  …and ${errors.length - 30} more`);
    process.exit(1);
  }

  // Exit criterion
  const pass = snapshotsEnriched >= MIN_SNAPSHOTS_WITH_NAMES;
  console.log(
    `\nExit criterion: ${snapshotsEnriched}/${MIN_SNAPSHOTS_WITH_NAMES} snapshots ` +
      `with EN+FR (Wikidata-enriched) names → ${pass ? 'PASS ✅' : 'FAIL ❌'}`
  );
  if (!pass) {
    console.error('  Run `npm run data:enrich` then `npm run data:transform`.');
    process.exit(1);
  }
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
