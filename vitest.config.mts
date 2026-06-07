import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    include: ['**/*.{test,spec}.{ts,tsx}'],
    exclude: ['node_modules', '.next', 'out']
  },
  resolve: {
    // Aligne l'alias @ sur celui de tsconfig.json
    alias: {
      '@': import.meta.dirname
    }
  }
});
