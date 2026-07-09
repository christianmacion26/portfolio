/**
 * feed-solutions.xml.ts — Atom 1.0 stream of solution entries only.
 *
 * See _feed-shared.ts for the rendering helpers.
 */
import type { APIRoute } from 'astro';
import { buildItems, renderFeed } from './_feed-shared';

export const prerender = true;

export const GET: APIRoute = async ({ site }) => {
  const baseUrl = site?.toString().replace(/\/$/, '') ?? 'https://christianmacion26.github.io';
  const now = new Date().toISOString();
  const items = await buildItems(baseUrl, now);

  const body = renderFeed({
    baseUrl,
    stream: 'solution',
    selfHref: `${baseUrl}/feed-solutions.xml`,
    title: 'Christian T. Macion — Solutions',
    subtitle: 'Client engagements and shipped deliverables. Newest first.',
    feedIdTag: 'feed:solutions',
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
