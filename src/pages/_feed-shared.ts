/**
 * _feed-shared.ts — shared helpers for the three Atom 1.0 feed streams.
 *
 * Used by:
 *   - /feed.xml            (merged)
 *   - /feed-projects.xml   (project stream only)
 *   - /feed-solutions.xml  (solution stream only)
 *
 * All three render via the same renderFeed() with different filters.
 */
import { getCollection } from 'astro:content';

export type FeedKind = 'project' | 'solution';
export type FeedStream = 'all' | 'project' | 'solution';

export interface FeedItem {
  id: string;
  title: string;
  url: string;
  updated: string; // ISO 8601
  summary: string;
  tags: string[];
  kind: FeedKind;
}

// tag: URI per RFC 4151 — stable, persistent, unique.
// Format: tag:<authority>,<date>:<specific>
export const PORTFOLIO_TAG_AUTHORITY = `christianmacion26.github.io,${new Date().getFullYear()}`;

function toIsoDate(d: Date | string | undefined, fallback: string): string {
  if (!d) return fallback;
  const date = typeof d === 'string' ? new Date(d) : d;
  if (isNaN(date.getTime())) return fallback;
  return date.toISOString();
}

export function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function buildItems(baseUrl: string, now: string): Promise<FeedItem[]> {
  const items: FeedItem[] = [];

  const projects = await getCollection('project');
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

  const solutions = await getCollection('solution');
  for (const s of solutions) {
    // Solutions schema has no `date` field; emit at build time.
    items.push({
      id: `tag:${PORTFOLIO_TAG_AUTHORITY}:solution:${s.data.slug}`,
      title: s.data.title,
      url: `${baseUrl}/solutions/#${s.data.slug}`,
      updated: now,
      summary: s.data.problem,
      tags: s.data.tags ?? [],
      kind: 'solution',
    });
  }

  // Order newest-first
  items.sort((a, b) => b.updated.localeCompare(a.updated));
  return items.slice(0, 50);
}

export interface RenderOpts {
  baseUrl: string;
  stream: FeedStream;
  selfHref: string;
  title: string;
  subtitle: string;
  feedIdTag: string;
  items: FeedItem[];
  now: string;
}

export function renderFeed(opts: RenderOpts): string {
  const { baseUrl, stream, selfHref, title, subtitle, feedIdTag, items, now } = opts;

  const entries = items
    .filter((it) => stream === 'all' || it.kind === stream)
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

  return `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <id>tag:${PORTFOLIO_TAG_AUTHORITY}:${feedIdTag}</id>
  <title>${escapeXml(title)}</title>
  <subtitle>${escapeXml(subtitle)}</subtitle>
  <link href="${selfHref}" rel="self" type="application/atom+xml" />
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
}
