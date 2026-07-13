/**
 * bump-version.ts — bump package.json + humans.md + footer stamp in lockstep.
 *
 * Usage:
 *   npx tsx scripts/bump-version.ts [patch|minor|major|x.y.z]
 *
 * - patch (default): 3.5.0 → 3.5.1
 * - minor:           3.5.0 → 3.6.0
 * - major:           3.5.0 → 4.0.0
 * - x.y.z:           explicit semver (e.g. 5.0.0)
 *
 * Updates:
 *   1. package.json: "version" field
 *   2. public/humans.md: "Version:" line in Build metadata
 *   3. public/humans.md: "Last edited vX.Y.Z" line at the bottom
 *
 * Stays in sync with src/components/Footer.astro v5.0 stamp — the footer reads
 * humans.md content at build time indirectly via profile.ts; the vX.Y stamp on
 * the footer is hand-written to match the latest version. This script prints the
 * new version so the operator can update the footer stamp manually.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

type BumpType = 'patch' | 'minor' | 'major' | string;

function parseSemver(v: string): [number, number, number] {
  const m = v.match(/^(\d+)\.(\d+)\.(\d+)/);
  if (!m) throw new Error(`Invalid semver: ${v}`);
  return [Number(m[1]), Number(m[2]), Number(m[3])];
}

function bumpSemver(v: string, type: BumpType): string {
  if (type === 'patch' || type === 'minor' || type === 'major') {
    const [maj, min, pat] = parseSemver(v);
    if (type === 'major') return `${maj + 1}.0.0`;
    if (type === 'minor') return `${maj}.${min + 1}.0`;
    return `${maj}.${min}.${pat + 1}`;
  }
  // explicit x.y.z
  if (/^\d+\.\d+\.\d+/.test(type)) return type;
  throw new Error(`Unknown bump argument: ${type} (use patch|minor|major|x.y.z)`);
}

const arg = process.argv[2] ?? 'patch';

// 1. Read package.json
const pkgPath = resolve(ROOT, 'package.json');
const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8')) as { version: string };
const oldVersion = pkg.version;
const newVersion = bumpSemver(oldVersion, arg);
const today = new Date().toISOString().slice(0, 10);

console.log(`[bump-version] ${oldVersion} → ${newVersion}`);

// 2. Write package.json
pkg.version = newVersion;
writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n', 'utf-8');
console.log(`[bump-version] wrote ${pkgPath}`);

// 3. Update public/humans.md Build metadata + footer line
const humansPath = resolve(ROOT, 'public/humans.md');
let humans = readFileSync(humansPath, 'utf-8');

const versionLine = `- **Version:** v${newVersion} · built ${today}.`;
const versionLineRe = /- \*\*Version:\*\* v[\d.]+ · built \d{4}-\d{2}-\d{2}\./;
if (versionLineRe.test(humans)) {
  humans = humans.replace(versionLineRe, versionLine);
} else {
  // Insert under "## Build metadata" if the line is missing.
  humans = humans.replace(/## Build metadata\n/, `## Build metadata\n\n${versionLine}\n`);
}

const lastEditedRe = /Last edited \d{4}-\d{2}-\d{2} · v[\d.]+\./;
const lastEditedLine = `Last edited ${today} · v${newVersion}.`;
if (lastEditedRe.test(humans)) {
  humans = humans.replace(lastEditedRe, lastEditedLine);
}

writeFileSync(humansPath, humans, 'utf-8');
console.log(`[bump-version] wrote ${humansPath}`);

console.log('');
console.log(`[bump-version] DONE — version is now v${newVersion}`);
console.log('');
console.log('  Next steps:');
console.log(`    1. Update src/components/Footer.astro v-stamp to v${newVersion}`);
console.log('    2. git add package.json public/humans.md src/components/Footer.astro');
console.log(`    3. git commit -m "v${newVersion}"`);
console.log('    4. git push');
