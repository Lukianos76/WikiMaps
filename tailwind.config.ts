import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        // Sérif discret pour les noms de territoires (cf. UX Principe 5)
        serif: ['Georgia', 'Cambria', 'Times New Roman', 'serif'],
        // Sans-sérif pour l'UI
        sans: ['system-ui', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif']
      }
    }
  },
  plugins: []
};

export default config;
