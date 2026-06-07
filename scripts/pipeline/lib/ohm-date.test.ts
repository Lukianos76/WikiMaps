import { describe, expect, it } from 'vitest';

import { isActiveAt, parseOhmDate } from './ohm-date';

describe('parseOhmDate', () => {
  it('parses plain years', () => {
    expect(parseOhmDate('1914')).toBe(1914);
    expect(parseOhmDate('0476')).toBe(476);
  });

  it('folds month/day into a fractional year', () => {
    const v = parseOhmDate('0476-10-04');
    expect(v).toBeGreaterThan(476.7);
    expect(v).toBeLessThan(476.85);
  });

  it('handles BC (negative) years', () => {
    expect(parseOhmDate('-0044')).toBe(-44);
  });

  it('ignores trailing fuzziness', () => {
    expect(parseOhmDate('1815~')).toBe(1815);
    expect(parseOhmDate('1700?')).toBe(1700);
  });

  it('returns null for empty/unparseable input', () => {
    expect(parseOhmDate('')).toBeNull();
    expect(parseOhmDate(null)).toBeNull();
    expect(parseOhmDate('unknown')).toBeNull();
  });
});

describe('isActiveAt', () => {
  it('is half-open [from, to)', () => {
    expect(isActiveAt(486, 496, 486)).toBe(true);
    expect(isActiveAt(486, 496, 495)).toBe(true);
    expect(isActiveAt(486, 496, 496)).toBe(false);
    expect(isActiveAt(486, 496, 485)).toBe(false);
  });

  it('treats null bounds as open', () => {
    expect(isActiveAt(null, null, 1500)).toBe(true);
    expect(isActiveAt(1789, null, 2000)).toBe(true);
    expect(isActiveAt(null, 1500, 1499)).toBe(true);
    expect(isActiveAt(null, 1500, 1500)).toBe(false);
  });
});
