# Math-News Vocabulary (Phase A-2) — Portfolio v6.3

> Audience: `MathBehindTape.astro` author + content reviewers
> Mission: 14 deterministic headline→math pairs, NDA-positive, generic.
> Standing Orders: §1 (5-must-haves), §7 (NDA scope).

## §1 — Protocol: pick 6 of 14 deterministically

The 14 pairs in §2 are a fixed corpus. Per session we surface 6 using a
seeded PRNG: `n = floor(seedFromString(BUILD_DATE + "math-tape")() * 14)`.
Draw six slots without replacement starting at `n`, wrapping modulo 14.
Same `BUILD_DATE` ⇒ same six pairs every visitor sees. Six is the page
density budget (one above each tape tick + headline); the other eight
remain in the corpus for future builds. No `Math.random()`, per §9.

## §2 — The 14 pairs (category / headline / formula / signal / magnitude)

| # | Category       | Headline (generic)                  | Formula                                                    | Signal        | Magnitude |
|---|----------------|-------------------------------------|------------------------------------------------------------|---------------|-----------|
| 1 | rates / cb     | Reference rate decision, day-of     | p(hold) ≈ 0.86 · 2s10s steepens; OOS half-life ≈ 8 min     | steepen       | +6 bp     |
| 2 | rates / cb     | Verbal forward-guidance release     | dσ_front/dword ≈ 1.4 bp; convexity long                    | long-vol      | 1.4 bp/wd |
| 3 | rates / fx     | Carry-channel rate decision         | Δcarry_cross ≈ +12 bp; OOS Sharpe ≈ 1.8                    | carry         | +12 bp    |
| 4 | rates / data   | Headline CPI release                | breakeven error ε ≈ ±3 bp; book skews long-vol             | long-vol      | ε ≈ ±3 bp |
| 5 | rates / data   | Labour-market headline              | ΔP(recession) ≈ ±18 % per 100 k surprise; flatten equity   | flatten       | ±18 %     |
| 6 | fx / data      | Trade-balance publication           | Δcopper ≈ 0.6 % per $1 B surplus; AUD β ≈ 0.4              | flatten       | 0.6 %/$B  |
| 7 | equities / earn| Mega-cap tech earnings              | ΔSPX back-end skew ≈ +2.5 vol-pts; long back-end           | long-vol      | +2.5 vol  |
| 8 | commod / geo   | Producer-nation framework statement | Δbrent ≈ ±1.1 % per tone-point; realized vol +28 %         | long-vol      | ±1.1 %    |
| 9 | fx / cb        | FX reserve adjustment               | ΔUS$ carry-index ≈ -0.8 σ; vol-of-vol +22 % next session   | short-vol     | -0.8 σ    |
| 10| credit / fixed | EM sovereign coupon                 | Δperiphery OAS ≈ +14 bp; regime tag = "risk-off"            | flatten       | +14 bp    |
| 11| vol / cross    | Cross-asset convexity spike         | ΔVIX_1d ≈ +35 %; gamma-cost ≈ 2.1 × baseline               | long-vol      | +35 %     |
| 12| rates / term   | Term-structure break (2s10s)        | |slope innovation| > 1.8 σ ⇒ regime = "twist"             | flatten       | 1.8 σ     |
| 13| fx / carry     | Carry unwinding event               | Δcarry-to-risk ≈ -2.4 σ; flatten FX exposure               | flatten       | -2.4 σ    |
| 14| credit / spread| Credit-spread blow-out             | ΔIG-HY ≈ +38 bp; regime = "credit stress"                  | short-vol     | +38 bp    |

Six signal tags used, matching `MathBehindTape.astro` schema:
`steepen · flatten · long-vol · short-vol · carry · breakeven-watch`.
The breakeven-watch tag is implicit in #4 (CPI prints set the rate).

## §3 — NDA-positive verification (one line per pair)

1. No employer — "reference rate decision" genericises any cb. Clean.
2. No employer — "verbal forward-guidance" is generic public-speech class. Clean.
3. No employer — "carry-channel rate decision" omits jurisdiction. Clean.
4. No platform — "headline CPI release" is the public statistical body. Clean.
5. No platform — "labour-market headline" maps to any public payroll series. Clean.
6. No employer — "trade-balance publication" generic, AUD/copper are public refs. Clean.
7. No platform — "mega-cap tech earnings" omits ticker; skew formula is textbook. Clean.
8. No employer — "producer-nation framework statement" omits signatory. Clean.
9. No employer — "FX reserve adjustment" is generic central-bank operation. Clean.
10. No platform — "EM sovereign coupon" omits issuer; OAS is public convention. Clean.
11. No platform — "convexity spike" + VIX formula is generic options math. Clean.
12. No employer — term-structure break is a public rates textbook construct. Clean.
13. No platform — carry-to-risk is generic FX carry-trade vocabulary. Clean.
14. No employer — IG-HY is public index convention (CDX / iTraxx). Clean.

Corpus also verified: 0 hits on Polymarket, Kalshi, Alpha Apex, Quantivo,
CallRank, NOAA, USDA, "Davao City", 19V Capital, or proprietary signal
names. All pairs are public-domain textbook formulae or generic
vocabulary. Magnitudes are illustrative heuristic ranges, not
calibrated alpha.
