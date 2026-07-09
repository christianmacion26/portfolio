# v3.5 Delta Plan — what to actually do

**For:** Christian T. Macion
**Date:** 2026-07-09
**Read with:** `PROPOSAL-v3.5.md` (the full research)
**Time to read:** 4 minutes
**Build window:** 10 working days (~70 hours)

This is the **delta** between the v3.4 site (which is real and shipping) and the v3.5 target. The full proposal is the *what + why*; this file is the *what to touch in your actual repo*.

---

## 0. State of the world (after filesystem recon)

The site at `/Users/christianmacion/Contingency/christianmacion.github.io` is **already substantial**:

| Asset | State | What it gives us |
|---|---|---|
| Astro project | v5.7.10 (not v7 — upgrade needed) | Solid SSG foundation |
| 16 components | `Avatar`, `CTABanner`, `Chart`, `DSRCalculator`, `Equation`, `Footer`, `MetricPill`, `Nav`, `ProjectCard`, `ProofCard`, `Sparkline`, `Stat`, `Ticker`, `TimelineEntry`, `VideoEmbed` | DSR + Chart + Sparkline + Ticker already exist |
| 17 pages | `index`, `about`, `certifications`, `contact`, `experience`, `methodology`, `mistakes`, `now`, `positions`, `projects`, `projects/[slug]`, `proof`, `publications`, `resume`, `skills`, `solutions`, `uses` + `404` | Most IA is there |
| 15 MDX projects | 6 AI (`rag-recall`, `toolcall-agent`, `judge-harness`, `eval-mcp-server`, `reflect-revise`, `slop-scanner`) + 9 quant (`deflated-sharpe`, `cross-sectional-momentum`, `timeseries-momentum-voltarget`, `variance-risk-premium`, `pairs-cointegration`, `funding-carry`, `macro-regime-overlay`, `backtest-engine-costs`, `lookahead-bias-audit`) | Content already there |
| Content collections | Zod-typed in `src/content.config.ts` | Type-safe frontmatter |
| `nda-audit.ts` | CI-enforced NDA guardrails | Already blocks Davao City / Present / fund renames / etc. |
| `profile.ts` | Single source of truth for identity | Easy to update |
| `tokens.css` + `global.css` + `print.css` | Design system in place | Extend, don't replace |
| 3 resume PDFs in `/public/resume-*.pdf` | PDF distribution | Refresh after v3.5 |
| 9 quant project figures in `/public/figures/quant/` | Visual assets | Keep |
| Deploy pipeline | GitHub Actions → GH Pages | Production-ready |

**Net:** v3.5 is a *targeted evolution*, not a rebuild. The full proposal is the destination; this delta is the route.

---

## 1. What's missing vs the proposal — the 9 deltas

Each delta is one focused change with an output and a test. Total: ~9 working days after the foundation day (Day 1).

### Delta 1 — Foundation + Astro 7 upgrade (Day 1, ~6h)

**Why it leads:** Unblocks every other change. New Astro features (View Transitions, content layer improvements) simplify everything else.

**What to do:**
```bash
cd /Users/christianmacion/Contingency/christianmacion.github.io
# 1. Verify target versions
npm view astro version         # confirm 7.x
npm view lucide version        # check if 1.23+ exists (may need a path)
npm view @astrojs/sitemap version
npm view @astrojs/rss version
npm view @fontsource/inter version
npm view @fontsource/jetbrains-mono version
npm view katex version

# 2. Upgrade Astro
npm install astro@^7 @astrojs/sitemap@latest @astrojs/mdx@latest
npm install @fontsource/inter@latest @fontsource/jetbrains-mono@latest

# 3. Audit (must stay 0)
npm run audit
npm run build
```

**Add new deps:**
```bash
npm install remark-math rehype-katex
npm install astro-expressive-code
npm install @astrojs/rss
npm install lightweight-charts
# Pagefind is binary, not npm
curl -fsSL https://pagefind.app/install.sh | bash
# (or use the @pagefind/default-ui + Pagefind CLI pattern)
```

**Test:**
- `npm run build` succeeds
- `npm run audit` returns 0
- `dist/` regenerates with new Astro 7 output

---

### Delta 2 — Color contrast fix (Day 2 AM, ~2h)

**Critical finding from the adversarial review:** the existing amber `#C9A24A` on the cream background likely fails WCAG 2.2 AA. This is a *correctness* issue, not aesthetic.

**Touch:** `src/styles/tokens.css`

**What to do:**
1. Add `--amber-deep: #8C6F2A` for text accents (passes AA on cream)
2. Reserve `--amber: #C9A24A` for non-text decorative (hex motif, hairlines) and large display sizes (≥24px Inter 600)
3. Replace any text-on-cream using `--amber` with `--amber-deep`
4. Add the `prefers-reduced-motion` global guard from §4.1 of the full proposal
5. Add the `prefers-color-scheme: dark` block (the v3.4 site may not have a dark mode)

