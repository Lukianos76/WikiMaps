import createNextIntlPlugin from 'next-intl/plugin';

// next-intl lit la config de requête depuis ./i18n/request.ts
const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Export statique : le build produit /out, servi par Nginx (cf. Dockerfile).
  // Conséquence : pas de middleware Next ; la détection Accept-Language et la
  // redirection « / » → « /fr | /en » sont gérées par Nginx (cf. nginx.conf).
  output: 'export',
  trailingSlash: true,
  images: {
    // L'optimiseur d'images Next nécessite un serveur ; incompatible avec l'export statique.
    unoptimized: true
  }
};

export default withNextIntl(nextConfig);
