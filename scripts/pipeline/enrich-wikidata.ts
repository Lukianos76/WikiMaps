import { writeFile } from 'node:fs/promises';
import path from 'node:path';

import type { FeatureCollection } from 'geojson';

import { PATHS } from './config';
import { readJson, readJsonIfExists } from './lib/io';
import { mapPool } from './lib/pool';
import { getEntities, searchEntity } from './lib/wikidata';
import { normalizeSnapshot } from './source/historical-basemaps';
import type { FetchManifest, WikidataCache, WikidataEntry } from './types';

const SEARCH_CONCURRENCY = 2;
const CHECKPOINT_EVERY = 200;

/** Collect every distinct source name across all cached snapshots. */
async function collectDistinctNames(manifest: FetchManifest): Promise<string[]> {
  const names = new Set<string>();
  for (const snapshot of manifest.snapshots) {
    const raw = await readJson<FeatureCollection>(
      path.join(PATHS.cacheDir, snapshot.fileName)
    );
    for (const feature of normalizeSnapshot(raw)) {
      if (feature.name) names.add(feature.name);
    }
  }
  return [...names].sort((a, b) => a.localeCompare(b));
}

/** Resolve names → entries (qid + labels + wikipedia), then merge into cache. */
async function resolve(
  names: string[],
  overrides: Record<string, string>
): Promise<Record<string, WikidataEntry>> {
  // Phase 1 — name → QID (override wins over search).
  let searched = 0;
  const qids = await mapPool(names, SEARCH_CONCURRENCY, async (name) => {
    const qid = overrides[name] ?? (await searchEntity(name));
    searched += 1;
    if (searched % 100 === 0) console.log(`  searched ${searched}/${names.length}…`);
    return qid;
  });

  // Phase 2 — batch-fetch labels + Wikipedia URLs for the matched QIDs.
  const uniqueQids = [...new Set(qids.filter((q): q is string => Boolean(q)))];
  console.log(`  fetching labels for ${uniqueQids.length} matched entities…`);
  const entities = await getEntities(uniqueQids);

  const result: Record<string, WikidataEntry> = {};
  names.forEach((name, i) => {
    const qid = qids[i];
    const meta = qid ? entities[qid] : undefined;
    result[name] = {
      qid: qid ?? null,
      labels: meta?.labels ?? {},
      wikipedia: meta?.wikipedia ?? {}
    };
  });
  return result;
}

function sortedCache(cache: WikidataCache): WikidataCache {
  const sorted: WikidataCache = {};
  for (const key of Object.keys(cache).sort((a, b) => a.localeCompare(b))) {
    sorted[key] = cache[key];
  }
  return sorted;
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const pilot = args.includes('--pilot');
  const limitArg = args.find((a) => a.startsWith('--limit='));
  const limit = limitArg ? Number.parseInt(limitArg.split('=')[1], 10) : Infinity;

  const overrides = await readJsonIfExists<Record<string, string>>(PATHS.overrides, {});

  if (pilot) {
    const sample = ['Roman Empire', 'France', 'Ottoman Empire', 'Japan', 'Egypt'];
    console.log('Pilot run — resolving 5 entities (no cache written):\n');
    const entries = await resolve(sample, overrides);
    for (const name of sample) {
      const e = entries[name];
      console.log(
        `  ${name.padEnd(16)} → ${e.qid ?? '(no match)'}  ` +
          `fr="${e.labels.fr ?? ''}"  wiki.fr=${e.wikipedia.fr ? 'yes' : 'no'}`
      );
    }
    return;
  }

  const manifest = await readJson<FetchManifest>(PATHS.manifest).catch(() => {
    throw new Error('No manifest found. Run `npm run data:fetch` first.');
  });
  const cache = await readJsonIfExists<WikidataCache>(PATHS.wikidataCache, {});

  const allNames = await collectDistinctNames(manifest);
  // Resolve names absent from cache, or whose override disagrees with the cache.
  const todo = allNames
    .filter((n) => !(n in cache) || (n in overrides && overrides[n] !== cache[n].qid))
    .slice(0, limit === Infinity ? undefined : limit);

  console.log(
    `${allNames.length} distinct names; ${allNames.length - todo.length} cached, ` +
      `${todo.length} to resolve.`
  );
  if (todo.length === 0) {
    console.log('Nothing to do.');
    return;
  }

  // Process in checkpointed chunks so the run is resumable: a crash (e.g. a
  // persistent rate-limit) keeps everything resolved so far, and re-running
  // skips cached names.
  let working: WikidataCache = { ...cache };
  for (let i = 0; i < todo.length; i += CHECKPOINT_EVERY) {
    const chunk = todo.slice(i, i + CHECKPOINT_EVERY);
    const resolved = await resolve(chunk, overrides);
    working = sortedCache({ ...working, ...resolved });
    await writeFile(PATHS.wikidataCache, JSON.stringify(working, null, 2) + '\n', 'utf8');
    console.log(
      `  checkpoint: ${Math.min(i + chunk.length, todo.length)}/${todo.length} resolved, cache saved.`
    );
  }

  const matched = Object.values(working).filter((e) => e.qid).length;
  console.log(
    `\nCache written: ${Object.keys(working).length} names, ${matched} matched ` +
      `(${((matched / Object.keys(working).length) * 100).toFixed(1)}%).`
  );
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
