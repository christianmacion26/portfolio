/**
 * url.ts — small URL helpers that respect the configured `base`
 * (defaults to `/portfolio` for GitHub Pages deployment).
 *
 * Use `path('/projects')` instead of writing `href="/projects"` so
 * internal links resolve correctly under any base path.
 */
export const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

export function path(p: string): string {
  const suffix = p.startsWith('/') ? p : `/${p}`;
  return `${BASE}${suffix}`;
}
