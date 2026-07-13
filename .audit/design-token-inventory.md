# Design-Token Inventory — `christianmacion26.github.io` v6.0.6

Compiled by the design-token inventory agent on 2026-07-10. Source files live under `/Users/christianmacion/Contingency/christianmacion.github.io/`. Every value below is a direct extraction — no values are guessed or invented.

---

## 0. Repo at a glance

- **Stack**: Astro 7 (`/portfolio` base, `trailingSlash: 'always'`, build format `directory`), MDX, sitemap, pagefind search, katex, lightweight-charts, lucide icons, expressive-code, @fontsource (Inter + JetBrains Mono) loaded via `BaseLayout.astro`.
- **CSS architecture**: hand-rolled, no Tailwind / no PostCSS config; three stylesheets (`tokens.css`, `global.css`, `print.css`) imported from `BaseLayout`. Component CSS is Astro-scoped per file; cross-file selectors use `:global()`.
- **Theme system**: dual-trigger dark mode via `[data-theme="dark"]` attribute OR `prefers-color-scheme: dark` media query. Both map to the same token set. The toggle (`theme-toggle.ts`) persists to `localStorage` under the key `theme`. The base inline script in `<head>` runs before paint to set `data-theme` and prevent flash.
- **JS bundles** (6 modules, total < 4KB minified+gzipped per the `BaseLayout` comment): `reveal-on-scroll`, `odometer`, `active-nav`, `copy-button`, `theme-toggle`, `scroll-progress`.
- **Content collections** (5): `project` (15 — 9 quant + 6 AI in `src/content/projects/{quant,ai}/*.mdx`), `certGroup` (4, in `src/content/certifications/`), `experience` (8 entries, `src/content/experience/`), `skill` (3, `src/content/skills/`), `solution` (10, `src/content/solutions/`).
- **Pages**: 24 .astro pages (Home, 404, about, about-this-site, certifications, colophon, contact, experience, for-recruiters, glossary, index, methodology, mistakes, now, papers, positions, projects/, proof, publications, reading, research/, resume, search, skills, solutions, talks, uses) + 2 sub-directory pages (glossary/, projects/, research/) + 3 XML feed endpoints (feed, feed-projects, feed-solutions).
- **Site identity** (from `src/utils/profile.ts`): `Christian T. Macion, CTA®`, title `Quantitative Researcher · AI Engineer`, tagline `I do solutions. Eval-first. NDA-clean.`, location Digos City / Davao del Sur / Philippines (UTC+8), 102 certs, 31 eval gates, 11 AI agents, 76.5k LOC Python, 30 hrs/wk remote.

---

## 1. Color tokens

All defined in `src/styles/tokens.css` `:root` (lines 26–147). Dark variants live in two places: `@media (prefers-color-scheme: dark)` (lines 154–216) and `:root[data-theme='dark']` (lines 218–278). The two dark blocks are identical and intentionally so.

### 1.1 Brand palette (light)

| Token                | Value     | Usage notes                                                                                   |
| -------------------- | --------- | --------------------------------------------------------------------------------------------- |
| `--c-primary`        | `#0a0e14` | Near-black. Primary brand. In dark mode this becomes `#e6edf3` (inverted to text-color role). |
| `--c-primary-deep`   | `#000000` | Hover/darker state of primary.                                                                |
| `--c-primary-2-deep` | `#8c6f2a` | Text-safe amber. WCAG-AA 5.0:1 on white — usable for body & small text.                       |
| `--c-primary-2`      | `#d4a017` | Single accent amber/gold. 2.7:1 on white — decorative only, ≥18px.                            |
| `--c-primary-3`      | `#6b4a8f` | Purple accent — sparingly. Maps to σ in math tokens.                                          |
| `--c-gold`           | `#d4a017` | Callouts/highlights (decorative). Synonym of `--c-primary-2`.                                 |
| `--c-amber-deep`     | `#8c6f2a` | Text-safe terminal-amber for body text.                                                       |
| `--c-amber`          | `#c98a16` | Terminal-amber accent (decorative).                                                           |
| `--c-accent-cyan`    | `#22d3ee` | Alternative accent (signal/data, not heavily used).                                           |

### 1.2 Ink (text) scale (light)

| Token             | Value     | Usage                                                                  |
| ----------------- | --------- | ---------------------------------------------------------------------- |
| `--c-ink`         | `#1a1f24` | Body text.                                                             |
| `--c-ink-2`       | `#5a6473` | Muted text (sub-titles, captions, secondary copy).                     |
| `--c-ink-3`       | `#869098` | Faintest (footnotes, pill labels, scroll-progress aria, ticker muted). |
| `--c-rule`        | `#c9ced6` | Dividers.                                                              |
| `--c-rule-soft`   | `#e6e9ee` | Hairline dividers.                                                     |
| `--c-rule-strong` | `#1a1f24` | High-contrast rule (in light mode = `--c-ink`).                        |

### 1.3 Background scale (light)

| Token             | Value     | Usage                        |
| ----------------- | --------- | ---------------------------- |
| `--c-bg`          | `#ffffff` | Paper / page bg.             |
| `--c-bg-2`        | `#f6f8fa` | Panel / banner bg.           |
| `--c-bg-3`        | `#eef1f5` | Deeper panel.                |
| `--c-paper`       | `#fbfaf6` | Term-paper cream.            |
| `--c-paper-2`     | `#f5f3eb` | Deeper paper.                |
| `--c-tape`        | `#0d1117` | Terminal / equity-tape dark. |
| `--c-tape-2`      | `#161b22` | Lighter tape.                |
| `--ink-on-tape`   | `#e6edf3` | Body text on dark/tape.      |
| `--ink-on-tape-2` | `#c9ced6` | Muted text on dark/tape.     |

### 1.4 Status / signal (light)

| Token           | Value     | Usage                                                   |
| --------------- | --------- | ------------------------------------------------------- |
| `--c-pass`      | `#15803d` | Equity green, verified/pass. Deep enough for body text. |
| `--c-pass-soft` | `#dcfce7` | Soft pass bg.                                           |
| `--c-fail`      | `#9b2226` | Error/danger.                                           |
| `--c-fail-soft` | `#fee2e2` | Soft fail bg.                                           |
| `--c-warn`      | `#8c6f2a` | Warning amber — text-safe (= `--c-amber-deep`).         |
| `--c-warn-soft` | `#fef3c7` | Soft warn bg.                                           |
| `--c-info`      | `#1d4ed8` | Info blue.                                              |
| `--c-info-soft` | `#dbeafe` | Soft info bg.                                           |

