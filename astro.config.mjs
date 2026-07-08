// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// Site deploy target: https://christianmacion26.github.io/portfolio
const SITE = 'https://christianmacion26.github.io';

export default defineConfig({
  site: SITE,
  base: '/portfolio',
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
  integrations: [
    mdx(),
    sitemap(),
  ],
  vite: {
    ssr: { noExternal: ['@fontsource/inter', '@fontsource/jetbrains-mono'] },
  },
  prefetch: { prefetchAll: true },
});