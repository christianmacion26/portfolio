# v6.1 Baseline Audit — Portfolio Site

**Mission:** Quality_Officer pre-ship baseline before Bloomberg-terminal v6.1 features.
**Repo:** `/Users/christianmacion/Contingency/christianmacion.github.io/`
**Date:** 2026-07-11
**Dist build:** 2026-07-11 03:14 UTC+8 (160 KB index.html, 55.8 KB compressed gz)
**Terminal state:** done
**Cost:** ~$0.05 (single local session, no sub-agent dispatches)

---

## §1. Visual audit (Playwright + system Chrome)

**Tool:** Playwright via `/Users/christianmacion/.npm/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs`
**Chrome:** `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome` (headless)
**Viewports:**
- desktop — 1280×800, DPR 1
- mobile  — 390×844, DPR 2, iPhone UA

**Result: 16 / 18 successful (2 expected fails).**

The 2 failures are `/markets/desktop` and `/markets/mobile` — the page does not exist in dist. This is the v6.1 surface we're adding; the gap is real and confirmed.

### Screenshot manifest (`notes/screenshots/`)

| Page | Desktop KB | Mobile KB | HTTP | Notes |
|---|---:|---:|---:|---|
| `/` | 85.3 | 201.1 | 200 | hero, ticker, voice line, odometer, ident-first |
| `/proof/` | 65.4 | 152.3 | 200 | quant showcase, 5-card grid (largest h2=h3 tail) |
| `/methodology/` | 76.7 | 177.8 | 200 | KaTeX math display, definition list |
| `/solutions/` | 75.0 | 173.8 | 200 | carousel present, 3 h2, 10 h3 |
| `/certifications/` | 94.0 | 220.8 | 200 | tables, 4 h2, 0 h3 (flat structure) |
| `/experience/` | 118.7 | 277.1 | 200 | timeline, 2428 words (heaviest content) |
| `/about/` | 73.1 | 172.0 | 200 | personal voice, 7 h2 |
| `/research/quant/01-deflated-sharpe/` | 97.5 | 224.6 | 200 | thin ~190 words — v6.1 candidate |
| `/markets/` | — | — | 404 | **MISSING — target of v6.1** |

The home mobile (201 KB) and experience mobile (277 KB) PNGs are the largest — they carry the most rendered content at 2× DPR. Screenshots are fullPage=false (above-the-fold) per the v6.0.13 carousel-fix contract. If we need full-page for v6.1, regenerate.

**Scripts:** `notes/v61-baseline-shot.mjs`, manifest in `notes/screenshots/v61-baseline-manifest.json`.

---

## §2. Asset inventory (`dist/_astro/`)

**161 files, 2,408,573 bytes total = 2,352.1 KB = 2.30 MB**

### Files > 50 KB (4 files — the only ones to watch)

| Size (KB) | File | Type | Note |
|---:|---|---|---|
| 81.4 | `BaseLayout.EJZmEhxi.css` | CSS | Global styles — heaviest of any single asset |
| 62.1 | `KaTeX_AMS-Regular.DRggAlZN.ttf` | Font | KaTeX font ttf (woff/woff2 also shipped) |
| 52.3 | `KaTeX_Main-Regular.ypZvNtVU.ttf` | Font | KaTeX font ttf |
| 50.1 | `KaTeX_Main-Bold.waoOVXN0.ttf` | Font | KaTeX font ttf |

The 3 .ttf files are likely dead weight — modern browsers pref woff2/woff. Removing them would save 164 KB at zero visual cost. **v6.1 opportunity**: KaTeX ttf cleanup = -7 % of total bundle for free.

### By file type

| Ext | Files | Total KB | % of bundle |
|---|---:|---:|---:|
| `.woff` | 58 | 900 | 38.3 % |
| `.woff2` | 55 | 703 | 29.9 % |
| `.ttf` | 20 | 501 | 21.3 % |
| `.css` | 17 | 197 | 8.4 % |
| `.webp` | 9 | 40 | 1.7 % |
| `.js` | 2 | 9 | 0.4 % |

**JS budget (the headline number): 9 KB total across 2 files.**

1. `BaseLayout.astro_astro_type_script_index_0_lang.DaldJmzt.js` — **6,932 bytes (6.8 KB)** — BaseLayout/island loader
2. `page.B2uBVZjk.js` — **2,470 bytes (2.4 KB)** — page entry

This is the JS budget we are starting from before v6.1. Adding a Bloomberg-terminal ticker (LW chart, scroll-spy, simulation runner, table sorter) puts us comfortably under 50 KB unbudgeted — room exists.

