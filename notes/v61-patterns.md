# v6.1 Patterns — Intelligence Officer Recipe Notes

> Audience: implementation agents (skill_officer + execution_officer) building the v6.1 portfolio milestone.
> Mode: recipes only. No code, no copy-paste. The "how" lives in the impl; the "why" lives here.
> Standing Orders invoked: §1 (5-must-haves), §9 (no `Math.random` / `Date.now()` in deterministic outputs).

---

## Pattern 1 — Deterministic PRNG fixture pattern

**The problem.** Static-HTML pages cannot call an API at request time, but a `/markets` page that renders an order book needs *numbers* — and if the numbers come from `Math.random()` they change every page load (Standing Order §9 violation). Worse: if they come from a hand-typed array, they're not "data" — they're decoration pretending to be data, and a quant-savvy visitor notices within 30 seconds.

**The recipe.**

1. **Pick a seeded PRNG.** sfc32 (a 4-state SIMD-friendly generator) and mulberry32 (a 32-bit one-liner) are the standard picks. Both produce a uniform `[0,1)` float per call, both pass BigCrush-ish sanity tests, and both are ~10 lines of code. xoshiro128** is the higher-quality upgrade path if you need period >2^32.
2. **Wrap as `seedFromString(str) -> () => number`.** The string input gives the rest of the system a stable handle (`seedFromString(BUILD_DATE)` is the canonical call) without exposing the underlying state object. The output is a closure that captures the four state words.
3. **Seed from `process.env.BUILD_DATE`** (already read by `src/utils/build-stamp.ts`). Each `npm run build:mirror` produces a *fresh but frozen* series — the order book ticks differently between July 11 and July 12, but identically for every visitor who loads the July 12 build. This is the build-stamp pattern extended from "displayed date" to "all stochastic content."
4. **Compose derived distributions from the uniform.** Need a normal? Box-Muller: two uniforms, sqrt + log + cos, gives you `gauss()`. Need a price walk? `base + gauss() * sigma` per tick, with sigma drawn from the same PRNG so it's reproducible too. Document the formula in a comment so a future reader can replay the series.
5. **Pre-compute at build time, freeze the array.** Astro renders `.astro` files server-side; do the PRNG walk in the frontmatter (`---` block), not in client JS. The client receives a `const orderBook = [...]` and just paints it. Zero JS execution cost for the data path.
6. **Honesty disclosure.** A footnote or `<small>` reading "Series seeded from BUILD_DATE for reproducibility" is *more* trust-preserving than silence. Visitors who care know; visitors who don't move on. Silent fakery is the failure mode; labeled fixtures are professional.

**Why this is "more honest" than fake live data.** A portfolio that shows "live" markets but isn't actually live is a credibility time-bomb — the moment a recruiter refreshes and sees a price jump from $101.42 to $201.18, the spell breaks. A portfolio that shows *deterministic seed-time data* with a build-stamp badge is making a different, defensible claim: "this is what my system would produce if fed a representative session." That claim survives scrutiny.

**Where it applies in v6.1.** `/markets` order book (50 ticks, bid/ask ladder), `/positions` equity-curve pre-roll, ticker tape across the home hero, and any "live-feed" panel that previously hard-coded a list.

---

## Pattern 2 — Bloomberg-style page composition

**Research framing.** The visual language of the public-domain Bloomberg Terminal screenshots (and its institutional descendants — AQR Insights research panels, Man Institute Research publications, the WorldQuant BRAIN operator dashboard, and Replicate model-card pages) shares a recognizable grammar. Five rules:

1. **High density per square inch.** A 13" laptop screen at 1440×900 should show ~30 distinct data cells. Whitespace is the enemy of "serious."
2. **Monospaced numbers, always tabular-nums.** Every digit-aligned column uses `font-variant-numeric: tabular-nums` and a mono face (`ui-monospace, SF Mono, Menlo`). Right-aligned prices, left-aligned labels, never center.
3. **Amber + black as the load-bearing palette.** Our tokens (`--c-bg: #0d1117`, `--c-primary-2: #c98a16`) are already this register. We are not inventing a brand; we are aligning to the genre.
4. **No animation for animation's sake.** A ticker that scrolls for "life" is decoration. A ticker that scrolls *because the data updates* is information. The animation is a side-effect of state change, not the goal.
5. **The strip layout.** Three horizontal bands + a vertical split: tape across the top, depth ladder on the left, chart center-right. This is what every institutional research terminal inherits from; it's not a stylistic choice, it's a learned reading pattern.

**The `/markets` layout recipe** (no measurements yet — these go in CSS with the existing 8pt grid):

```
+-----------------------------------------------------------+
| TAPE — full width, 36px tall, single horizontal scroll    |
+-----------------------------------------------------------+
| STATS ROW — 4 cells, each 25%, 64px tall, mono numerals   |
+-----------+--------------------------------+---------------+
|           |                                |               |
|  ORDER    |         CHART CENTER           |   QUEUE /     |
|  BOOK     |         45% width              |   DEPTH       |
|  30%      |         server-rendered SVG    |   25%         |
|  ladder   |                                |   ladder      |
|           |                                |               |
+-----------+--------------------------------+---------------+
| COVERAGE DOT MAP   |   TERM STRUCTURE   |   INDICES LIST |
| bottom band, 3 columns, ~160px tall                        |
+-----------------------------------------------------------+
```

