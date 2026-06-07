import { describe, expect, it } from 'vitest';

import { makeUniqueSlug, slugify } from './slug';

describe('slugify', () => {
  it('kebab-cases and drops parentheticals/punctuation', () => {
    expect(slugify('Imperial Japan (Fujiwara)')).toBe('imperial-japan-fujiwara');
  });

  it('strips diacritics', () => {
    expect(slugify("Côte d'Ivoire")).toBe('cote-d-ivoire');
  });

  it('falls back when nothing usable remains', () => {
    expect(slugify('***')).toBe('territory');
  });
});

describe('makeUniqueSlug', () => {
  it('suffixes collisions within a snapshot', () => {
    const used = new Set<string>();
    expect(makeUniqueSlug('france', used)).toBe('france');
    expect(makeUniqueSlug('france', used)).toBe('france-2');
    expect(makeUniqueSlug('france', used)).toBe('france-3');
  });
});