### CSS (top 5)

| Size (KB) | File |
|---:|---|
| 81.4 | `BaseLayout.EJZmEhxi.css` |
| 15.8 | `proof.CVQKaTXM.css` |
| 14.1 | `methodology.CVqfMy66.css` |
| 12.1 | `index.WqI8Lcnl.css` |
| 11.7 | `positions.CQRMD3x2.css` |

Per-page CSS varies 4–16 KB. Heavy hitters: proof, methodology (KaTeX rendering needs).

### Image assets

9 `.webp` files = 40 KB total. Headshot source set + figures. All < 13 KB each — already well optimized.

---

## §3. Forbidden-string scan

```
grep -rE "Davao City|Alpha Apex|Quantivo|CallRank|Polymarket|Kalshi|NOAA|USDA" dist/ 2>/dev/null
```

**Result: 0 hits.** All 8 NDA / employer / competitor patterns clean.

`Digos City` / `PSHS-SMC` / `USeP` / `UM` / `STA` (positive baseline identities from `baseline-truths.md`) were not in scope of this scan but are present in `/about/` and `/resume/` per the resume-voice memory.

---

## §4. Page inventory (h1/h2/h3 + word counts)

Source: `notes/v61-baseline-inventory.mjs` → JSON at `notes/v61-page-inventory.json`.

### Headline counts (main content scope)

| Slug | h1 | h2 | h3 | Words | Bytes (KB) |
|---|---:|---:|---:|---:|---:|
| `/` | 1 | 5 | 10 | 697 | 55 |
| `/proof/` | 1 | 6 | 13 | **2,080** | 129 |
| `/methodology/` | 1 | 7 | 11 | 1,034 | 97 |
| `/solutions/` | 1 | 3 | 10 | 1,913 | 90 |
| `/certifications/` | 1 | 4 | 0 | 732 | 65 |
| `/experience/` | 1 | 3 | 8 | **2,428** | 93 |
| `/about/` | 1 | 7 | 3 | 859 | 66 |
| `/now/` | 1 | 7 | 0 | 455 | 40 |
| `/positions/` | 1 | 5 | 7 | 963 | 57 |
| `/contact/` | 1 | 3 | 6 | 437 | 43 |
| `/reading/` | 1 | 4 | 12 | 463 | 42 |
| `/colophon/` | 1 | 6 | 6 | 530 | 46 |
| `/papers/` | 1 | 3 | 9 | 895 | 47 |
| `/projects/` | 1 | 3 | 18 | 1,002 | 71 |
| `/mistakes/` | 1 | 7 | 0 | 1,142 | 66 |
| `/resume/` | 1 | 0 | 1 | 327 | 52 |
| `/search/` | 1 | 1 | 0 | **119** | 35 |
| `/skills/` | 1 | 3 | 36 | 791 | 91 |
| `/publications/` | 1 | 5 | 16 | 1,528 | 78 |
| `/talks/` | 1 | 3 | 8 | 559 | 45 |
| `/uses/` | 1 | 8 | 0 | 892 | 53 |
| `/for-recruiters/` | 1 | 2 | 0 | 526 | 47 |
| `/about-this-site/` | 1 | 6 | 8 | 582 | 48 |

### Research pages (all low density, all candidates)

| Slug | Words |
|---|---:|
| `/research/quant/01-deflated-sharpe/` | 190 |
| `/research/quant/02-cross-sectional-momentum/` | 181 |
| `/research/quant/03-timeseries-momentum-voltarget/` | 184 |
| `/research/quant/04-variance-risk-premium/` | 188 |
| `/research/quant/05-pairs-cointegration/` | 190 |
| `/research/quant/06-funding-carry/` | 175 |
| `/research/quant/07-macro-regime-overlay/` | 182 |
| `/research/quant/08-backtest-engine-costs/` | 187 |
| `/research/quant/09-lookahead-bias-audit/` | 185 |
| `/research/ai/01-rag-recall/` | 186 |
| `/research/ai/02-toolcall-agent/` | 180 |
| `/research/ai/03-judge-harness/` | 183 |
| `/research/ai/04-eval-mcp-server/` | 186 |
| `/research/ai/05-reflect-revise/` | 186 |
| `/research/ai/06-slop-scanner/` | 179 |

**All h1 = 1 everywhere.** Good heading discipline. H2/h3 sums vary 2 → 39 (skills/36 is a list). No h1 leaks, no h1 missing.

### Pages with content density < 200 words