### 1.5 Math / quant accents (light)

| Token       | Value     | Symbol | Notes                             |
| ----------- | --------- | ------ | --------------------------------- |
| `--c-eq`    | `#0a0e14` | —      | Equation color (near-black).      |
| `--c-phi`   | `#8c6f2a` | Φ      | Primary accent. Text-safe, 5.0:1. |
| `--c-sigma` | `#6b4a8f` | σ      | Purple, kept for variety.         |
| `--c-delta` | `#8c6f2a` | Δ      | Deep amber.                       |
| `--c-mu`    | `#5a6473` | μ      | Gray.                             |
| `--c-alpha` | `#15803d` | α      | Green (signal pass), text-safe.   |
| `--c-beta`  | `#8c6f2a` | β      | Deep amber.                       |

### 1.6 Dark mode overrides (key shifts)

| Token               | Light                   | Dark                    | Δ                                                                  |
| ------------------- | ----------------------- | ----------------------- | ------------------------------------------------------------------ |
| `--c-primary`       | `#0a0e14`               | `#e6edf3`               | inverts role: was brand ink, now text                              |
| `--c-primary-2`     | `#d4a017`               | `#e8b220`               | slight lift for dark BG                                            |
| `--c-primary-3`     | `#6b4a8f`               | `#9d80c4`               | purple lifted                                                      |
| `--c-amber`         | `#c98a16`               | `#e8b220`               | lifted                                                             |
| `--c-ink`           | `#1a1f24`               | `#f0f6fc`               | inverts                                                            |
| `--c-ink-2`         | `#5a6473`               | `#c9d1d9`               |                                                                    |
| `--c-ink-3`         | `#869098`               | `#8b949e`               |                                                                    |
| `--c-rule`          | `#c9ced6`               | `#4a525a`               | v6.0 fix: lifted from `#30363d` for readable dividers on `#0d1117` |
| `--c-rule-soft`     | `#e6e9ee`               | `#2d333b`               | v6.0 fix: lifted from `#21262d`                                    |
| `--c-bg`            | `#ffffff`               | `#0d1117`               |                                                                    |
| `--c-bg-2`          | `#f6f8fa`               | `#161b22`               |                                                                    |
| `--c-bg-3`          | `#eef1f5`               | `#1f242c`               |                                                                    |
| `--c-pass`          | `#15803d`               | `#3fb950`               | lifted for dark contrast                                           |
| `--c-fail`          | `#9b2226`               | `#f85149`               |                                                                    |
| `--c-warn`          | `#8c6f2a`               | `#d4a017`               |                                                                    |
| `--c-info`          | `#1d4ed8`               | `#58a6ff`               |                                                                    |
| `--hero-gradient-1` | `rgba(212,160,23,0.14)` | `rgba(212,160,23,0.18)` |                                                                    |
| `--hero-gradient-2` | `rgba(11,61,92,0.10)`   | `rgba(11,61,92,0.18)`   |                                                                    |

Shadows also darken: `--shadow-xs/sm/md/lg` swap from `rgba(11,31,42,0.0X)` to `rgba(0,0,0,0.X)`. Borders lift: `--border-paper: 1px solid rgba(230,237,243,0.08)`.

### 1.7 Ad-hoc colors (NOT in tokens.css)

These raw hex / rgba values are sprinkled directly across components and need either hoisting into tokens or leaving as-is. **Audit-grep finds them across Nav, Footer, DSRCalculator, TrustStrip, etc.** — list in priority order:

