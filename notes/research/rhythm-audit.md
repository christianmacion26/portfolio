# Vertical-Rhythm Audit (Phase A-3) — Portfolio v6.3

## §1 — Home page section inventory (top → bottom)

| # | Section (class) | pb (top / bottom) | Approx content height | Visible seam to next |
|---|---|---|---|---|
| 1 | `.hero` (L111) | clamp(sp‑7,14vh,11rem) / clamp(sp‑7,12vh,9rem) | ~440px | ~144px → workspace (no pb) |
| 2 | `.workspace` (L178) | 0 / 0 (border‑block only) | ambient 180-260px + feed 28px | ~48px → entry-strip |
| 3 | `.entry-strip` (L193) | sp‑7 / sp‑7 (48/48) | ~210px (head+grid) | ~80px → ingest |
| 4 | `<DataIngestion />` (L365) | sp‑6 / sp‑6 (32/32) | ~210px (heading+list) | ~80px → desk |
| 5 | `<TraderDesk />` (L372) | sp‑6 / sp‑7 (32/48) | ~420px (4-cell desk) | ~48px → ticker |
| 6 | `<Ticker />` (L379) | inline (no own pb) | 28px tape | ~64px → world-events |
| 7 | `.section.world-events` (L388) | sp‑8 / sp‑8 (64/64) | ~520px (SVG map) | ~192px → what  ← **big** |
| 8 | `.section.what` (L410) | sp‑10 / sp‑10 (128/128) | ~340px (4-row list) | ~256px → work ← **worst** |
| 9 | `.section.section--alt.work` (L477) | sp‑10 / sp‑10 (128/128) | ~430px (3×2 grid) | ~256px → numbers ← **worst** |
| 10| `.section.numbers` (L522) | sp‑10 / sp‑10 (128/128) | ~120px (4-tile row); **doubled** by `.numbers__row{ border-top + padding-top: sp-6 }` | ~256px → carousel |
| 11| `<StatementCarousel />` (L557) | inline | ~80px | ~128px → creds |
| 12| `.section.section--alt.creds` (L564) | sp‑10 / sp‑10 (128/128) | ~150px (4-row list) | ~176px → CTA |
| 13| `<CTABanner />` (L601) | sp‑7 / sp‑7 (48/48) | ~120px | (page end) |

Notes:
- `.section { padding-block: var(--sp-10) }` is the default in `global.css:244-246` (`sp-10 = 8rem = 128px`). Becomes `sp-8` only on `≤720px`.
- `.section--tight` exists (sp-6, global.css:256) but is unused on `/`. **No** `.section--slim` yet.
- `.numbers` suffers **double-counting**: outer 128px + inner `.numbers__row { border-top + padding-top: sp-6 }` (index L904-905) adds an extra 32px+1px hairline above the row.

## §2 — Top 3 offenders (worst visible-gap-to-content ratio)

1. **`.numbers`** — ratio ≈ 256px seam / 120px content = **2.1:1**. Double padding is unjustified.
   *Fix:* swap `.numbers` to `class="section section--slim numbers"` and drop `.numbers__row { padding-top: var(--sp-6); border-top: 1px solid }` (the only row that has both; `.what__list`/`.creds__list` use only `border-top`).

2. **`.what`** — ratio ≈ 256px seam / 340px content = 0.75:1, **worst absolute seam**. Editorial-value-prop list doesn't need 128px air above and below a 340px list.
   *Fix:* add `class="section section--slim what"` in `index.astro` L410. The 4-row list keeps its own internal sp-6 padding per row, so the section can shrink to sp-7 (48px).

3. **`.creds`** — ratio ≈ 256px seam / 150px content = 1.7:1, **content thinnest in page**. Same `sp-10` blanket.
   *Fix:* add `class="section section--slim section--alt creds"` in `index.astro` L564.

## §3 — `.section--slim` utility spec for v6.3

Add to `src/styles/global.css` (next to `.section--tight`, around line 256):

```css
/* v6.3 — slim section padding for low-content panels (what/numbers/creds)
   that don't need sp-10 air on both ends. Pairs with the existing
   .section--tight (sp-6, used on dense dashboards). */
.section--slim {
  padding-block: var(--sp-7);            /* 48px desktop */
}
@media (max-width: 720px) {
  .section--slim {
    padding-block: var(--sp-6);          /* 32px mobile, matches existing
                                            .section fallback */
  }
}
```

Rationale:
- `.section` defaults to `sp-10` (128px) — too airy for thin editorial panels.
- `.section--tight` is `sp-6` (32px) — used for dense grids; too tight for a 4-row list.
- `.section--slim` at `sp-7` (48px) is the missing middle tier: matches `entry-strip` and `.hero` bottom, restoring a single 48px rhythm step across all low-content bands (entry-strip / numbers / what / creds).
- Mobile fallback to `sp-6` matches existing `.section` mobile rule so slim never feels chunkier than its sibling.
- Total page-height saving on the three flagged sections: ~80px × 2 (top+bottom) × 3 = ~480px → ~12% shorter above-the-fold portfolio scroll depth.

### Files referenced
- `/Users/christianmacion/Contingency/christianmacion.github.io/src/pages/index.astro`
- `/Users/christianmacion/Contingency/christianmacion.github.io/src/styles/global.css`
- `/Users/christianmacion/Contingency/christianmacion.github.io/src/styles/tokens.css`
- `/Users/christianmacion/Contingency/christianmacion.github.io/src/components/{DataIngestion,TraderDesk,Ticker,StatementCarousel,CTABanner,KeyHintPanel}.astro`

No `.section--slim` exists yet. Total payload ~1.9 KB.
