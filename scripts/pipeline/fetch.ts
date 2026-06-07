import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

import { PATHS } from './config';
import {
  SOURCE_NAME,
  SOURCE_URL,
  listSnapshots,
  rawUrl
} from './source/historical-basemaps';
import type { FetchManifest, SnapshotRef } from './types';

const CONCURRENCY = 6;

async function downloadSnapshot(snapshot: SnapshotRef): Promise<void> {
  const response = await fetch(rawUrl(snapshot.fileName), {
    headers: { 'User-Agent': 'wikimaps-data-pipeline' }
  });
  if (!response.ok) {
    throw new Error(
      `Download failed for ${snapshot.fileName} (${response.status} ${response.statusText})`
    );
  }
  const body = await response.text();
  await writeFile(path.join(PATHS.cacheDir, snapshot.fileName), body, 'utf8');
}

/** Run `worker` over `items` with a bounded number of concurrent tasks. */
async function pool<T>(
  items: T[],
  limit: number,
  worker: (item: T) => Promise<void>
): Promise<void> {
  let cursor = 0;
  const runners = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (cursor < items.length) {
      const index = cursor++;
      await worker(items[index]);
    }
  });
  await Promise.all(runners);
}

async function main(): Promise<void> {
  console.log(`Discovering snapshots from ${SOURCE_NAME}…`);
  const snapshots = await listSnapshots();
  console.log(`Found ${snapshots.length} snapshots.`);

  await mkdir(PATHS.cacheDir, { recursive: true });

  let done = 0;
  await pool(snapshots, CONCURRENCY, async (snapshot) => {
    await downloadSnapshot(snapshot);
    done += 1;
    console.log(`  [${done}/${snapshots.length}] ${snapshot.fileName}`);
  });

  // `new Date()` keeps the manifest informative; it is not used for logic.
  const manifest: FetchManifest = {
    source: SOURCE_NAME,
    sourceUrl: SOURCE_URL,
    fetchedAtIso: new Date().toISOString(),
    snapshots
  };
  await writeFile(PATHS.manifest, JSON.stringify(manifest, null, 2) + '\n', 'utf8');

  console.log(`\nCached ${snapshots.length} snapshots in ${PATHS.cacheDir}`);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
