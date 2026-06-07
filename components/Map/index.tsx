'use client';

import { useTranslations } from 'next-intl';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { Attribution } from '@/components/Attribution';

/**
 * MapView — full-screen container that will host MapLibre GL JS (Phase 2).
 * For Phase 0 it materializes the map-first principle: the map fills
 * 100vw x 100vh and every UI element is overlaid on top, never beside it.
 */
export function MapView() {
  const t = useTranslations('Map');

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-[#e8e2d5] text-neutral-800">
      {/* Map area (Phase 0 placeholder — MapLibre arrives in Phase 2) */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-6 text-center">
        <h1 className="font-serif text-2xl text-neutral-700">{t('comingSoonTitle')}</h1>
        <p className="max-w-md text-sm text-neutral-500">{t('comingSoonBody')}</p>
      </div>

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
