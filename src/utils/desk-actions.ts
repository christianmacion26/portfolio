/**
 * desk-actions.ts — v6.4 "Earth Mission Control" deterministic desk-action
 * picker.
 *
 * Five NDA-positive categories × six desk-action strings each. Every
 * string is a desk-side 1-liner that describes what a real quant position
 * does in response to a given event class. All verbs and nouns are
 * deliberately generic (no employer, no proprietary signal name, no
 * platform-specific vocabulary).
 *
 * `deskActionFor(category, buildDateIso?)` deterministically picks one
 * string per category per build, seeded by
 * `(buildDateIso ?? buildSeed()) + '::desk-action-' + category` so
 * re-rendering the same build returns the same action — re-runs of the
 * same build key are NOOPs (idempotent — Standing Order §1.3).
 *
 * Hard constraints honored:
 *   - No `Math.random()` / `Date.now()` (Standing Order §9).
 *   - No NDA-prohibited employer/platform names (nda-audit).
 *   - Reuses the existing deterministic PRNG fixture contract from
 *     `@utils/prng`.
 */
import { seedFromString, buildSeed } from '@utils/prng';

export type NewsEventCategory =
  | 'central-bank'
  | 'earnings'
  | 'data-release'
  | 'geopolitical'
  | 'fx';

export const DESK_ACTIONS: Record<NewsEventCategory, readonly string[]> = {
  'central-bank': [
    'desk trims 10Y receivers, rolls into 5Y',
    'book fades FX carry into the fix',
    'desk buys 1m wings on the front-end',
    'book holds curve-flattener into the statement',
    'desk writes 6m vol on the front-end',
    'book rolls down 5y into the auction',
  ],
  'earnings': [
    'desk buys 3m 110% call spreads',
    'TWAP through the last 15 min',
    'book lifts gamma into the print',
    'desk sells weekly IV into the bell',
    'book holds post-print drift via dispersion',
    'desk buys skew on the long side',
  ],
  'data-release': [
    'desk holds breakevens, lift vega 1m',
    'book trims front-end receivers into print',
    'desk adds 1m options if surprise > 1.4σ',
    'book sizes position to vol surprise',
    'desk fades the kneejerk in 5 min',
    'book keeps breakeven watch to next print',
  ],
  'geopolitical': [
    'desk buys 1m ATM straddles on brent',
    'book lifts flight-to-quality beta',
    'desk shortens duration into the headline',
    'book unwinds EM-FX carry to one-third',
    'desk buys 6m sovereign CDS optionality',
    'book holds cash, waits for the dust to settle',
  ],
  'fx': [
    'book holds cross-currency basis through fix',
    'desk sells 1w vol-of-vol on dollar smile',
    'desk buys 3m USD/JPY wings into intervention',
    'book clips FX carry at 75 bp',
    'desk fades the fix into the close',
    'book keeps carry-to-risk under 2σ',
  ],
};

/**
 * Deterministically pick one desk-action string for `category`.
 *
 * Seed: `(buildDateIso ?? buildSeed()) + '::desk-action-' + category` —
 * the same build always returns the same action per category. Different
 * builds return a different action (the universe shifts every day, like
 * a real desk would).
 *
 * Falls back to `central-bank` if `category` is unknown — defensive;
 * keeps callers from needing to import the union type.
 */
export function deskActionFor(
  category: NewsEventCategory | string,
  buildDateIso?: string,
): string {
  const key = category as NewsEventCategory;
  const pool = DESK_ACTIONS[key] ?? DESK_ACTIONS['central-bank'];
  const seed =
    (buildDateIso ?? buildSeed()) + '::desk-action-' + category;
  const rand = seedFromString(seed);
  const idx = Math.floor(rand() * pool.length);
  return pool[idx];
}
