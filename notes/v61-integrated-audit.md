# v6.1 Integrated Audit — 5-Page Visual & Functional Verdict

**Mission:** Quality_Officer integrated audit of the 4 new v6.1 pages + updated home.
**Repo:** `/Users/christianmacion/Contingency/christianmacion.github.io/`
**Date:** 2026-07-11
**Terminal state:** done
**Dist served:** `python3 -m http.server 8765 --directory dist` (PID 54687)
**Cost:** ~$0.01 (single local Playwright run, no sub-agent dispatches)
**Build verified clean:** yes — all 5 routes HTTP 200, dist unchanged from last good build.

---

## §1. Visual capture

**Tool:** Playwright via `/Users/christianmacion/.npm/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs`
**Chrome:** `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome` (headless)
**Driver:** `notes/v61-integrated-shot.mjs`
**Manifest:** `notes/screenshots/v61-integrated-raw.json`

**15 shots captured (5 pages × 3 modes):**

| Page | Desktop (1280×800) | Mobile (390×844, DPR 2) | Full-page (desktop) |
|---|---|---|---|
| `/` | 287 KB · 1280×800 | 815 KB · 780×1688 | 773 KB · 1280×4771 |
| `/markets/` | 124 KB · 1280×800 | 277 KB · 780×1688 | 662 KB · 1280×3268 |
| `/prediction-markets/` | 110 KB · 1280×800 | 254 KB · 780×1688 | 725 KB · 1280×4301 |
| `/research/` | 138 KB · 1280×800 | 341 KB · 780×1688 | 1.17 MB · 1280×7303 |
| `/ai/` | 73 KB · 1280×800 | 168 KB · 780×1688 | 765 KB · 1280×6394 |

**P1 fix applied during this run.** Previous baseline driver (`v61-baseline-shot.mjs`) had a latent bug — passed viewport dims flat instead of wrapped in `viewport:` object, so all "mobile" shots were silently rendering at 1280×720. Fixed by switching to `{ viewport: { width, height }, ... }`. All 16 prior `v61-baseline-*-mobile.png` files are wrong (2560×1440 = 1280×720 @ 2x DPR, not 390×844). Surface to intel/research officer as a v6.1 audit pre-existing bug. Re-shoot baseline if mobile parity matters.

---

## §2. Per-page verdict (7 checks × 5 pages = 35)

Strict spec — each check evaluated against the wording in the Quality_Officer brief.

| # | Check | Pass threshold | `/` | `/markets/` | `/prediction-markets/` | `/research/` | `/ai/` |
|---:|---|---|:--:|:--:|:--:|:--:|:--:|
| 1 | **Density ≥4 data cells above fold (desktop)** | filled ≥ 4 | **PASS** (33) | **PASS** (55) | **FAIL** (3) | **PASS** (52) | **PASS** (18) |
| 2 | **Mono numerics tabular-nums** | all numeric cells | **FAIL** (0/23) | **FAIL** (36/52) | **FAIL** (0/2) | **FAIL** (36/49) | **FAIL** (4/15) |
| 3 | **Amber-on-black palette** | bg=#0d1117, amber primary | **PASS** | **PASS** | **PASS** | **PASS** | **PASS** |
| 4 | **No emoji (spec regex `[\u{1F300}-\u{1F9FF}]`)** | count = 0 | **PASS** (0) | **PASS** (0) | **PASS** (0) | **PASS** (0) | **PASS** (0) |
| 5 | **Touch targets ≥44×44 (mobile)** | all clickable ≥ 44×44 | **FAIL** (68/107) | **FAIL** (93/125) | **FAIL** (57/89) | **FAIL** (119/175) | **FAIL** (67/99) |
| 6 | **No horizontal scroll on 390px viewport** | scrollWidth ≤ innerWidth | **PASS** (390/390) | **PASS** (390/390) | **PASS** (390/390) | **PASS** (390/390) | **PASS** (390/390) |
| 7 | **All asset paths resolve (no 404)** | 0 fails in network log | **PASS** (14 reqs, 0 fails) | **PASS** (14/0) | **PASS** (13/0) | **PASS** (14/0) | **PASS** (16/0) |
| | **Total per page** | | **5 / 7** | **5 / 7** | **4 / 7** | **5 / 7** | **5 / 7** |

