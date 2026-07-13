# Portfolio NDA Scope (per-workspace typed memory)

**Workspace:** `Contingency/christianmacion.github.io`
**Effective:** 2026-07-10 (Wave-2 dispatch, Agent 1.3)
**Complements:** `~/.claude/projects/-Users-christianmacion/memory/twentyv-conflict.md`,
`portfolio-positioning-level.md`, `baseline-truths.md` (user-level globals).

This file pins three typed rules that any artifact generated for _this_
workspace must satisfy before it leaves the repo. Every rule is lintable
in principle; review each one before shipping copy, screenshots, or
generated JSON.

---

## Rules

### 1. Employer ID — no current-employment claims

> **Never name 19V Capital or any other NDA employer as current employment.**

Only **closed past contracts** with disclosed end-dates are admissible.
Phrasings like "Currently at 19V Capital", "Active contract with Macion
Capital", "Working at [NDA desk]" are forbidden. Acceptable framing:

- "systematic-strategy desk (NDA-protected; closed past contract 03/2026 – 06/2026)"
- "Contract researcher — 19V Capital — Mar 2026 to Jun 2026"
- "[role], 2024 – 2025"

If an artifact needs an employer name, the date range must be **closed**
(≤ today is required; `Present`, `Currently`, `Active`, `Now`, and
`_year_xxx` are all banned as end-dates for employer rows).

Lintable via `src/utils/nda-audit.ts` (`employer.id` rule).

### 2. Premise — senior QR tone only

> **Senior Quant Researcher copy only; QR-rotational only when describing a seat being applied for.**

The portfolio's public-facing voice reads **senior Quant Researcher +
AI Engineer**. Forbidden terms in public copy:

- `Junior QR`, `apprentice`, `intern`, `aspiring`, `entry-level`,
  `learning`, `trying to break into`.

Permitted contexts for `QR-rotational`:

- A job-application seat description (e.g. "applied for the QR-rotational
  seat at Acme Capital — Q3 2026").
- An internal-only note explicitly marked `[INTERNAL]`.

Otherwise: write as a senior practitioner with verifiable artifacts
behind every claim. See `portfolio-positioning-level.md` for the
canonical voice examples.

Lintable via manual copy review + `premise.role` row in
`src/utils/nda-audit.ts`.

### 3. Artifact scope — no Macion Capital counsel-only material

> **Macion Capital counsel-only materials (legal/institutional pitch audit) MUST NOT appear in any artifact generated for this workspace.**

The Macion Capital skills (`ph-funds-legal-review`, `ph-securities-claims-review`,
`ph-tax-compliance`, `institutional-pitch-auditor`, etc.) produce counsel-only
artifacts under the `Macion Capital/` workspace. Those artifacts — contracts,
IC memos, LP data, securities-claims reviews, tax-compliance opinions,
institutional pitch audits — MUST NOT be referenced, quoted, summarized, or
linked from anything generated for _this_ portfolio workspace.

Concretely forbidden surfaces:

- Any `.astro`, `.md`, `.mdx` page or component under `src/`.
- Any script output (`dist/scorecards.json`, `dist/sitemap*.xml`,
  `dist/llms*.txt`, screenshots).
- Any `_research/`, `.audit/`, `tools/`, `scripts/` file.
- Any `_pagefind/` index entry.

If a generation step needs legal / institutional content, route it back
to the `Macion Capital/` workspace; do not stage it here even as
`work-in-progress`. Reviewers will reject any artifact whose diff touches
counsel-only material.

Lintable via manual diff review + NDA-audit keyword filter (the audit
dictionary does not yet enumerate every Macion Capital skill name; if
you find a leak, add it to `nda-audit.ts` before merging).

---

## How these rules surface in the built tools

| Tool                                         | Rule 1 | Rule 2  | Rule 3 |
| -------------------------------------------- | :----: | :-----: | :----: |
| `tools/check_no_hard_paths.sh`               |   —    |    —    |   —    |
| `tools/scorecard_aggregator.py`              |   —    |    —    |   —    |
| `tools/live_vs_offline.py`                   |   —    |    —    |   —    |
| `src/utils/nda-audit.ts` (CI)                |   X    | partial |   X    |
| Operator copy review (manual)                |   X    |    X    |   X    |
| Pre-deploy `wrangler pages deploy` checklist |   X    |    X    |   X    |

The three tools above are _content-shaping_ utilities — they move bytes
but do not, on their own, enforce the three typed rules. The rule
enforcement is upstream (writer / aggregator input) and downstream
(`nda-audit.ts` + manual review).

---

_End of portfolio-nda-scope.md._
