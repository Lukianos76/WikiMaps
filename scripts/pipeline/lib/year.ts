/**
 * Parse a Historical Basemaps year token into a signed integer year.
 *
 * Examples: `"1000"` -> 1000, `"bc1000"` -> -1000, `"bc1"` -> -1.
 * There is no year zero in the source; BC values are simply negated.
 */
export function parseYearToken(token: string): number {
  const normalized = token.trim().toLowerCase();
  const isBc = normalized.startsWith('bc');
  const digits = isBc ? normalized.slice(2) : normalized;

  if (!/^\d+$/.test(digits)) {
    throw new Error(`Invalid year token: "${token}"`);
  }

  const value = Number.parseInt(digits, 10);
  return isBc ? -value : value;
}

/**
 * Extract the year token from a snapshot file name.
 * `"world_bc1000.geojson"` -> `"bc1000"`.
 */
export function fileNameToYearToken(fileName: string): string {
  const match = /^world_(.+)\.geojson$/i.exec(fileName);
  if (!match) {
    throw new Error(`Unexpected snapshot file name: "${fileName}"`);
  }
  return match[1];
}
