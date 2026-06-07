'use client';

import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter, routing, type Locale } from '@/i18n/routing';

/**
 * LanguageSwitcher — bascule FR/EN.
 * Met à jour l'URL localisée et persiste le choix dans localStorage
 * (cf. UX — « Toggle FR/EN, persiste en localStorage »).
 */
export function LanguageSwitcher() {
  const t = useTranslations('LanguageSwitcher');
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();

  function switchTo(next: Locale) {
    if (next === locale) return;
    try {
      window.localStorage.setItem('wikimaps.locale', next);
    } catch {
      // localStorage indisponible (mode privé) — non bloquant.
    }
    router.replace(pathname, { locale: next });
  }

  return (
    <div
      className="flex items-center gap-1 rounded-full bg-white/80 p-1 text-xs shadow-md backdrop-blur-sm"
      role="group"
      aria-label={t('label')}
    >
      {routing.locales.map((loc) => (
        <button
          key={loc}
          type="button"
          onClick={() => switchTo(loc)}
          aria-pressed={loc === locale}
          className={`min-h-[32px] rounded-full px-3 py-1 font-medium uppercase transition-colors ${
            loc === locale
              ? 'bg-neutral-800 text-white'
              : 'text-neutral-600 hover:bg-neutral-200'
          }`}
        >
          {loc}
        </button>
      ))}
    </div>
  );
}
