/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    // Tailwind CSS v4 : un seul plugin PostCSS (le prefixing est intégré).
    '@tailwindcss/postcss': {}
  }
};

export default config;
