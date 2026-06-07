'use client';

import { useTranslations } from 'next-intl';

/**
 * Attribution — sources de données obligatoires (cf. doc Sources de données).
 * Historical Basemaps (CC BY-SA 4.0), Wikidata (CC0), Natural Earth (domaine public).
 */
export function Attribution() {
  const t = useTranslations('Attribution');

  return (
    <p className="text-[10px] leading-tight text-neutral-500">
      {t('data')}:{' '}
      <a
        href="https://github.com/aourednik/historical-basemaps"
        target="_blank"
        rel="noopener noreferrer"
        className="underline hover:text-neutral-700"
      >
        Historical Basemaps
      </a>{' '}
      (CC BY-SA 4.0) · {t('metadata')}:{' '}
      <a
        href="https://www.wikidata.org"
        target="_blank"
        rel="noopener noreferrer"
        className="underline hover:text-neutral-700"
      >
        Wikidata
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
