/**
 * scripts/build-resumes-md.mjs — convert resume JSON → Markdown (.md) and plain text (.txt)
 *
 * Generated alongside the PDFs (which are produced by scripts/build-resumes.mjs +
 * the OJP/Upwork python-docx builder). The .md and .txt variants target ATS
 * systems (Workday classic, Greenhouse, Taleo) and LLM-based recruiter agents
 * that ingest text/Markdown more reliably than CSS-rich PDFs.
 *
 * Output:
 *   public/resume-tailored.md         public/resume-tailored.txt
 *   public/resume-ai-only.md          public/resume-ai-only.txt
 *   public/resume-quant-onepage.md    public/resume-quant-onepage.txt
 *
 * Usage:
 *   node scripts/build-resumes-md.mjs                         # build all 3
 *   node scripts/build-resumes-md.mjs --variant unified       # one only
 *
 * Hooks (via package.json prebuild chain):
 *   npm run resumes:build:md → this script
 *
 * Resume JSON shape contract (per scripts/resumes/*.json):
 *   header:    { name, title, contact_row }
 *   callout_box: optional string (FIT FOR: …)
 *   sections: [{
 *     heading, layout_cols (1|2, ignored in MD), content? | items? | groups?,
 *     items: string[] | {degree, institution, year}[]   // Education
 *                 | {role, company, location, dates, bullets[]}  // Experience
 *                 | {name, description, link}[]         // Projects
 *     groups: [{ name, items: string[] }]               // Certifications
 *   }]
 */

import { readFileSync, writeFileSync, statSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, '..');
const jsonDir = join(__dirname, 'resumes');
const publicDir = join(repoRoot, 'public');

const VARIANTS = [
  {
    name: 'unified',
    json: join(jsonDir, 'unified.json'),
    md: join(publicDir, 'resume-tailored.md'),
    txt: join(publicDir, 'resume-tailored.txt'),
  },
  {
    name: 'ai-only',
    json: join(jsonDir, 'ai-only.json'),
    md: join(publicDir, 'resume-ai-only.md'),
    txt: join(publicDir, 'resume-ai-only.txt'),
  },
  {
    name: 'quant-onepage',
    json: join(jsonDir, 'quant-onepage.json'),
    md: join(publicDir, 'resume-quant-onepage.md'),
    txt: join(publicDir, 'resume-quant-onepage.txt'),
  },
];

const variantArg = process.argv.find((a) => a.startsWith('--variant='));
const onlyVariant = variantArg ? variantArg.split('=')[1] : null;

function normalizeContactRow(row) {
  // The PDF builder emits rows with 2+ spaces between fields.
  // Collapse to a single middot separator for MD/TXT (compact + scannable).
  return row.replace(/\s{2,}/g, ' · ');
}

function pushBlank(lines) {
  // Avoid stacking blank lines — replace triple+ with a single blank.
  if (lines.length > 0 && lines[lines.length - 1] !== '') lines.push('');
}

function renderContent(section, lines) {
  if (!section.content) return;
  // content is a single string with \n\n paragraph breaks.
  const paragraphs = section.content.split(/\n\n+/);
  for (const p of paragraphs) {
    const trimmed = p.trim();
    if (trimmed) {
      lines.push(trimmed);
      pushBlank(lines);
    }
  }
}

function renderItems(section, lines) {
  if (!Array.isArray(section.items)) return;
  const last = section.items.length - 1;
  section.items.forEach((item, i) => {
    if (typeof item === 'string') {
      lines.push(`- ${item}`);
    } else if (item && typeof item === 'object') {
      renderStructuredItem(item, lines);
    }
    // Blank line ONLY after the final item (separates section from the next).
    if (i === last) pushBlank(lines);
  });
}

function renderStructuredItem(item, lines) {
  // Education shape: { degree, institution, year }
  if (item.degree || item.institution || item.year) {
    const degree = item.degree ?? '';
    const institution = item.institution ?? '';
    const year = item.year ?? '';
    if (degree && institution && year) {
      lines.push(`- **${degree}** — ${institution} (${year})`);
    } else if (degree && institution) {
      lines.push(`- **${degree}** — ${institution}`);
    } else if (degree) {
      lines.push(`- **${degree}**`);
    }
    pushBlank(lines);
    return;
  }

  // Projects shape: { name, description, link }
  if (item.name && (item.description || item.link)) {
    if (item.link) {
      lines.push(`- **[${item.name}](${item.link})** — ${item.description ?? ''}`);
    } else {
      lines.push(`- **${item.name}** — ${item.description ?? ''}`);
    }
    pushBlank(lines);
    return;
  }

  // Experience shape: { role, company, location, dates, bullets[] }
  if (item.role || item.company || item.bullets) {
    const heading = [item.role, item.company].filter(Boolean).join(' — ');
    if (heading) {
      lines.push(`### ${heading}`);
      pushBlank(lines);
    }
    const meta = [item.location, item.dates].filter(Boolean).join(' · ');
    if (meta) {
      lines.push(`*${meta}*`);
      pushBlank(lines);
    }
    if (Array.isArray(item.bullets)) {
      for (const b of item.bullets) {
        if (typeof b === 'string' && b.trim()) {
          lines.push(`- ${b.trim()}`);
        }
      }
      pushBlank(lines);
    }
    return;
  }

  // Generic shape: { label, value } or { name, value } — preserved for forward compat
  if (item.label || item.name || item.value) {
    const label = item.label ?? item.name ?? '';
    const value = item.value ?? item.description ?? '';
    if (label && value) lines.push(`- **${label}** — ${value}`);
    else if (label) lines.push(`- **${label}**`);
    else if (value) lines.push(`- ${value}`);
    pushBlank(lines);
  }
}

