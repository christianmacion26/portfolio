/**
 * feed.xml.ts — Atom 1.0 feed of all portfolio content (projects + solutions merged).
 *
 * Three streams:
 *   /feed.xml            — merged (all kinds), canonical homepage link
 *   /feed-projects.xml   — project stream only
 *   /feed-solutions.xml  — solution stream only
 *
 * Surfaced via <link rel="alternate" type="application/atom+xml"> in BaseLayout.
 * Items are ordered newest-first; capped at 50 per stream. Each entry links to
 * the canonical public URL and carries the frontmatter summary as the content body.
 */
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { buildItems, renderFeed } from './_feed-shared';

export const prerender = true;

export const GET: APIRoute = async ({ site }) => {
  const baseUrl = site?.toString().replace(/\/$/, '') ?? 'https://christianmacion26.github.io';
  const now = new Date().toISOString();
  const items = await buildItems(baseUrl, now);

  const body = renderFeed({
    baseUrl,
    stream: 'all',
    selfHref: `${baseUrl}/feed.xml`,
    title: 'Christian T. Macion — Portfolio Updates',
    subtitle: 'Newest projects, research artifacts, and client solutions. Quant, AI, OSS.',
    feedIdTag: 'feed:all',
    items,
    now,
  });

  return new Response(body, {
    headers: {
      'Content-Type': 'application/atom+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=600',
    },
  });
};
