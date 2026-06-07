/**
 * Conventional Commits — aligné sur CLAUDE.md et le Contributing Guide.
 * On étend la config standard pour autoriser les types projet `data:` et `i18n:`.
 */
const config = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'data',
        'i18n',
        'docs',
        'chore',
        'refactor',
        'test',
        'build',
        'ci',
        'perf',
        'style',
        'revert'
      ]
    ]
  }
};

export default config;