- `/search/` — 119 words
- `/research/quant/01-deflated-sharpe/` — 190
- `/research/quant/02-cross-sectional-momentum/` — 181
- `/research/quant/03-timeseries-momentum-voltarget/` — 184
- `/research/quant/04-variance-risk-premium/` — 188
- `/research/quant/05-pairs-cointegration/` — 190
- `/research/quant/06-funding-carry/` — 175
- `/research/quant/07-macro-regime-overlay/` — 182
- `/research/quant/08-backtest-engine-costs/` — 187
- `/research/quant/09-lookahead-bias-audit/` — 185
- `/research/ai/01-rag-recall/` — 186
- `/research/ai/02-toolcall-agent/` — 180
- `/research/ai/03-judge-harness/` — 183
- `/research/ai/04-eval-mcp-server/` — 186
- `/research/ai/05-reflect-revise/` — 186
- `/research/ai/06-slop-scanner/` — 179

**Total: 16 pages < 200 words.** The 15 research pages are systematic underweight (only 175–190 words each — they are scaffolding stubs). `/search/` is near-empty stub UI. These are exactly the v6.1 inflation targets.

### Pages missing entirely (need adding in v6.1)

- `/markets/` — confirmed absent (`dist/markets/index.html` does not exist)

---

## §5. Risk register for v6.1

| Risk | Severity | Mitigation |
|---|---|---|
| New components push JS over 50 KB | Medium | Headroom exists (9 KB → 9 KB + new ≈ 9–25 KB) — budget; lighthouse gate |
| KaTeX .ttf cleanup removes visual feature silently | Low | Verify methodology.html falls back to .woff2 — same glyphs (woff2 is the modern primary) |
| 16 thin research pages re-shipped underweight | Low | Mark as v6.2 backlog; v6.1 focuses on /markets/ scaffold + home terminal widgets |
| Mobile screenshots hide above-the-fold content | Low | fullPage=false per v6.0.13 contract; consider fullPage=true for /proof/, /experience/ in next baseline |
| `BaseLayout` CSS already 81 KB; adding bloomberg-terminal widgets could push it past 100 KB | Medium | Per-page CSS extraction pattern (proof/methodology/positions each ship their own slice) |

---

## §6. Recommendation for v6.1 ship order

Ship **terminal-flavored home widgets first** (live ticker, scroll-progress, command-K from `src/scripts/` already shipped, + a single new `<MarketTicker />` island). They reuse existing JS budget, ship without new pages, and prove the visual direction before `/markets/` gets built. Estimated ship: +6 KB JS, +0 KB CSS (pure className reuse on BaseLayout).

Build `/markets/` after the home widgets prove themselves — sequencing lets the markets page inherit the validated ticker/terminal vocabulary rather than establish it.

Parallel: budget a **one-pass KaTeX .ttf removal** (-164 KB bundle) before the v6.1 release tag.

---

## §7. Artefacts produced

- `notes/v61-baseline-audit.md` (this file — the AAR)
- `notes/v61-baseline-shot.mjs` (Playwright screenshot driver)
- `notes/v61-baseline-inventory.mjs` (page density auditor)
- `notes/screenshots/v61-baseline-*.png` (16 screenshots, 8 pages × 2 viewports)
- `notes/screenshots/v61-baseline-manifest.json` (per-shot status + http code)
- `notes/v61-page-inventory.json` (per-page h1/h2/h3/word counts)

---

## §8. Final 8-line summary

- **baseline screenshot count:** 16 (8 pages × 2 viewports; `/markets/` × 2 = expected 404, see manifest)
- **`dist/_astro/` total size:** 2,352.1 KB (2.30 MB) across 161 files
- **top 3 largest JS files:** only 2 JS files exist — `BaseLayout.astro_astro_type_script_index_0_lang.DaldJmzt.js` (6.8 KB), `page.B2uBVZjk.js` (2.4 KB); total JS = 9.2 KB
- **forbidden-string scan:** **0 hits** across all 8 patterns
- **pages with content density < 200 words:** `/search/` (119 words); all 15 `/research/quant/NN-*` and `/research/ai/NN-*` pages (175–190 words each)
- **pages missing entirely:** `/markets/` (confirmed absent — primary v6.1 build target)
- **AAR path:** `notes/v61-baseline-audit.md`
- **1 thing I recommend shipping first:** a **KaTeX .ttf removal** pass — strip 3 unused .ttf files to free 164 KB (-7 % bundle) at zero visual cost, before adding any new v6.1 JS — and then ship a single `<MarketTicker />` island as v6.1's first widget (reuses existing carousel/reveal/odometer motion vocabulary; +6 KB JS).
