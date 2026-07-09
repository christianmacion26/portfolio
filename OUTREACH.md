# Outreach & monitoring — Day 10 baseline

Status: portfolio v3.6 (Delta 8–10 in place).  
This document tracks the **state of the world as of 2026-07-09** and the
operational items that gate the next outreach push.

## 1. Site assets shipped (Deltas 1–10)

| Delta | Surface                  | What changed                                                                 |
| ----- | ------------------------ | ---------------------------------------------------------------------------- |
| 1     | build                    | Astro 7 upgrade + new deps (katex, sitemap, mdx)                             |
| 2     | global                   | WCAG AA contrast — all text-bearing tokens ≥4.5:1                            |
| 3     | `/`                      | Hero rebuild (H-R-T: Headline / Result / Tooltip)                            |
| 4     | `/`                      | Stat row — 4 real numerals + sparkline on gates                              |
| 5     | `/proof`                 | 5 proof cards lead (3 new code artifacts)                                    |
| 6     | `/publications`          | AQR-style research archive (group by year, topic filter)                     |
| 7     | `/`                      | AI engineering process strip (5-step loop)                                   |
| 8     | `/experience`, `/skills` | NDA-safe callout · 5-dot proficiency bars + years of practice                |
| 9     | global                   | Trust signals (TrustStrip) · Atom feed · JSON-LD (Person+WebSite+ItemList)   |
| 10    | `/chat`                  | Client-side TF-IDF RAG over 33-chunk corpus (frontmatter + body + solutions) |

Build: `npm run build` → 33 static pages, 1 sitemap, 1 Atom feed.
Bundle: chat-page inline JS ≈ 3.5 KB minified (RAG index in the same payload as the corpus).

## 2. Quantitative metrics (verifiable, public)

These are the headline numbers that the rest of the portfolio proves up. They
are the four numbers on the home page stat row.

- `9` quant projects (all public-data reproducible, public repo per project).
- `31` statistical eval gates (G1–G31; declared before any number published).
- `5` asset classes covered.
- `100%` NDA-clean (no proprietary data sources; 19V Capital = closed past contract).

Skill matrix: 36 skills across 3 domains (AI / Quant / Tools), 100% self-rated.
Production-grade (L5): 8 skills. The full /skills page is the source of truth.

## 3. Outreach channels (Day-10 plan)

Three channels, in order of expected signal-per-effort:

### 3.1 Direct outreach to QR/AI hiring managers

- 5–10 warm intros/week via LinkedIn (search: "Quant Researcher hiring" +
  "Digos City remote" excluded; target: NY/London/Singapore remote-first shops).
- Hand-attach the resume tailored to the role (one of three flavours:
  resume-ai-only.pdf / resume-quant-onepage.pdf / resume-tailored.pdf).
- Follow up at T+5d with a pointer to a specific project that matches the JD.

### 3.2 Visible-content passive channel

- LinkedIn / Medium cross-posts of /publications and /projects (1 per week).
- Pin a single canonical link in the LinkedIn featured slot
  (https://christianmacion26.github.io/portfolio/).

### 3.3 Inbound (read by the agents above)

- Atom feed at `/feed.xml` — auto-discoverable from `<link rel="alternate">` in
  BaseLayout. Submit to NetNewsWire / Feedly public feed catalogues if
  applicable.
- JSON-LD `WebSite` + `SearchAction` block is now valid; Knowledge-Graph
  ingestion (when it happens) will pick up `Person.knowsAbout` and
  `Person.alumniOf`.

## 4. Monitoring baseline

CI signals (already shipped in `.github/workflows/`):

- **ci.yml** — typecheck (advisory), lint, format, md, dead, secrets.
- **deploy.yml** — `npm run build` + NDA audit + Pages deploy.
- **lighthouse.yml** (Day 10) — weekly perf / a11y / SEO / best-practices on
  the deployed site. Accessibility is the only hard error (≥0.95); performance
  and best-practices are warnings.

Operational signals to watch:

- **Build failure** — Pages deploy halts; first PR to fail CI = first to fix.
- **Lighthouse a11y** — the WCAG AA bar is the floor; a regression here breaks
  the portfolio's senior/quant positioning (you cannot ship a "trust signals"
  page that fails its own contrast gate).
- **Lighthouse SEO** — schema.org / meta / canonical regression = drop in
  Knowledge-Graph uptake.

## 5. What to NOT do (negative priors)

- Do not claim current employment at 19V Capital or any NDA-protected employer.
  Always frame as closed past contract with publicly-attributable PM of record
  (Evan Ferioli for 19V).
- Do not state proprietary data sources, strategy internals, or desk PnL.
- Do not refer to portfolio site in the senior "Junior QR" voice — always
  "Quant Researcher" or "QR-rotational" when describing a seat being applied
  for.
- Do not auto-delete education-history folders during any disk cleanup; the
  `~/Documents/Usep/` loss of 2026-07-09 is the cautionary tale.

## 6. Next steps (post-Day-10)

1. Run lighthouse on local build, capture baseline numbers, store in
   `LIGHTHOUSE-BASELINE.md` next to this file.
2. Wire `/chat` query logs (with explicit consent / opt-in) to a tiny
   serverless endpoint for a 30-day corpus-coverage report.
3. First outreach push: 5 intros, target 2 interviews by 2026-07-23.