**Test:**
- Run an axe-core scan (manual: open Chrome DevTools → Lighthouse → Accessibility)
- All `--amber` text uses must now be `--amber-deep` for sizes <24px

---

### Delta 3 — Hero rebuild (Day 2 PM, ~5h)

**Touch:** `src/pages/index.astro`, new `src/components/HexPattern.astro`, `src/components/VersionStamp.astro`, `src/components/NounList.astro`

**Why:** The v3.4 hero is the primary "looks AI generated" symptom. Replace it with the HRT/AQR pattern.

**What to do:**
1. Build `HexPattern.astro` — single SVG, ~30 lines, 1–2 amber-segment fills, mostly transparent
2. Build `VersionStamp.astro` — small mono text `portfolio.os / v3.5.0` bottom-right of hero
3. Build `NounList.astro` — period-separated singular noun list (e.g., `backtest · risk model · factor library · DSR calculator · MCP server · RAG harness · research note · OSS tool`)
4. Rewrite hero in `index.astro`:
   - Hex motif background (low opacity)
   - 64px circular headshot top-right
   - Singular noun list (display Inter 600, period-terminated)
   - Third-person sub-statement: *"Christian Macion is a quantitative researcher and AI engineer based in Digos City, Philippines (UTC+8), open to remote research roles with US-premarket or APAC-anchor overlap."*
   - Mono sub-tags: `ALPHA RESEARCH · AI ENGINEERING · OPEN-SOURCE TOOLS · REMOTE-READY`
   - Two text-link CTAs: `[Read research →] · [Resume (PDF) →]`

**Test:**
- Above-the-fold on 1366×768 and 375×667 (mobile)
- 90-second skim test: can a stranger answer who/what/location/WFH in 90 seconds?

---

### Delta 4 — Stat row (Day 3 AM, ~3h)

**Touch:** `src/pages/index.astro` (insert), new `src/components/StatRow.astro`, update `src/components/Stat.astro`

**Why:** The v3.4 site has `Stat.astro` and `MetricPill.astro` already; consolidate into a single 4-numeral line with no card chrome.

**What to do:**
1. Audit `~/code` and GitHub for **real** stats:
   - # of quant research notes
   - # of AI engineering projects
   - # of OSS repos
   - # of backtest runs / OSS stars / Numerai correlation (whichever is the most defensible)
2. Build `StatRow.astro` — single horizontal line, 4 numerals, tabular-nums Inter 600, label below each
3. Add an odometer increment for one stat (IntersectionObserver, 1.2s ease-out)
4. Wire it into `index.astro` immediately under the hero

**Test:** Stats are verifiable via one click (link to the underlying source: `/projects`, `/oss`, GitHub profile, etc.)

---

### Delta 5 — Proof cards lead (Day 3 PM, ~4h)

**Touch:** `src/pages/index.astro`, `src/components/ProofCard.astro`, `src/components/ProjectCard.astro`

**Why:** The current homepage likely leads with About or Projects. The proposal reorders: **proof before bio.** This is the single biggest "AI generated → institutional" lever.

