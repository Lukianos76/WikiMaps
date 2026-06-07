/**
 * Conventional Commits — aligned with CLAUDE.md and the Contributing guide.
 * We extend the standard config to allow the project types `data:` and `i18n:`.
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
