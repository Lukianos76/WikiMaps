import { describe, expect, it } from 'vitest';

import { TERRITORY_PALETTE, territoryColor } from './territoryColor';

describe('territoryColor', () => {
  it('is deterministic for a given name', () => {
    expect(territoryColor('Roman Empire')).toBe(territoryColor('Roman Empire'));
    expect(territoryColor('France')).toBe(territoryColor('France'));
  });

  it('always returns a color from the palette', () => {
    for (const name of [
      'France',
      'Roman Empire',
      'Cyprus',
      'Imperial Japan (Fujiwara)',
      ''
    ]) {
      expect(TERRITORY_PALETTE).toContain(territoryColor(name));
    }
  });

  it('distributes distinct names across more than one color', () => {
    const names = Array.from({ length: 60 }, (_, i) => `Entity ${i}`);
    const distinct = new Set(names.map(territoryColor));
    expect(distinct.size).toBeGreaterThan(1);
  });
});
