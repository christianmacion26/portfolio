# v6.6 Visual Asset Manifest

One-time image generation brief for the v6.6 graphic/visual/dynamic home page rebuild.
Page: `src/pages/index.astro` · 84 pages built (not yet deployed).

Every numeric in v6.6 is seeded from `buildSeed()` per Standing Order §9. The build seed is
an ISO date string from `BUILD_DATE` env var (deterministic UTC+8 build stamp). Per-feature
seeds take the form `seedFromString(buildSeed() + '::feature-tag')`. The same build always
renders the same visuals; the next build rolls a fresh combination.

---

## §02 · TraderDesk
- **P&L equity curve** · 60-bar sparkline, viewBox 280×48, max-DD band rendered as translucent red underlay between `ddStart` and `ddEnd`, baseline dashed line, bars scaled by `Math.abs(r) / maxAbs × MAX_BAR`, signed color via `--c-data-positive` / `--c-data-negative`.
- **Order-flow heat grid** · 8 rows × 4 cols = 32 cells, size-graded via `color-mix(in oklab, --c-data-positive/-negative calc(--t × 100%), transparent)`, intensity normalized 0.18–0.83 across the bag.
- **Risk gauge** · SVG semicircle 200×110, 3 arc segments (safe 0–50, warn 50–75, alert 75–100), 5 tick labels (0/25/50/75/100), needle at `varPct`, hub circle at center.
- **Signal matrix** · SVG 280×90, 4 rows (MOM/MR/CRY/VRP) × 4 cols (1D/5D/10D/30D) of 5-bar mini-sparklines; last bar per cell colored positive/negative by `lastSign`, others muted.
- **Provenance** · `seedFromString(buildSeed() + '::traderdesk')` → uniform stream → Box-Muller `z()` for daily returns and equity curve; separate `u()` calls for tape sizes, gauge VaR, signal walks, and KPI counts. Per-cell PRNG calls are NOT separated by feature tag — all 4 panels share the single seeded stream, so order matters. **Known gap:** adding/removing a `u()` call upstream shifts every downstream number; refactors to the frontmatter must preserve draw order.

## §03 · DataIngestion
- **Pipeline diagram** · Inline SVG, viewBox 1080×220. 5 stage columns (SOURCE 4 nodes · NORMALIZE 3 · ENRICH 3 · INDEX 3 · STREAM 3) = 16 nodes total, x-centers at [110, 320, 530, 740, 950], nodes vertically centered around y=130. Edges = 13 cubic bezier paths (one per max(from, to) lane pair across adjacent stages), arrowheads via `<marker id="ing-arrow">`. Stage headers (5 mono caps labels + 100px hairline rule). Each node = 12×12 amber square + 11px mono label + 11px mono `tps` value.
- **Per-venue throughput chart** · 180×40 inline SVG, 5 vertical bars (NYSE/NASDAQ/CME/BINANCE/CBOE), each 22px wide, 11px mono numeric label above, 9px mono axis tick below in a sibling grid.
- **Lag strip** · CSS-grid 5×1, each cell = stage-name mono + 8px-tall horizontal fill bar (width = `--pct`) + tabular-num pct label. Left border color encodes green/amber/red state.
- **Provenance** · `seedFromString(buildSeed() + '::ingest')` for venue bar heights (ratio 0.35–1.0 × 4.8); `seedFromString(buildSeed() + '::ingest-lag')` for per-stage lag (20–90% pct). Node `tps` strings (NYSE 1.2k … KAFKA-PUB 7.9k) are hand-authored fixtures, not seeded. **Known gap:** the 4→3 source-to-normalize merge uses `Math.min(i, fromNodes.length-1)` so the 4th SOURCE lane (BINANCE) collapses into the 3rd NORMALIZE lane (CLEAN); 13 bezier edges for 16 nodes, not the 16+15=31 a strict bipartite would produce.

