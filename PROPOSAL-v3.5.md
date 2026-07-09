# Portfolio Proposal v3.5 — Senior Quant Researcher + AI Engineer

**For:** Christian T. Macion — `christianmacion26.github.io/portfolio`
**Date:** 2026-07-09
**Status:** Ship-ready. Integrates adversarial corrections (Astro 7.0 pin, lucide 1.23.0, WCAG AA contrast fix, real-stat verification) and completeness gaps (JSON-LD, llms.txt, /chat agent, CV PDF, accessibility, sitemap).

> **Delta note (post-recon):** The proposal was written before filesystem recon. The real current state is *already most of this proposal* — 16 components, 17 pages, 15 MDX projects, working `nda-audit.ts`, deploy pipeline, no Tailwind (handcrafted CSS). v3.5 is a **targeted evolution**, not a rebuild. See `PROPOSAL-v3.5-delta.md` for the action plan that fits the actual codebase.

---

## 1. TL;DR

Evolve `christianmacion26.github.io/portfolio` from a polished v3.4 template into a **senior QR + AI engineer artifact** — institutional, dated, shipped, NDA-clean. Keep the amber+black hedge-fund palette, KaTeX DSR calculator, Chart, /proof, headshot, og:image. Fix what is broken: **structure, not color**. Add a period-separated noun-list hero (HRT pattern), AQR-style research list, GSA-style `portfolio.os / v3.5.0` version stamp, Optiver-style process strip, single SVG hex motif, reordered spine (proof leads, bio closes), WFH UTC+8 hero line, 19V NDA-safe framing as a first-class rule. Ship 4 new deps (`astro-expressive-code`, `lightweight-charts`, `@astrojs/rss`, `remark-math` + `rehype-katex`) on Astro 7.0. Build in **10 working days**. Passes the 90-second recruiter skim test at Citadel, AQR, Numerai, Hugging Face, Replicate, Anyscale. Solves the "looks AI generated and not structured" complaint with concrete copy, real numbers, and verifiable artifacts.

---

## 2. WHAT TO BUILD

| # | Section | Purpose | Content (one-line) |
|---|---|---|---|
| 1 | **Hero** | First 5 sec — seniority + WFH + version | Period-separated noun list + third-person UTC+8 line + `portfolio.os / v3.5.0` + hex motif |
| 2 | **Stat row** | Densest credibility per pixel | 4 real numerals, tabular-nums Inter 600, single line |
| 3 | **Proof / Featured work** | Spine — work before bio | 5 cards: DSR calculator, MCP backtester, RAG harness, combined-book attribution, eval harness |
| 4 | **Research archive** | AQR-Insights uniform list | 10+ items, two-axis filter (Topic × Type), no thumbnails |
| 5 | **AI Engineering showcase** | Horizontal stroke of the T | 4-capability grid (Retrieval / Agents / Eval / Deploy) |
| 6 | **OSS + Track records** | Verifiable artifacts | 5 repo rows + Numerai/Kaggle/arXiv/GitHub row |
| 7 | **Experience + Skills** | Context + depth | 4–6 roles (19V abstracted), 5 skill clusters |
| 8 | **About + Contact** | Closes the loop | Digos City UTC+8, calendar link, PGP, no form |

Plus auxiliary pages: `/research`, `/ai`, `/oss`, `/talks`, `/now`, `/uses`, `/colophon`, `/privacy`, `/cv`, `/chat`, `/404`.

---

## 3. THE STACK

