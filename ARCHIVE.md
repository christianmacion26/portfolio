# Archive & durability — christianmacion.github.io v6.0

> This document is the institutional record of the portfolio's runtime
> architecture, deploy pipeline, and backup strategy. Update this when
> you change anything material about how the site ships.

**Last updated:** 2026-07-10 · v6.0

---

## Runtime architecture

| Layer       | Tech                                                  | Notes                                                                                                                                     |
| ----------- | ----------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Framework   | Astro 7.0.7                                           | Static-site generator. No JS framework runtime — pages are HTML at build time.                                                            |
| Styling     | Hand-rolled CSS + design tokens                       | `src/styles/tokens.css` is the single source of truth for colors, type, spacing, shadows. No Tailwind, no CSS-in-JS.                      |
| Type system | TypeScript 5.7 + path aliases                         | `@components/*`, `@layouts/*`, `@scripts/*`, `@styles/*`, `@utils/*` resolved via `tsconfig.json`.                                        |
| Math        | KaTeX 0.17                                            | Server-rendered (no client JS). Trust-mode `false`.                                                                                       |
| Charts      | `lightweight-charts`                                  | Single instance on `/positions`.                                                                                                          |
| Scripts     | Five small TS modules                                 | `reveal-on-scroll`, `odometer`, `active-nav`, `copy-button`, `theme-toggle`. Total ≈ 6KB minified. All gated by `prefers-reduced-motion`. |
| Fonts       | Inter + JetBrains Mono, self-hosted via `@fontsource` | No Google Fonts CDN dependency.                                                                                                           |

## Content collections

- `src/content/project/` — 9 quant + 6 AI project MDX entries
- `src/content/experience/` — 8 experience entries
- `src/content/skillGroup/` — 3 grouped skill sets
- `src/content/certGroup/` — 4 grouped cert families (with `featuredImg`, `featuredHref`, `featuredAlt`, `featuredCaption` for flagship cards)
- `src/content/solution/` — 10 solutions entries (problem → approach → evidence → outcome → proof)

## Build pipeline

```bash
# Development
npx astro dev

# Production build for GH Pages (default base /portfolio)
npx astro build

# Production build for Cloudflare Pages mirror (base /)
npx astro build --base=/
```

Astro emits 34 pages (28 static routes + 6 deep project routes × sub-paths) plus 3 Atom feeds (`/feed.xml`, `/feed-projects.xml`, `/feed-solutions.xml`) and a sitemap.

## Deploy targets

| Target                         | URL                                             | Trigger                                                                                                                                      |
| ------------------------------ | ----------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| **Cloudflare Pages (primary)** | `https://christianmacion-portfolio.pages.dev`   | Manual `wrangler pages deploy dist --project-name christianmacion-portfolio --commit-dirty=true --branch main` after every GA-relevant edit. |
| **GitHub Pages (degraded)**    | `https://christianmacion26.github.io/portfolio` | Auto-deploy via `.github/workflows/deploy.yml` on push to `main`.                                                                            |

The Cloudflare Pages mirror is the **primary live URL** because GH Pages' CDN edge on `185.199.111.153` is intermittently unresponsive in PH / sandbox regions. The GH Pages CDN serves 3 of 4 Pages IPs correctly — only one edge is broken. Not under our control.

## SEO + accessibility baseline

- Per-page `<title>`, `<meta description>`, canonical URL, OG image, Twitter card.
- Schema.org `Person` + `WebSite` JSON-LD emitted by `BaseLayout.astro`. `FAQPage` JSON-LD on `/for-recruiters`.
- Skip-to-content link, keyboard focus-visible (amber outline), `<main>` landmark.
- WCAG-AA contrast on body text (5.0:1 amber on cream, 5.0:1 ink on cream).
- Sticky `<SectionTOC>` with auto-discovered anchors (`[data-toc-id]`) on long pages; active-section highlight via IntersectionObserver.

## NDA guardrail

`src/utils/nda-audit.ts` runs 6 rules on every build:

1. **City discipline** — no `Davao City` (must be `Digos City, Davao del Sur, Philippines`).
2. **Engagement framing** — no present-tense 19V Capital mentions.
3. **Fund renames** — no `Alpha Apex` or `Alpha Apex Quant`.
4. **Proprietary data sources** — no `Polymarket`, `Kalshi`, `NOAA`, `USDA`.
5. **Quantivo specifics** — no `Quantivo`.
6. **CallRank AI specifics** — no `CallRank`.

Run manually: `npx tsx src/utils/nda-audit.ts`. Output must always be `OK — 0 violations`.

## Security baseline

- `Content-Security-Policy` meta tag in `<head>`: `default-src 'self'`, blocks inline scripts, prevents clickjacking via `frame-ancestors 'none'`.
- `Referrer-Policy: strict-origin-when-cross-origin` — does not leak query strings cross-origin.
- `base-uri 'self'` — prevents `<base>` tag injection.
- No tracking pixels, no analytics, no third-party fonts. GDPR-clean by construction.
- `npm audit` against `registry.npmjs.org` — 0 vulnerabilities in prod deps.

## Backup strategy

- Source of truth: `~/Contingency/christianmacion.github.io/` (working tree).
- Mirror 1: GitHub repo (`christianmacion26/portfolio`).
- Mirror 2: Cloudflare Pages deployed bundle (immutable per-deploy).
- Resume PDFs: regenerated via `scripts/build-resumes.mjs` from `scripts/resumes/*.json`. Source JSON is the canonical; PDFs are build outputs.
- Build artefacts (`dist/`, `.astro/`, `node_modules/`) are git-ignored — only source files are checked in.
- Dependabot weekly for npm dependencies (`.github/dependabot.yml`).

## Versioning

- `Footer.astro` displays `vN · last build · YYYY-MM-DD` (currently v6.0).
- `public/humans.md` is the AI-recruiter indexing source of truth; update on every release with the spine summary.
- This file (`ARCHIVE.md`) updated whenever the architecture, deploy pipeline, or backup strategy changes.

## Recovery procedure

If the GH Pages edge stays broken and Cloudflare Pages goes down:

1. The repo remains readable at `https://github.com/christianmacion26/portfolio`.
2. Anyone can clone and run `npx astro build` locally to reproduce `dist/`.
3. Netlify, Vercel, or any static host can serve `dist/` directly — the build output is fully self-contained (no server-side code, no API routes).

If the content collection schema changes incompatibly, content entries older than 60 days may need a one-time `pnpm content:upgrade` migration (none required for v6.0).

---

_This file is the institutional record. Update when the architecture changes._