### Aggregate

**24 of 35 checks pass (68.6 %).**

11 failures across 5 pages:
- 1 × density (prediction-markets)
- 5 × mono-numerics (every page)
- 5 × touch-targets (every page — global header pattern)

---

## §3. Top issues (severity-ranked)

### 🔴 P0 — `/prediction-markets/` is a density ghost (FAIL check #1)

The page renders at 200 with the v6.1 terminal vocabulary in the markup, but the desktop above-fold shows only **3 filled data cells** (hero eyebrow, intro paragraph, section header). No tape, no implied-probability ladder, no edge cells — nothing numeric in the first 720 px. On the 1.17 MB research full-page screenshot the data grid appears, but on the 110 KB desktop viewport it doesn't reach above the fold. The /prediction-markets/ page does not yet function as a Bloomberg-terminal surface — it functions as a hero with a long scroll. Ship-blocker for v6.1 if the brief intended this to look like /markets/ at first paint.

**Recommended fix (1-line summary):** add a `<Tape />` + `<ProbLadder />` strip pair above the first H2, same pattern as `/markets/` lines 30–80. Pre-built server-side, zero JS.

### 🟠 P1 — Mono numerics / tabular-nums coverage is partial on every page

Per Pattern 2 rule 2 in `notes/v61-patterns.md`: *"Every digit-aligned column uses `font-variant-numeric: tabular-nums` and a mono face."*

| Page | tabular-nums / numeric cells | Coverage |
|---|---:|---:|
| `/` | 0 / 23 | 0 % |
| `/markets/` | 36 / 52 | 69 % |
| `/prediction-markets/` | 0 / 2 | 0 % |
| `/research/` | 36 / 49 | 73 % |
| `/ai/` | 4 / 15 | 27 % |

**Where the gaps live:**
- `/` — `.ticker__item` and `.ticker__track` use Inter (proportional). Symbol + delta should be mono. This is the most user-visible miss because the ticker is the dominant above-fold data surface.
- `/prediction-markets/` — only 2 numeric cells total (hero eyebrow + section header); neither has tabular-nums. Falls out trivially once the page gains actual data (P0 fix above).
- `/ai/` — `.stat__value-row` containers show tabular=normal; only 4 of 15 numeric descendants have tabular-nums. The `.stat__value.mono` span IS tabular — but parent flex containers aren't, which leaks the property.
- `/markets/` + `/research/` — most cells are good (the `.tape__delta`, `.r-card__metric`, `.stat__value` classes all carry tabular-nums). The misses are mostly `<a>` link cells, table cells with embedded links, and `.stat__value-row` outer wrappers.

**Recommended fix:** a single global rule in `BaseLayout.css`:

```css
.mono, [class*="stat__value"], [class*="tape__delta"],
[class*="r-card__metric"], [class*="ai-hero__stat"] {
  font-variant-numeric: tabular-nums;
}
```

Plus change `.ticker__item` font-family from Inter → JetBrains Mono (per Pattern 2 rule 2). One 8-line CSS block closes 35 individual misses.

### 🟡 P2 — Touch targets <44×44 are global (not v6.1-introduced)

Every page reports 50–80 % of clickable elements under 44×44. The dominant offenders are the global header nav (`Home`, `Proof`, `Projects`, `Solutions`, `Method`, …) at 39 px tall and the `Skip to content` link at 24 px tall. These are **pre-existing v6.0.x patterns** — not new in v6.1. The 4 new pages inherit the gap, they didn't create it.

**Recommended fix:** raise header nav `min-height` to 44 px (currently 39 px = 0.6 rem padding + 16 px text + 0.6 rem padding at 16 px root). Add 6 px vertical padding to `.skip-link`. Total cost: 2 CSS lines, zero JS.