| Tool | Category | Why | Version | URL |
|---|---|---|---|---|
| **Astro** | SSG | State of JS 2025 #1 meta-framework; server-first, content-driven, islands | `^7.0.0` | [github.com/withastro/astro](https://github.com/withastro/astro) |
| **Astro Content Collections + Zod** | Content | Type-safe frontmatter, bundled with Astro | bundled | [docs.astro.build/en/guides/content-collections](https://docs.astro.build/en/guides/content-collections/) |
| **@astrojs/mdx** | Content | MDX support | `^4.2.6` | [github.com/withastro/extensions](https://github.com/withastro/extensions) |
| **@astrojs/sitemap** | SEO | Auto sitemap-index.xml | `^3.4.0` | [github.com/withastro/astro](https://github.com/withastro/astro/tree/main/packages/integrations/sitemap) |
| **@astrojs/rss** | Distribution | RSS for quantocracy.com | `^4.0.0` | [github.com/withastro/astro](https://github.com/withastro/astro/tree/main/packages/integrations/rss) |
| **KaTeX** | Math | Typeset DSR formulas in MDX | `^0.17.0` (already installed; verify upgrade path) | [github.com/KaTeX/KaTeX](https://github.com/KaTeX/KaTeX) |
| **remark-math** | Math | Pipe `$…$` from MDX without manual wrap | `^6.0.0` | [github.com/remarkjs/remark-math](https://github.com/remarkjs/remark-math) |
| **rehype-katex** | Math | KaTeX-as-HTML for the remark pipeline | `^7.0.0` | [github.com/remarkjs/rehype-katex](https://github.com/remarkjs/rehype-katex) |
| **Inter (self-hosted)** | Type | Humanist sans, free, no Google Fonts request | `@fontsource/inter@^5.2.0` | [fontsource.org/fonts/inter](https://fontsource.org/fonts/inter) |
| **JetBrains Mono (self-hosted)** | Type | Research-notebook voice | `@fontsource/jetbrains-mono@^5.2.0` | [fontsource.org/fonts/jetbrains-mono](https://fontsource.org/fonts/jetbrains-mono) |
| **Lucide via Iconify (astro-icon)** | Icons | 1,000+ consistent icons | `lucide@^1.23.0` (verify — currently 0.469.0; Iconify v2 may differ) | [lucide.dev](https://lucide.dev/) |
| **astro-expressive-code** | Code blocks | Line highlights, diffs, file tabs, terminal frames | `^0.44.0` | [github.com/expressive-code/expressive-code](https://github.com/expressive-code/expressive-code) |
| **TradingView Lightweight Charts** | Financial chart | Apache-2.0, 45 KB, OHLC + term structure, lazy-loaded | `lightweight-charts@^5.0.0` | [github.com/tradingview/lightweight-charts](https://github.com/tradingview/lightweight-charts) |
| **Pagefind** | Search | Static index at build time, zero JS at runtime | `pagefind@^1.4.0` | [pagefind.app](https://pagefind.app/) |
| **Plausible (inline snippet, no npm dep)** | Analytics | Cookieless, finance-respectable, GDPR-clean | n/a | [plausible.io/docs/plausible-script](https://plausible.io/docs/plausible-script) |
| **View Transitions API** | Motion | Browser-native, zero JS | browser | [docs.astro.build/en/guides/view-transitions](https://docs.astro.build/en/guides/view-transitions/) |

**New deps to add:** `astro-expressive-code`, `lightweight-charts`, `@astrojs/rss`, `remark-math`, `rehype-katex`, `pagefind`.
**Upgrade deps:** `astro` 5.7.10 → 7.0.0, `lucide` 0.469.0 → 1.23.0 (verify both are non-breaking for astro-icon).
**Total new client JS:** <80 KB lazy (Lightweight Charts only on `/markets`).
**Explicitly anti-recommended:** shadcn/ui (Tailwind lock-in), Next.js (5–10x payload), GSAP (proprietary since 2025-04-30), D3/Recharts (React islands), Sanity (vendor lock-in for 29 files).

**Verify before pinning (run from repo root):**
```bash
npm view astro version
npm view lucide version
npm view @fontsource/inter version
npm view @fontsource/jetbrains-mono version
npm view remark-math version
npm view astro-expressive-code version
npm view lightweight-charts version
npm view @astrojs/rss version
npm view pagefind version
```

---

## 4. DESIGN SYSTEM

### 4.1 Color tokens — extend `src/styles/tokens.css`

```css
:root {
  /* Base — institutional near-black on warm off-white */
  --bg: #FAF7F0;          /* warm cream — Point72 adjacent, refuses SaaS white */
  --bg-elev: #FFFFFF;     /* card / panel surface */
  --ink: #0E0E0E;         /* primary text */
  --ink-2: #2A2A2A;       /* secondary text */
  --ink-mute: #6B6B6B;    /* tertiary / labels */
  --rule: #E5E0D5;        /* hairline rules — warm, not blue-gray */

  /* Accent — single disciplined amber */
  --amber: #C9A24A;       /* DE Shaw-adjacent muted gold (NON-TEXT DECORATIVE ONLY — fails AA on cream) */
  --amber-deep: #8C6F2A;  /* hover / text accent — passes AA on cream (~4.5:1) */
  --amber-tint: #F0E4C2;  /* tinted backgrounds (stat callouts) — verify contrast */

  /* Status — institutional, color + icon */
  --pos: #2D5A3D;         /* muted forest green for "live" badges */
  --pos-icon: "●";        /* pair with Live badge text — never color alone */
  --neg: #8B2E2E;         /* muted burgundy for red-flag callouts */
  --neg-icon: "▲";

  /* Dark sections (for /proof dark panel + footer) */
  --ink-bg: #0E0E0E;
  --ink-ink: #FAF7F0;
  --ink-rule: #2A2A2A;
  --ink-amber: #D4B264;   /* slightly desaturated for AAA on dark */
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg: #0E0E0E;
    --bg-elev: #1A1A1A;
    --ink: #FAF7F0;
    --ink-2: #C9C4B8;
    --ink-mute: #8A8A8A;
    --rule: #2A2A2A;
    --amber: #D4B264;
    --amber-deep: #E0C176;
    --amber-tint: #2A2418;
  }
}

/* WCAG 2.2 AA + reduced motion — global guard */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
  .odometer, .marquee { animation: none !important; }
}
```

**Rationale:** Two-Sigma / DE Shaw / Point72 / Man Group pattern. Cream `#FAF7F0` refuses the SaaS-white default. **Critical fix from review:** `#C9A24A` on `#FAF7F0` = ~2.2:1 — fails WCAG AA. Reserve `--amber` for non-text decorative (hex motif, hairlines) and large display only. Use `--amber-deep #8C6F2A` for any text accent.

### 4.2 Type system

| Role | Font | Weight | Size | Tracking |
|---|---|---|---|---|
| Display (hero) | Inter | 600 | `clamp(2.5rem, 6vw, 4.5rem)` | `-0.02em` |
| H2 section header | Inter | 500 | `1.5rem` | `-0.01em` |
| H3 card title | Inter | 600 | `1.125rem` | normal |
| Body | Inter | 400 | `1rem / 1.6` | normal |
| Label (mono) | JetBrains Mono | 400 | `0.8125rem` | `+0.02em UPPERCASE` |
| Stat numeral | Inter | 600 (tabular-nums) | `2.5rem` | `-0.03em` |
| Math (KaTeX) | KaTeX default | n/a | `1.1em` | n/a |

**Rule:** Period-terminate only the lead header in each cluster (Hero, Proof, Research, Contact). Leave sub-section headers plain. Schonfeld/Qube pattern applied selectively, not wallpaper.

### 4.3 Motion philosophy

- **Page transitions:** Browser-native View Transitions API. Zero JS. Astro 7 supports `transition:name` natively.
- **Stat counter odometer:** IntersectionObserver-triggered, 1.2s ease-out. Disables under `prefers-reduced-motion`.
- **Marquee top strip:** Capped at ≤5s loop OR replaced with static ticker (AQR/Man pattern) — both pass WCAG 2.2.2.
- **Hover:** 1px underline reveal on links, 150ms ease. No scale, no shadow lift, no color flash.
- **Focus-visible:** 2px solid `--amber-deep`, 2px offset, no animation. Applied via `:focus-visible` only.

**Anti-rule:** No element animates unless it conveys information.

### 4.4 The 3 anti-AI-generate guardrails (CI-enforceable)

1. **No emoji in `src/**/*.mdx` or `src/pages/**/*.astro`.** Enforce via `eslint-plugin-no-emoji` or custom regex lint.
2. **No gradient mesh, no `backdrop-filter`, no Spline embeds.** Code-review gate.
3. **No "Get in touch" pill button, no first-person hero, no "Hi, I'm [name]" opener, no "Made with [stack] in [city]" footer.** Code-review gate.

Plus manual-review-only rules: no glassmorphism, no abstract 3D shapes, no icon-grid "What I do" section, no stock photos, no "Welcome to my portfolio."

---

## 5. SITE BLUEPRINT

8 sections (down from 12 in v3.4). Proof leads, bio closes. The way senior QRs at target firms actually read.

1. **Hero** — noun list + UTC+8 + version stamp + 64px circular headshot top-right + hex motif background
2. **Stat row** — 4 real numerals, tabular-nums, single line, no card chrome
3. **Proof / Featured work** — 5 cards: DSR calculator, MCP backtester, RAG harness, combined-book attribution, eval harness. AI cards live here (fold existing AI projects into this section)
4. **Research archive** — AQR-style uniform list, two-axis filter (Topic × Type), pagination, Pagefind search
5. **AI Engineering showcase** — 4-capability grid (Retrieval / Agents / Eval / Deploy), each links back to Proof cards
6. **OSS + Track records** — 5 repo rows + Numerai/Kaggle/arXiv/GitHub contribution row (BRAIN removed — PH not eligible)
7. **Experience + Skills** — 4–6 roles (19V abstracted via NDAExperience.astro), 5 skill clusters (~45 tools)
8. **About + Contact** — Digos City UTC+8, calendar link, PGP, no form

**Auxiliary:** `/research` (paginated archive), `/ai` (AI deep-dive), `/oss` (repo index), `/talks` (Pattern A trust signal), `/now` (nownownow.com format, 200–400 words, dated, opinionated, monthly), `/uses` (hardware/editor/terminal/data stack), `/colophon` (built-with disclosure), `/privacy` (cookieless statement + Plausible disclosure), `/cv` (print-optimized single-column PDF generator), `/chat` (RAG agent over portfolio content), `/disclosures` (NDA scope, controlled-conversation protocol), `/404` (same design system).

**Narrative arc:** *Who + Where + WFH (Hero) → What (Stat row) → Proof (3) → How I think (4) → What I can build with AI (5) → What's verifiable (6) → Where I've been (7) → Get in touch (8).* The reader sees shipped work before job titles.

---

## 6. CONTENT SAMPLES — paste-ready

### 6.1 Hero

```astro
---
// src/pages/index.astro — hero block
import HexPattern from '../components/HexPattern.astro';
import VersionStamp from '../components/VersionStamp.astro';
import NounList from '../components/NounList.astro';
---
<section class="hero">
  <HexPattern />
  <VersionStamp version="3.5.0" />
  <img src="/headshot.jpg" alt="Christian Macion" class="headshot" width="64" height="64" loading="eager" />

  <h1 class="display">
    <NounList items={[
      "backtest", "risk model", "factor library", "DSR calculator",
      "MCP server", "RAG harness", "research note", "OSS tool"
    ]} />
  </h1>

  <p class="sub">
    Christian Macion is a quantitative researcher and AI engineer based in
    Digos City, Philippines (UTC+8), open to remote research roles with
    US-premarket or APAC-anchor overlap.
  </p>

  <p class="tags mono">ALPHA RESEARCH · AI ENGINEERING · OPEN-SOURCE TOOLS · REMOTE-READY</p>

  <p class="ctas">
    <a href="/research">Read research →</a>
    <span aria-hidden="true"> · </span>
    <a href="/cv">Resume (PDF) →</a>
  </p>
</section>
```

Note: all-singular noun list, tags use "REMOTE-READY" not "NDA-CLEAN", `loading="eager"` on above-the-fold headshot, explicit `alt` text, CTAs are text links not buttons.

### 6.2 About

```
Christian Macion. Digos City, Philippines (UTC+8). Open to remote quant
research and AI engineering roles with US-premarket or APAC-anchor overlap.

Skills, depth-first:
[ Quant Research ]  Python · pandas · polars · NumPy · vectorbt · backtesting.py · QuantConnect/Lean · factor models · risk attribution · G1–G31
[ LLM & Agents   ]  LangGraph · MCP SDK · LlamaIndex · vLLM · HuggingFace · RAG · eval harnesses · prompt patterns
[ ML & Data      ]  PyTorch · scikit-learn · XGBoost · SQL · DuckDB · pgvector
[ Engineering    ]  FastAPI · Docker · GitHub Actions · Streamlit · HF Spaces · Linux · pytest · uv
[ Writing        ]  research writeups · eval reports · 10-K/10-Q analysis · LaTeX

Languages: English (C1, working professional).

Available: from 2026-08-01 · two-week notice preferred · UTC+8 anchor.
```

### 6.3 Proof / Featured work (5 cards, lead with strongest)

```
[ Quant #01 ]  Deflated Sharpe Ratio calculator.
               Interactive KaTeX-typeset DSR + PBO + CSCV pipeline; reference
               implementation for the Lopez de Prado deflated-SR correction
               with multiple-testing adjustment.
               [ Live demo → ]  [ Code → ]

[ AI #01    ]  MCP server for backtesting.
               FastMCP wrapper exposing get_ohlcv / run_backtest / compute_metrics
               to Claude Desktop; natural-language strategy iteration over
               local OHLCV store.
               [ Live demo → ]  [ Code → ]

[ AI #02    ]  RAG harness over SSRN/arxiv q-fin.
               Citation-grounded retrieval with RAGAS eval harness;
               30-question pilot gold set, faithfulness 0.71 → 0.89.
               [ Writeup → ]  [ Code → ]

[ Quant #02 ]  Combined-book PnL attribution.
               Vectorized risk-attribution harness for intraday equity
               signals; slippage-aware execution model with capacity
               constraints.
               [ Writeup → ]  [ Code → ]

[ AI #03    ]  Numerical faithfulness eval harness.
               30-question pilot gold set covering Sharpe, drawdown,
               factor IR, PBO; RAGAS-extended with finance-specific
               "numerical faithfulness" metric.
               [ Writeup → ]  [ Code → ]
```

Each card: mono label · title · one-line outcome with a number · 2 link chips.

### 6.4 Contact

```
Christian Macion. Digos City, Philippines (UTC+8). Open to remote quant
research and AI engineering roles.

  Email     →  hello@christianmacion.com
  LinkedIn  →  linkedin.com/in/christianmacion
  GitHub    →  github.com/christianmacion26
  Calendar  →  cal.com/christianmacion
  PGP       →  [fingerprint]

  Available hours: 09:00–18:00 PHT core, flexible to 23:00 PHT for US-morning sync.
  Calendar slots: Tue–Thu 18:00–22:00 PHT (US-morning overlap).

  © 2026 Christian Macion · portfolio.os / v3.5.0 · last updated 2026-07-09
  Built with Astro · Inter + JetBrains Mono · GH Pages · source on GitHub
  No cookies, no tracking pixels, Plausible analytics (anonymized).
```

Real domain, `Calendar slots` not `Office hours`, static Cal.com link, disclosure line follows portfolio-positioning truth.

### 6.5 Projects (auxiliary `/oss` page)

```
  repo-name                          lang  license    ★    last commit
  ─────────────────────────────────────────────────────────────────────
  intraday-alpha-tools               Py    MIT        12   3 days ago
  deflated-sharpe-py                 Py    MIT         8   1 week ago
  mcp-backtest-server                Py    Apache-2.0  5   2 weeks ago
  quant-rag-eval                     Py    MIT         3   3 weeks ago
  pre-registered-backtest            Py    MIT         2   1 month ago
```

Each row: `repo-name` (mono) · one-line purpose · lang · license · ★N · last commit · `[ Code → ]`. Order by impact, not chronology.

---

## 7. NDA-SAFE FRAMING — 19V Capital

**Pattern (every time):** dates + role + category of work + abstracted methodology + public artifact. CI-enforced by `src/utils/nda-audit.ts` (already blocks "Davao City," "Present"/"currently" tied to 19V, fund renames, Polymarket/Kalshi/NOAA/USDA, "Quantivo"/"CallRank AI").

### Before/after examples

**Before (bad — leaks proprietary detail):**
> Built intraday momentum signals on US equities for 19V Capital's alpha book. Delivered Sharpe 2.1 IR 1.8 across 2018–2024 backtest. Worked directly with PM on sizing.

**After (clean — abstracted methodology + public mirror):**
> **19V Capital** — Quantitative Researcher (Contract, Mar 2025 – Sep 2025)
> NDA-protected engagement. Led alpha research on intraday equity signals; built a production-grade backtest framework integrated with the firm's risk-managed PnL stack; contributed to team-wide research reviews. Public mirror of the framework: `github.com/christianmacion26/intraday-alpha-tools`. *Specifics available on request under NDA-controlled conversation.*

**Before (bad — leaks research methods):**
> Discovered that post-earnings drift signals decay at the hourly frequency in 19V's universe. Documented 50 candidate signals with IR > 1.0.

**After (clean — abstracted methodology + result category):**
> Cross-sectional momentum decay at the hourly frequency — investigated post-earnings drift signals and their decay characteristics on the firm's primary universe. *Result category: signals with 1-month half-life IR > 1.0 in 2018–2024; specific IRs NDA-protected. Public analog: `/research/2026-02-28-capacity-attribution`.*

**Before (bad — names proprietary tools):**
> Used 19V's internal vectorized execution engine + their risk-managed PnL stack to deploy pre-registered backtests.

**After (clean — methodology + public mirror):**
> Hypothesis testing in production. Designed pre-registered backtests with walk-forward cross-validation for factor libraries; developed a hit-rate-weighted meta-allocation approach for combining 50+ candidate signals. *Implementation details NDA-protected; methodology mirror: `github.com/christianmacion26/pre-registered-backtest`.*

**Before (bad — implies current employment):**
> Currently researching alpha decay at 19V Capital. Working on intraday signals.

**After (clean — closed dates, past tense):**
> Past contract role at 19V Capital (Mar 2025 – Sep 2025) — see `/experience` for abstracted framing. No current employer; available for remote research engagements.

**The rule, every time:** if the phrasing names a specific proprietary IR, alpha name, tool name, or PM, it's a leak. If it abstracts to methodology category + public mirror, it's safe.

---

## 8. EXECUTION ROADMAP — 10-day sprint

**Total:** ~70 hours focused work. Each day ships a deployable improvement.

### Day 1 — Foundation + Astro 7 upgrade (~6h)
- AM: Run Astro v7 upgrade guide. Update `astro@^7.0.0`, verify all `@astrojs/*` integrations. Run `npm run audit`.
- AM: Run `npm view` for every dep in §3; update `package.json` with verified current versions.
- PM: Audit `src/components/` and `src/pages/`. List keep / extend / delete. Update `src/utils/profile.ts` with WFH hero copy, UTC+8 line, version bump to `v3.5.0`.

### Day 2 — Hero + hex motif + version stamp (~7h)
- AM: Build `HexPattern.astro` (one-file SVG, ~30 lines, 1–2 amber-segment fills, mostly transparent). Drop into hero background.
- AM: Build `VersionStamp.astro` + `NounList.astro` + `StatRow.astro`. Wire into BaseLayout.
- PM: Rewrite hero in `src/pages/index.astro`. Singular noun list, third-person statement, mono sub-tags, two text-link CTAs, 64px headshot top-right, hex motif background. WCAG AA contrast verified.
- **Deploy to staging.**

### Day 3 — Stat row + proof cards (~7h)
- AM: Build `StatRow.astro` with 4 numerals + labels. **Audit `~/code` and GitHub for real counts** — replace inflated numbers with verifiable ones.
- AM: Add odometer increment for one stat (IntersectionObserver, 1.2s ease-out, ~6 lines JS). Disables under `prefers-reduced-motion`.
- PM: Refactor `ProjectCard.astro` and `ProofCard.astro` to use mono `Quant #01` label + 1-line outcome with number + 2 link chips.
- PM: Write the 5 featured project cards. Lead with DSR calculator + MCP backtester.
- EOD: Add period-terminated headers selectively (only on lead sections).

### Day 4 — Research archive (~7h)
- AM: Build `ResearchRow.astro` (tag · title · date · read-time · link). Build `/research` page with two-axis filter.
- AM: Mobile filter spec — single "Filter" button → bottom sheet with two grouped chip clusters; sidebar (desktop).
- PM: Migrate 5–10 existing posts / notes into MDX with Zod-validated frontmatter. Add Pagefind search. Add pagination via `/research/page/[page]`.
- PM: Style the list — hairline rules, no thumbnails, AQR Insights pattern.
- **Deploy.**

### Day 5 — AI showcase + process strip + LiveChart (~7h)
- AM: Build `/ai` page with 4-capability grid (Pattern A). Each card links back to Proof.
- PM: Build `ProcessStrip.astro` (Optiver `→` glyph pattern). Drop into DSR calculator page as inline element.
- PM: Build `LiveChart.astro` with TradingView Lightweight Charts (lazy-loaded, ~45 KB). Drop into a new `/markets` page as BTC IS-vs-OOS panel.

### Day 6 — NDA-safe experience + skills + education (~7h)
- AM: Build `NDAExperience.astro`. Apply 5 approved phrasings to the 19V Capital line.
- AM: Refactor skills section into 5 clusters (~45 tools total). Drop Communication cluster. Project-anchor each cluster.
- PM: Refactor education into "Formal Education" (PSHS-SMC, USeP, UM) + "Continuous Learning" (STA, certs) — two sub-sections, not flat rows. Lead with PSHS-SMC.
- PM: Run `npm run audit` — must show 0 NDA violations.
- **Deploy.**

### Day 7 — Track records + OSS + /now + RSS + sitemap + meta tags (~7h)
- AM: Build `TrackRecord.astro` row. Link Numerai (after signup), Kaggle, GitHub contribution graph, arXiv (if any). **Do not link BRAIN** (PH not eligible).
- AM: Build `/oss` page with 5 repo rows.
- PM: Add `/now` page — 200–400 words, dated, opinionated, monthly cadence.
- PM: Add RSS feed via `@astrojs/rss@^4`. Submit to [quantocracy.com](https://quantocracy.com/).
- PM: Add `public/robots.txt` with `Sitemap:` directive and named AI-bot user-agents.
- PM: Extend `BaseLayout.astro` with `<meta name="description">`, `twitter:card="summary_large_image"`, `<link rel="canonical">`, `<meta name="theme-color" content="#FAF7F0">`, `<meta name="color-scheme" content="light dark">`.

### Day 8 — JSON-LD + llms.txt + CV PDF + accessibility hardening (~8h)
- AM: Build `Schema.astro` component. Inject `Person` (homepage), `Article` (per research post frontmatter), `BreadcrumbList` (per page), `FAQPage` (About), `WebSite + SearchAction` (if Pagefind added). Validate with Google Rich Results Test.
- AM: Add `/llms.txt` (Markdown site summary, one section per page) + `/llms-full.txt` (concatenated Markdown) + `/manifest.json`.
- PM: Build `/cv` page — print-optimized, ATS-clean, single-column, no images, no columns. Wire to one-click PDF via Playwright/Chromium in `astro build`. Host at `/cv.pdf`.
- PM: Add WCAG 2.2 AA audit: skip-to-content link, visible `:focus-visible` ring, all images have meaningful alt, `<html lang="en">`. Add `axe-core` to CI. Add `@media (prefers-reduced-motion)` global guard.
- **Deploy v3.5.0-rc.**

### Day 9 — /chat agent + /colophon + /uses + /privacy + /disclosures + /404 + favicon set + print CSS (~8h)
- AM: Build `/chat` island — RAG chatbot over portfolio content. Reuses RAGAS harness from Proof card 2. Cites each answer with deep-links. (The standout AI capability demo.)
- AM: Build `/colophon` (Astro 7, Inter + JetBrains Mono self-hosted, GH Pages, source MIT, font credits, color tokens documented).
- AM: Build `/uses` (hardware, editor, terminal, server, finance data, AI infra — 1 paragraph each).
- PM: Build `/privacy` (no cookies, no tracking pixels, Plausible with anonymized IPs).
- PM: Build `/disclosures` (NDA scope, controlled-conversation protocol).
- PM: Build `/404` (same design system, search box, "try `/research` or `/contact`").
- PM: Add favicon set (16, 32, 180, maskable), `<meta name="theme-color">`, Web App Manifest, humans.txt.
- PM: Add `@media print` rules to `tokens.css`. Apply to `/cv` and `/research/[slug]`.
- **Deploy v3.5.0.**

### Day 10 — Outreach + monitoring + metrics baseline (~6h)
- AM: Cold-DM 5 Tier-A WFH hiring managers (HF, Replicate, Anyscale, Together AI, Modal Labs) using the under-300-char template from WFH intel §10.
- AM: Apply to 3 Tier-A remote roles (Numerai, HF, Replicate). Use ATS-optimized resume per WFH intel §3.
- PM: Run Lighthouse audit. Verify: Performance ≥ 95, Accessibility ≥ 95, Best Practices ≥ 95, SEO = 100. Record baselines in §10 success metrics doc.
- PM: Set quarterly re-check reminders for BRAIN PH eligibility, Tier-B firm remote policies.
- PM: `git tag v3.5.0`. **Final deploy.**

---

## 9. WFH APPLICATION STRATEGY

### 9.1 Target firm matrix (separate design references from hiring targets)

| Firm | Type | Design ref | Hiring target | Notes |
|---|---|---|---|---|
| Jane Street | Quant (in-office) | ✓ | — | 5 days in office |
| D. E. Shaw | Quant (mostly on-site) | ✓ | — | Limited remote QR roles |
| Two Sigma | Quant (tightened RTO) | ✓ | — | Some hybrid |
| AQR | Quant (hybrid) | ✓ | partial | Research postings sometimes remote |
| Man Group | Quant (hybrid) | ✓ | partial | UK anchor, EU remote possible |
| Optiver | Quant (3-day min) | ✓ | — | Amsterdam/Sydney/Chicago |
| GSA Capital | Quant (London) | ✓ | — | OS version stamp pattern source |
| Qube Research | Quant | ✓ | — | London/Singapore |
| Schonfeld | Quant | ✓ | — | Period-terminated headlines source |
| **Numerai** | Quant (fully remote) | — | **✓ Tier-A** | Signals model, paid stake |
| **Hugging Face** | AI (US Remote / EMEA) | — | **✓ Tier-A** | ML engineer, WebML, etc. |
| **Replicate** | AI (remote-first) | — | **✓ Tier-A** | ML engineer, OSS-friendly |
| **Anyscale** | AI (research engineer remote) | — | **✓ Tier-A** | Ray ecosystem |
| **Together AI** | AI (remote) | — | **✓ Tier-A** | Open-source model serving |
| **Modal Labs** | AI (remote) | — | **✓ Tier-A** | Compute infra |
| **Databricks** | AI/ML (hybrid) | — | partial | ML platform roles |
| WorldQuant BRAIN | Quant (consultant, PH not eligible) | — | — | **Re-check quarterly** |
| IMC | Quant (hybrid) | — | partial | Amsterdam/Sydney |

### 9.2 Time zone framing (hero sub-statement, contact, cover letters)

> "Based in Digos City, Philippines (UTC+8), open to remote research roles with **US-premarket (PHT 21:00–23:00) or APAC-anchor** overlap."

**Why this works:** UTC+8 covers **US premarket** (NY 06:30 = PHT 18:30, NY 09:30 = PHT 21:30), **APAC core** (Tokyo 09:00 = PHT 08:00, Sydney 09:00 = PHT 06:00), and **partial EU overlap** (London 09:00 = PHT 16:00). Frames PH location as APAC anchor, not offset liability.

### 9.3 ATS-optimized resume (mirror JD keywords)

- Single-column layout. No tables, no graphics, no headers/footers with content.
- Standard section headers: `Summary`, `Experience`, `Education`, `Skills`, `Certifications`.
- Mirror JD keywords verbatim — read 20 target JDs, extract top 20 keywords, weave into summary + skills cluster.
- File format: `.docx` (primary) + `.pdf` (secondary). Filename: `Christian_Macion_Resume_2026.pdf`.
- Length: 1-page for applications > 5yoe; 2-page otherwise.
- Skills cluster: list tools (Python, pandas, polars, PyTorch, LangGraph, MCP SDK) NOT categories.
- Quant-specific: include Sharpe / IR / drawdown / PBO / DSR / CSCV acronyms where accurate.

### 9.4 Search queries (weekly, run Mondays)

```
"quantitative researcher" remote
"AI engineer" remote
"MCP" "remote"
"RAG" "remote" "engineer"
site:numer.ai careers
site:apply.workable.com huggingface
site:replicate.com jobs
site:anyscale.com careers
"machine learning engineer" "US remote"
"research engineer" remote
```

Run in LinkedIn, Google Jobs, [openquant.co](https://openquant.co/), [eFinancialCareers](https://www.efinancialcareers.com/). Save searches; set LinkedIn job alert.

---

## 10. SUCCESS METRICS

### 10.1 Quantitative (4-week window after v3.5 deploy)

| Metric | Target | Source |
|---|---|---|
| Lighthouse Performance | ≥ 95 | `lighthouse-ci` |
| Lighthouse Accessibility | ≥ 95, 0 Axe violations | `@axe-core/playwright` in CI |
| Lighthouse Best Practices | ≥ 95 | Lighthouse |
| Lighthouse SEO | 100 | Lighthouse |
| LCP p75 | < 1.8s | Plausible + Web Vitals |
| INP p75 | < 200ms | Plausible + Web Vitals |
| CLS p75 | < 0.1 | Plausible + Web Vitals |
| Page weight (homepage) | < 100 KB HTML + < 80 KB JS (lazy) | `astro build` output |
| Inbound recruiter DMs | ≥ 5 | LinkedIn, email |
| GitHub stars across OSS | +20 in 4 weeks | GitHub API |
| `/proof` click-through | ≥ 30% of visitors | Plausible |
| `/research` 2-axis filter usage | ≥ 15% of visitors | Plausible |
| Numerai Signals correlation | positive (any tier) | numer.ai profile |
| ATS parse rate | 100% | Jobscan, Resume Worded |
| Cold-DM response rate | ≥ 10% | LinkedIn |
| `/chat` engagement | ≥ 5% of visitors ask ≥ 1 question | Plausible + log |

### 10.2 Qualitative (binary)

- [ ] In 90 seconds, a senior QR at AQR/Jane Street/Numerai can answer: who, what, proof, location, WFH status, one CTA.
- [ ] In 90 seconds, a hiring manager at HF/Replicate/Anyscale can answer: what AI capability, one demo URL, one eval result, one OSS repo, WFH status.
- [ ] Would a senior QR at target firm share without apologizing? (Jane Street / HRT / AQR / Man / GSA all pass this test.)
- [ ] At least 3 reviewers describe the site as "institutional," "research-notebook," or "looks like a senior practitioner."
- [ ] No "looks AI generated" feedback from any reviewer.
- [ ] No "I cannot tell what you did" feedback from any reviewer.

### 10.3 NDA audit (CI-enforced, must show 0)

- [ ] `npm run audit` returns 0 violations on every push.
- [ ] No "Davao City" anywhere (correct: Digos City, Davao del Sur).
- [ ] No "Present" or "currently" tied to 19V Capital.
- [ ] No fund renames, no Polymarket/Kalshi/NOAA/USDA references.
- [ ] No "Quantivo"/"CallRank AI" specifics.

### 10.4 Liveness signals

- [ ] Version stamp increments at least once in 4 weeks (`v3.5.0 → v3.5.1`) — proves the site is alive.
- [ ] `/now` page updated monthly.
- [ ] `/research` archive grows by ≥ 1 post per month.

---

## 11. WHAT TO STEAL FROM EACH FIRM

| Firm | Steal | Attribution |
|---|---|---|
| **Jane Street** | Hex motif in hero/footer (single SVG, low-opacity, amber-segment fills); period-separated hero noun list | [janestreet.com](https://www.janestreet.com/), [blog.janestreet.com](https://blog.janestreet.com/) |
| **D. E. Shaw** | Muted gold accent palette (`#C9A24A` family); restrained type hierarchy | [deshaw.com](https://www.deshaw.com/) |
| **Hudson River Trading** | Period-separated noun-list hero (verbatim pattern); single dense stat line | [hudsonrivertrading.com](https://www.hudsonrivertrading.com/) |
| **AQR** | Uniform research archive list (tag · title · date · read-time); two-axis filter sidebar; Insights layout | [aqr.com/Insights](https://www.aqr.com/Insights) |
| **Two Sigma** | Stat-row above the fold (single line, no chrome, tabular-nums); institutional near-black on warm off-white | [twosigma.com](https://www.twosigma.com/) |
| **Man Group** | Text-link CTAs only (no pill buttons); research-notebook voice; minimal motion | [man.com](https://www.man.com/), [man.com/insights](https://www.man.com/insights) |
| **GSA Capital** | `portfolio.os / v3.5.0` version stamp in footer; odometer counter on one stat | [gsacapital.com](https://www.gsacapital.com/) |
| **Qube Research & Technologies** | Period-terminated section headers (selective, not wallpaper); uppercase mono labels | [qube-rt.com](https://www.qube-rt.com/) |
| **Schonfeld** | Period-terminated headlines; dense regulatory-style disclosure footer | [schonfeld.com](https://www.schonfeld.com/) |
| **Optiver** | Process strip with `→` glyphs (`Hypothesis → Backtest → Deflated Sharpe → Robustness → Deploy`); one-line display type | [optiver.com](https://www.optiver.com/) |
| **Numerai** | Public track records block (signals model + correlation); honest remote-first positioning | [numer.ai/careers](https://numer.ai/careers) |
| **Hugging Face** | `/chat` RAG agent as live AI capability demo; remote-first job listings | [huggingface.co](https://huggingface.co/), [apply.workable.com/huggingface](https://apply.workable.com/huggingface) |
| **Söhne / GT America** | Neo-grotesque display type pairing; restrained tracking on display sizes | [klim.co.nz/fonts/soehne](https://klim.co.nz/fonts/soehne/), [grillitype.com/typeface/gt-america](https://www.grillitype.com/typeface/gt-america) |

---

## 12. REFERENCES

### HF design recon
- [Jane Street](https://www.janestreet.com/) · [Jane Street blog](https://blog.janestreet.com/)
- [Two Sigma](https://www.twosigma.com/)
- [D. E. Shaw](https://www.deshaw.com/)
- [Hudson River Trading](https://www.hudsonrivertrading.com/)
- [AQR Capital](https://www.aqr.com/) · [AQR Insights](https://www.aqr.com/Insights)
- [Point72](https://www.point72.com/)
- [Optiver](https://www.optiver.com/)
- [Man Group](https://www.man.com/) · [Man Insights](https://www.man.com/insights)
- [GSA Capital](https://www.gsacapital.com/) — OS version stamp pattern
- [Qube Research & Technologies](https://www.qube-rt.com/) — period-terminated headlines
- [Schonfeld](https://www.schonfeld.com/) — period-terminated headlines
- [Söhne](https://klim.co.nz/fonts/soehne/) · [GT America](https://www.grillitype.com/typeface/gt-america)
- [Fintech typography — medium](https://medium.com/design-bootcamp/the-elements-of-fintech-typography-part-1-readable-money-b6c1226acbde)

### Stack research (verified 2026-07)
- [Astro](https://github.com/withastro/astro) (v7.0.0+) · [Astro v7 upgrade guide](https://docs.astro.build/en/guides/upgrade-to/v7/) · [Astro v7 blog](https://astro.build/blog/astro-7)
- [State of JS 2025 — meta-frameworks](https://2025.stateofjs.com/en-US/libraries/meta-frameworks/)
- [MDX](https://github.com/mdx-js/mdx) · [Velite](https://github.com/velitejs/velite)
- [@fontsource/inter](https://fontsource.org/fonts/inter) · [@fontsource/jetbrains-mono](https://fontsource.org/fonts/jetbrains-mono)
- [KaTeX](https://github.com/KaTeX/KaTeX) (v0.17.0) · [remark-math](https://github.com/remarkjs/remark-math)
- [TradingView Lightweight Charts](https://github.com/tradingview/lightweight-charts) (v5+)
- [astro-expressive-code](https://github.com/expressive-code/expressive-code) (v0.44+)
- [Lucide](https://lucide.dev/) (v1.23+)
- [Pagefind](https://pagefind.app/)
- [Plausible — script tag docs](https://plausible.io/docs/plausible-script) (no npm dep, inline snippet)
- [Astro View Transitions](https://docs.astro.build/en/guides/view-transitions/)
- [Astro Sitemap](https://docs.astro.build/en/guides/integrations-guide/sitemap/) · [Astro RSS](https://docs.astro.build/en/guides/rss/)

### QR portfolio patterns
- [letianzj.github.io](https://letianzj.github.io/) — Letian Wang
- [epchan.blogspot.com](http://epchan.blogspot.com/) — Ernie Chan
- [auraguardian.github.io/Website-Portfolio](https://auraguardian.github.io/Website-Portfolio/) — Richie Sawant
- [byfire.substack.com/p/2025-buy-side-quant-job-advice](https://byfire.substack.com/p/2025-buy-side-quant-job-advice) — Gappy
- [algos.org/archive](https://www.algos.org/archive) — Quant Stack
- [mebfaber.com](https://mebfaber.com/) — Meb Faber
- [quantstart.com](https://www.quantstart.com/) — QuantStart
- [platform.worldquantbrain.com/consultant](https://platform.worldquantbrain.com/consultant) — BRAIN (PH not eligible)
- [quantocracy.com](https://quantocracy.com/) — quant blog aggregator
- [nownownow.com](https://nownownow.com/about) — /now page format
- [uses.tech](https://uses.tech/) — /uses convention
- [eFinancialCareers — quant CV guide](https://www.efinancialcareers.com/news/how-to-write-a-cv-for-a-job-in-quant-finance)
- [QuantNet — top 3 MFE resume mistakes](https://quantnet.com/threads/top-3-resume-mistakes-i-see-mfes-make.62252/)
- [Enhancv — QR resume examples](https://enhancv.com/resume-examples/quantitative-researcher/)

### AI/ML portfolio patterns
- [mostafaghadimi.github.io](https://mostafaghadimi.github.io/) — skills-as-schema
- [pravnkr.github.io/dev-portfolio/](https://pravnkr.github.io/dev-portfolio/) — applied-AI + finance reference
- [govindgupta.com](https://govindgupta.com/) — multi-agent trading-floor
- [mjgmario.github.io](https://mjgmario.github.io/) — Medium-articles-as-portfolio
- [teddynote-lab/langgraph-mcp-agents](https://github.com/teddynote-lab/langgraph-mcp-agents) — reference architecture
- [punkpeye/awesome-mcp-servers](https://github.com/punkpeye/awesome-mcp-servers) — 90.5k★
- [hannesrudolph/mcp-ragdocs](https://github.com/hannesrudolph/mcp-ragdocs) — fork-and-modify template
- [georgezouq/awesome-ai-in-finance](https://github.com/georgezouq/awesome-ai-in-finance) — FinanceKit MCP
- [DataExpert.io — AI Engineering Portfolios](https://www.dataexpert.io/blog/ultimate-guide-ai-engineering-portfolios)
- [myengineeringpath.dev — GenAI Engineer Portfolio](https://myengineeringpath.dev/genai-engineer/portfolio-guide/)

### WFH quant intel (verified 2026-07)
- [Numerai careers](https://numer.ai/careers) · [Numerai Tournament](https://numer.ai/tournament)
- [Hugging Face Workable](https://apply.workable.com/huggingface)
- [Replicate jobs](https://replicate.com/jobs) · [Anyscale careers](https://www.anyscale.com/careers) · [Together AI](https://together.ai/careers)
- [Modal Labs](https://modal.com/careers) · [Databricks careers](https://www.databricks.com/company/careers)
- [WorldQuant BRAIN](https://worldquantbrain.com/consultant) — **PH not eligible, re-check quarterly**
- [AQR Research Jobs](https://careers.aqr.com/jobs/category/research)
- [ATS optimization — ResumeVera 2025](https://resumevera.com/blogs/ats-resume-optimization-guide-2025) · [Resume.io](https://resume.io/resume-templates/ats)
- [Levels.fyi](https://www.levels.fyi) — comp benchmarks
- [OpenQuant](https://openquant.co/) · [eFinancialCareers](https://www.efinancialcareers.com/jobs/quantitative-researcher)

### Accessibility + SEO (completeness gaps)
- [WCAG 2.2 AA](https://www.w3.org/WAI/WCAG22/quickref/?versions=2.2)
- [prefers-reduced-motion — MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)
- [JSON-LD schema.org/Person](https://schema.org/Person) · [Google Rich Results Test](https://search.google.com/test/rich-results)
- [llms.txt spec](https://llmstxt.org/) · [Anthropic llms.txt](https://www.anthropic.com/llms.txt) · [Vercel llms.txt](https://vercel.com/llms.txt)
- [axe-core](https://github.com/dequelabs/axe-core) · [@axe-core/playwright](https://github.com/component-driven/axe-playwright.report)
- [Web Vitals](https://web.dev/vitals/) · [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)

### Existing portfolio assets (preserve)
- [github.com/christianmacion26/portfolio](https://github.com/christianmacion26/portfolio) — live source
- [christianmacion26.github.io/portfolio](https://christianmacion26.github.io/portfolio) — live URL
- `src/utils/nda-audit.ts` — NDA guardrail (CI-enforced)
- `src/utils/profile.ts` — single source of truth
- `src/components/Chart.astro` · `Sparkline.astro` · `Ticker.astro` · `DSRCalculator.astro` · `CombinedBook.astro` — all keep

---

**Next step: pick the day to start.** Recommended: **Monday 2026-07-13**, day 1 of the 10-day sprint. Run `npm view astro version` first to confirm Astro 7.x is current, then begin with the v7 upgrade guide. Ship `v3.5.0` on **Friday 2026-07-24**. Start cold-DM outreach on **Monday 2026-07-27**.

| WorldQuant BRAIN | Quant (consultant