function renderGroups(section, lines) {
  if (!Array.isArray(section.groups)) return;
  const last = section.groups.length - 1;
  section.groups.forEach((g, gi) => {
    if (g.name) {
      lines.push(`### ${g.name}`);
      pushBlank(lines);
    }
    if (Array.isArray(g.items)) {
      const lastItem = g.items.length - 1;
      g.items.forEach((item, i) => {
        if (typeof item === 'string' && item.trim()) {
          lines.push(`- ${item}`);
        } else if (item && typeof item === 'object') {
          const label = item.label ?? item.name ?? '';
          const value = item.value ?? item.description ?? '';
          if (label && value) lines.push(`- **${label}** — ${value}`);
          else if (label) lines.push(`- **${label}**`);
        }
        if (i === lastItem) pushBlank(lines);
      });
    } else {
      // Empty group — still separate from next section.
      if (gi === last) pushBlank(lines);
    }
  });
}

function jsonToMarkdown(json) {
  const lines = [];
  const h = json.header ?? {};
  if (h.name) {
    lines.push(`# ${h.name}`);
    pushBlank(lines);
    if (h.title) {
      lines.push(`**${h.title}**`);
      pushBlank(lines);
    }
    if (h.contact_row) {
      lines.push(normalizeContactRow(h.contact_row));
      pushBlank(lines);
    }
  }
  if (json.callout_box) {
    lines.push(`> **${json.callout_box}**`);
    pushBlank(lines);
  }
  for (const section of json.sections ?? []) {
    if (section.heading) {
      lines.push(`## ${section.heading}`);
      pushBlank(lines);
    }
    renderContent(section, lines);
    renderItems(section, lines);
    renderGroups(section, lines);
  }
  // Collapse 3+ consecutive blank lines into 1, then trim trailing blanks.
  return lines
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/\s+$/, '') + '\n';
}

function jsonToPlainText(json) {
  // Plain text: strip markdown decorations, ALL-CAPS headings, bullet glyph.
  const md = jsonToMarkdown(json);
  return md
    .replace(/^-{3,}$/gm, '')
    .replace(/^`{3}[\s\S]*?`{3}$/gm, '')
    // Headings → ALL CAPS lines (do BEFORE bold-strip so callout box replacement still matches)
    .replace(/^#{1,6}\s+(.+)$/gm, (_, t) => t.toUpperCase())
    // Callout box: `> **FIT FOR: ...**` → `=== FIT FOR: ... ===` (do BEFORE bold-strip)
    .replace(/^>\s+\*\*(.+)\*\*/gm, '=== $1 ===')
    // Bold/italic wrappers → keep the text
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1 ($2)')
    .replace(/^[-*]\s+/gm, '• ')
    .replace(/\n{3,}/g, '\n\n')
    .trim() + '\n';
}

let built = 0;
for (const v of VARIANTS) {
  if (onlyVariant && v.name !== onlyVariant) continue;
  if (!existsSync(v.json)) {
    console.warn(`[resumes-md] skip ${v.name}: JSON not found at ${v.json}`);
    continue;
  }
  if (!existsSync(publicDir)) mkdirSync(publicDir, { recursive: true });
  const raw = JSON.parse(readFileSync(v.json, 'utf8'));
  const md = jsonToMarkdown(raw);
  const txt = jsonToPlainText(raw);
  writeFileSync(v.md, md, 'utf8');
  writeFileSync(v.txt, txt, 'utf8');
  const mdSize = statSync(v.md).size;
  const txtSize = statSync(v.txt).size;
  console.log(`[resumes-md] ${v.name}: ${mdSize.toLocaleString()}B md / ${txtSize.toLocaleString()}B txt`);
  built++;
}

console.log(`[resumes-md] done — ${built} variant(s) built`);