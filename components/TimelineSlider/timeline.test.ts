import { describe, expect, it } from 'vitest';

import { formatYear, nextYear } from './timeline';

describe('nextYear', () => {
  const years = [1500, 1550, 1600];

  it('returns the following year', () => {
    expect(nextYear(years, 1500)).toBe(1550);
    expect(nextYear(years, 1550)).toBe(1600);
  });

  it('returns null at the end or for an unknown year', () => {
    expect(nextYear(years, 1600)).toBeNull();
    expect(nextYear(years, 9999)).toBeNull();
  });
});

describe('formatYear', () => {
  it('formats AD years plainly', () => {
    expect(formatYear(1500)).toBe('1500');
    expect(formatYear(2000)).toBe('2000');
  });

  it('marks BC years', () => {
    expect(formatYear(-44)).toBe('44 BC');
  });
});
