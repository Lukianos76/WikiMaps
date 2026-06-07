import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  // Langues V1 : FR + EN (cf. PRD — i18n natif dès le départ)
  locales: ['fr', 'en'],
  defaultLocale: 'fr',
  // Préfixe de locale toujours présent dans l'URL (/fr, /en).
  // La détection Accept-Language sur « / » est déléguée à Nginx (export statique).
  localePrefix: 'always'
});

export type Locale = (typeof routing.locales)[number];

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
