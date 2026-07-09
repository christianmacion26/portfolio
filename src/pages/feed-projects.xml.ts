/**
 * feed-projects.xml.ts — Atom 1.0 stream of project entries only.
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
    stream: 'project',
    selfHref: `${baseUrl}/feed-projects.xml`,
    title: 'Christian T. Macion — Projects',
    subtitle: 'Quant research, AI systems, OSS. Newest first.',
    feedIdTag: 'feed:projects',
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