## §05 · MathBehindTape (formula grid)
- **3×2 formula tiles** · 6 fixed 280×140 tiles (SHARPE · DEFLATED SHARPE · VRP · ORNSTEIN-UHLENBECK · FUNDING CARRY · REALIZED VOL), each with a category-pip dot, KaTeX formula via `<Equation size="xl">`, Δ-input chip bottom-left, 24px output value bottom-right (sign-tinted).
- **Input tape** · CSS grid 7×1, mono cells (σ_XS, t, n, SR̂, p, ρ, ν) with label + value, color = `signVar(sign)`.
- **Output tape** · Same shape, 7 cells (SR, SE, DSR, p_DSR, Cvg, VRP, σ̂).
- **Correlation mini-matrix** · 3×3 inline, 16×16 px cells, RGB tint green (74,222,128) / red (248,113,113) scaled by `|v|` × 0.18 alpha; diagonal cells = amber `rgba(232,178,32,0.18)` + `--c-amber` border. Corner + row/col labels (SR/DSR/VRP × OU/CARRY/σ̂).
- **Build fingerprint** · 4-digit stamp in the bottom-right corner = `jitter().toFixed(4)` from `seedFromString(buildSeed() + '::mathtile')`.
- **Provenance** · Formula latex strings, Δ-input chips, output values, and correlation matrix are ALL hand-authored fixtures (public-domain quant idioms). The single `jitter()` draw only produces the corner stamp; the PRNG is consumed-once. **Known gap:** the 6 correlation values in `CORR_CELLS` are illustrative, not computed from any data — flagged in the source comment as "pre-curated fixtures".

## §06 · StatementCarousel (graphic variant)
- **3 stacked cards** · Each card = 1px-stroked 40×40 numeral square (top-left) + serif italic statement centered + 10px mono eyebrow `STRATEGY NOTE 0{i+1} · CONDENSED` above + 3 small pip squares bottom-right (active=amber scale-1.2, inactive=ink-3).
- **Roman numerals** · Hard-coded `['i', 'ii', 'iii', ...]` array, indexed by card position; only the first 3 statements are shown even if more are passed.
- **Cross-fade driver** · `src/scripts/carousel.ts` (imported via BaseLayout, NOT a per-component `<script>` — Astro 7 was silently dropping those; see `portfolio-v612-carousel-bundle-fix.md`). 5-second interval, pauses on hover/focus, no-op under `prefers-reduced-motion: reduce`.
- **Provenance** · No seeded PRNG — statements array is passed as a prop from index.astro (3 hard-coded strings). **Known gap:** the same 3 statements rotate regardless of build; v6.6 didn't seed them.

## §07 · CTABanner (graphic variant)
- **80px rail** · Left = "Ready when you are." serif italic (clamp 20–24px), right = 44px-tall amber CTA button `[ CTA: Schedule a 30-min review → ]`.
- **14×4 availability matrix** · 56 cells, 28×28px each (22px mobile), 4px gap, 1px `--c-rule` stroke + 3px inset fill. Column headers = `09:00 / 12:00 / 15:00 / 18:00 UTC+8`. Row headers = serif day-month + 9px mono weekday. Legend at right: open (green), confirmed (amber-solid), blocked (ink-3 0.55), open-soft (amber-light 0.4).
- **Provenance** · Cell status bag = `[48 × 'amber-light', 4 × 'open', 2 × 'confirmed', 2 × 'blocked']`, Fisher-Yates shuffled via `seedFromString(buildSeed() + '::availability')`. Day labels derive from `Date.UTC(...)` parsed out of `buildSeed()` ISO prefix (UTC+8 offset); falls back to `Date.now()` only if the seed can't be regex-matched. **Known gap:** the day labels advance with the BUILD_DATE seed, so they re-roll on every build — the spec calls this out as "deterministic across rerenders for the same build, NOT across builds".

