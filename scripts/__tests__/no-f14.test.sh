#!/usr/bin/env bash
# scripts/__tests__/no-f14.test.sh — reproduction test for the F14 gate.
#
# v6.11.12 — turns the v6.11.11 AAR's one-line synthetic test into a
# reproducible CI assertion. Future contributors can verify the gate is
# actually catching violations without re-deriving the synthetic case.
#
# Usage:  bash scripts/__tests__/no-f14.test.sh
# Exit:   0 if the gate works, 1 if it doesn't.
#
# Pattern: builds a synthetic dist/_astro/ with a known violation,
# verifies the regex excludes token defs, runs the gate, expects exit 1.
# Then runs against a clean fixture, expects exit 0. Backs up any real
# dist/_astro/*.css to /tmp/f14-test.bak.css and restores after.
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
GATE="$REPO_ROOT/scripts/check-no-f14-traffic-light.sh"
TMPDIR="$(mktemp -d)"
trap 'rm -rf "$TMPDIR"; if [ -f /tmp/f14-test.bak.css ]; then mv /tmp/f14-test.bak.css "$REPO_ROOT/dist/_astro/$(basename /tmp/f14-test.bak.css)" 2>/dev/null || true; fi' EXIT

echo "🧪 Test: F14 traffic-light CI gate"

if [ ! -f "$GATE" ]; then
  echo "  ✗ gate not found at $GATE"
  exit 1
fi

# === Fixture 1: violation ===
mkdir -p "$TMPDIR/dist_with_violation/_astro"
cat > "$TMPDIR/dist_with_violation/_astro/fake.css" <<'CSS'
.usage-pass{color:var(--c-pass);}
.usage-fail{background:var(--c-fail);}
.defs{--c-pass:#3fb950;--c-fail:#f85149;}
.good::after{color:var(--c-amber);}
CSS

# v6.11.18 — also include an HTML file with SVG attribute violations
# (Astro inlines var() refs into HTML fill="..." and stroke="..." attrs,
# which the previous gate missed). Fixture validation requires the gate
# to catch these too.
cat > "$TMPDIR/dist_with_violation/index.html" <<'HTML'
<svg fill="var(--c-pass)"></svg>
<div style="color:var(--c-fail)"></div>
HTML

# v6.11.18 — also include a fixture that uses raw rgba(63,185,80,*) /
# rgba(248,81,73,*) (the literal green/red values bypassing the token
# system). Some components (EquityCurveChart, HeroVideo) historically
# rendered these directly. The gate's rgba pattern catches both.
cat > "$TMPDIR/dist_with_violation/raw-rgba.html" <<'HTML'
<rect fill="rgba(63, 185, 80, 0.06)"></rect>
<rect fill="rgba(248,81,73,0.18)"></rect>
HTML

# Sanity check: the regex MUST match all usage lines and MUST NOT match defs.
USAGE_MATCHES=$(grep -cE 'var\(--c-(pass|fail|data-positive|data-negative)\)' "$TMPDIR/dist_with_violation/_astro/fake.css" || true)
DEF_MATCHES=$(grep -cE '^\s*--c-(pass|fail|data-positive|data-negative):' "$TMPDIR/dist_with_violation/_astro/fake.css" || true)
if [ "$USAGE_MATCHES" -lt 2 ]; then
  echo "  ✗ regex sanity: expected ≥2 usage matches in violation fixture, got $USAGE_MATCHES"
  exit 1
fi
if [ "$DEF_MATCHES" -ne 0 ]; then
  echo "  ✗ regex sanity: expected 0 def matches (defs are excluded by design), got $DEF_MATCHES"
  exit 1
fi

# === Test 1: violation produces exit 1 ===
# Backup any real dist/_astro/*.css before we point the gate at TMPDIR.
if [ -d "$REPO_ROOT/dist/_astro" ]; then
  for f in "$REPO_ROOT/dist/_astro"/*.css; do
    [ -f "$f" ] && cp "$f" /tmp/f14-test.bak.css
  done
fi

set +e
DIST="$TMPDIR/dist_with_violation" bash "$GATE" >/dev/null 2>&1
RC=$?
set -e

if [ "$RC" -ne 1 ]; then
  echo "  ✗ synthetic violation produced exit $RC, expected exit 1"
  exit 1
fi
echo "  ✓ synthetic violation produces exit 1"

# === Fixture 2: clean ===
mkdir -p "$TMPDIR/dist_clean/_astro"
cat > "$TMPDIR/dist_clean/_astro/clean.css" <<'CSS'
.good::after{color:var(--c-amber);background:var(--c-ink-2);}
.ok::before{color:var(--c-amber-soft);}
CSS

# === Test 2: clean produces exit 0 ===
set +e
DIST="$TMPDIR/dist_clean" bash "$GATE" >/dev/null 2>&1
RC=$?
set -e

if [ "$RC" -ne 0 ]; then
  echo "  ✗ clean fixture produced exit $RC, expected exit 0"
  exit 1
fi
echo "  ✓ clean fixture produces exit 0"

echo "  ✅ F14 traffic-light CI gate is functioning correctly."
exit 0
