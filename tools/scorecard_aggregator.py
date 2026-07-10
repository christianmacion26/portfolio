#!/usr/bin/env python3
"""tools/scorecard_aggregator.py — aggregate `<!-- scorecard: { ... } -->` blocks into dist/scorecards.json.

Scans every ``.md`` file under ``src/content/`` for a JSON scorecard block of
the form:

    ---
    <!-- scorecard: { "label": "value", ... } -->
    title: foo
    ...

i.e. an HTML comment whose body is a single JSON object, located between the
leading ``---`` frontmatter fences. The comment is parsed as JSON; the
filename stem becomes the slug; the result is a flat array::

    [
      {"slug": "01-rag-recall", "scorecard": {"label": "value", ...}},
      ...
    ]

written to ``dist/scorecards.json`` (path configurable via ``--out``).

Usage:
  python3 tools/scorecard_aggregator.py                  # writes dist/scorecards.json
  python3 tools/scorecard_aggregator.py --self-test      # 3 fake content files; exit 0
  python3 tools/scorecard_aggregator.py --content-dir <dir> --out <path>

Exit codes:
  0 — wrote JSON (or --self-test passed)
  1 — wrote zero scorecards and ``--strict`` was passed
  2 — usage error / malformed JSON in a comment block

Pure Python 3 stdlib. No external deps.
"""
from __future__ import annotations

import argparse
import json
import re
import sys
import tempfile
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
DEFAULT_CONTENT_DIR = REPO_ROOT / "src" / "content"
DEFAULT_OUTPUT = REPO_ROOT / "dist" / "scorecards.json"

# Match the leading frontmatter fences and the inner scorecard comment.
# Group 1 = body between the two `---` lines.
FRONTMATTER_RE = re.compile(r"\A---\s*\n(.*?)\n---\s*\n", re.DOTALL)
# Match `<!-- scorecard: { ... } -->` (single-line; the JSON must be inline).
SCORECARD_RE = re.compile(
    r"<!--\s*scorecard:\s*(\{.*?\})\s*-->",
    re.DOTALL,
)


def extract_scorecard(md_text: str) -> tuple[str, dict] | None:
    """Return (raw_json, parsed_dict) if a scorecard comment is in the frontmatter."""
    m = FRONTMATTER_RE.match(md_text)
    if not m:
        return None
    frontmatter = m.group(1)
    cm = SCORECARD_RE.search(frontmatter)
    if not cm:
        return None
    raw = cm.group(1)
    try:
        parsed = json.loads(raw)
    except json.JSONDecodeError as exc:
        raise ValueError(f"malformed scorecard JSON: {exc}: {raw!r}") from exc
    if not isinstance(parsed, dict):
        raise ValueError(f"scorecard JSON must be an object, got {type(parsed).__name__}")
    return raw, parsed


def collect(content_dir: Path) -> list[dict]:
    """Walk ``content_dir`` recursively for ``.md`` files containing scorecards."""
    if not content_dir.exists():
        return []
    out: list[dict] = []
    for path in sorted(content_dir.rglob("*.md")):
        try:
            text = path.read_text(encoding="utf-8")
        except UnicodeDecodeError:
            continue
        try:
            extracted = extract_scorecard(text)
        except ValueError:
            # Bad JSON in a scorecard comment — skip but don't crash.
            continue
        if extracted is None:
            continue
        _, scorecard = extracted
        slug = path.stem
        out.append({"slug": slug, "scorecard": scorecard})
    return out


def write_scorecards(scorecards: list[dict], out_path: Path) -> None:
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(json.dumps(scorecards, indent=2, ensure_ascii=False) + "\n")


