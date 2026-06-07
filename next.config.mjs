import createNextIntlPlugin from 'next-intl/plugin';

// next-intl reads the request config from ./i18n/request.ts
const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export: the build produces /out, served by Nginx (see Dockerfile).
  // Consequence: no Next middleware; Accept-Language detection and the
  // "/" → "/en | /fr" redirect are handled by Nginx (see nginx.conf).
  output: 'export',
  trailingSlash: true,
  images: {
    // The Next image optimizer requires a server; incompatible with static export.
    unoptimized: true
  }
};

export default withNextIntl(nextConfig);
