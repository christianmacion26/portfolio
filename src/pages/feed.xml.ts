/**
 * feed.xml.ts — Atom 1.0 feed of all portfolio content (projects + publications).
 *
 * Surfaced via <link rel="alternate" type="application/atom+xml"> in BaseLayout.
 * Items are ordered newest-first; capped at 50. Each entry links to the
 * canonical public URL and carries the frontmatter summary as the content body.
 */
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const prerender = true;

interface FeedItem {
  id: string;
  title: string;
  url: string;
  updated: string; // ISO 8601
  summary: string;
  tags: string[];
  kind: 'project';
}

// tag: URI per RFC 4151 — stable, persistent, unique.
// Format: tag:<authority>,<date>:<specific>
const PORTFOLIO_TAG_AUTHORITY = `christianmacion26.github.io,${new Date().getFullYear()}`;

function toIsoDate(d: Date | string | undefined, fallback: string): string {
  if (!d) return fallback;
  const date = typeof d === 'string' ? new Date(d) : d;
  if (isNaN(date.getTime())) return fallback;
  return date.toISOString();
}

export const GET: APIRoute = async ({ site }) => {
  const baseUrl = site?.toString().replace(/\/$/, '') ?? 'https://christianmacion26.github.io';

  const projects = await getCollection('project');

  const now = new Date().toISOString();

  const items: FeedItem[] = [];

  for (const p of projects) {
    items.push({
      id: `tag:${PORTFOLIO_TAG_AUTHORITY}:project:${p.id}`,
      title: p.data.title,
      url: `${baseUrl}/projects/${p.id}/`,
      updated: toIsoDate(p.data.date, now),
      summary: p.data.summary,
      tags: p.data.tags ?? [],
      kind: 'project',
    });
  }

  // Order newest-first
  items.sort((a, b) => b.updated.localeCompare(a.updated));
  const top = items.slice(0, 50);

  const escapeXml = (s: string) =>
    s
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');

  const entries = top
    .map(
      (it) => `  <entry>
    <id>${it.id}</id>
    <title>${escapeXml(it.title)}</title>
    <link href="${it.url}" rel="alternate" type="text/html" />
    <updated>${it.updated}</updated>
    <summary type="text">${escapeXml(it.summary)}</summary>${
        it.tags.length
          ? `\n    ${it.tags.map((t) => `<category term="${escapeXml(t)}" />`).join('\n    ')}`
          : ''
      }
  </entry>`,
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <id>tag:${PORTFOLIO_TAG_AUTHORITY}:feed:all</id>
  <title>Christian T. Macion — Portfolio Updates</title>
  <subtitle>Newest projects and research artifacts. Quant research, AI systems, OSS.</subtitle>
  <link href="${baseUrl}/feed.xml" rel="self" type="application/atom+xml" />
  <link href="${baseUrl}/" rel="alternate" type="text/html" />
  <updated>${now}</updated>
  <author>
    <name>Christian T. Macion</name>
    <email>christianmacion26@gmail.com</email>
    <uri>${baseUrl}/</uri>
  </author>
${entries}
</feed>
`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/atom+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=600',
    },
  });
};