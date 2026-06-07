import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypeScript from 'eslint-config-next/typescript';
import prettier from 'eslint-config-prettier/flat';

// Next.js 16 : ESLint flat config natif (le CLI `next lint` a été retiré).
const eslintConfig = [
  ...nextCoreWebVitals,
  ...nextTypeScript,
  prettier,
  {
    rules: {
      // TypeScript strict : pas de `any` sans justification (cf. CLAUDE.md)
      '@typescript-eslint/no-explicit-any': 'error'
    }
  },
  {
    ignores: ['node_modules/**', '.next/**', 'out/**', 'build/**', 'next-env.d.ts']
  }
];

export default eslintConfig;