def _self_test() -> int:
    """Build 3 fake content files in a tempdir; verify shape + sort + exit 0."""
    with tempfile.TemporaryDirectory() as tmpd:
        tmp = Path(tmpd)
        projects = tmp / "projects"
        projects.mkdir(parents=True)
        solutions = tmp / "solutions"
        solutions.mkdir(parents=True)

        # 1) frontmatter scorecard + body
        (projects / "01-rag-recall.md").write_text(
            "---\n"
            "<!-- scorecard: {\"recall@3\": \"0.886\", \"MRR@3\": \"0.805\"} -->\n"
            "title: RAG Recall Eval\n"
            "order: 1\n"
            "---\n"
            "Body text.\n",
            encoding="utf-8",
        )

        # 2) multi-key scorecard with nested numbers
        (projects / "02-reagent.md").write_text(
            "---\n"
            "<!-- scorecard: {\"tool_correctness\": 1.0, \"loops_without_bound\": 0, "
            "\"avg_latency_ms\": 412} -->\n"
            "title: ReAct Agent\n"
            "order: 2\n"
            "---\n"
            "Body.\n",
            encoding="utf-8",
        )

        # 3) solution-style file with same shape
        (solutions / "03-deflated-sharpe.md").write_text(
            "---\n"
            "<!-- scorecard: {\"deflated_sharpe\": 1.84, \"p_value\": 0.012, \"n_trials\": 240} -->\n"
            "title: Deflated Sharpe\n"
            "order: 5\n"
            "---\n"
            "Body.\n",
            encoding="utf-8",
        )

        # A 4th file with NO scorecard comment — must be skipped.
        (solutions / "04-no-scorecard.md").write_text(
            "---\ntitle: No Scorecard\n---\nBody.\n",
            encoding="utf-8",
        )

        scorecards = collect(tmp)
        out = tmp / "scorecards.json"
        write_scorecards(scorecards, out)

        if len(scorecards) != 3:
            print(f"FAIL: expected 3 scorecards, got {len(scorecards)}", file=sys.stderr)
            return 1
        data = json.loads(out.read_text())
        # Top-level must be a flat list (not a nested object).
        if not isinstance(data, list):
            print(f"FAIL: top-level must be a list, got {type(data).__name__}", file=sys.stderr)
            return 1
        if {e["slug"] for e in data} != {"01-rag-recall", "02-reagent", "03-deflated-sharpe"}:
            print(f"FAIL: unexpected slugs: {[e['slug'] for e in data]}", file=sys.stderr)
            return 1
        rag = next(e for e in data if e["slug"] == "01-rag-recall")
        if rag["scorecard"].get("recall@3") != "0.886":
            print(f"FAIL: rag scorecard malformed: {rag}", file=sys.stderr)
            return 1
        reagent = next(e for e in data if e["slug"] == "02-reagent")
        if reagent["scorecard"].get("loops_without_bound") != 0:
            print(f"FAIL: reagent scorecard malformed: {reagent}", file=sys.stderr)
            return 1

    print("scorecard_aggregator --self-test: 3/3 scorecards parsed; flat list shape OK")
    return 0


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Aggregate `<!-- scorecard: { ... } -->` blocks from src/content/*.md"
    )
    parser.add_argument("--content-dir", type=Path, default=DEFAULT_CONTENT_DIR)
    parser.add_argument("--out", type=Path, default=DEFAULT_OUTPUT)
    parser.add_argument(
        "--self-test", action="store_true", help="run a 3-file fixture (exit 0 on PASS)"
    )
    parser.add_argument(
        "--strict", action="store_true", help="exit 1 if zero scorecards were found"
    )
    args = parser.parse_args()

    if args.self_test:
        return _self_test()

    scorecards = collect(args.content_dir)
    write_scorecards(scorecards, args.out)
    rel = (
        str(args.out.relative_to(REPO_ROOT))
        if args.out.is_absolute() and args.out.is_relative_to(REPO_ROOT)
        else str(args.out)
    )
    print(f"scorecard_aggregator: {len(scorecards)} scorecard(s) -> {rel}")
    if args.strict and len(scorecards) == 0:
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())