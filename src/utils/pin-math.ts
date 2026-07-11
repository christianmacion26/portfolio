/**
 * pin-math.ts — 1-line math string for an EventPin / category.
 *
 * The Globe hover overlay (CoverageGlobe.astro) and any pin-style
 * tooltip needs a formula a senior quant would read, not a marketing
 * sentence. This module produces that string.
 *
 * Determinism: magnitudes are seeded from BUILD_DATE (via `buildSeed()`)
 * so the same build produces the same strings; tomorrow's build shifts
 * the jitter. No wall-clock randomness (Standing Order §9).
 *
 * NDA-positive: only public-domain quant idioms (β, σ, DVO1, carry, FX
 * CIP, GARCH, ρ, ε). No employer / platform / signal content.
 */
import { seedFromString, buildSeed } from '@utils/prng';

export type EventCategory =
  | 'central-bank'
  | 'earnings'
  | 'geopolitical'
  | 'data-release'
  | 'fx';
export type Severity = 'mild' | 'moderate' | 'critical';

/**
 * 1-line math formula string a senior quant reads from a pin/event of
 * the given category. Pure function; magnitude is seeded from BUILD_DATE.
 *
 * NDA-positive: generic quant math idioms (β, σ, DVO1, carry), no
 * proprietary signal content, no employer / platform names.
 */
export function pinMathFromCategory(
  category: EventCategory,
  severity: Severity,
): string {
  const seed = seedFromString(buildSeed() + `::math-${category}-${severity}`);
  // Pre-curated templates — formulas don't need to be computed from
  // physics; they need to read as "this is how a quant thinks."
  const mag = (n: number, decimals = 1): string => n.toFixed(decimals);
  switch (category) {
    case 'central-bank':
      return `Δy = ±${mag(2 + seed() * 8)}·σ_pp · cov(b,1y) ≈ +${mag(0.8 + seed() * 0.8)}σ`;
    case 'earnings':
      return `|z_post| ≈ ${mag(1.0 + seed() * 0.6)}× pre; vol regime shift: low → mid`;
    case 'geopolitical':
      return `flight-to-quality β ≈ ${mag(0.45 + seed() * 0.30)}; DVO1 spikes ${mag(8 + seed() * 12)}%`;
    case 'data-release':
      return `|ε| < σ̂ ⇒ in-line; signal: long-vol if |ε| > ${mag(1.1 + seed() * 0.6)}σ`;
    case 'fx':
      return `carry = r_d − r_f − σ·Δτ; intervention if |z| > ${mag(1.6 + seed() * 0.8)}σ`;
  }
}