**What to do:**
1. Refactor `ProofCard.astro` to use the proposal's pattern: mono label (`[ Quant #01 ]`) + title + 1-line outcome with a number + 2 link chips
2. Curate 5 cards in this order (strongest first):
   1. **Deflated Sharpe Ratio calculator** (existing `DSRCalculator.astro` — anchor as Quant #01)
   2. **MCP backtest server** (new — small 50-line FastMCP server exposing `get_ohlcv` / `run_backtest` to Claude Desktop)
   3. **RAG harness over SSRN/arxiv q-fin** (new — small 100-line retrieval + RAGAS eval)
   4. **Combined-book PnL attribution** (existing `CombinedBook.astro` — fold into Proof as Quant #02)
   5. **Numerical faithfulness eval harness** (new — the 30-question pilot gold set + RAGAS extension)
3. Build the 3 new cards (MCP server, RAG harness, eval harness) in `/Users/christianmacion/portfolio_v2/<new-repo>/` and link from the cards to the public repos
4. Move `/proof` content into the homepage Proof section; `/proof` page becomes a paginated archive

**Test:** 90-second skim — by the time a reviewer scrolls past the Proof section, they've seen 5 numbered cards with verifiable links. They don't need the About section to know what Christian built.

---

### Delta 6 — AQR-style research archive (Day 4, ~7h)

**Touch:** `src/pages/research.astro` (new), `src/components/ResearchRow.astro` (new), migrate `src/content/notes/` or add `src/content/research/`

**Why:** v3.4 has `publications.astro` already; reshape it into a paginated AQR-Insights-style uniform list with two-axis filter (Topic × Type).

**What to do:**
1. Create `src/content/research/` collection in `src/content.config.ts` with Zod schema (title, date, topic, type, readTime, summary, slug)
2. Migrate 5–10 existing posts/notes from `publications.astro` into MDX with the new schema
3. Build `ResearchRow.astro`: tag · title · date · read-time · link, hairline rule, no thumbnail
4. Build `/research` page with:
   - Two-axis filter sidebar (desktop) / bottom-sheet modal (mobile)
   - Pagination via `/research/page/[page]`
   - Pagefind search input
5. Keep `/publications` as a redirect → `/research` for the v3.4 URL stability

**Test:** Filter works on Topic (Quant/AI/Eng) and Type (Note/Eval/Tool/Post). Pagination works. Pagefind returns results within 100ms.

---

### Delta 7 — AI showcase grid + process strip (Day 5 AM, ~4h)

**Touch:** new `src/pages/ai.astro`, new `src/components/CapabilityGrid.astro`, new `src/components/ProcessStrip.astro`

**What to do:**
1. Build `CapabilityGrid.astro` — 4-capability grid (Retrieval / Agents / Eval / Deploy) with one-paragraph capability statement and link back to the Proof card
2. Build `ProcessStrip.astro` — Optiver `→` glyph pattern: `Hypothesis → Backtest → Deflated Sharpe → Robustness → Deploy`
3. Build `/ai` page with the grid + a featured project spotlight (the eval harness)
4. Add the process strip to the DSR calculator page as an inline element

**Test:** Each capability card deep-links to its proof card; deep-link from Proof card back to `/ai` works.

---

### Delta 8 — NDA-safe experience + skills refactor (Day 6, ~7h)

**Touch:** `src/components/TimelineEntry.astro`, `src/pages/experience.astro`, `src/pages/skills.astro`

**Why:** This is the highest-risk "leak" surface. v3.4 already has `nda-audit.ts`, but the *content* of the experience entries needs the 5 before/after rewrites from the full proposal §7.

**What to do:**
1. Apply the 5 before/after rewrites to the 19V Capital line:
   - Specific IRs (2.1, 1.8) → "Result category: signals with 1-month half-life IR > 1.0; specific IRs NDA-protected"
   - PM names → removed
   - "Currently" / "Present" → "Past contract (Mar 2025 – Sep 2025)"
2. Refactor skills into 5 clusters (drop Communication cluster):
   - `[ Quant Research ]` Python · pandas · polars · NumPy · vectorbt · backtesting.py · QuantConnect/Lean · factor models · risk attribution · G1–G31
   - `[ LLM & Agents   ]` LangGraph · MCP SDK · LlamaIndex · vLLM · HuggingFace · RAG · eval harnesses · prompt patterns
   - `[ ML & Data      ]` PyTorch · scikit-learn · XGBoost · SQL · DuckDB · pgvector
   - `[ Engineering    ]` FastAPI · Docker · GitHub Actions · Streamlit · HF Spaces · Linux · pytest · uv
   - `[ Writing        ]` research writeups · eval reports · 10-K/10-Q analysis · LaTeX
3. Project-anchor each cluster with a one-line proof
4. Refactor education into two sub-sections: "Formal Education" (PSHS-SMC → USeP units → UM) and "Continuous Learning" (STA, certs)
5. Add a Calendar slots line to the contact page (Tue–Thu 18:00–22:00 PHT for US-morning overlap)
6. **Run `npm run audit` — must remain 0 violations**

**Test:** `npm run audit` returns 0. Manual review of every "19V" / "Davao" / "Present" mention in `dist/`.

---

### Delta 9 — Trust signals + meta + RSS + sitemap hardening (Day 7, ~7h)

**Touch:** `src/components/TrackRecord.astro` (new), `src/pages/oss.astro` (new), `src/pages/now.astro` (existing — refresh), `src/pages/404.astro`, `BaseLayout.astro`, `public/robots.txt`, `public/llms.txt`, `public/llms-full.txt`, `astro.config.mjs`

**What to do:**
1. Build `TrackRecord.astro` row: Numerai (after signup), Kaggle, arXiv (if any), GitHub contribution graph. **Do not link BRAIN** (PH not eligible)
2. Build `/oss` page with 5 repo rows
3. Refresh `/now` page — 200–400 words, dated 2026-07-09, opinionated, monthly cadence commitment
4. Add RSS feed at `/rss.xml` via `@astrojs/rss`. Submit to [quantocracy.com](https://quantocracy.com/submit/)
5. Extend `BaseLayout.astro` with:
   - `<meta name="description">` (already in `seo.ts` — verify)
   - `twitter:card="summary_large_image"`
   - `<link rel="canonical">`
   - `<meta name="theme-color" content="#FAF7F0">`
   - `<meta name="color-scheme" content="light dark">`
6. Create `public/robots.txt` with `Sitemap:` directive and named AI-bot user-agents (GPTBot, ClaudeBot, anthropic-ai, PerplexityBot)
7. Create `public/llms.txt` (Markdown site summary) and `public/llms-full.txt` (concatenated content)
8. Add `@astrojs/rss` integration to `astro.config.mjs`
9. Add JSON-LD `Person` schema to homepage via new `src/components/Schema.astro`

**Test:** Lighthouse SEO = 100. `llms.txt` validates against the spec. RSS feed validates in W3C feed validator.

---

### (Optional) Delta 10 — /chat RAG agent (Day 9, ~8h)

**Touch:** new `src/pages/chat.astro`, new `src/components/ChatIsland.astro` (React/Preact island)

**Why:** This is the standout AI capability demo. Reuses the RAGAS eval harness from the Proof section.

**What to do:**
1. Build `ChatIsland.astro` — Preact/React component, lazy-loaded, ~30 KB
2. Wire to a small RAG backend: Vercel Edge Function or Cloudflare Worker that:
   - Embeds all MDX content at build time (use `@xenova/transformers` locally or a hosted embed API)
   - Stores vectors in pgvector (Neon free tier) or Turbopuffer
   - Returns citations with deep-links
3. Add a "Numerical faithfulness" metric (the 30-question pilot gold set) and show the eval result inline
4. The agent must be **honest** — if the answer isn't in the corpus, it says so. Never hallucinate a result.

**Test:** Ask the agent a question it should know (e.g., "What's the DSR formula Christian uses?") and verify it cites the right MDX. Ask it a question it shouldn't know (e.g., "What's 19V Capital's AUM?") and verify it refuses.

---

## 2. Critical pre-flight checks (do these BEFORE Delta 1)

```bash
cd /Users/christianmacion/Contingency/christianmacion.github.io

# Confirm the live URL is reachable
curl -I https://christianmacion26.github.io/portfolio

# Confirm git is clean
git status
git log --oneline -10

# Confirm CI is green
cat .github/workflows/deploy.yml   # check what runs
```

If git is dirty or CI is red, fix that first. v3.5 ships on top of green.

---

## 3. What to NOT do

- **Don't redesign the color palette.** Amber+black is correct. The fix is *contrast* (--amber-deep for text), not *color*.
- **Don't add a "What I do" icon grid.** That's the AI-generated pattern the proposal explicitly forbids.
- **Don't add a "Hi, I'm Christian" hero.** The third-person sub-statement is the move.
- **Don't claim current employment at 19V Capital.** Past contract, closed dates, abstracted methodology.
- **Don't add a glassmorphism nav, gradient mesh hero, or Spline embed.** Code-review gate.
- **Don't pull a stock photo.** The hex motif is the only background.
- **Don't use emoji in any copy.** Code-review gate.
- **Don't ship before Lighthouse Accessibility ≥ 95.** Build fails the gate if not.

---

## 4. The 30-second decision tree

When you open `index.astro` and don't know what to do next:

```
Is it the hero copy?         → Use §6.1 of full proposal
Is it the stat numbers?      → Audit ~/code + GitHub for real counts
Is it a section structure?   → Use §5 site blueprint
Is it the 19V Capital line?  → Use §7 NDA-safe rewrites
Is it a tool to install?     → Use §3 stack table; run npm view <name> version first
Is it a design decision?     → Use §4 design system tokens
Is it WFH application?       → Use §9 WFH strategy (target Numerai/HF/Replicate/Anyscale/Modal)
Is it a recruiter question?  → Use §11 "what to steal" attribution
Is it accessibility?         → Use Delta 2 + Delta 9
Is it deployment?            → git tag v3.5.0; push to main; CI does the rest
```

---

## 5. Success signal — when v3.5 is done

The site is done when **all of these** are true:

- [ ] `npm run audit` returns 0
- [ ] `npm run build` succeeds
- [ ] Lighthouse: Performance ≥ 95, Accessibility ≥ 95, Best Practices ≥ 95, SEO = 100
- [ ] Above-the-fold on 1366×768 and 375×667 — no layout shift, no horizontal scroll
- [ ] 90-second skim: who / what / proof / location / WFH / one CTA all answered
- [ ] No "looks AI generated" feedback from any reviewer
- [ ] 5+ cold-DMs sent to WFH hiring managers
- [ ] 3+ applications submitted to Tier-A remote roles (Numerai / HF / Replicate / Anyscale / Modal / Together AI)
- [ ] `/now` page updated for 2026-07
- [ ] `git tag v3.5.0` on main, deployed via GH Actions

---

**Recommended start date:** **Monday 2026-07-13**. Ship **Friday 2026-07-24**. Outreach **Monday 2026-07-27**.
