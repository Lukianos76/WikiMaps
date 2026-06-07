/**
 * Parse an OpenHistoricalMap date tag (`start_date` / `end_date`) into a
 * decimal year.
 *
 * OHM dates are mostly ISO-8601-ish: `"1914"`, `"1914-07-28"`, BC years as
 * `"-0044"` / `"-0044-03-15"`. Trailing fuzziness (`~`, `?`, `..`) is ignored.
 * A month/day is folded into a fractional year so sub-year ordering is kept
 * (e.g. `"0476-10-04"` → ~476.75). Unparseable or empty input → `null`.
 */
export function parseOhmDate(value: string | undefined | null): number | null {
  if (!value) return null;
  const match = /^\s*(-?)(\d{1,7})(?:-(\d{2}))?(?:-(\d{2}))?/.exec(value.trim());
  if (!match) return null;

  const sign = match[1] === '-' ? -1 : 1;
  const year = Number.parseInt(match[2], 10);
  const month = match[3] ? Number.parseInt(match[3], 10) : null;
  const day = match[4] ? Number.parseInt(match[4], 10) : null;

  let fraction = 0;
  if (month && month >= 1 && month <= 12) {
    fraction += (month - 1) / 12;
    if (day && day >= 1 && day <= 31) {
      fraction += (day - 1) / (12 * 31);
    }
  }
  return sign * (year + fraction);
}

/** Whether an entity with [from, to) validity is active at `year` (to=null → open). */
export function isActiveAt(
  from: number | null,
  to: number | null,
  year: number
): boolean {
  if (from !== null && year < from) return false;
  if (to !== null && year >= to) return false;
  return true;
}