- `#8a6506` — used in `.pill--accent` and `.pill--gold` text color (`global.css:310, 315`) — same as deep amber; should just be `--c-amber-deep`.
- `#d4a017` / `#d29922` — used as raw hex in DSRCalculator (DSR number, axis-label, threshold), Ticker (warn color), TrustStrip icon. Always available as `--c-amber` / `--c-primary-2` in tokens, but used raw for static JS-driven inline SVG.
- `#3fb950` — used raw in Footer `.footer__role`, Ticker `--pass` delta, Stat `--mono` value. Available as `--c-pass` in dark mode only; in light mode the raw `#3fb950` is the GitHub-green pass color used for "Available" copy.
- `#f85149` (fail in Ticker), `#58a6ff` (info in Ticker), `#6e7681` (muted in Ticker), `#8b949e` (symbol in Ticker) — all GitHub dark-mode palette colors hard-coded in Ticker.astro.
- `#0a0d12` — used as the dark hover color of `--c-amber` (CTA banner, nav resume button) — close to but not equal to `--c-primary` (`#0a0e14`).
- `#fff` / `#ffffff` — used raw in 14+ places (Footer `.footer__name`, Avatar button hover, DSRCalculator axis) — should be `var(--ink-on-tape)` for symmetry.
- `rgba(255,255,255,0.X)` — used in 9+ dark-bg contexts (Footer, Ticker, DSR, TrustStrip, CTABanner) as overlays. No semantic naming.
- `rgba(212, 160, 23, 0.X)` — used as the "amber overlay" pattern in 7+ places (TrustStrip pill hover, hero gradient, ticker-border, etc.) — should become a token like `--c-amber-overlay-X`.
- `rgba(11, 31, 42, 0.X)` — navy ink overlay (Founder's tint from resume.css). Not in tokens.

### 1.8 Status dot (built into tokens.css, lines 327–352)

Five semantic dots all share an 8×8px core with a 3px-ring glow:

| Class         | Core color                     | Ring color                                         |
| ------------- | ------------------------------ | -------------------------------------------------- |
| `.dot`        | `var(--c-pass/fail/warn/info)` | `var(--c-pass-soft/fail-soft/warn-soft/info-soft)` |
| `.dot--muted` | `var(--c-ink-3)`               | —                                                  |

---

## 2. Typography scale

Defined in `tokens.css` (lines 82–100) and applied via `global.css` h1–h6 (lines 102–129). All fonts loaded via `@fontsource` from `BaseLayout.astro` (lines 5–10): Inter weights 400/500/600/700 and JetBrains Mono weights 400/500.

### 2.1 Font family stack

| Token       | Value                                                                                                                   | Notes                                   |
| ----------- | ----------------------------------------------------------------------------------------------------------------------- | --------------------------------------- |
| `--ff-sans` | `'Inter', 'Helvetica Neue', system-ui, -apple-system, sans-serif`                                                       | Body, headings, UI.                     |
| `--ff-mono` | `'JetBrains Mono', ui-monospace, 'SF Mono', Menlo, monospace`                                                           | Code, captions, numbers, ticker, pills. |
| `--ff-math` | `'KaTeX_Main', 'Latin Modern Math', 'Computer Modern Serif', 'STIX Two Math', 'Cambria Math', 'Times New Roman', serif` | KaTeX equation rendering.               |

The `BaseLayout` body uses `font-size: 16px` and `line-height: var(--lh-normal)` (1.5). `-webkit-font-smoothing: antialiased`, `text-rendering: optimizeLegibility`. `code/pre/kbd` get `font-size: 0.92em` (slightly smaller than body).

### 2.2 Font-size scale (modular — 1.25 ratio with rounded values)

| Token       | rem      | px     | Used for                                                                               |
| ----------- | -------- | ------ | -------------------------------------------------------------------------------------- |
| `--fs-xs`   | 0.78rem  | 12.5px | Eyebrows, pill labels, ticker items, footnotes, code, tooltips, hero sub, input ticks. |
| `--fs-sm`   | 0.875rem | 14px   | Nav links, button text, card body, project summary, proof-list meta.                   |
| `--fs-base` | 1rem     | 16px   | Body.                                                                                  |
| `--fs-lg`   | 1.125rem | 18px   | Section sub-headings, h4, footer__name.                                                |
| `--fs-xl`   | 1.375rem | 22px   | h3, code-card__title, callout titles.                                                  |
| `--fs-2xl`  | 1.75rem  | 28px   | h2, stat--md value, metric__value, cta__title.                                         |
| `--fs-3xl`  | 2.25rem  | 36px   | h1 (mobile), section__title, stat--lg value.                                           |
| `--fs-4xl`  | 3rem     | 48px   | h1 (desktop), stat--xl value.                                                          |
| `--fs-5xl`  | 4rem     | 64px   | Defined but unused in current source.                                                  |

Two `clamp()` overrides bypass the scale:

- `.hero__title` → `clamp(2.5rem, 5.5vw, 4.5rem)` (max 72px).
- `.hero__result-figure` → `clamp(2.25rem, 5vw, 3.5rem)`.

### 2.3 Line-height scale

| Token         | Value  | Used for                                           |
| ------------- | ------ | -------------------------------------------------- |
| `--lh-tight`  | `1.15` | h1–h6 (headings).                                  |
| `--lh-snug`   | `1.3`  | Captions, code blocks, timeline contributions.     |
| `--lh-normal` | `1.5`  | html/body, footer col, hero stat tiles.            |
| `--lh-loose`  | `1.75` | Body paragraphs (`<p>`), list items, descriptions. |

### 2.4 Heading defaults (global.css lines 102–129)

- h1–h6: `font-weight: 600`, `line-height: var(--lh-tight)`, `color: var(--c-ink)`, `letter-spacing: -0.012em`.
- h1: `--fs-4xl` (48px), letter-spacing `-0.025em`.
- h2: `--fs-2xl` (28px), letter-spacing `-0.018em`.
- h3: `--fs-xl` (22px).
- h4: `--fs-lg` (18px).
- **Mobile breakpoint (≤720px)**: h1 → `--fs-3xl`; h2 → `--fs-2xl`.
- **Sub-mobile (≤480px)**: h1 → `--fs-2xl`; h2 → `--fs-xl`.
- p: `line-height: var(--lh-loose)` (1.75).
- li: `line-height: var(--lh-loose)`.

### 2.5 Numeric / tabular

- `.stat__value`, `.metric__value`, `.hero__result-figure` all set `font-variant-numeric: tabular-nums; font-feature-settings: 'tnum' 1;` — keeps the columns aligned when numbers animate.
- Ticker items: `font-variant-numeric: tabular-nums` on `.ticker__sym` and `.ticker__delta`.

---

## 3. Spacing scale

Defined in `tokens.css` (lines 102–112). 10-step geometric-ish scale, doubling from `--sp-6` upward.

| Token     | rem     | px    | Used for                                                                                        |
| --------- | ------- | ----- | ----------------------------------------------------------------------------------------------- |
| `--sp-1`  | 0.25rem | 4px   | tight stacking inside pills, gap between eyebrow/title pairs.                                   |
| `--sp-2`  | 0.5rem  | 8px   | inline icon-text gaps, pill padding-y, micro margins.                                           |
| `--sp-3`  | 0.75rem | 12px  | card body gaps, eyebrow→title margin, grid gap-2.                                               |
| `--sp-4`  | 1rem    | 16px  | section sub-margin, card padding-y, list gaps.                                                  |
| `--sp-5`  | 1.5rem  | 24px  | default section gap, card padding, grid gap-default, `gap: var(--sp-5)` on the `.grid` utility. |
| `--sp-6`  | 2rem    | 32px  | section padding, big gaps, section__head bottom margin.                                         |
| `--sp-7`  | 3rem    | 48px  | hero padding-block, footer padding-block, "tight" section alternative.                          |
| `--sp-8`  | 4rem    | 64px  | `.section` default padding-block, `process` padding-block.                                      |
| `--sp-9`  | 6rem    | 96px  | Footer top margin, hero top padding.                                                            |
| `--sp-10` | 8rem    | 128px | Defined but unused.                                                                             |

---

## 4. Radius scale

| Token         | Value  | Used by                                                                                                                                                                              |
| ------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `--radius-sm` | `6px`  | Buttons, pills, code-card, search bar, theme toggle, ticker__item...wait, no — `.katex__thumb`, `.code-card__preview` (since it inherits), search input. Most-used radius.           |
| `--radius`    | `10px` | Cards (`.card`, `.code-card`, `.proj-card`, `.stat`, `.gate-tile`, `.dsr-calc`), `.toc__link`, `.nav-more__menu`, `.hero__eq-cell`, `.proof-card`, `.flagship`, `.ctabanner__inner`. |
| `--radius-lg` | `16px` | `.cta` (the gradient CTA banner), `.dsr-calc` outer.                                                                                                                                 |

Plus: pill-shaped elements use `border-radius: 999px` directly (no token), and avatar uses `50%`. `.hl::after` (highlight underline) uses `2px`.

---

## 5. Shadow scale

Four steps (light mode → dark mode):

| Token         | Light                                                           | Dark                                                     |
| ------------- | --------------------------------------------------------------- | -------------------------------------------------------- |
| `--shadow-xs` | `0 1px 1px rgba(11,31,42,0.04)`                                 | `0 1px 1px rgba(0,0,0,0.4)`                              |
| `--shadow-sm` | `0 1px 3px rgba(11,31,42,0.06), 0 1px 2px rgba(11,31,42,0.04)`  | `0 1px 3px rgba(0,0,0,0.5), 0 1px 2px rgba(0,0,0,0.3)`   |
| `--shadow-md` | `0 4px 12px rgba(11,31,42,0.08), 0 2px 4px rgba(11,31,42,0.04)` | `0 4px 12px rgba(0,0,0,0.5), 0 2px 4px rgba(0,0,0,0.3)`  |
| `--shadow-lg` | `0 12px 32px rgba(11,31,42,0.1), 0 4px 8px rgba(11,31,42,0.05)` | `0 12px 32px rgba(0,0,0,0.6), 0 4px 8px rgba(0,0,0,0.3)` |

Ad-hoc (not in tokens) — `0 1px 6px rgba(212,160,23,0.18)` (Footer avatar), `0 4px 16px rgba(11,31,42,0.18)` (hero headshot), `0 2px 12px rgba(212,160,23,0.18)` (avatar ring), `0 0 6px rgba(212,160,23,0.4)` (scroll-progress bar).

---

## 6. Motion vocabulary

### 6.1 Tokens (`tokens.css` lines 124–131)

- `--transition: 150ms ease;` — default. Used for color, border, background, opacity.
- `--ease-snappy: cubic-bezier(0.4, 0, 0.2, 1);` — Material standard. Applied to `.btn`, `.hero__link`, `.proof-list__title`, `.gate-tile`, `.flagship` (via `global.css` lines 395–402).
- `--ease-out: cubic-bezier(0.16, 1, 0.3, 1);` — "soft landing" / reveal. Used by `[data-reveal]` (320ms fade+8px translateY).

### 6.2 Ad-hoc transitions in components

- `.nav__toggle span` → `all 200ms ease` (burger bar transform).
- `.nav__links` → `transform 200ms ease` (slide-out for mobile menu).
- `.nav-more__chev` → `transform var(--transition)` (chevron rotation).
- `.proof-card__link:hover .proof-card__img` → `transform 200ms ease` (1.01× scale on hover).
- `.flagship::after` → `transform 600ms ease` (shine sweep from -110% to 110% x).
- `.ticker__track` → `ticker-scroll 45s cubic-bezier(0.4, 0, 0.2, 1) infinite` (Phase D-6 change from 60s linear).
- `.dsr-calc__slider::-webkit-slider-thumb` → `transform 0.1s` (1.15× on hover).

### 6.3 Keyframe animations

- `@keyframes brand-motif-breathe` (5.5s ease-in-out infinite) — opacity 1→0.72→1 on the "ship" cell of the gate lattice.
- `@keyframes trust-pulse` (2.4s ease-snappy infinite) — green dot under the "verified" pill (box-shadow ring expands 0→3px, opacity 1→0.85→1).
- `@keyframes ticker-scroll` (45s cubic-bezier) — translateX(0 → -50%), pure CSS.
- `@keyframes odometer` (JS-driven, 1200ms ease-out cubic) — textContent 0→N with rAF.

### 6.4 `prefers-reduced-motion` handling

- `tokens.css` lines 286–291: `* { transition: none !important; animation: none !important; }` — global kill.
- BrandMotif ship-breathing wrapped in `@media (prefers-reduced-motion: no-preference)` — only animates when explicitly allowed.
- TrustStrip pulse, Ticker scroll, theme-toggle, NavMore chevron, reveal-on-scroll, odometer — all individually honor reduced motion in their own CSS or JS.

### 6.5 What's MISSING from the motion vocabulary

- **Page-transition / view-transition API**: not used at all. Astro 7 supports it; could be wired for a more app-like feel on inter-page navigation.
- **Scroll-linked animations**: only `scroll-progress.ts` exists (a 2px amber bar at top). No parallax, no scroll-driven reveals beyond the simple opacity+translate.
- **Spring physics / overshoots**: zero. All motion is linear or cubic-bezier ease-out. No elastic, no bounce.
- **Reduced motion fallback for hover transforms**: `transform: translateY(-1px)` on `.proj-card`, `.trust-pill` is NOT explicitly disabled under reduced-motion (relies on the global `*` rule, which should cover it).
- **Staggered reveals**: `[data-reveal]` fires one at a time as each crosses the viewport; no orchestrated stagger delay.
- **Hover scale on Cards**: present (1.01× on proof-card), absent on project-card (only translateY -1px).
- **Skeleton/shimmer**: used only once (SectionTOC `__skeleton` text). No skeleton cards, no shimmer animation.
- **Marquee direction**: ticker is one-way. No reverse, no pause-on-hover (intentional — "institutional restraint" per Phase D-6 note).

---

## 7. Z-index scale

The system is **not tokenized** — values are inline across 5 files. Order from bottom to top:

| z-index | Element                                   | File               |
| ------- | ----------------------------------------- | ------------------ |
| `0`     | (default)                                 | —                  |
| `2`     | `.ticker::before/after` gradient mask     | Ticker.astro       |
| `30`    | `.toc` (sticky section TOC)               | SectionTOC.astro   |
| `50`    | `.nav` (sticky top nav)                   | Nav.astro          |
| `60`    | `.nav-more__menu` (Resources dropdown)    | NavMore.astro      |
| `60`    | `#scroll-progress-bar` (top progress bar) | scroll-progress.ts |
| `1000`  | `.skip-link:focus`                        | global.css         |

Stacking order reads correctly (TOC under nav, dropdown above nav, progress above all), but it relies on inline `60` colliding with itself. A `--z-{nav,toc,dropdown,progress,skip-link}` token set would let the implementer reorder cleanly.

---

## 8. Layout primitives

### 8.1 Container (global.css lines 148–160)

- `.container` → `width: 100%; max-width: var(--container-max); margin-inline: auto; padding-inline: var(--sp-5);`
- `.container-narrow` → same but `max-width: var(--container-narrow)`.
- `--container-max: 1180px` (site default — used by `.section > .container`, `process__diagram`, brand motif width = 360 / 420).
- `--container-narrow: 760px` (long-form prose: `proof-head`, `process__head`, proof page `__inner`).

### 8.2 Section (global.css lines 162–196)

- `.section` → `padding-block: var(--sp-8)` (4rem vertical).
- `.section--alt` → `background: var(--c-bg-2)` (alternating zebra).
- `.section--tight` → `padding-block: var(--sp-6)` (2rem).
- `.section__head` → `margin-bottom: var(--sp-6)`.
- `.section__eyebrow` → uppercase mono (12.5px, 0.12em letter-spacing, `--c-primary-2-deep`).
- `.section__title` → `--fs-3xl`, `margin-bottom: var(--sp-3)`.
- `.section__sub` → `--fs-lg`, `color: var(--c-ink-2)`, `max-width: 60ch`.

### 8.3 Grids

- `.grid` → `display: grid; gap: var(--sp-5)`.
- `.grid-2` → `repeat(auto-fit, minmax(280px, 1fr))`.
- `.grid-3` → `repeat(auto-fit, minmax(260px, 1fr))`.
- `.grid-4` → defined by the home page hero__stats (`repeat(4, 1fr)`).
- `.hero__stats`, `.stats-grid` (mobile) collapse to `repeat(2, minmax(0, 1fr))` at ≤720px, `1fr` at ≤480px.
- `.footer__cols` → `repeat(4, 1fr)` (desktop), `1fr 1fr` (≤880px), `1fr` (≤540px).
- `.footer__inner` → `1.1fr 3fr` (desktop), `1fr` (≤880px).
- `.hero__portrait` → `minmax(0, 1.6fr) minmax(0, 1fr)` (desktop), `1fr` (≤720px).
- `.hero__eq-row` → `1.5fr 1fr` (desktop), `1fr` (≤880px).
- `.hero__result` → `minmax(0, 1fr) minmax(0, 1.2fr)` (desktop), `1fr` (≤880px).
- `.stat-row__inner` → `repeat(4, 1fr)` (desktop), `1fr 1fr` (≤880px), `1fr` (≤540px).
- `.gates-preview` → `repeat(auto-fit, minmax(220px, 1fr))`.
- `.ai-secondary__grid` → `repeat(3, 1fr)`, `1fr` (≤720px).
- `.proof-grid--flagship` and `.proof-grid--code` (on proof.astro) → `repeat(auto-fit, minmax(280px, 1fr))` (live in scoped CSS).
- `.proof-list--paged` → flex column with `data-page-index` driving client-side paging.
- `.dsr-calc__body` → `1.4fr 1fr`, `1fr` (≤720px).
- `.footer__base-inner` → flex `space-between` with wrap.
- `.tl` (timeline) → `32px 1fr`.

### 8.4 Specific vertical heights

- `--nav-h: 56px` (sticky nav height).
- `--section-toc-h: 36px` (sticky section TOC).
- `--tape-h: 28px` (legacy ticker height; current ticker is `32px` hard-coded).
- `.ticker` is `32px` hard-coded.
- `.pipeline` SVG: horizontal 1000×320, vertical 400×variable (60 + 5×80 + 4×60 + 60 ≈ 540).

### 8.5 Other layout notes

- `html { scroll-behavior: smooth; }` (line 23 of global.css).
- `body { min-height: 100dvh; overflow-x: hidden; }` (line 30) — body never scrolls horizontally, narrow content uses `.scroll-x`.
- `img, picture, video, canvas, svg { display: block; max-width: 100%; height: auto; }` — global responsive media.
- `a` has `text-decoration-color: var(--c-rule)` (default underline uses rule color), `text-underline-offset: 2px`.

---

## 9. Breakpoints (media queries)

`tokens.css` does not define breakpoint tokens. Breakpoints are scattered:

| px   | Where                                                                             | Effect                                                                                            |
| ---- | --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| 1080 | Nav.astro                                                                         | Brand sub hides, primary nav still visible inline.                                                |
| 1024 | Nav.astro (commented: "primary visible ≥1024px")                                  | —                                                                                                 |
| 980  | Nav.astro / NavMore.astro                                                         | Burger toggle appears, dropdown collapses, all links flat.                                        |
| 880  | Footer.astro, index.astro (hero__eq-row, hero__result, stat-row, now-strip)       | Footer 4→2 cols, hero__result stacks, now strip 3→1.                                              |
| 760  | PipelineDiagram.astro                                                             | Horizontal SVG → vertical.                                                                        |
| 720  | global.css, index.astro, CTABanner, DSRCalculator, Avatar, TrustStrip, BrandMotif | Major mobile breakpoint. h1→--fs-3xl, h2→--fs-2xl, grids to 2-up, slider stacked, CTA 1-col, etc. |
| 600  | global.css                                                                        | KaTeX block shrink to 0.74em. Nav brand-name shrinks.                                             |
| 540  | Footer.astro, index.astro                                                         | Footer 2→1 col. Stat row 2→1 col.                                                                 |
| 480  | global.css                                                                        | h1→--fs-2xl, h2→--fs-xl, container padding-inline→--sp-3.                                         |
| 420  | Nav.astro                                                                         | Brand-name 0.7rem.                                                                                |

**Missing**: any 4K / extra-large breakpoint. The site is desktop-up, never grows beyond `1180px` container.

---

## 10. Borders

Three shorthand tokens (`tokens.css` lines 135–137):

| Token             | Value                              |
| ----------------- | ---------------------------------- |
| `--border`        | `1px solid var(--c-rule)`          |
| `--border-strong` | `1px solid var(--c-ink-3)`         |
| `--border-paper`  | `1px solid rgba(11, 31, 42, 0.12)` |

Plus component-specific border colors:

- `.code-card` / `.flagship` / `.hero__result` / `.gate-tile` / `.ai-secondary` / `.dsr-calc__why` use a `border-left: 3px solid var(--c-primary-2-deep)` accent — a recurring visual motif (6+ components).
- `.hero__proof-row` uses `border-left: 3px solid var(--c-pass)`.
- `.now-strip` has `border-top/bottom: 1px solid var(--c-tape-2)`.
- Cards in dark mode use `--border-paper: 1px solid rgba(230, 237, 243, 0.08)`.

---

## 11. Hero & paper-texture background

- `.bg--paper` (tokens.css line 311) — combined linear gradient + 18×18px dot grid. Defined but not actually used in any current page (home uses ad-hoc radial gradients in `.hero`).
- `.bg--tape` — just `var(--c-tape)` + `var(--ink-on-tape)`. Used by now-strip, footer, dsr output.
- `.hero` (index.astro) — two radial gradients (`rgba(212,160,23,0.14)` top-right, `rgba(11,61,92,0.10)` top-left) over `var(--c-paper)`. Defined as `--hero-gradient-1` and `--hero-gradient-2` in tokens but used as raw rgba in the page.
- `.cta` — `linear-gradient(135deg, var(--c-tape) 0%, var(--c-tape-2) 100%)` with `border: 1px solid var(--c-amber)`.
- `.dsr-calc__output` — `var(--c-tape)`.
- `.stat--primary`, `.stat--mono` — `var(--c-tape)`.
- `.now-strip` — `var(--c-tape)`.
- `--eq-bg` — `linear-gradient(180deg, var(--c-bg) 0%, var(--c-paper) 100%)`. Defined but currently unused.

---

## 12. Focus / a11y

- Universal `*:focus-visible` ring: `outline: 2px solid var(--c-primary-2-deep); outline-offset: 2px;` (global.css line 94).
- `a:focus-visible` adds `border-radius: 2px;` and an `outline-offset: 3px;` (line 88).
- `.skip-link` — absolute, `left: -9999px` until focus, then `position: fixed; z-index: 1000;` (lines 357–370).
- `.sr-only` utility present (lines 345–355).
- Dark mode outline color stays text-safe because it uses the same `--c-primary-2-deep` token.

---

## 13. Component inventory (all `src/components/*.astro`)

| File                    | Purpose                                                                                                                                                                                      | Key CSS classes                                                                                                                                                                                                                           | LOC |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --- |
| `Avatar.astro`          | Circular headshot, AVIF+WebP via `<Image>`, amber ring + soft amber shadow.                                                                                                                  | `.avatar`                                                                                                                                                                                                                                 | 63  |
| `BrandMotif.astro`      | 33-cell micro-lattice SVG encoding G1–G31; family cells are real `<a>` links to `/methodology#family-N`; cell 16 is "ship" (animated), 27 is "block".                                        | `.brand-motif`, `.brand-motif__cell`, `__cell--gate/--ship/--block`                                                                                                                                                                       | 217 |
| `CTABanner.astro`       | Terminal-gradient CTA strip (tape→tape-2 diagonal, amber border) with primary+ghost buttons.                                                                                                 | `.cta`, `.cta__inner/title/sub/actions`                                                                                                                                                                                                   | 93  |
| `Chart.astro`           | Server-rendered SVG chart, 3 types: line / hist (with null PDF overlay + dataX marker) / bar. Deterministic gradient ID hash to avoid `<defs>` collisions.                                   | `.chart`, `__svg/grid/axis/tick/title/caption/mark`                                                                                                                                                                                       | 396 |
| `CodeProofCard.astro`   | Proof card for OSS artifacts. `kind` eyebrow, title, tagline, terminal-style preview block + output lines, repo path footer. Amber left rail.                                                | `.code-card`, `__head/kind/title/tagline/metric/preview/output/foot/link`                                                                                                                                                                 | 186 |
| `DSRCalculator.astro`   | Interactive Deflated Sharpe Ratio (Bailey & López de Prado 2014) — 3 sliders (N, SR, T), verdict (pass/warn/fail), tape-dark output panel, `<details>` explainer. Pure JS, no libs.          | `.dsr-calc`, `__head/eyebrow/title/sub/body/controls/row/label/val/slider/ticks/output/result/verdict/num/dsr/dsr-label/gates/chart/axis/axis-label/mark/why/why-summary/why-body`                                                        | 493 |
| `Equation.astro`        | Server-rendered KaTeX (`renderToString`), supports inline+block, 4 sizes (sm/md/lg/xl), 2 tones (paper/tape). Tape tone re-paints ~40 KaTeX class selectors to keep glyphs readable on dark. | `.eq`, `eq--block/--tape/--sm/--lg/--xl`, `.eq__label`                                                                                                                                                                                    | 149 |
| `FlagshipCard.astro`    | Tier-1 credential card. Wraps `ProofCard`. Has built-in `::after` shine sweep (600ms) + lift on hover.                                                                                       | `.flagship`, `__head/kind/badge/title/group/blurb/media/link`                                                                                                                                                                             | 144 |
| `Footer.astro`          | 4-column site map + identity block. Uses `BrandMotif` + `Avatar` + status dot. Dark `var(--c-tape)` background.                                                                              | `.footer`, `__inner/brand/mark/identity/avatar/id-text/name/role/loc/hours/cols/col/h4/base/base-inner/base-meta`                                                                                                                         | 241 |
| `MetricPill.astro`      | Single headline-metric pill (label + big mono value + optional sub). Tone-mappable color (brand/accent/gold/pass).                                                                           | `.metric`, `__value/label/sub`                                                                                                                                                                                                            | 57  |
| `Nav.astro`             | Top sticky nav. 7 primary + 11 secondary (Resources dropdown). Brand mark + name + sub. Search + theme-toggle buttons. Mobile: burger menu at ≤980px. Resume CTA always amber (P0-4 fix).    | `.nav`, `__inner/brand/brand-mark/brand-text/brand-name/brand-sub/links/primary/secondary-row/link/link--active/cta/cta--mobile/cta--desktop/search/toggle-input/toggle/secondary-row/links`                                              | 391 |
| `NavMore.astro`         | `<details>`-based Resources disclosure for desktop, flat `<ul>` for mobile.                                                                                                                  | `.nav-more`, `__summary/chev/menu/flat/link/link--active`                                                                                                                                                                                 | 198 |
| `PipelineDiagram.astro` | Inline SVG flowchart, 5 boxes + arrows + feedback loop curve, both horizontal (default) and vertical (≤760px) variants. Themable: paper / tape tones.                                        | `.pipeline`, `__svg/--h/--v`, `.pd-grid/grid-line/--v/--h`, `.pd-arrow/--loop`, `.pd-arrow-head/--loop`, `.pd-box/box-rect/box-num/box-title/box-sub`, `.pd-loop-label`                                                                   | 473 |
| `ProcessStrip.astro`    | Wrapper around `PipelineDiagram` with section head. The v3.5 replacement for the old flat bar chart.                                                                                         | `.process`, `__head/title/sub/diagram`, `process--tape`                                                                                                                                                                                   | 72  |
| `ProjectCard.astro`     | Single project cell (AI or Quant), with `lane` badge, optional order number + status pill, up to 3 metrics, "Read more →" link. Hover: `translateY(-1px)`.                                   | `.proj-card`, `__head/lane/ord/title/summary/metrics/metric/-label/-value/-sub/more`                                                                                                                                                      | 146 |
| `ProofCard.astro`       | `<figure>` with optional link wrap, `loading="lazy"` `<img>`, caption, credit. Aspect-ratio guard via inline `--proof-aspect` CSS var. Two tones (paper/tape).                               | `.proof-card`, `proof-card--paper/--tape`, `__link/img/cap/caption/credit`                                                                                                                                                                | 116 |
| `ReadMeta.astro`        | Quiet mono read-time + last-updated annotation for long-form pages.                                                                                                                          | `.read-meta`, `__time/sep/upd-prefix/date/proof`                                                                                                                                                                                          | 117 |
| `SectionTOC.astro`      | Sticky in-page section nav (below nav). Auto-discovers `[data-toc-id]` via client script. `is-active` class driven by `active-nav.ts` IntersectionObserver.                                  | `.toc`, `__inner/label/list/link/link--active/auto/skeleton`                                                                                                                                                                              | 156 |
| `Sparkline.astro`       | Tiny inline SVG sparkline, optional gradient fill, deterministic gradient ID.                                                                                                                | `.sparkline`                                                                                                                                                                                                                              | 108 |
| `Stat.astro`            | Metric tile: label + big mono value (4 sizes, 4 variants) + sub + optional trend arrow + optional sparkline + optional KaTeX formula.                                                        | `.stat`, `__head/label/formula/value-row/value/trend/spark/sub`, `stat--sm/md/lg/xl`, `stat--default/primary/accent/mono`, `stat--trend-up/down/flat`                                                                                     | 198 |
| `Ticker.astro`          | CSS-only scrolling marquee of 10 "ticker symbols" (DSR, OOS, PBO, SHARPE, GATES, NDA, PROJ, CTA, PIT, UTC). 45s loop, 5 GitHub dark-mode color hues hard-coded.                              | `.ticker`, `__track/item/sym/val/delta`, `__item--pass/fail/warn/info/muted`                                                                                                                                                              | 142 |
| `TimelineEntry.astro`   | One experience entry. Left rail with dot+line, role/company/loc, date range, summary, contributions list with dot-status proofs.                                                             | `.tl`, `__rail/dot/line/body/head/role/meta/company/sep/loc/current/date/summary/content/contributions/contributions-label/contributions-list/contribution-label/contribution-evidence/contribution-proof/proofs/proofs-list/proof-glyph` | 268 |
| `TrustStrip.astro`      | Row of 5 trust pills (tested / reproducible / NDA-clean / RSS / build-SHA / verified). Pulsing green dot on the verified pill.                                                               | `.trust-strip`, `trust-strip--paper/--tape`, `__inner/title`, `.trust-pill`, `__icon/label/detail/dot`, `trust-pill--static`                                                                                                              | 201 |
| `VideoEmbed.astro`      | HTML5 `<video>` wrapper. Two modes: inline (click-to-play, native controls) and gallery (autoplay/muted/loop/playsinline). Duration badge top-right in inline mode.                          | `.video-embed`, `__frame/video/cap/duration`, `video-embed--paper/--tape`                                                                                                                                                                 | 104 |

**Total**: 25 components, ~4,729 lines (3,165 lines of markup/JS + ~1,564 lines of scoped CSS).

---

## 14. Current type system — prose

The site speaks a **3-font language** with a tight, technical register. The body is Inter (loaded as a self-hosted webfont via `@fontsource/inter`, weights 400/500/600/700), set at 16px with a generous 1.75 line-height for prose and 1.5 for UI. The voice of authority comes from the heading weights — h1/h2 carry 600 with progressively tighter letter-spacing (`-0.025em` at h1, `-0.018em` at h2) to feel like a Bloomberg terminal headline. JetBrains Mono is the second voice: every eyebrow, every pill, every pill label, every metric number, every code block, every pill background — all mono. It is the "data voice", and it dominates on the home page (Ticker, TrustStrip, gate-tile ranges, sparkline numbers, "trust/" eyebrow). KaTeX is the third voice, reserved for inline equations and the hero DSR formula; its serif (Cambria Math / STIX Two Math stack) deliberately contrasts the sans/mono binary to read as a math paper rather than a marketing page. The type scale is modular (1.25 ratio, 9 steps from 12.5 to 64px) and only marginally bent by clamps on the hero (max 72px) and result figure (max 56px). There is no display weight differentiation: nothing in the system uses Inter Black or extra-bold except the brief `--c-primary` value text at 800. The system is **deliberately restrained** — every typographic choice ties to a token, and the only `clamp()`s in production are on the two hero numbers.

## 15. Current palette story — prose

The palette is a **hedge-fund / terminal-tape dichotomy** built on three pillars: (1) **near-black ink** (`#0a0e14`) on **white paper** (`#ffffff`) for light mode; (2) **text-safe amber** (`#8c6f2a`) as the only accent that crosses the contrast line for body copy, with decorative amber (`#d4a017` / `#c98a16`) reserved for ≥18px non-text uses; and (3) **signal semantics** (pass `#15803d`, fail `#9b2226`, warn `#8c6f2a`, info `#1d4ed8`) borrowed from the Bloomberg terminal — every status dot, every proof ribbon, every verdict, every ticker delta carries semantic weight. Dark mode **inverts the substrate but keeps the amber and signal hues**, lifting `--c-rule` from a near-invisible `#30363d` to a readable `#4a525a` (the v6.0 fix). The five math accent tokens (`--c-eq`, `--c-phi`, `--c-sigma`, `--c-delta`, `--c-mu`, `--c-alpha`, `--c-beta`) are the most semantically overloaded tokens on the site: they let every equation in a component speak in the same color language as the Ticker, the gate lattice, the DSR calculator, and the proof ribbons. The dominant visual move is the **amber-left-rail motif** — six+ components (`.code-card`, `.flagship`, `.hero__result`, `.gate-tile`, `.ai-secondary`, `.hero__proof-row`) use a `border-left: 3px solid var(--c-primary-2-deep)` (or pass) to break the white grid monotony with a vertical accent. The narrative tension is institutional restraint vs. amber-pop: 90% of the surface is paper-and-ink sober, and 10% (CTAs, status pills, ticker delta, hero result figure, highlight underlines) carries the warm gold. Ad-hoc raw hex/rgba appears in 7+ places where tokens would have been cleaner — the implementer should hoist these into `--c-amber-overlay-{1,2,3}`, `--c-ink-on-tape-dim`, and similar.

## 16. Current motion vocabulary — prose

Motion is **institutional, not expressive**. The Phase D spec framed it as "institutional restraint" and the result is: hover effects are 150ms ease or 200ms linear; reveals are 320ms cubic-bezier(0.16, 1, 0.3, 1) opacity+translateY(8px); the ticker is a 45s linear translate; the brand motif ship-cell breathes at 5.5s ease-in-out; the TrustStrip green dot pulses at 2.4s. That's the entire vocabulary. There is **no page transition**, **no view-transition-API** integration, **no scroll-linked parallax**, **no spring physics**, **no orchestrated stagger** (reveals fire individually as each section crosses 15% of the viewport), and **no skeleton shimmer** (only a `Loading sections…` text in the SectionTOC). The shine sweep on FlagshipCard (600ms translateX -110% → 110%) is the most theatrical moment, and even it is restrained. All motion is gated by a global `prefers-reduced-motion: reduce` rule plus per-component fallbacks. The most obvious **missing pieces** for a redesign are: (1) a real scroll-progress / scroll-storytelling system beyond the 2px progress bar; (2) a view-transition wrapper around the page swap; (3) orchestrated staggered reveal for groups (gate tiles, project cards); (4) a hover affordance that does more than `translateY(-1px)` or color swap — e.g., a subtle scale or a content reveal; (5) active-state micro-animations on nav links and TOC pills.

## 17. Current IA (information architecture)

The site is **content-heavy and quant-first**. Twenty-four pages organized around one argument: "I do solutions. Eval-first. NDA-clean." The hub-and-spoke radiates from the home page, with `proof.astro` (1,323 lines, 6 sections) as the spine and `methodology.astro` (G1–G31) as the load-bearing reference. The primary nav (always-visible on desktop ≥980px) surfaces 7 routes: **Home, For recruiters, Proof, Projects, Solutions, Method, Now**. The 11 secondary routes hide behind a Resources disclosure: **Live book, Experience, Pubs, Papers, Talks, Contact, Glossary, Uses, Reading, About this site, Colophon**. Mobile collapses everything into a flat burger menu.

The home page is structured as a **scrollable prospectus**: (1) identity eyebrow + TL;DR pitch + h1 (the H1 sentence) + portrait block (CTA cert photo overlapping headshot) + topic chips; (2) Ticker marquee; (3) hero-meta with brand motif + two equation cells (DSR + multi-agent cost) + result-figure "31" with tooltip listing the 6 families; (4) TrustStrip; (5) 4-up stat row (certs / gates / LOC / agents); (6) ProcessStrip (5-step pipeline); (7) Now strip (open-to / latest / next); (8) Lane 1 — Quant Researcher projects (3 of 9); (9) Lane 2 — AI Engineer projects (3 of 6) + AI-secondary panel framing the AI lane as a _secondary, evaluable_ extension of the primary quant work; (10) Method preview — 6 gate-tile cards; (11) CTABanner.

Content collections total **44 entries**: 8 experiences (each a TimelineEntry), 4 cert groups, 15 projects (9 quant + 6 AI), 3 skills, 10 solutions, plus a 23k-line glossary. The proof page is the deepest: 6 sectioned tiers (Identity → Flagship credentials → Shipped code → Research artifacts → Track record → Public track record → NDA disclosure), with a Topic × Type filter bar (client-side, URL-sync), pagination (page size 6), and status pills. The for-recruiters page is a 4-section pitchbook that compresses the whole site for a 5-minute skim. The methodology page walks G1–G31 family by family. About.astro is the longest narrative page (554 lines) and serves as the bio. Positions.astro is a live paper-trade log (838 lines, NDA-safe by construction). Now.astro is the Derek Sivers–style current state. Mistakes.astro lists postmortems. Uses.astro and Reading.astro are classic taste pages. Colophon.astro is the implementation disclosure. The glossary.astro page renders the 23k-line `glossary-terms.ts` data file.

The **implied narrative order** for a first-time visitor, optimized for a hiring manager, is: **Home → For recruiters → Proof → Methodology → Projects → Contact → Resume**. A curious quant researcher might go: **Methodology → Proof → Positions → Papers → Publications**. A recruiter skimming the resume might go: **Resume (3 PDF variants × 3 formats) → For recruiters → Contact**. The sitemap.xml, llms.txt, and llms-full.txt (build-time concatenated Markdown) make the IA legible to LLM crawlers. Three feed endpoints (feed.xml, feed-projects.xml, feed-solutions.xml) make it observable by RSS.

The single biggest IA weakness is that **everything is one scroll long**. The home page is 1,011 lines of source; proof.astro is 1,323; about.astro is 554. The site is in desperate need of: (1) a TOC-aware above-the-fold design that lets you jump to a section without scrolling; (2) a clearer "where am I" indicator (the existing SectionTOC exists but is only on a few pages); (3) a "next page" / "previous page" footer to encourage traversal; (4) an IA that lets the AI lane be discovered without being re-explained on every page (the `ai-secondary` panel on home is the only place it's framed — every other page treats AI as equal-weight).

---

## 18. Files read for this inventory

All file paths are absolute. The implementer can re-read any of these for full source.

- `/Users/christianmacion/Contingency/christianmacion.github.io/astro.config.mjs`
- `/Users/christianmacion/Contingency/christianmacion.github.io/package.json`
- `/Users/christianmacion/Contingency/christianmacion.github.io/src/styles/tokens.css`
- `/Users/christianmacion/Contingency/christianmacion.github.io/src/styles/global.css`
- `/Users/christianmacion/Contingency/christianmacion.github.io/src/styles/print.css`
- `/Users/christianmacion/Contingency/christianmacion.github.io/src/layouts/BaseLayout.astro`
- `/Users/christianmacion/Contingency/christianmacion.github.io/src/utils/profile.ts`
- All 25 `.astro` files in `/Users/christianmacion/Contingency/christianmacion.github.io/src/components/`
- All 6 `.ts` files in `/Users/christianmacion/Contingency/christianmacion.github.io/src/scripts/`
- `/Users/christianmacion/Contingency/christianmacion.github.io/src/pages/index.astro` (sections 1–3 + 8–11 read in detail)
- `/Users/christianmacion/Contingency/christianmacion.github.io/src/pages/proof.astro` (sections P.1–P.3 read in detail)
- Directory listings of `src/pages/`, `src/content/`, `src/components/`, `src/scripts/`, `src/utils/`, `src/data/`

End of inventory.
