import { describe, expect, it } from 'vitest';

import { fileNameToYearToken, parseYearToken } from './year';

describe('parseYearToken', () => {
  it('parses AD years', () => {
    expect(parseYearToken('1000')).toBe(1000);
    expect(parseYearToken('2010')).toBe(2010);
  });

  it('negates BC years', () => {
    expect(parseYearToken('bc1000')).toBe(-1000);
    expect(parseYearToken('bc1')).toBe(-1);
    expect(parseYearToken('BC123000')).toBe(-123000);
  });

  it('throws on a non-numeric token', () => {
    expect(() => parseYearToken('places')).toThrow();
  });
});

describe('fileNameToYearToken', () => {
  it('extracts the token from a snapshot file name', () => {
    expect(fileNameToYearToken('world_1000.geojson')).toBe('1000');
    expect(fileNameToYearToken('world_bc1000.geojson')).toBe('bc1000');
  });

  it('throws on an unexpected file name', () => {
    expect(() => fileNameToYearToken('places.geojson')).toThrow();
  });
});
