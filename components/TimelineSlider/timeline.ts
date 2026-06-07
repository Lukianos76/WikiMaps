/** The years for which a borders snapshot exists (matches the seeded data). */
export const AVAILABLE_YEARS = [
  1500, 1550, 1600, 1650, 1700, 1750, 1800, 1850, 1900, 1950, 2000
] as const;

/** Next year in the sequence, or null at/after the end (used by auto-play). */
export function nextYear(years: readonly number[], current: number): number | null {
  const index = years.indexOf(current);
  if (index === -1 || index === years.length - 1) return null;
  return years[index + 1];
}

/** Format a year for display: 1500 → "1500", -44 → "44 BC". */
export function formatYear(year: number): string {
  return year < 0 ? `${-year} BC` : String(year);
}
