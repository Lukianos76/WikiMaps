// Dev-only: mirror /data into /public/data so `next dev` (and a standalone static
// export) can serve the GeoJSON at /data/*. Production does NOT use this — Nginx
// serves /data/ straight from the mounted volume (see nginx.conf + docker-compose.yml).
// public/data is gitignored. Runs automatically via the `predev` npm hook.
import { cp, rm } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const src = path.join(root, 'data');
const dest = path.join(root, 'public', 'data');

await rm(dest, { recursive: true, force: true });
await cp(src, dest, { recursive: true });

console.log(`Mirrored ${src} -> ${dest}`);
