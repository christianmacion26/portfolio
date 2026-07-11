# PROPOSAL — v6.1 "Bloomberg-Terminal" Upgrade

**Mission:** Convert `christianmacion-portfolio.pages.dev` from "vibe-coded" to **Bloomberg-terminal-class institutional** — for quant research + AI engineer recruiting. Static, NDA-clean, deterministic.
**Target ship:** 2026-07-18 (1 week from Mission A).
**Owner:** Christian T. Macion, CTA®. Based in Digos City, Davao del Sur, Philippines.

---

## 1. Why v6.1

The current site reads as a polished blog. To win senior QR/AI seats it must read as **a desk**.

1. **Signal density vs story density.** Recruiters at Jane Street / Man Group / HF scan in 12s. Right now the hero trades away 30 lines of identity prose. A terminal layout delivers 5 datapoints/sec in the same real estate.
2. **Domain primitives > generic sections.** "Selected work" is generic; an order book + term-structure ladder + tape are **domain primitives a QR recognizes in 200ms**. They prove the applicant lives in this vocabulary.
3. **Live-feel without live data.** A static PRNG-seeded tape + book reads as "live terminal" but ships as a CDN page. NDA-clean (no proprietary feeds), fast (no JS), and reproducible (same seed → same numbers on every build).
4. **Composability win.** Four new primitives (`MarketTape` / `OrderBook` / `TermStructure` / `CoverageGlobe`) are reusable across `/`, `/markets`, `/research`, `/ai`, `/proof`. Each is ~80 lines; one design system earns 5 pages.

---

## 2. What's already on disk (the inventory we compose with)

**Content collections (NDA-clean, public data only):**
- `/Users/christianmacion/Contingency/christianmacion.github.io/src/content/projects/quant/` — 9 mdx files (01-deflated-sharpe → 09-lookahead-bias-audit)
- `/Users/christianmacion/Contingency/christianmacion.github.io/src/content/projects/ai/` — 6 mdx files (01-rag-recall → 06-slop-scanner)
- `/Users/christianmacion/Contingency/christianmacion.github.io/src/content/solutions/` — 10 case studies
- `/Users/christianmacion/Contingency/christianmacion.github.io/src/content/experience/` — 8 entries
- `/Users/christianmacion/Contingency/christianmacion.github.io/src/content/certifications/` — 4 groups
- `/Users/christianmacion/Contingency/christianmacion.github.io/src/content/skills/` — skill groups

**Visual assets:**
- `/Users/christianmacion/Contingency/christianmacion.github.io/public/figures/quant/01-multiple-testing-deflated-sharpe.webp` … `09-bias-audit.webp` (9 equity/drawdown charts)
- `/Users/christianmacion/Contingency/christianmacion.github.io/public/proof/cta-cert-portrait-2026-01.jpg`
- `/Users/christianmacion/Contingency/christianmacion.github.io/public/proof/ateneo-american-corner-2025-11.jpg`
- `/Users/christianmacion/Contingency/christianmacion.github.io/public/proof/bida-meta-aiccelerate-2025-11.jpg`
- `/Users/christianmacion/Contingency/christianmacion.github.io/public/proof/bitget-b4y-2026.jpg`
- `/Users/christianmacion/Contingency/christianmacion.github.io/public/proof/cryptoneeds-christ-chart.jpg`
- `/Users/christianmacion/Contingency/christianmacion.github.io/public/proof/usep-lecture.{mp4,jpg}`
- `/Users/christianmacion/Contingency/christianmacion.github.io/public/proof/ai-workflow.{mp4,jpg}`

**Existing components to extend (do not rewrite):** `Ticker.astro`, `VoiceLine.astro`, `ProofCard.astro`, `SectionTOC.astro`, `StatementCarousel.astro`, `TrustStrip.astro`, `VideoEmbed.astro`, `CodeProofCard.astro`, `FlagshipCard.astro`, `BrandMotif.astro`, `EquityCurveChart.astro`, `Chart.astro`, `Sparkline.astro`, `PipelineDiagram.astro`, `DSRCalculator.astro`.

**Palette (do NOT change):** `--c-tape #0d1117`, `--c-tape-2 #161b22`, `--c-amber #c98a16`, `--c-amber-light #e8b220`, `--c-pass #3fb950`, `--c-fail #f85149`, `--c-ink #e6edf3`. Single palette — no light/dark toggle (removed v6.1.0).

---

## 3. The 4 new primitives

