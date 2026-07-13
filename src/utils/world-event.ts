/**
 * world-event.ts — Shared type surface for EarthGlobe event pins.
 * Extracted so non-Astro modules (gdelt-bucket.ts, content collection
 * mappers) can import without going through an .astro file.
 */

export interface ResolvedEvent {
  title: string;
  category: 'central-bank' | 'earnings' | 'geopolitical' | 'data-release' | 'fx';
  severity: 'mild' | 'moderate' | 'critical';
  lat: number;
  lon: number;
  city: string;
  /** Data provenance label (e.g. "GDELT 2.0", "content/world-events"). */
  source?: string;
}
