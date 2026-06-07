import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  // V1 locales: English + French (i18n is native from day one).
  locales: ['en', 'fr'],
  // English-first: English is the default/base locale.
  defaultLocale: 'en',
  // Always keep the locale prefix in the URL (/en, /fr).
  // Accept-Language detection on "/" is delegated to Nginx (static export).
  localePrefix: 'always'
});

export type Locale = (typeof routing.locales)[number];

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
