// scripts/build-og-image.mjs
//
// Composites the og:image banner used for LinkedIn / Slack / Twitter previews.
// Input:  src/assets/portrait/headshot-source.jpg
// Output: public/og-image.jpg (1600×900) + public/og-image-twitter.jpg (1200×675)
//
// Run once, then commit the outputs. Not part of `npm run build` — image is
// deterministic from the source headshot, no need to rebuild on every commit.

import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const headshotPath = join(root, 'src/assets/portrait/headshot-source.jpg');
const publicDir = join(root, 'public');

// ── SVG composition ──────────────────────────────────────────────────────────
// Headshot anchored to the right third, dark gradient + amber rule on the left.
// Type stack intentionally uses platform-safe sans (Helvetica/Arial) — these
// get rasterized at build time, so we don't depend on @fontsource loading.
function buildSvg({ width, height, headshotBox }) {
  const scale = width / 1600; // normalize to 1600 design grid
  const s = (n) => Math.round(n * scale);

  // Headshot placement: anchored to right side, vertically centered
  const hsX = Math.round(width - headshotBox - s(80));
  const hsY = Math.round((height - headshotBox) / 2);

  return `
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0a0e14"/>
      <stop offset="50%" stop-color="#11161d"/>
      <stop offset="100%" stop-color="#1a1f24"/>
    </linearGradient>
    <linearGradient id="amber" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#d4a017"/>
      <stop offset="100%" stop-color="#e8b53a"/>
    </linearGradient>
    <pattern id="grid" x="0" y="0" width="${s(60)}" height="${s(60)}" patternUnits="userSpaceOnUse">
      <path d="M ${s(60)} 0 L 0 0 0 ${s(60)}" fill="none" stroke="#d4a017" stroke-opacity="0.06" stroke-width="1"/>
    </pattern>
  </defs>

  <!-- Background -->
  <rect width="${width}" height="${height}" fill="url(#bg)"/>
  <rect width="${width}" height="${height}" fill="url(#grid)"/>

  <!-- Amber left rule -->
  <rect x="${s(60)}" y="${s(80)}" width="${s(6)}" height="${height - s(160)}" fill="url(#amber)"/>

  <!-- Type stack -->
  <g font-family="Helvetica, Arial, sans-serif" fill="#ffffff">
    <text x="${s(120)}" y="${s(220)}" font-size="${s(32)}" letter-spacing="${s(6)}" fill="#d4a017" font-weight="600">
      CHRISTIAN T. MACION, CTA®
    </text>
    <text x="${s(120)}" y="${s(360)}" font-size="${s(86)}" font-weight="700" letter-spacing="${s(-3)}">
      I do solutions.
    </text>
    <text x="${s(120)}" y="${s(470)}" font-size="${s(62)}" font-weight="600" letter-spacing="${s(-1)}" fill="#d4a017">
      Two hats. One method.
    </text>
    <text x="${s(120)}" y="${s(580)}" font-size="${s(32)}" fill="#869098">
      Quant Researcher · AI Engineer · Eval-first
    </text>
    <text x="${s(120)}" y="${s(630)}" font-size="${s(24)}" fill="#7c8693">
      Multiple-testing-aware systematic strategies &amp; multi-agent LLM systems.
    </text>
    <text x="${s(120)}" y="${s(820)}" font-size="${s(20)}" letter-spacing="${s(2)}" fill="#5a6473" font-family="ui-monospace, Menlo, monospace">
      christianmacion26.github.io/portfolio
    </text>
  </g>

  <!-- Headshot (composited after, but reserve slot for layout) -->
  <rect x="${hsX}" y="${hsY}" width="${headshotBox}" height="${headshotBox}" fill="#0a0e14" stroke="#d4a017" stroke-width="${s(4)}"/>
</svg>`;
}

// ── Pipeline ─────────────────────────────────────────────────────────────────
async function buildOne({ width, height, outFile, headshotBox, quality }) {
  // Resize headshot: crop-to-square at headshotBox, focus on attention area
  const headshotBuf = await sharp(headshotPath)
    .resize(headshotBox, headshotBox, { fit: 'cover', position: 'attention' })
    .png()
    .toBuffer();

  const svg = buildSvg({ width, height, headshotBox });
  const compositeX = Math.round(width - headshotBox - (80 * width) / 1600);
  const compositeY = Math.round((height - headshotBox) / 2);

  await sharp(Buffer.from(svg))
    .composite([{ input: headshotBuf, left: compositeX, top: compositeY }])
    .jpeg({ quality, mozjpeg: true, progressive: true })
    .toFile(outFile);

  const stats = await sharp(outFile).metadata();
  console.log(`✓ ${outFile}  ${stats.width}×${stats.height}  ${(stats.size / 1024).toFixed(1)} KB`);
}

await buildOne({
  width: 1600,
  height: 900,
  outFile: join(publicDir, 'og-image.jpg'),
  headshotBox: 640,
  quality: 82,
});

await buildOne({
  width: 1200,
  height: 675,
  outFile: join(publicDir, 'og-image-twitter.jpg'),
  headshotBox: 480,
  quality: 82,
});