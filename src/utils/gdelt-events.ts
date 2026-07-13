/**
 * gdelt-events.ts — v6.11 typed loader for the GDELT event cache.
 *
 * The `scripts/fetch-gdelt.mjs` prebuild step writes
 *   src/data/gdelt-cache.json
 * with the most recent ~50 GDELT events (filtered to geopolitical +
 * central-bank categories in v6.11). This module reads that JSON at
 * Astro SSR time and exposes it as `ResolvedEvent[]` so EarthGlobe
 * can drop them into the existing pin pipeline without a refactor.
 *
 * Graceful degradation: if the cache file is missing or malformed,
 * `loadGdeltEvents()` returns `[]`. The static `worldEvent` collection
 * still renders its 10 curated pins. The globe never crashes on a
 * stale or absent GDELT cache.
 */

import gdeltCache from '@data/gdelt-cache.json';
import type { ResolvedEvent } from '@utils/world-event';

/** Mirror of the JSON shape written by scripts/fetch-gdelt.mjs. */
export interface GdeltCachedEvent {
  id: string;
  title: string;
  category: 'central-bank' | 'geopolitical';
  severity: 'mild' | 'moderate' | 'critical';
  lat: number;
  lon: number;
  city: string;
  source: string;
  timestamp: string;
  goldstein: number;
}

export interface GdeltCache {
  fetchedAt: string;
  buildDate: string;
  source: 'gdelt' | 'fallback';
  url: string;
  events: GdeltCachedEvent[];
}

/**
 * Read the cached GDELT events and return them as `ResolvedEvent[]`.
 * Defensive: returns `[]` on missing/malformed cache so the SSR build
 * never crashes on a transient fetch failure.
 */
export function loadGdeltEvents(): ResolvedEvent[] {
  try {
    const cache = gdeltCache as GdeltCache;
    if (!cache || !Array.isArray(cache.events)) return [];
    return cache.events.map((e): ResolvedEvent => ({
      title: String(e.title || 'GDELT event'),
      category: e.category === 'central-bank' ? 'central-bank' : 'geopolitical',
      severity:
        e.severity === 'critical' ? 'critical' : e.severity === 'moderate' ? 'moderate' : 'mild',
      lat: Number(e.lat),
      lon: Number(e.lon),
      city: String(e.city || 'unspecified'),
    }));
  } catch {
    return [];
  }
}

/**
 * Returns the ISO timestamp at which the GDELT cache was last written.
 * Used by EarthGlobe's chrome for the `LIVE · refreshed <iso>` badge.
 */
export function gdeltFetchedAtIso(): string {
  try {
    const cache = gdeltCache as GdeltCache;
    return cache?.fetchedAt || '';
  } catch {
    return '';
  }
}

/**
 * Returns whether the cache came from a successful GDELT fetch or from
 * the fallback path (empty events array). When `fallback`, the chrome
 * should hide the freshness badge (we don't lie about freshness).
 */
export function gdeltSource(): 'gdelt' | 'fallback' {
  try {
    const cache = gdeltCache as GdeltCache;
    return cache?.source === 'gdelt' ? 'gdelt' : 'fallback';
  } catch {
    return 'fallback';
  }
}

/** Convenience: total number of cached events (for chrome counters). */
export function gdeltEventCount(): number {
  return loadGdeltEvents().length;
}
