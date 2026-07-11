# Phase A-1 — Reference Bench Summary

> Visual grammar that signals "billion-dollar institutional, not vibe-coded."
> Set: Bloomberg · Reuters Eikon (LSEG) · Optiver · AQR Insights · Man Institute · Replicate.

---

## §1 — Reference matrix (6 sites × 5 cues)

- **Bloomberg** — `#000` bg, amber `#F5821F`, cyan/red/green tape. Very high (30+ cells, 8-level ladders). Mono ALL numerics. State-driven motion. IA: tape + book + chart strip.
- **Eikon / LSEG** — `#1A1A1A`, orange `#FF5B14`. High (tile grid). Sans prose, mono in numerics. Subtle transitions. IA: tile grid + chain ribbon.
- **Optiver** — Navy `#0A1020`, cobalt `#0033A0`. Medium (marketing). Geometric sans; mono only in code/data. Office-clock marquee + parallax. IA: hero + 3-col cards.
- **AQR Insights** — White, navy `#00395D`, crimson banner. Medium. Avenir sans, no mono. No motion. IA: paper-row stack + pills.
- **Man Institute** — White, black nav, coral `#E94E1B`. Medium. Humanist sans, ALL CAPS labels. Static; tabbed hub. IA: card grid + filters.
- **Replicate** — White/light gray, near-black. Moderate (single-col doc). Sans prose, mono ONLY in Python block. No motion. IA: header + tabs + README.

---

## §2 — The 5 universal cues (consensus grammar)

Appear in ≥5 of 6 sites:

1. **Restrained 3-color palette.** Dark bg + one accent + neutral grays. Accent for *state, brand, numerics* — never decoration.
2. **Mono numerics + `tabular-nums` in every data cell.** Right-aligned prices, left-aligned labels. Proportional reserved for prose.
3. **State-driven motion only.** Tickers scroll because data updates. No shimmer, no draw-on. Replicate/AQR/Man ship zero motion.
4. **Full-bleed strip + vertical-split IA.** Tape top, ladder side, chart center, coverage band bottom. Learned since the 1980s.
5. **Compliance UI as first-class citizen.** AQR fraud banner, Man outbound interstitial, Eikon gate. *Announced* — brand, not footnote.

---

## §3 — Outlier cues to adopt (high bar)

1. **Bloomberg's tape + book + chart + coverage four-strip.** Full-width ticker + 8-level book + center chart with last-value amber hairline + coverage dot map. **We already have all four** (`MarketTape`, `OrderBook`, `EquityCurveChart`, `CoverageGlobe`) — just not composed on `/index.astro`. v6.3 home = four-strip in one viewport.
2. **Optiver's location/clock marquee.** Scrolling city/time pairs. "Global 24-hour desk" without prose. ~2KB. Replaces "based in NYC" line.
3. **Replicate's code-as-artifact.** Monospaced snippet in `pre`, no card chrome — code *is* the proof. v6.3 home could anchor a "build artifacts" card around literal build stamp + PRNG seed + last-deploy SHA in mono.

---

## §4 — What v6.3 home is missing vs the reference set

- **Four-strip parts exist, not the composition.** `/index.astro` doesn't compose tape + book + chart + coverage as a first-viewport strip. **Fix:** rebuild so first 800px = tape + book + chart + coverage.
- **Missing location/clock marquee.** **Fix:** add `OfficeClockTicker.astro` (~2KB).
- **Missing "code-as-proof" anchor.** All current proof cards are metric pills. **Fix:** one `CodeProofCard` with build stamp + seed hash + last-deploy SHA in mono.
- **Compliance surface too quiet.** Ours is footer; AQR + Man put it *above* the fold. **Fix:** lift one "not investment advice" badge into page chrome.
- **Amber accent over-used.** Right register (`#c98a16` on `#0d1117`) but in too many places. **Fix:** ~3 uses per viewport; let data carry color.

---

## Sources

- AQR — https://www.aqr.com/insights
- Man Institute — https://www.man.com/maninstitute
- Replicate SDXL — https://replicate.com/stability-ai/sdxl
- Optiver — https://www.optiver.com/ · /working-at-optiver · /what-we-do/trading
- LSEG Eikon — https://www.lseg.com/en/data-analytics/products/eikon-trading-software
- Bloomberg — WebSearch: "bloomberg terminal screenshot public domain"
- v6.1 baseline — `/notes/v61-patterns.md` (§2)