| Component | File (NEW) | LOC | Interface (TS props) | Composition rule |
|---|---|---|---|---|
| **MarketTape** | `src/components/MarketTape.astro` | ~90 | `symbols?: {sym:string;px:number;deltaPct:number;vol:string}[]` | Render once at top of `/markets`. CSS-only `@keyframes scroll-x` 60s linear, duplicated track for seamless wrap. |
| **OrderBook** | `src/components/OrderBook.astro` | ~140 | `symbol: string; midPx: number; spreadBps: number; depth?: number; seed?: string` | PRNG (mulberry32) generates 12 bid + 12 ask rows; deterministic from `BUILD_DATE`. Bid green, ask red, size-bar driven by `max(size)` ratio. |
| **TermStructure** | `src/components/TermStructure.astro` | ~110 | `points: {tenor:string;yld:number}[]; spot?: number` | Hand-rolled SVG (no runtime JS): polyline + axis ticks + area fill at `--c-amber`. Reusable for yield curves AND prediction-market time-decay curves. |
| **CoverageGlobe** | `src/components/CoverageGlobe.astro` | ~150 | `points: {city:string;lat:number;lon:number;weight:number}[]` | Inline SVG world dot map (Equirectangular). 6 dots seeded from research locations. Used on `/for-recruiters` footer + `/markets` corner. |

All four: **zero runtime JS**, server-rendered, palette-compliant, `prefers-reduced-motion` honored on `MarketTape`.

---

## 4. The 6 pages (2 new + 4 rebuilt)

| Route | Status | Layout (top → bottom) | Composables | Done artifact |
|---|---|---|---|---|
| **`/markets`** | NEW | `<MarketTape>` (full-bleed) → 3-col grid: `<OrderBook>` left · `<TermStructure>` center · `<CoverageGlobe>` right → indices strip (S&P/DXY/VIX `Sparkline` fixtures) | All 4 primitives | Visit `/markets`, screenshot the 4-region grid; tape scrolls; book has 24 rows; curve has 8 tenors |
| **`/prediction-markets`** | NEW | 6-12 deterministic event cards (election, GDP, BTC end-of-year, etc.) + `<TermStructure>` showing probability decay across tenors. Generic category language only ("binary event markets", "event contracts"). | `<TermStructure>` (reused), `<MetricPill>`, `<VoiceLine>` | Visit `/prediction-markets`; cards read probabilities 0.00–1.00; no platform names anywhere in DOM or comments |
| **`/research`** | REBUILT (was `/research/index.astro`) | `<MarketTape>` mini-top → 9 quant strategies grid (uses existing `public/figures/quant/*.webp`) → factor decomposition table (Sharpe / Deflated Sharpe / PSR / DSR / PBO columns × rows) | `<MarketTape>`, `<Sparkline>`, existing figures | Visit `/research`; 9 project cards; factor table renders 5 columns × 9 rows with real metrics from `src/content/projects/quant/*.mdx` frontmatter |
| **`/ai`** | REBUILT (was research stub) | `<MarketTape>` mini-top → 11-agent platform diagram (use `PipelineDiagram` extended) → eval console (31-gate result grid mirroring `methodology.astro` G1–G31) | `<MarketTape>`, `<PipelineDiagram>`, existing `<VoiceLine>` | Visit `/ai`; 11 agents labeled; 31 eval gates visible |
| **`/proof`** | TOUCHED | No structural change (6-section spine from v6.0.12 preserved). Add 1 nav entry: "→ See the live `/markets` terminal". | `<SectionTOC>` updated | Visit `/proof`; new line item appears in TOC + closing CTABanner |
| **`/`** (home) | TOUCHED | Identity-first hero STAYS (v6.0.12 Phase R). Add **4-entry-point strip** below hero: Markets · Prediction · Research · AI. Each tile = 1-line caption + mini primitive preview (sparkline for markets, curve for prediction, dot grid for research, agent roster for AI). | All 4 primitives at small size | Visit `/`; new strip visible between hero and Ticker |

---

## 5. Live-data policy (binding)

**Default:** Deterministic PRNG fixtures, seeded from `BUILD_DATE` (already exposed via `process.env.BUILD_DATE` in `package.json`). No fetch, no WebSocket, no client-side polling.

**Why this is better than "live API mock" for a portfolio:**

1. **Static-hostable** — every page builds to a CDN file. Cloudflare Pages serves it in <100ms globally.
2. **NDA-clean by construction** — no API key, no third-party feed, no scraping footprint. A hiring manager at a regulated shop can verify with `curl | grep`.
3. **Reproducible** — same `BUILD_DATE` seed → identical numbers on every render. The CTO can audit the build.
4. **Honest** — a "live mock" that secretly fetches and lies about latencies is the exact anti-pattern this portfolio exists to oppose. The methodology page says "every metric is real." Live mocks violate that.
5. **Cheap** — no API cost, no rate-limit edge cases, no auth refresh.

**Carve-out for /positions:** the existing `/positions` page already uses deterministic fixtures (per v6.0.12 EquityCurveChart). v6.1 extends the same pattern; no new carve-outs.

