// eslint.config.js — flat-config ESLint v9 setup for Astro 5/7.
//
// Stacks:
//   - @eslint/js recommended      : core JS rules
//   - typescript-eslint recommended: TS-aware rules (catches no-unused-vars)
//   - eslint-plugin-astro recommended: .astro file anti-patterns (missing alt,
//                                     deprecated APIs, hardcoded href, etc.)
//   - eslint-config-prettier       : disables format rules so Prettier wins
//
// Note: eslint-plugin-astro v2.x requires Node 22.22+. Pinned to ^1.6.0
// because deploy.yml runs on Node 20.

import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import astro from 'eslint-plugin-astro';
import prettier from 'eslint-config-prettier';
import globals from 'globals';

export default [
  { ignores: ['dist/**', '.astro/**', 'node_modules/**', 'public/**'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...astro.configs.recommended,
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      'no-unused-vars': 'off',
    },
  },
  prettier,
];
