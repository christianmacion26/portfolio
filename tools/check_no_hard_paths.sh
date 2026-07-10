#!/usr/bin/env bash
# tools/check_no_hard_paths.sh — fail CI on hard-coded absolute paths.
#
# Scope (per Wave-2 dispatch Agent 1.3):
#   Detect absolute system paths and hard-coded venv paths that should never
#   be baked into a portable repo. Examples that count as offenders:
#     /Users/<name>/...
#     /home/<name>/...
#     /private/var/...
#     Library/md files/.venv/...
#     /Library/Application Support/...
#     any literal "/path/to/.venv/bin/python" reference
#
# Usage:
#   tools/check_no_hard_paths.sh                 # scan repo root, exit 1 on offenders
#   tools/check_no_hard_paths.sh --dry-run       # report offenders, exit 0
#   tools/check_no_hard_paths.sh --scope <dir>   # scan a specific subtree
#   tools/check_no_hard_paths.sh --self-test     # run an in-memory fixture (exit 0)
#
# Exit codes:
#   0 — clean OR --dry-run OR --self-test passed
#   1 — at least one hard-path offender found (no --dry-run)
#   2 — bad usage
#
# Pure bash + grep. No Python, no jq.

set -uo pipefail

# Repo root = one level up from this script.
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# Patterns that count as "hard paths". Keep this regex anchored on whole-path
# literals so it only fires on absolute user-home / venv / OS-library strings,
# not on every string containing "users" or "home".
HARD_PATH_REGEX='(/Users/[A-Za-z0-9._-]+/|/home/[A-Za-z0-9._-]+/|/private/var/|Library/md files/\.venv|/Library/Application Support/|\.venv/bin/(python|pip)([[:space:]]|$))'

# Files we skip — generated artifacts, third-party, and known reference docs
# that legitimately contain proof paths in prose.
DEFAULT_SKIP=(
  '*/node_modules/*'
  '*/.git/*'
  '*/dist/*'
  '*/.astro/*'
  '*/.wrangler/*'
  '*/package-lock.json'
  '*/.DS_Store'
  '*/tools/check_no_hard_paths.sh'
  '*/.audit/*'
  '*/_research/*'
  '*/PROPOSAL-*.md'
  '*/ARCHIVE.md'
  '*/OUTREACH.md'
  '*/LIGHTHOUSE-BASELINE.md'
  '*/README.md'
  # sha256 manifests inherently contain the absolute path of the file they
  # checksum (sha256sum default). Skip them so the gate is portable-code-
  # focused, not reference-data focused.
  '*.sha256'
  '*.lock'
)

DRY_RUN=0
SELF_TEST=0
SCOPE="$REPO_ROOT"
EXEMPT_REGEXES=()

while [[ $# -gt 0 ]]; do
  case "$1" in
    --dry-run) DRY_RUN=1; shift ;;
    --self-test) SELF_TEST=1; shift ;;
    --scope) SCOPE="$2"; shift 2 ;;
    --allow) EXEMPT_REGEXES+=("$2"); shift 2 ;;
    --help|-h)
      sed -n '2,28p' "$0"
      exit 0 ;;
    *)
      echo "check_no_hard_paths: unknown arg '$1'" >&2
      exit 2 ;;
  esac
done

# ---------- self-test ----------
if [[ "$SELF_TEST" == "1" ]]; then
  # Build a tiny temp workspace with one offender + one clean file.
  # Expected offender count: 1 (BAD). CLEAN must NOT count.
  TMP="$(mktemp -d)"
  trap "rm -rf '$TMP'" EXIT
  BAD="$TMP/bad-script.mjs"
  CLEAN="$TMP/good-script.mjs"
  printf "%s\n" "#!/usr/bin/env node" \
                 'const P = "Library/md files/.venv/bin/python";' > "$BAD"
  printf "%s\n" "#!/usr/bin/env node" \
                 'const P = "/srv/ok-path/cfg.json";' > "$CLEAN"
  offenders=0
  offender_files=()
  for f in "$BAD" "$CLEAN"; do
    # Allow /srv/ok-path/ so the CLEAN file is exempted.
    line="$(grep -nE "$HARD_PATH_REGEX" "$f" 2>/dev/null | head -n 1 || true)"
    if [[ -n "$line" ]] && ! echo "$line" | grep -qE '/srv/ok-path/'; then
      offenders=$((offenders + 1))
      offender_files+=("$f")
    fi
  done
  echo "check_no_hard_paths --self-test: offenders=$offenders (expect 1)"
  if [[ "$offenders" -eq 1 ]]; then
    echo "PASS"
    exit 0
  fi
  echo "FAIL"
  exit 1
fi

# ---------- production scan ----------
# Build grep --exclude patterns.
SKIP_ARGS=()
for s in "${DEFAULT_SKIP[@]}"; do
  SKIP_ARGS+=("--exclude=$s")
done

# Collect offenders.
offenders=0
offender_lines=()

# shellcheck disable=SC2086
while IFS=: read -r file _num line; do
  # Allowlisted regexes skip a line.
  skip=0
  for ex in "${EXEMPT_REGEXES[@]:-}"; do
    if [[ -n "$ex" ]] && echo "$line" | grep -qE "$ex"; then
      skip=1; break
    fi
  done
  [[ "$skip" == "1" ]] && continue
  offenders=$((offenders + 1))
  offender_lines+=("  $file: $line")
done < <(grep -rnE "$HARD_PATH_REGEX" "$SCOPE" "${SKIP_ARGS[@]}" 2>/dev/null \
         | grep -v '^Binary' || true)

if [[ "$offenders" -gt 0 ]]; then
  echo "check_no_hard_paths: $offenders hard-path offender(s) in $SCOPE"
  printf '%s\n' "${offender_lines[@]}"
  if [[ "$DRY_RUN" == "1" ]]; then
    echo ""
    echo "(dry-run: would exit 1; rerun without --dry-run to fail CI.)"
    exit 0
  fi
  echo ""
  echo "Fix: replace absolute paths with env-var references or PATH-resolved commands."
  echo "     See scripts/build-resumes.mjs:OJP_BUILDER / OJP_PYTHON pattern."
  exit 1
fi

if [[ "$DRY_RUN" == "1" ]]; then
  echo "check_no_hard_paths --dry-run: 0 hard-path offenders in $SCOPE"
else
  echo "check_no_hard_paths: 0 hard-path offenders in $SCOPE"
fi
exit 0