**Density budget.** Per cell: 1 cell title (8px label), 1 big number (24-32px mono), 1 delta (12px mono, up/down arrow + percentage). Four cells × three rows of information = 12 data points visible above the fold without scrolling on a 13" screen.

**Reference notes for the impl.**
- The order-book ladder: 8 levels of bid/ask, two columns per row (price + size), cumulative-size bar on the inside edge drawn with `linear-gradient` from `--c-primary-2` at 8% opacity to transparent.
- The chart center: Pattern 3 below (the SVG chart pattern lives in its own section).
- The queue panel: same mono numerics, but the rows are *time-priority* — a small monospace timestamp (HH:MM:SS) on the left, the symbol in the middle, the size on the right.
- Coverage dot map: a grid of ~120 small circles, each colored on a 4-step scale from `--c-bg-3` (no coverage) to `--c-primary-2` (full coverage). Hover reveals a tooltip with the underlying numbers.

**Strip-pattern reuse.** The same 4-cell stats row recurs on `/positions` (alpha / beta / Sharpe / drawdown), `/certifications` (4 program metrics), and `/about` (years / projects / clients / artifacts). Define the cell once in `src/components/StatCell.astro`; the page is just a grid of them.

---

## Pattern 3 — Polished SVG chart pattern (no library)

**The problem.** A 45KB lightweight-charts bundle for a single equity-curve display is overhead a static portfolio can't justify. The chart doesn't need crosshairs-from-200-different-keys, doesn't need 14 overlay types, doesn't need a Canvas renderer for 120 data points. It needs to *look institutional* and ship in 8KB.

**The recipe.** Every rule maps to a single CSS variable or SVG attribute. No magic numbers baked in.

1. **Stroke `var(--c-primary)` at 1.5px, no dots on the line.** A 2px stroke reads as "decorative." A 1px stroke reads as "data." A 1.5px stroke is the compromise — sharp but present. Dots belong on scatter plots, not line series.
2. **Area fill `var(--c-primary)` at 8% opacity.** A gradient from 12% at the top of the series to 0% at the baseline reads more polished than a flat fill and costs one `<linearGradient>` definition.
3. **Domain padding 6%.** Add 6% empty space on the left, right, top, and bottom of the data extent. Tight padding reads as "I cropped this chart to make it look better"; 6% reads as "this is the data and its margin of error."
4. **Y-axis labels: right-aligned, tabular-nums mono, 11px.** Place them outside the plot area to the right of the axis, not inside. Color `--c-primary` at 60% opacity so they recede behind the line.
5. **X-axis ticks every Nth, lowercase short format.** "Jan", "Feb", not "January", not "2026-01-01". If the data is daily, show every 30th tick; if weekly, every 4th; if monthly, every tick. The human eye wants rhythm, not uniformity.
6. **Last-value hairline.** A 3px-thick vertical line in `var(--c-primary-2)` (amber) at the rightmost data point, with the closing value labeled to its right in 14px mono. This is the Bloomberg "current price" treatment; it anchors the eye and survives cropping.
7. **Crosshair on hover.** A single `<g>` element containing one vertical line, one horizontal line, and a small text label per axis. Hidden by default (`visibility: hidden`). On `mousemove`, translate the `<g>` to the cursor position and reveal. No library needed — one `addEventListener` and ~15 lines of math.
8. **No animation on the line itself.** The line appears at full opacity on render. Animating a chart-draw ("left-to-right wipe") is a 2018-era flourish that reads as "I'm trying to look impressive." The data is the impressiveness.

**Size budget.** SVG with 120 data points, one gradient, one hairline, axis ticks, axis labels, last-value label, crosshair `<g>` — total markup is ~6-8KB uncompressed, gzips to ~2KB. Vs 45KB for a charting library. The math is obvious.

**Implementation notes.**
- Generate the SVG in the `.astro` frontmatter. Pre-compute the path `d` string with a single `for` loop over the data array. The browser does no work.
- The crosshair `<g>` is the only client-side JS. Wire it via `BaseLayout.astro` import pattern (the same fix from v6.0.12's carousel bundle repair) — never as a per-component `<script>` block, or Astro 7 will silently drop it.
- Responsive: use a single `viewBox` and let CSS scale it. Never lock pixel widths.

---

## Skill-Officer handoff

Three things the implementation agents MUST remember:

1. **Use `var(--ease-out)` (the cubic-bezier from `tokens.css`) for any transition timing.** Never `linear`, never `ease-in-out`, never a magic 300ms. The token already exists; use it. The only allowed animation is the crosshair translate, and it gets `transition: transform 80ms var(--ease-out)`.
2. **All stochastic content goes through `seedFromString(BUILD_DATE)` — never `Math.random()`, never `Date.now()`, never a hand-typed array of fake prices.** This is a Standing Order §9 hard rule, not a style preference. The build-stamp module (`src/utils/build-stamp.ts`) is the single source of truth for the seed input.
3. **Mono numerics everywhere a number appears in a data context.** `font-family: ui-monospace, SF Mono, Menlo, monospace; font-variant-numeric: tabular-nums;` is the default. Serif/proportional type is reserved for prose paragraphs and the voice line. Mixing them in a single row breaks the genre.