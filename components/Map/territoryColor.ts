/**
 * Deterministic per-entity coloring (UX Principle 4: "color as language").
 *
 * A territory's color is derived from its name, so the same entity keeps the
 * same color across every year/snapshot without any shared state. The palette
 * is intentionally desaturated and cartographic — inspired by printed atlases,
 * not modern dataviz.
 */
export const TERRITORY_PALETTE = [
  '#a8b89e', // sage green
  '#c9b79c', // tan
  '#b8a6c0', // muted mauve
  '#9fb0c0', // dusty blue
  '#d0b0a0', // clay
  '#b0c4b1', // pale green
  '#c7c0a0', // khaki
  '#a0b8b8', // muted teal
  '#c4a8a8', // dusty rose
  '#b6b6c8', // periwinkle gray
  '#cbbf9e', // wheat
  '#a9c1b0', // eucalyptus
  '#c0a9b8', // heather
  '#aebfa0' // olive sage
] as const;

/** djb2 string hash, kept as an unsigned 32-bit integer. */
function hashString(value: string): number {
  let hash = 5381;
  for (let i = 0; i < value.length; i += 1) {
    hash = ((hash << 5) + hash + value.charCodeAt(i)) >>> 0;
  }
  return hash;
}

/** Stable cartographic color for a territory name. */
export function territoryColor(name: string): string {
  return TERRITORY_PALETTE[hashString(name) % TERRITORY_PALETTE.length];
}
