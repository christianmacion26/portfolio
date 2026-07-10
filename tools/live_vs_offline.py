#!/usr/bin/env python3
"""tools/live_vs_offline.py — compare local ``dist/`` to the live Cloudflare Pages URL.

The portfolio site is mirrored at ``christianmacion-portfolio.pages.dev`` (per
the ``portfolio-cloudflare-mirror`` global memory). After every GA-relevant
edit, the operator deploys with ``wrangler pages deploy`` and this tool
answers: "did the live deploy drift away from what I just built?"

Behavior:
  * For each path in ``--paths``, fetch the corresponding ``dist/<path>`` file
    and the live URL's ``<path>`` resource via ``urllib.request.urlopen``.
  * Compare byte hashes (sha256). HTML files are normalized by stripping the
    Cloudflare-injected ``<head>...</head>`` block before hashing (CF appends
    nonces; we want body-fingerprint equality).
  * Print a per-path table; exit 1 if any path drifted.

Usage:
  python3 tools/live_vs_offline.py                                        # uses default paths
  python3 tools/live_vs_offline.py --live https://christianmacion-portfolio.pages.dev
  python3 tools/live_vs_offline.py --dist ./dist
  python3 tools/live_vs_offline.py --paths src/pages/index.astro src/content/about.md
  python3 tools/live_vs_offline.py --dry-run                             # report only; exit 0
  python3 tools/live_vs_offline.py --self-test                           # mock dist + mock live; exit 0

Exit codes:
  0 — match OR --dry-run OR --self-test passed
  1 — at least one path drifted OR local dist/ missing
  2 — usage error

Pure Python 3 stdlib (urllib.request only — no http.client, no requests).
"""
from __future__ import annotations

import argparse
import contextlib
import hashlib
import http.server
import json
import re
import socketserver
import sys
import tempfile
import threading
from pathlib import Path
from typing import Iterable
from urllib.parse import urljoin
from urllib.request import Request, urlopen

REPO_ROOT = Path(__file__).resolve().parent.parent
DEFAULT_DIST = REPO_ROOT / "dist"
DEFAULT_LIVE = "https://christianmacion-portfolio.pages.dev"

# Default drift-check set: a route + a content file + an asset.
DEFAULT_PATHS = [
    "src/pages/index.astro",
    "src/content/about.md",
    "humans.md",
]

HEAD_END_RE = re.compile(rb"</head>", re.IGNORECASE)
HTML_SUFFIXES = (".html", ".htm", ".astro")


def _is_html(path: str) -> bool:
    return path.endswith("/") or path.endswith(HTML_SUFFIXES)


def _hash_local(path: Path) -> str:
    """sha256 over the file's bytes, with HTML normalization for ``.html`` files."""
    raw = path.read_bytes()
    if path.suffix in HTML_SUFFIXES:
        m = HEAD_END_RE.search(raw)
        if m:
            raw = raw[m.end():]
    return hashlib.sha256(raw).hexdigest()


def _hash_remote(url: str, timeout: float = 8.0) -> tuple[int, str]:
    """Fetch URL via urllib.request, hash the body, return (status, hexdigest)."""
    req = Request(url, headers={"User-Agent": "live-vs-offline/0.2"})
    with contextlib.closing(urlopen(req, timeout=timeout)) as resp:
        body = resp.read()
        status = resp.status
        # If the URL ends in HTML, normalize same way as the local side.
        if url.endswith(HTML_SUFFIXES) or url.endswith("/"):
            m = HEAD_END_RE.search(body)
            if m:
                body = body[m.end():]
    return status, hashlib.sha256(body).hexdigest()


def _live_url_for(path: str, live: str) -> str:
    """Map a repo-relative path to a live URL.

    Astro with ``trailingSlash: always`` renders content files at
    ``/<stem>/index.html``, so ``src/content/about.md`` -> ``/about/``.
    """
    # ``src/pages/index.astro`` -> ``/`` (Astro root)
    if path == "src/pages/index.astro":
        return urljoin(live, "/")
    # ``src/content/about.md`` -> ``/about/`` (Astro trailingSlash route)
    if path.startswith("src/content/"):
        rel = path[len("src/content/"):]
        stem = Path(rel).stem
        return urljoin(live, "/" + stem + "/")
    # Otherwise treat as a ``dist/``-relative URL asset (e.g. ``humans.md``).
    return urljoin(live, "/" + path.lstrip("/"))


def _local_path_for(dist: Path, repo_path: str) -> Path:
    """Map a repo-relative path to a ``dist/`` filesystem path."""
    if repo_path == "src/pages/index.astro":
        return dist / "index.html"
    if repo_path.startswith("src/content/"):
        rel = repo_path[len("src/content/"):]
        # Astro renders content files at /<stem>/index.html with
        # trailingSlash: always. Fall back to /<rel> if that doesn't exist.
        stem = Path(rel).stem
        candidate = dist / stem / "index.html"
        if candidate.exists():
            return candidate
    return dist / Path(repo_path).name


def _dist_label(dist: Path) -> str:
    """Return a repo-relative path string for ``dist`` if possible, else absolute."""
    try:
        return str(dist.resolve().relative_to(REPO_ROOT))
    except ValueError:
        return str(dist)


