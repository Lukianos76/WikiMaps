'use client';

import { useTranslations } from 'next-intl';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { Attribution } from '@/components/Attribution';

/**
 * MapView — conteneur plein écran qui accueillera MapLibre GL JS (Phase 2).
 * Pour la Phase 0, il matérialise le principe map-first : la carte occupe
 * 100vw x 100vh et tous les éléments d'UI sont superposés, jamais à côté.
 */
export function MapView() {
  const t = useTranslations('Map');

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-[#e8e2d5] text-neutral-800">
      {/* Zone carte (placeholder Phase 0 — MapLibre arrive en Phase 2) */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-6 text-center">
        <h1 className="font-serif text-2xl text-neutral-700">{t('comingSoonTitle')}</h1>
        <p className="max-w-md text-sm text-neutral-500">{t('comingSoonBody')}</p>
      </div>

      {/* Contrôle de langue — superposé, haut gauche (cf. UX Disposition) */}
      <div className="absolute left-4 top-4 z-10">
        <LanguageSwitcher />
      </div>

      {/* Slider temporel — superposé, bas pleine largeur (placeholder Phase 3) */}
      <div className="absolute inset-x-0 bottom-0 z-10 flex justify-center p-4">
        <div className="rounded-full bg-white/80 px-6 py-2 text-xs text-neutral-500 shadow-md backdrop-blur-sm">
          {t('placeholderTimeline')}
        </div>
      </div>

      {/* Attribution des sources — superposé, bas droite (exigence légale V1) */}
      <div className="absolute bottom-2 right-3 z-10">
        <Attribution />
      </div>
    </main>
  );
}
