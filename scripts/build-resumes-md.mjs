/**
 * scripts/build-resumes-md.mjs — convert resume JSON → plain Markdown (.md) and plain text (.txt)
 *
 * Generated alongside the PDFs (which are produced by scripts/build-resumes.mjs +
 * the OJP/Upwork python-docx builder). The .md and .txt variants target ATS
 * systems (Workday classic, Greenhouse, Taleo) that parse text/Markdown more
 * reliably than CSS-rich PDFs — recruiter agents increasingly use them as the
 * primary ingestion format.
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

function jsonToMarkdown(json) {
  const lines = [];
  const h = json.header ?? {};
  if (h.name) {
    lines.push(`# ${h.name}`, '');
    if (h.title) lines.push(`**${h.title}**`, '');
    if (h.contact_row) {
      // The contact row is a tab/space-separated string per build_resume.py output.
      lines.push(h.contact_row.replace(/\s{2,}/g, ' · '), '');
    }
  }
  for (const section of json.sections ?? []) {
    if (section.heading) lines.push(`## ${section.heading}`, '');
    if (section.content) {
      // content is a single string with optional \n\n paragraph breaks.
      const paragraphs = section.content.split(/\n\n+/);
      for (const p of paragraphs) {
        if (p.trim()) lines.push(p.trim(), '');
      }
    }
    if (Array.isArray(section.items)) {
      // Items may be strings, {label, value}, or sub-arrays. Handle all three.
      for (const item of section.items) {
        if (typeof item === 'string') {
          lines.push(`- ${item}`, '');
        } else if (item && typeof item === 'object') {
          if (item.label || item.value || item.name) {
            const label = item.label ?? item.name ?? '';
            const value = item.value ?? item.description ?? '';
            if (label && value) lines.push(`- **${label}** — ${value}`, '');
            else if (label) lines.push(`- **${label}**`, '');
            else if (value) lines.push(`- ${value}`, '');
          }
        }
      }
    }
    if (Array.isArray(section.groups)) {
      // Two-column layout (Skills|Education+Tools): groups = [{heading, items[]}]
      for (const g of section.groups) {
        if (g.heading) lines.push(`### ${g.heading}`, '');
        if (Array.isArray(g.items)) {
          for (const item of g.items) {
            if (typeof item === 'string') lines.push(`- ${item}`, '');
            else if (item && typeof item === 'object') {
              const label = item.label ?? item.name ?? '';
              const value = item.value ?? item.description ?? '';
              if (label && value) lines.push(`- **${label}** — ${value}`, '');
              else if (label) lines.push(`- **${label}**`, '');
            }
          }
        }
      }
    }
  }
  return lines.join('\n').replace(/\n{3,}/g, '\n\n').trim() + '\n';
}

function jsonToPlainText(json) {
  // Plain text: strip markdown decorations. Use line-by-line transformation.
  const md = jsonToMarkdown(json);
  return md
    // Drop horizontal rules and code fences
    .replace(/^-{3,}$/gm, '')
    .replace(/^`{3}[\s\S]*?`{3}$/gm, '')
    // Headings → ALL CAPS lines (no leading #)
    .replace(/^#{1,6}\s+(.+)$/gm, (_, t) => t.toUpperCase())
    // Bold/italic wrappers → keep the text
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    // Links → keep display text (drop URL)
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // List bullets → keep text only
    .replace(/^[-*]\s+/gm, '• ')
    // Collapse 3+ blank lines
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