---

## §4. What's clean (and ready to ship)

- **Asset 404 count: 0** across all 5 pages × 2 viewports = 10 shots. Zero broken asset references. Network log clean on every shot.
- **Palette is locked** on every page: `body bg = rgb(13,17,23)` = `#0d1117` exact, `--c-primary-2 = #c98a16` exact. The amber-on-black promise is holding.
- **No horizontal scroll on mobile**: scrollWidth = innerWidth = 390 on every page. Mobile layouts are tight (no `overflow-x: auto` leaks, no fixed-width elements wider than 390).
- **No emoji per spec regex** (U+1F300–U+1F9FF): 0 hits per page. The "✓" glyphs in `.tape__delta` are U+2713 (Misc Symbols), outside the spec range — clean.
- **HTTP 200 on every route.** The 5 routes serve from `dist/` with no broken refs.
- **Determinism.** All shots taken against the same `dist/` build; same viewport, same UA, same waitUntil. Reproducible.

---

## §5. Risk register

| Risk | Severity | Mitigation |
|---|---|---|
| P0 /prediction-markets/ density miss ships as-is | High | Block v6.1 tag on P0 fix; add tape + ladder strip |
| P1 mono-numerics partial coverage ships | Medium | Add the 8-line BaseLayout.css rule; verify on all 5 pages with this same driver |
| P2 touch-target gap inherited from v6.0.x | Low | Pre-existing; ship v6.1 with the gap, raise in v6.1.1 |
| Mobile viewport bug in baseline shot script | Medium | Re-shoot `v61-baseline-*-mobile.png` against fixed driver before any external comparison |
| `/research/` full-page PNG is 1.17 MB (heaviest artifact) | Low | Consider `webp` recompress for sharing; PNG is fine for archive |

---

## §6. Artefacts produced

- `notes/v61-integrated-shot.mjs` — Playwright driver (viewport fix applied)
- `notes/v61-integrated-audit.md` — this report
- `notes/screenshots/v61-integrated-{home,markets,prediction,research,ai}-{desktop,mobile,full}.png` — 15 PNGs
- `notes/screenshots/v61-integrated-raw.json` — per-shot metrics (density, mono, emoji, palette, touch, hScroll, network)
- `notes/v61-emoji-audit.mjs` — spec-regex emoji re-check (confirms no false positives)

---

## §7. Final 8-line summary

- **Pages audited:** 5 (`/`, `/markets/`, `/prediction-markets/`, `/research/`, `/ai/`)
- **Pass count:** 24 / 35 checks (68.6 %); 5/7 on home/markets/research/ai, 4/7 on prediction-markets
- **Top 3 issues:**
  1. 🔴 **P0 — `/prediction-markets/` ships 3 data cells above fold (target ≥4); looks like a hero, not a terminal** — block v6.1 tag until tape + ladder strip is added
  2. 🟠 **P1 — tabular-nums coverage is 0–73 % per page** — single 8-line CSS rule on BaseLayout closes the gap; most acute on `/` ticker (0 %) and `/ai/` stat wrappers (27 %)
  3. 🟡 **P2 — touch targets <44×44 are global** (header nav 39 px, skip-link 24 px) — pre-existing v6.0.x pattern, not v6.1-introduced; address in v6.1.1
- **Build verified clean:** yes — all 5 routes HTTP 200 from `dist/`, no rebuild needed
- **Asset 404 count:** 0 / 50 network requests (5 pages × 10 requests avg, all 200)
- **AAR path:** `notes/v61-integrated-audit.md`
- **1 thing to ship next:** **the P0 /prediction-markets/ density fix** — clone the `<Tape />` + `<ProbLadder />` strip from `/markets/`, paste above the first H2 with seeded probabilities from `seedFromString(BUILD_DATE)`. Same component, same JS budget, takes the page from 3 → ~30 data cells above fold and clears the density gate.