---

## 6. Nav restructure (1 file: `Nav.astro`)

Insert a new **Markets dropdown** in the primary nav, positioned between `Proof` and `Projects`:

```
Home · For-recruiters · Proof · [Markets ▾] · Projects · Solutions · Method · Now
                          ├─ /markets         (terminal layout)
                          ├─ /prediction-markets
                          └─ /research
```

- Pattern: `<details><summary>` disclosure (already used by `NavMore` — reuse the same CSS).
- Mobile (<=980px): dropdown collapses flat inside burger menu.
- New primary entries: `/markets`, `/prediction-markets`, `/research`. `/ai` is sub-route of `/research` for nav purposes (avoid nav bloat) but is its own page.

---

## 7. File list of changes

| File | Action | LOC delta | Notes |
|---|---|---|---|
| `src/components/MarketTape.astro` | CREATE | +90 | CSS scroll animation, prefers-reduced-motion guard |
| `src/components/OrderBook.astro` | CREATE | +140 | mulberry32 PRNG, 24 rows, 8px font, bid/ask color |
| `src/components/TermStructure.astro` | CREATE | +110 | Pure SVG, viewBox 0 0 600 240, axis ticks |
| `src/components/CoverageGlobe.astro` | CREATE | +150 | Inline SVG world dots, 6 cities (Digos, Singapore, NY, London, Zurich, Tokyo) |
| `src/components/FactorTable.astro` | CREATE | +80 | New: Sharpe/PSR/DSR/PBO column grid for /research |
| `src/pages/markets.astro` | CREATE | +220 | The terminal layout |
| `src/pages/prediction-markets.astro` | CREATE | +200 | 8 event cards + probability decay curves |
| `src/pages/research.astro` | REBUILD | +260 | 9 strategies + factor table |
| `src/pages/ai.astro` | REBUILD | +240 | 11-agent platform + eval console |
| `src/pages/proof.astro` | TOUCH | +10 | New TOC line + CTABanner link to /markets |
| `src/pages/index.astro` | TOUCH | +60 | New 4-entry-point strip |
| `src/components/Nav.astro` | TOUCH | +30 | New dropdown for Markets |
| `src/styles/global.css` | TOUCH | +80 | Shared primitives styles (tape, book, curve, globe base) |
| `src/content/projects/prediction/` | CREATE dir | +120 | 6-8 mdx event fixtures |
| `src/content.config.ts` | TOUCH | +15 | New `prediction` collection schema |

**Total LOC:** ~1,805 lines added, ~50 removed. **Net +1,755.** All additive; existing pages untouched.

---

## 8. Done criteria (quality-officer checklist)

- [ ] `npm run build:mirror` exits 0; dist contains `/markets/`, `/prediction-markets/`, `/research/`, `/ai/`
- [ ] `npm run audit` (NDA scan) passes — no `Alpha Apex`, `Quantivo`, `CallRank`, `Polymarket`, `Kalshi`, `NOAA`, `USDA` in any file
- [ ] `grep -r "Davao City" src/` returns 0 matches (must be "Digos City, Davao del Sur")
- [ ] All 4 new primitives render server-side (zero `client:*` directives)
- [ ] `/markets` Lighthouse Performance ≥ 95 on mobile (4G slow)
- [ ] `/markets` tape respects `prefers-reduced-motion: reduce` (no animation)
- [ ] Order book fixture is deterministic — re-running `npm run build` with the same `BUILD_DATE` produces byte-identical numbers
- [ ] `/prediction-markets` contains no platform name in DOM (verified via `curl /prediction-markets/ | grep -E "Polymarket|Kalshi"`)
- [ ] `/ai` shows 11 agent labels + 31 eval gates
- [ ] `/proof` TOC includes a "Live terminal → /markets" entry
- [ ] Home `/` shows the 4-entry-point strip below the hero
- [ ] `wrangler pages deploy` succeeds; live URL `christianmacion-portfolio.pages.dev/markets` renders correctly
- [ ] Spot-check: `/markets` on mobile (<=720px) stacks tape → book → curve → globe without horizontal scroll

---

## Open questions for CEO

1. **Flash-crash artifact in OrderBook?** Should the depth-of-book fixture occasionally show a 1-row "thin liquidity gap" as a teaching artifact (mirrors real flash-crash microstructure)? Yes = proves we know the edge case; no = cleaner fixture. *My recommendation: yes, 5% probability.*
2. **Prediction market event count?** 6 cards (curated, only events with strong public-data priors) vs 12 cards (more impressive, but some feel forced)? *My recommendation: 8.*
3. **`/ai` separate vs `/research` sub-route?** Nav spec above says separate page, sub-route of /research for IA. Confirm — or merge `/ai` into `/research` as a tab?