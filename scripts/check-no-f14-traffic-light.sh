#!/usr/bin/env bash
# check-no-f14-traffic-light.sh
# Pre-commit guard against the F14 institutional rule:
#   F14: amber-only chrome — no red/green traffic-light semantics.
#
# Why: Owner 2026-07-13 sweep across 14 secondary-page components found 19
# scattered sites using `var(--c-pass)`, `var(--c-fail)`,
# `var(--c-data-positive)`, or `var(--c-data-negative)` for sentiment
# coloring (up/down/long-vol/short-vol/etc). The institutional rule
# (Man Group / Renaissance / AQR / Bridgewater / Jane Street / D.E. Shaw /
# Two Sigma) is monochrome amber + ink — NEVER green-for-up / red-for-down.
# Every directional signal is carried by hue intensity, not sentiment hue.
#
# Reference: ~/.claude/projects/-Users-christianmacion/memory/
#            institutional-design-patterns.md (F-rule set)
# See also:  portfolio-v61110-secondary-f14-sweep.md (origin of this gate)
#
# This script scans the BUILT CSS (dist/_astro/*.css) for the four
# traffic-light tokens in USAGE position. Token DEFINITIONS in tokens.css
# are `--c-pass: #...;` — no `var(--c-pass)` — so a simple grep on
# `var(--c-pass|...)` cleanly separates "is the variable being rendered
# anywhere?" from "where is the variable defined?".
#
# Usage:
#   ./scripts/check-no-f14-traffic-light.sh
#
# Exit codes:
#   0  = clean (no traffic-light usage in rendered CSS)
#   1  = found traffic-light usage sites (will print offenders)
#   2  = bad args
set -euo pipefail

for arg in "$@"; do
  case "$arg" in
    -h|--help)
      sed -n '2,30p' "$0"
      exit 0
      ;;
    *) echo "Unknown arg: $arg" >&2; exit 2 ;;
  esac
done

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
# DIST may be overridden for testing (e.g. scripts/__tests__/no-f14.test.sh).
# In production usage, leave DIST unset and the gate scans $ROOT/dist/_astro.
DIST="${DIST:-$ROOT/dist/_astro}"

if [ ! -d "$DIST" ]; then
  echo "ℹ️  No dist/_astro/ directory yet (run \`npm run build\` first)."
  echo "   Skipping F14 gate — pre-build check is a no-op."
  exit 0
fi

echo "Scanning $DIST for F14 traffic-light chrome..."

# The pattern: any usage of the four legacy tokens via var(...).
# Token DEFINITIONS look like `--c-pass: #...;` — those have NO `var(...)`
# wrapper and so are silently excluded by this regex.
# v6.11.18 — also check SVG attributes (`fill="var(--c-pass)"`,
# `stroke="var(--c-pass)"`, `bg="...", style="...: var(--c-pass)"`) which
# render in dist/*.html but bypass `--include="*.css"`. Astro inlines
# scoped CSS into HTML <style> blocks, AND any literal var() in JSX
# attributes flows through as-is to render output.
#
# v6.11.18 — also check raw rgba(63,185,80,*) / rgba(248,81,73,*)
# (the literal green/red values for the legacy pass/fail semantics).
# These are how some components bypass the token system entirely.
# Pattern matches `rgba(63, 185, 80, ...)` and `rgba(248, 81, 73, ...)`
# with any alpha. Whitespace-tolerant.
VAR_PATTERN='var\(--c-(pass|fail|data-positive|data-negative)\)'
RGBA_PATTERN='rgba\(\s*(63,\s*185,\s*80|248,\s*81,\s*73)\s*,'

# Collect offenders: "<file>:<line>: <match>"
# Scan both: (1) bundled CSS — same as before, and (2) rendered HTML
# (with --include="*.html") which catches SVG attribute values and
# inline style strings.
OFFENDERS=$(grep -rEn \
  --include="*.css" --include="*.html" \
  "$DIST" \
  -e "$VAR_PATTERN" -e "$RGBA_PATTERN" \
  2>/dev/null | head -100 || true)

if [ -n "$OFFENDERS" ]; then
  COUNT=$(echo "$OFFENDERS" | wc -l | tr -d ' ')
  echo ""
  echo "❌ F14 TRAFFIC-LIGHT VIOLATIONS FOUND ($COUNT site$( [ "$COUNT" = "1" ] || echo s )):"
  echo ""
  echo "$OFFENDERS"
  echo ""
  echo "These are institutional-rule violations. Replace with the"
  echo "amber/ink-2 monochrome tokens:"
  echo "  • data-positive  → var(--c-amber) + color-mix amber 8-14%"
  echo "  • data-negative  → var(--c-ink-2) + color-mix ink-2 6-10%"
  echo "  • data-neutral   → var(--c-ink-3)"
  echo ""
  echo "Token definitions in src/styles/tokens.css remain for backward"
  echo "compat with MDX/content callers, but NO rendered surface may use"
  echo "them."
  echo ""
  echo "Reference: ~/.claude/projects/-Users-christianmacion/memory/"
  echo "           institutional-design-patterns.md"
  echo "Origin:    portfolio-v61110-secondary-f14-sweep.md"
  exit 1
fi

echo "✅ No F14 traffic-light chrome found in dist/_astro/*.css."
exit 0