def diff_paths(paths: Iterable[str], live: str, dist: Path, timeout: float) -> dict:
    report = {
        "live": live,
        "dist": _dist_label(dist),
        "paths": [],
        "drift_count": 0,
        "errors": [],
    }
    for repo_path in paths:
        local = _local_path_for(dist, repo_path)
        live_url = _live_url_for(repo_path, live)
        row = {
            "path": repo_path,
            "live_url": live_url,
            "local_path": str(local),
            "match": False,
        }
        if not local.exists():
            row["error"] = f"offline missing {local}"
            report["errors"].append(row["error"])
            report["drift_count"] += 1
            report["paths"].append(row)
            continue
        try:
            local_h = _hash_local(local)
        except OSError as exc:
            row["error"] = f"local read error: {exc}"
            report["errors"].append(row["error"])
            report["drift_count"] += 1
            report["paths"].append(row)
            continue
        try:
            status, remote_h = _hash_remote(live_url, timeout=timeout)
        except Exception as exc:  # noqa: BLE001
            row["error"] = f"live fetch error: {exc.__class__.__name__}: {exc}"
            report["errors"].append(row["error"])
            report["drift_count"] += 1
            report["paths"].append(row)
            continue
        row["local_hash"] = local_h
        row["remote_hash"] = remote_h
        row["status"] = status
        row["match"] = local_h == remote_h
        if not row["match"]:
            report["drift_count"] += 1
        report["paths"].append(row)
    return report


def _print_report(report: dict) -> None:
    print(f"live_vs_offline: live={report['live']} dist={report['dist']}")
    for row in report["paths"]:
        tag = "OK " if row["match"] else "X  "
        print(
            f"  [{tag}] {row['path']:<30} "
            f"local={row.get('local_hash', '-')[:12]:<12} "
            f"remote={row.get('remote_hash', '-')[:12]:<12} "
            f"status={row.get('status', '-')} "
            + (f"({row.get('error', '')})" if row.get("error") else "")
        )
    if report["errors"]:
        print("errors:")
        for e in report["errors"]:
            print(f"  - {e}")
    print(f"drift_count={report['drift_count']}")


def _self_test() -> int:
    """Mock offline dist + mock live server; force a 1/3 drift; expect exit code."""
    with tempfile.TemporaryDirectory() as td:
        td = Path(td)
        # Build a 3-file offline dist: index.html, about/index.html, humans.md.
        (td / "index.html").write_bytes(
            b"<html><head>CF_INJECT</head><body>home-offline</body></html>"
        )
        about = td / "about"
        about.mkdir()
        (about / "index.html").write_bytes(
            b"<html><head></head><body>about-offline</body></html>"
        )
        (td / "humans.md").write_bytes(b"# humans\ncontact: cf-mirror@test\n")

        # Build a "live" copy with one drift (index.html body differs).
        live_root = td / "live_twisted"
        live_root.mkdir()
        (live_root / "index.html").write_bytes(
            b"<html><head>CF_INJECT</head><body>home-live</body></html>"
        )
        live_about = live_root / "about"
        live_about.mkdir()
        (live_about / "index.html").write_bytes(
            b"<html><head></head><body>about-offline</body></html>"
        )
        (live_root / "humans.md").write_bytes(b"# humans\ncontact: cf-mirror@test\n")

        # Spin up a tiny HTTP server on an ephemeral port to serve ``live_root``.
        class Handler(http.server.SimpleHTTPRequestHandler):
            def __init__(self, *args, **kwargs):  # noqa: D401
                super().__init__(*args, directory=str(live_root), **kwargs)

            def log_message(self, *_a, **_kw):  # noqa: D401
                pass

        with socketserver.TCPServer(("127.0.0.1", 0), Handler) as srv:
            port = srv.server_address[1]
            threading.Thread(target=srv.serve_forever, daemon=True).start()
            try:
                live_url = f"http://127.0.0.1:{port}"
                paths = ["src/pages/index.astro", "src/content/about.md", "humans.md"]
                report = diff_paths(paths, live_url, td, timeout=5.0)
            finally:
                srv.shutdown()
                srv.server_close()

        # Sanity: index.astro drifts; about.md matches; humans.md matches.
        by_path = {row["path"]: row for row in report["paths"]}
        if by_path["src/pages/index.astro"]["match"]:
            print(
                "FAIL self-test: index.astro drift expected (offline body != live body)",
                file=sys.stderr,
            )
            return 1
        if not by_path["src/content/about.md"]["match"]:
            print(
                f"FAIL self-test: about.md expected to match, got {by_path['src/content/about.md']}",
                file=sys.stderr,
            )
            return 1
        if not by_path["humans.md"]["match"]:
            print(
                f"FAIL self-test: humans.md expected to match, got {by_path['humans.md']}",
                file=sys.stderr,
            )
            return 1

    print("live_vs_offline --self-test: 2/3 match, 1/3 drift detected; mock live server OK")
    return 0


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Compare local dist/ to the live Cloudflare Pages URL."
    )
    parser.add_argument("--dist", type=Path, default=DEFAULT_DIST)
    parser.add_argument("--live", default=DEFAULT_LIVE)
    parser.add_argument(
        "--paths",
        nargs="+",
        default=DEFAULT_PATHS,
        help="repo-relative paths to diff (default: index.astro, about.md, humans.md)",
    )
    parser.add_argument("--timeout", type=float, default=8.0)
    parser.add_argument("--dry-run", action="store_true", help="report only; exit 0")
    parser.add_argument("--json", action="store_true", help="emit JSON result")
    parser.add_argument("--self-test", action="store_true")
    args = parser.parse_args()

    if args.self_test:
        return _self_test()

    if not args.dist.exists():
        print(f"live_vs_offline: dist/ not found at {args.dist}", file=sys.stderr)
        return 1

    report = diff_paths(args.paths, args.live, args.dist, timeout=args.timeout)

    if args.json:
        print(json.dumps(report, indent=2))
    else:
        _print_report(report)

    if args.dry_run:
        return 0
    return 0 if report["drift_count"] == 0 else 1


if __name__ == "__main__":
    sys.exit(main())