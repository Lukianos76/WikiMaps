'use client';

import { useTranslations } from 'next-intl';

/**
 * Attribution — mandatory data sources (see docs/DATA_SOURCES.md and data/NOTICE).
 * Historical borders: OpenHistoricalMap (CC0). Basemap: Natural Earth (public domain).
 */
export function Attribution() {
  const t = useTranslations('Attribution');

  return (
    <p className="text-[10px] leading-tight text-neutral-500">
      {t('data')}:{' '}
      <a
        href="https://www.openhistoricalmap.org"
        target="_blank"
        rel="noopener noreferrer"
        className="underline hover:text-neutral-700"
      >
        OpenHistoricalMap
      </a>{' '}
      (CC0) · {t('basemap')}:{' '}
      <a
        href="https://www.naturalearthdata.com"
        target="_blank"
        rel="noopener noreferrer"
        className="underline hover:text-neutral-700"
      >
        Natural Earth
      </a>
    </p>
  );
}
