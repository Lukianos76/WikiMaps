import type { Geometry } from 'geojson';
import { describe, expect, it } from 'vitest';

import { buildTerritoryFeatures } from './mapper';
import type { NormalizedFeature, WikidataCache } from './types';

const geom: Geometry = { type: 'Point', coordinates: [0, 0] };

function feature(overrides: Partial<NormalizedFeature>): NormalizedFeature {
  return {
    name: 'X',
    subjectTo: null,
    partOf: null,
    borderPrecision: 1,
    geometry: geom,
    ...overrides
  };
}

describe('buildTerritoryFeatures', () => {
  it('drops features without a name or geometry', () => {
    const out = buildTerritoryFeatures(
      [feature({ name: null }), feature({ geometry: null })],
      1000,
      {}
    );
    expect(out).toHaveLength(0);
  });

  it('maps names, metadata and year; FR enriched from cache', () => {
    const cache: WikidataCache = {
      'Roman Empire': {
        qid: 'Q2277',
        labels: { en: 'Roman Empire', fr: 'Empire romain' },
        wikipedia: { fr: 'https://fr.wikipedia.org/wiki/Empire_romain' }
      }
    };
    const [rome] = buildTerritoryFeatures(
      [feature({ name: 'Roman Empire', subjectTo: 'Roman Empire', borderPrecision: 3 })],
      -27,
      cache
    );
    expect(rome.properties.id).toBe('roman-empire');
    expect(rome.properties.names).toEqual({ en: 'Roman Empire', fr: 'Empire romain' });
    expect(rome.properties.subjectTo).toBe('Roman Empire');
    expect(rome.properties.borderPrecision).toBe(3);
    expect(rome.properties.wikidata).toBe('Q2277');
    expect(rome.properties.wikipedia).toEqual({
      fr: 'https://fr.wikipedia.org/wiki/Empire_romain'
    });
    expect(rome.properties.year).toBe(-27);
  });

  it('falls back FR to EN and nulls metadata when unmatched', () => {
    const [gaul] = buildTerritoryFeatures([feature({ name: 'Gaul' })], -100, {});
    expect(gaul.properties.names).toEqual({ en: 'Gaul', fr: 'Gaul' });
    expect(gaul.properties.wikidata).toBeNull();
    expect(gaul.properties.wikipedia).toBeNull();
  });

  it('makes slugs unique within a snapshot', () => {
    const out = buildTerritoryFeatures(
      [feature({ name: 'France' }), feature({ name: 'France' })],
      1000,
      {}
    );
    expect(out.map((f) => f.properties.id)).toEqual(['france', 'france-2']);
  });
});
