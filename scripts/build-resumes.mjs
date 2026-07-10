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
// if you move it. Default discovers the builder & venv at known convention
// paths (Contengency/OnlineJobs_PH_Applications/03_TEMPLATES) relative to the
// user's HOME — never hard-coded to a single host. On a CI runner or a
// different dev machine, OJP_BUILDER / OJP_PYTHON env vars override.
const HOME = process.env.HOME || process.env.USERPROFILE || '';
const OJP_BUILDER =
  process.env.OJP_BUILDER ||
  `${HOME}/Contingency/OnlineJobs_PH_Applications/03_TEMPLATES/scripts/build_resume.py`;

// Discover the OJP venv interpreter. Prefer `python3` on PATH (system Python
// in a fresh venv is fine for `python-docx` + `soffice`); fall back to the
// venv's `python` only if it exists. The hard-code to a single machine has
// been removed — anyone can clone this repo and the script will find the
// toolchain or skip cleanly.
function defaultPython() {
  if (process.env.OJP_PYTHON) return process.env.OJP_PYTHON;
  // Candidate interpreters, first-existing wins.
  const candidates = [
    `${HOME}/Contingency/OnlineJobs_PH_Applications/03_TEMPLATES/.venv/bin/python`,
    'python3',
    'python',
  ];
  for (const c of candidates) {
    if (c.includes('/') && existsSync(c)) return c;
    if (!c.includes('/')) return c; // bare command — resolved by spawnSync
  }
  return 'python3';
}
const PYTHON = defaultPython();

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

// Returns true when the OJP toolchain is reachable. CI runners don't have the
// local venv or the builder script, so they fall through to "skip" instead of
// failing the prebuild — the committed PDFs in public/ are the source of truth
// for what ships. Bare commands like "python3" are always considered reachable
// since PATH resolution handles them; only absolute paths trigger the FS check.
function toolchainAvailable() {
  const builderOk = OJP_BUILDER.startsWith('/') ? existsSync(OJP_BUILDER) : true;
  const pythonOk =
    PYTHON.includes('/') || PYTHON.includes('\\') ? existsSync(PYTHON) : true;
  return builderOk && pythonOk;
}

function render(variant) {
  log(variant.name, `→ ${variant.pdf}`);
  if (!existsSync(variant.json)) {
    console.error(`[build-resumes] ✗ ${variant.name}: missing JSON at ${variant.json}`);
    process.exit(1);
  }
  if (!toolchainAvailable()) {
    // Not a hard error — CI without the OJP venv should ship the committed PDFs.
    if (existsSync(variant.pdf)) {
      const size = statSync(variant.pdf).size;
      log(
        variant.name,
        `○ skip (no OJP toolchain); using committed PDF (${(size / 1024).toFixed(1)} KB)`,
      );
      return;
    }
    console.error(
      `[build-resumes] ✗ ${variant.name}: OJP toolchain not found AND no committed PDF at ${variant.pdf}`,
    );
    console.error(`[build-resumes]   either set OJP_PYTHON + OJP_BUILDER, or commit public/${variant.pdf}`);
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
if (!toolchainAvailable()) {
  log(
    'skip',
    `OJP toolchain not reachable (PYTHON=${PYTHON}, BUILDER=${OJP_BUILDER}); shipping committed PDFs`,
  );
  // Run render() anyway so each variant reports its committed size — fast path.
}
for (const v of targets) render(v);
log('done', `✓ ${targets.length}/${VARIANTS.length} resumes ready`);