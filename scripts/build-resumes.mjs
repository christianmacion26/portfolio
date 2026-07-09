// scripts/build-resumes.mjs — render the 3 portfolio resumes from JSON to PDF.
//
// Reuses the same OJP/Upwork builder (`python-docx` + `soffice`) that produces
// the master-pack PDFs for OnlineJobs.ph applications. Each resume in this
// portfolio is sourced from a JSON schema identical to the OJP master packs,
// so the same proven HIRED-FlowCV-style layout is used here too.
//
// Usage:
//   node scripts/build-resumes.mjs                    # rebuild all 3 PDFs
//   node scripts/build-resumes.mjs --variant unified  # rebuild only one
//
// Hooks:
//   npm run prebuild → calls this script before `astro build`.
//
// Output:
//   public/resume-tailored.pdf       (unified AI+Quant)
//   public/resume-ai-only.pdf        (AI Engineer lane)
//   public/resume-quant-onepage.pdf  (Quant Researcher lane, 1-page variant)

import { spawnSync } from 'node:child_process';
import { existsSync, statSync, mkdirSync, unlinkSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, '..');
const jsonDir = join(__dirname, 'resumes');
const publicDir = join(repoRoot, 'public');

// OJP/Upwork builder lives outside this repo. Override via OJP_BUILDER env var
// if you move it. Default path matches the Contengency/OnlineJobs_PH_Applications
// venv used during development.
const OJP_BUILDER =
  process.env.OJP_BUILDER ||
  '/Users/christianmacion/Contingency/OnlineJobs_PH_Applications/03_TEMPLATES/scripts/build_resume.py';

const PYTHON =
  process.env.OJP_PYTHON ||
  '/Users/christianmacion/Contingency/OnlineJobs_PH_Applications/03_TEMPLATES/.venv/bin/python';

// variants: array of {json, pdf, docx} entries
const VARIANTS = [
  {
    name: 'unified',
    json: join(jsonDir, 'unified.json'),
    docx: join(publicDir, 'resume-tailored.docx'),
    pdf: join(publicDir, 'resume-tailored.pdf'),
  },
  {
    name: 'ai-only',
    json: join(jsonDir, 'ai-only.json'),
    docx: join(publicDir, 'resume-ai-only.docx'),
    pdf: join(publicDir, 'resume-ai-only.pdf'),
  },
  {
    name: 'quant-onepage',
    json: join(jsonDir, 'quant-onepage.json'),
    docx: join(publicDir, 'resume-quant-onepage.docx'),
    pdf: join(publicDir, 'resume-quant-onepage.pdf'),
  },
];

// Parse --variant flag (optional)
const flagIdx = process.argv.indexOf('--variant');
const onlyVariant = flagIdx > -1 ? process.argv[flagIdx + 1] : null;

function log(prefix, msg) {
  console.log(`[build-resumes] ${prefix} ${msg}`);
}

function render(variant) {
  log(variant.name, `→ ${variant.pdf}`);
  if (!existsSync(variant.json)) {
    console.error(`[build-resumes] ✗ ${variant.name}: missing JSON at ${variant.json}`);
    process.exit(1);
  }
  if (!existsSync(PYTHON)) {
    console.error(`[build-resumes] ✗ python venv not found at ${PYTHON}`);
    console.error(`[build-resumes]   set OJP_PYTHON env var to the python3 with python-docx installed`);
    process.exit(1);
  }
  if (!existsSync(OJP_BUILDER)) {
    console.error(`[build-resumes] ✗ builder not found at ${OJP_BUILDER}`);
    console.error(`[build-resumes]   set OJP_BUILDER env var to the build_resume.py path`);
    process.exit(1);
  }
  mkdirSync(dirname(variant.pdf), { recursive: true });

  const r = spawnSync(
    PYTHON,
    [OJP_BUILDER, '--json', variant.json, '--docx', variant.docx, '--pdf', variant.pdf],
    { stdio: 'inherit' },
  );
  if (r.status !== 0) {
    console.error(`[build-resumes] ✗ ${variant.name}: builder exited ${r.status}`);
    process.exit(1);
  }

  // Verify the output PDF is real + non-trivial
  if (!existsSync(variant.pdf)) {
    console.error(`[build-resumes] ✗ ${variant.name}: PDF not produced`);
    process.exit(1);
  }
  const size = statSync(variant.pdf).size;
  if (size < 5_000) {
    console.error(`[build-resumes] ✗ ${variant.name}: PDF suspiciously small (${size} bytes)`);
    process.exit(1);
  }
  // Drop the intermediate .docx so it doesn't bloat the repo
  if (existsSync(variant.docx)) unlinkSync(variant.docx);

  log(variant.name, `✓ ${variant.pdf}  ${(size / 1024).toFixed(1)} KB`);
}

const targets = onlyVariant ? VARIANTS.filter((v) => v.name === onlyVariant) : VARIANTS;
if (onlyVariant && targets.length === 0) {
  console.error(`[build-resumes] ✗ unknown variant '${onlyVariant}'`);
  console.error(`[build-resumes]   valid: ${VARIANTS.map((v) => v.name).join(', ')}`);
  process.exit(1);
}

log('start', `rendering ${targets.length} resume variant(s)`);
for (const v of targets) render(v);
log('done', `✓ ${targets.length}/${VARIANTS.length} resumes built`);