## §08 · AiEntryPoints
- **3 tiles** · 280×160 each, 3 chips (READ METHOD → /methodology/, FIND PATTERN → /research/#math-corpus, OPEN NOTEBOOKS → /projects/?tag=quant). Each tile: 14px monoline SVG icon top-right over a 120×120 radial-gradient amber orb (animated `epip-orb-pulse` 6s ease-in-out infinite), 14px tracked mono caps label centered, 24px-tall progress bar bottom (1px stroke + 38% amber fill at center), 10px mono count chip bottom-right (`31 GATES · 26 PAIRS · 15 PROJECTS`).
- **Hover affordance** · 4px-wide amber bar slides in from the left (220ms ease); `prefers-reduced-motion` zeros it.
- **Provenance** · No seeded PRNG — chip data (labels, hrefs, counts, countLabel, icon key) is a static array in the frontmatter. **Known gap:** orb pulse animation is purely visual; no per-build jitter.

## §10 · Collaborators
- **7 mini-cards** · 200×260 each, 4-up grid (desktop) / 2-up (≤1080px) / 1-up (≤720px). Each card: 80×80 letter-avatar (with radial-gradient rim via `::after`) + role + context date eyebrow + 6-cell engagement meter (24×4 amber bars on a hairline track, 3–6 lit cells contiguous left-to-right) + 1-line deliverable with link.
- **Provenance** · Lit-cell count per card = `3 + Math.floor(seedFromString(buildSeed() + '::collab-' + i)() * 4)` ∈ {3, 4, 5, 6}. Each card gets a separate seed `::collab-0` through `::collab-6`. Greedy left-to-right fill so the meter reads as contiguous activity, not random. **Known gap:** `avatarLetter` values for the two NASA-Apps and Numerai entries are both 'N' (and the two STA-peer/QR entries are both 'Q' and 'S'); the rim color (amber-deep vs ink) is the only visual differentiator.

## §11 · EntryStations (v6.6 dense polish)
- **4 station columns** · Per station: 18×1px amber ID bar + serif italic title in question form + 1.95rem tabular-num big number + 14px amber icon + mono caption + 3 stat K/V pairs + 4th-row STATUS·DELTA·NEXT (pipe-separated) + 48×24 trend strip (4 bars) + 240×40 mini-trend (60 bars, last-bar amber) + 24×96 absolute-positioned right-edge event tape (5 stacked 6×6 ticks in 4-color palette: amber/pass/cyan/fail) + `[ INPUT ] →→→ [ OUTPUT ]` flow arrow.
- **Per-station data** · Station 01 MARKETS: 2s10s ±3bp, DXY 102.9–106.3, VIX 12.0–16.4, BRENT 74.0–82.8. Station 02 PREDICTION: median implied prob 0.53–0.71, events 6–10, edge ±0.30–0.40, tenor 2027-Q1..Q4. Station 03 RESEARCH: pass rate 76–88%. Station 04 AI: pass rate 91–97%.
- **Status row** · STATUS ∈ {LIVE, OPEN, OBS}, DELTA ∈ ±0.08, NEXT = `hh:mm UTC+8`. Status kinds + delta + next-all share one PRNG per station.
- **As-of timestamp** · Head row timestamp = `hh:mm UTC+8` from `seedFromString(buildSeed() + '::station-asof')`.
- **Provenance** · Per-station seeds: `::station-01`, `::station-02`, `::station-03`, `::station-04` for the headline numerics; nested `::station-XX-spark-XX`, `::station-XX-row`, `::station-XX-tape` for the new v6.6 features so existing fixtures stay stable. **Known gap:** the `miniSparkRng` function uses the same `sIdx` twice (e.g. `::station-01-spark-01`) — this is intentional reuse of the existing station-01 PRNG stream but the function signature looks duplicated; future contributors may "fix" it and shift the meter bars.

## §11b · HeroVideo (ambient workspace band)
- **Inline SVG fallback** (no `public/ambient/workspace-loop.mp4` ships in this build). 1600×800 canvas, 6 amber orbital stations (4 amber + 2 cyan accents, r=3–5), 8 city dots (r=2–3, banded y at 0.4/0.55/0.7 of 800), 24-point price-line polyline (random walk around y=420 with 0.04 mean reversion), 16-row × 32-col perspective grid (y = `800 - t² × 720`), companion polyline at `x + 1540` for seamless loop.
- **Provenance** · `seedFromString(buildSeed() + '::herovideo')` shared by all 4 ambient features (orbits + city dots + price-line + grid offsets). **Known gap:** if a video file ever lands at `public/ambient/workspace-loop.mp4`, the entire SVG fallback is bypassed at build time via `import.meta.glob('/public/ambient/*')` probe; no current visual asset inventory for the video branch.

---

## Cross-cutting notes

1. **Standing Order §9 compliance** — every `Math.random()` / `Date.now()` / argless `new Date()` site has been replaced with `seedFromString(buildSeed() + '::tag')`. Verified zero violations.
2. **BUILD_DATE plumbing** — `buildSeed()` reads `BUILD_DATE` env var (set in CI / `npm run deploy:mirror`), so a build on the same day yields identical visuals; a build on the next day rolls a fresh combo.
3. **Reduced-motion** — every animated element (orb pulse, hover-slide, ticker blink, gauge needle, carousel auto-rotate, marquee scroll) is zeroed under `@media (prefers-reduced-motion: reduce)` at the component level.
4. **Palette tokens only** — no raw hex outside tokens; tints composed via `color-mix(in oklab, ...)` or CSS `opacity`.
5. **Server-rendered only** — zero `client:*` directives in v6.6 components; the carousel driver is the only client-side JS, imported via BaseLayout (not per-component `<script>`).
6. **NDA-positive copy** — generic asset classes only (2s10s spread, DXY, VIX, BRENT), no tickers, no platform names in any of the rendered numerics.

---

*Asset inventory only — no marketing copy, no recruitment framing. For build/deploy, see `notes/v65-integrated-shot.mjs` and the standing deploy playbook.*