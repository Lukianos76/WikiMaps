'use client';

import 'maplibre-gl/dist/maplibre-gl.css';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import type { FeatureCollection } from 'geojson';
import type { Map as MaplibreMap, StyleSpecification } from 'maplibre-gl';

import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { Attribution } from '@/components/Attribution';
import { territoryColor } from './territoryColor';

/** Fixed year for now; a time slider (Phase 3) will pick the snapshot. */
const FIXED_YEAR = 1900;
const BORDERS_URL = `/data/europe/admin2-${FIXED_YEAR}.geojson`;
// 50m basemap (not 110m): at the Europe/country zoom the coarse 110m coastline
// clashed with the detailed OHM borders; 50m hugs the real coast far better.
const LAND_URL = '/basemap/land-50m.geojson';
const COASTLINE_URL = '/basemap/coastline-50m.geojson';

// Desaturated, atlas-like base tones (territory colors come from territoryColor).
// Natural Earth is the single coastline authority; the historical borders are a
// translucent political TINT over the physical land, not a competing coastline —
// the two datasets generalize coasts differently, so we never draw two coasts.
const OCEAN = '#cfdae3';
const LAND = '#e7e0d0';
const COASTLINE = '#8b969b';
const BORDER_LINE = '#8f8678';

type Status = 'loading' | 'ready' | 'error';

/** Build the inline MapLibre style. Borders are passed pre-colored (inline data). */
function buildStyle(borders: FeatureCollection): StyleSpecification {
  return {
    version: 8,
    sources: {
      land: { type: 'geojson', data: LAND_URL },
      coastline: { type: 'geojson', data: COASTLINE_URL },
      borders: { type: 'geojson', data: borders }
    },
    layers: [
      { id: 'background', type: 'background', paint: { 'background-color': OCEAN } },
      { id: 'land', type: 'fill', source: 'land', paint: { 'fill-color': LAND } },
      {
        id: 'borders-fill',
        type: 'fill',
        source: 'borders',
        paint: { 'fill-color': ['get', 'color'], 'fill-opacity': 0.5 }
      },
      {
        // Internal political borders, drawn UNDER the coastline so the physical
        // coast stays crisp where a territory edge runs along the shore.
        id: 'borders-line',
        type: 'line',
        source: 'borders',
        paint: { 'line-color': BORDER_LINE, 'line-width': 0.4, 'line-opacity': 0.6 }
      },
      {
        id: 'coastline',
        type: 'line',
        source: 'coastline',
        paint: { 'line-color': COASTLINE, 'line-width': 0.8 }
      }
    ]
  };
}

/**
 * MapView — the application IS the map (map-first). Renders a full-screen
 * MapLibre GL map: a neutral Natural Earth basemap plus the historical borders
 * for FIXED_YEAR, colored per political entity. UI is overlaid, never beside.
 */
export function MapView() {
  const t = useTranslations('Map');
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<Status>('loading');

  useEffect(() => {
    let cancelled = false;
    let map: MaplibreMap | undefined;

    (async () => {
      try {
        const maplibregl = (await import('maplibre-gl')).default;

        const response = await fetch(BORDERS_URL);
        if (!response.ok)
          throw new Error(`Failed to load borders: HTTP ${response.status}`);
        const borders = (await response.json()) as FeatureCollection;

        // Color each territory by its stable entity id (Wikidata QID), so an
        // entity keeps the same color across years regardless of language.
        for (const feature of borders.features) {
          const id =
            typeof feature.properties?.id === 'string' ? feature.properties.id : '';
          feature.properties = {
            ...(feature.properties ?? {}),
            color: territoryColor(id)
          };
        }

        if (cancelled || !containerRef.current) return;

        map = new maplibregl.Map({
          container: containerRef.current,
          style: buildStyle(borders),
          center: [2, 47], // France / Western Europe (MVP region)
          zoom: 4.3,
          dragRotate: false,
          attributionControl: false // we render our own Attribution overlay
        });
        map.touchZoomRotate.disableRotation();
        map.addControl(
          new maplibregl.NavigationControl({ showCompass: false }),
          'top-right'
        );

        map.on('load', () => {
          if (!cancelled) setStatus('ready');
        });
        map.on('error', (e) => {
          console.error('MapLibre error', e.error);
        });
      } catch (error) {
        console.error(error);
        if (!cancelled) setStatus('error');
      }
    })();

    return () => {
      cancelled = true;
      map?.remove();
    };
  }, []);

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-[#e8e2d5] text-neutral-800">
      {/* Live MapLibre canvas. h-full/w-full make the size explicit: MapLibre's
          own `.maplibregl-map { position: relative }` overrides Tailwind's
          `absolute`, so opposing insets alone would collapse the height to 0. */}
      <div ref={containerRef} className="absolute inset-0 h-full w-full" />

      {/* Loading / error states over the map shell */}
      {status !== 'ready' && (
        <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center px-6 text-center">
          <p className="text-sm text-neutral-600">
            {status === 'error' ? t('loadError') : t('loading')}
          </p>
        </div>
      )}

      {/* Language switch — overlaid, top-left (see UX layout) */}
      <div className="absolute top-4 left-4 z-10">
        <LanguageSwitcher />
      </div>

      {/* Time slider — overlaid, bottom full-width (Phase 3 placeholder) */}
      <div className="absolute inset-x-0 bottom-0 z-10 flex justify-center p-4">
        <div className="rounded-full bg-white/80 px-6 py-2 text-xs text-neutral-500 shadow-md backdrop-blur-sm">
          {t('placeholderTimeline')}
        </div>
      </div>

      {/* Data source attribution — overlaid, bottom-right (V1 legal requirement) */}
      <div className="absolute right-3 bottom-2 z-10">
        <Attribution />
      </div>
    </main>
  );
}
