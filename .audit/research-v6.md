# Portfolio Research v6.0 — Senior Quant Researcher + AI Engineer

**For:** Christian T. Macion — `christianmacion26.github.io/portfolio`
**Date:** 2026-07-09
**Source corpus:** 18 institutional + 7 personal reference sites (see §13).
**Goal:** define the **delta** from current v3.4 state to a world-class senior-QR portfolio. P0/P1/P2 priority tags; concrete action items mapped to existing `src/pages/`.

> **Reading guide.** Each section follows the same shape:
> 1. **What world-class sites do** (sourced patterns, link citations)
> 2. **What the current portfolio has** (audit against `PROPOSAL-v3.5.md` + `src/pages/`)
> 3. **The delta** (concrete action items, ordered P0 → P1 → P2)

---

## 1. /proof — what world-class sites surface that we currently don't

### 1.1 World-class patterns

| Site | What /proof (or equivalent) surfaces |
|------|--------------------------------------|
| **AQR Insights** | Tag · title · date · 1-paragraph abstract · PDF/HTML link. Uniform row list with two-axis filter (Topic × Type). Topic multi-select includes `Machine Learning`, `Alternative Thinking`, `White Paper`. Source: [aqr.com/Insights](https://www.aqr.com/Insights) |
| **Man Insights** | Title · Format (Article/Podcast/Video) · Series · length · date · teaser. Tabbed filters: Macro / Asset class / Client solutions, each with its own sidebar (Series, Topic, Audience) + Format sub-filter. Pagination 1–68 pages. Source: [man.com/insights](https://www.man.com/insights) |
| **Jane Street blog** | Thumbnail · title · date · read-time · **author byline** (recurring names signal institutional voice). Pagination 14 pages. Separate `/machine-learning` landing curates a vertical. Source: [blog.janestreet.com](https://blog.janestreet.com/) |
| **HuggingFace Spaces** | Each Space surfaces: status badge (Running / Zero / CPU Upgrade), tags (Featured / Agents / MCP), popularity count, last-updated timestamp, cover. "Spaces of the week" is a rotating curated highlight. Source: [huggingface.co/spaces](https://huggingface.co/spaces) |
| **Replicate** | Each model: run-count as proof (`162.7M runs`), official/community badge, version visibility (flux-2-pro / flux-2-max), cover image as output sample. Trending vs latest vs popular as separate discovery rails. Source: [replicate.com/explore](https://replicate.com/explore) |
| **Sebastian Raschka** | Dual-lane: long-form articles + Quick Notes, each with thumbnail + read time. `/publications/` separate from blog. Source: [sebastianraschka.com](https://sebastianraschka.com/) |
| **Hudson River Trading `hrtbeat`** | Tech blog post titles: SystemVerilog tooling, Web Workers for real-time data, Python alerts DSL. "Artifacts speak louder than job titles." Source: [hudsonrivertrading.com](https://www.hudsonrivertrading.com/) |
| **Letian Wang** | Each post: math typeset (LaTeX), external Colab notebook link, GitHub repo, category taxonomy, Disqus comments. Source: [letianzj.github.io](https://letianzj.github.io/) |
| **NumEri (sub-pattern)** | Public researcher profile with cumulative correlation + stake (NMR). Numerai signals page surfaces: profile, model id, current correlation, MMC, TC, payout track record. |

### 1.2 Current portfolio state

`src/pages/proof.astro` exists; `src/pages/projects/` has 15 MDX files. v3.5 proposal §6.3 plans 5 cards with mono label + 1-line outcome + 2 link chips. **Missing** vs world-class:

- No **read-time** displayed per proof card (current DSR calculator page omits).
- No **last-updated / freshness pill** ("Updated 3 days ago") per project.
- No **status badge** ("Live", "Beta", "Archived") — Replicate/HF pattern.
- No **two-axis filter** (Topic × Type) on `/proof` — AQR/Man pattern.
- No **pagination** (15 projects on one page is too many for the 90-second skim test).
- No **author/mentee callouts** on collaborative work — Shreya Shankar pattern.
- No **public dashboards / live signals**: Numerai profile link, Braintrust scores, GitHub contribution graph, arXiv citations.
- No **walkforward / out-of-sample equity curves** as the lead visual artifact for each project.
- No **recorded talk** surface (no `/talks` yet).
- No **white-paper / SSRN preprint** links.

### 1.3 Delta — concrete action items

**P0 — must have for v6.0**

1. **Add a two-axis filter bar** to `/proof`: Topic (Quant / AI / OSS / Teaching) × Type (Code / Writeup / Talk / Live demo). AQR/Man pattern; reuses the existing filter component logic.
2. **Each proof card must surface**: mono label · title · 1-line outcome with **a number** (Sharpe / IR / correlation / latency / faithfulness) · 2 link chips · **status badge** (Live / Beta / Archived) · **last-updated pill** · **read time** (if writeup). Replicate/HF card-density pattern.
3. **Lead visual per card**: small inline equity-curve or walkforward chart (Sparkline / `<canvas>` re-render of existing `Chart.astro`). When the project has a `chartUrl` frontmatter field, render inline. Lopez-de-Prado: "deflated Sharpe with bootstrap CI" is the canonical first artifact.
4. **Add `/proof/[slug]` deep pages** for the top 5 projects. Each: 1) problem statement, 2) methodology diagram (Optiver process strip), 3) live demo link or notebook iframe, 4) GitHub link, 5) results (chart + table), 6) limitations / kill criteria, 7) citations. AQR Insights article-page pattern.
5. **Public-track-record block**: build `TrackRecord.astro`. Embed:
   - **Numerai signals profile** (when signed up) with current correlation / MMC / TC.
   - **GitHub contribution graph** (static SVG via `gh-contrib` or simple heatmap).
   - **arXiv search URL** linking any author papers.
   - **Kaggle / HF / Replicate** profile links (handle where applicable).
   - **Numerai / Kaggle / arXiv** rows in a single uniform table, hairline rules, no thumbnails.
6. **Pagination on `/proof`**: 6 cards per page, `/proof/page/[page]` Astro dynamic route. Stripe-docs pagination pattern.

**P1 — should have**

7. **Add `/talks` page** — Pattern A trust signal. Even one talk is enough. Format: title · venue · date · slides link · video link · transcript. Matches `Sebastian Raschka / Talks` nav item.
8. **Recording block** on hero proof cards: "Watch the 8-min walkthrough" → Loom / YouTube. Demos-as-artifact pattern.
9. **Pre-registered backtests as a category** — Lopez-de-Prado "Advances in Financial ML" canonical pattern. Tag existing backtests under `/proof?type=preregistered`.
10. **Citations / SSRN block** on each deep proof page: arXiv ID, SSRN ID, venue, year. AQR `Journal Article` type.
11. **Mentee/co-author callouts** when applicable (Shreya Shankar pattern) — prepares for future co-authored research.

**P2 — nice to have**

12. **"Featured by" badges** — if a piece is featured on quantocracy, Hacker News, or a fund's reading list.
13. **Citation count** auto-fetched from Semantic Scholar API per arXiv ID.
14. **"View source" button** on each proof card deep-link that opens the GitHub repo at the specific commit hash.

---

## 2. /methodology — what world-class sites do

### 2.1 World-class patterns

| Site | Methodology / process treatment |
|------|----------------------------------|
| **Optiver** | Six-stage pipeline as bold word chips: `Build → Ownership → Validate → Question → Deploy → Compound`. No numerals, no icons — purely typographic. One-loop narrative linking traders / researchers / engineers. Source: [optiver.com](https://www.optiver.com/) |
| **Two Sigma** | "This is Financial Sciences" + stat carousel (380+ PB, 250+ PhDs, 12 Math Olympiad medalists). Implicit methodology = rigorous inquiry, data analysis, invention. Source: [twosigma.com](https://www.twosigma.com/) |
| **Jane Street** | "Work where your mind matters" + Sierpinski-triangle puzzle as the methodology-flavored CTA — embed a math problem on the page. Source: [janestreet.com/join-jane-street](https://www.janestreet.com/join-jane-street) |
| **Man Group** | Tabbed early-career tracks (Graduates / Internships / Apprenticeships), each with "What we offer you" bullets + CTA. Pattern matches a methodology with three entry paths. Source: [man.com/careers](https://www.man.com/careers) |
| **GSA Capital** | Odometer counter on three stats with `//` code-comment sub-headline ("// A ruthlessly, restlessly nice place to work.") + ASCII-art decorative separator. Source: [gsacapital.com](https://www.gsacapital.com/) |
| **Cubist / W&B** | "Modern quant lifecycle" blog — IDE → backtest → deflated Sharpe → robustness → deploy → monitor. Lopez-de-Prado derived pipeline. Source: [wandb.ai/site/articles/architecting-alpha](https://wandb.ai/site/articles/architecting-alpha-the-modern-quant-lifecycle/) |

### 2.2 Current portfolio state

`src/pages/methodology.astro` exists. v3.5 §5 places an Optiver-style process strip (`Hypothesis → Backtest → Deflated Sharpe → Robustness → Deploy`) inside the DSR calculator page as an inline element, not on `/methodology`. **Missing:**

- No **dedicated process diagram** on `/methodology` itself.
- No **"what we'd build in week 1 / week 4 / week 12"** section.
- No **comparison table**: one-pager resume vs detailed PDF.
- No **kill-criterion table** ("if X then we abandon this strategy").
- No **screening pipeline visualization** (signal → gate → portfolio → deploy).
- No **DSR / PBO / CSCV methodology explainer** for non-quants.
- No **"deflated" emphasis** — v3.5 places the DSR calculator on a separate page; methodology should reference it.

### 2.3 Delta — concrete action items

**P0**

1. **Process diagram on `/methodology`** — single SVG, 6 chips: `Hypothesis → Backtest → Deflated Sharpe → Robustness → Capacity → Deploy`. Optiver strip pattern, institutional amber+black. Render once, link from DSR calculator.
2. **"Week 1 / Week 4 / Week 12"** block: the explicit scope of a starter research engagement. Three columns. Reduces the recruiting-manager cognitive load on "what do I get for the offer." Man Group early-careers tabbed pattern adapted.
3. **Kill-criterion table** (Lopez-de-Prado "before you backtest" pattern): 8–10 rows of `If [observable X] then [abandon strategy Y]`. Examples: "If OOS Sharpe < 50% of IS Sharpe → abandon." "If turnover > 20×/yr IR < 0.5 → abandon." "If factor is just sector proxy → abandon." Quant credibility marker.
4. **Comparison table**: one-pager resume vs. detailed PDF. Two columns, hairline rules, "Use the one-pager for cold-DM. Use the PDF for ATS submissions." Concrete operational advice.
5. **Screening-pipeline visualization**: SVG funnel `Universe (~10k) → Liquidity gate (~2k) → Signal filter (~200) → Capacity check (~50) → Risk gate (~20) → Live deploy (~10)`. With counts. Quant-credibility marker.

**P1**

6. **DSR / PBO / CSCV glossary** — cross-link to `/glossary` (already exists per v3.5). Methodology page should not redefine terms.
7. **Bootstrap CI demo** on the methodology page: 1,000-iteration bootstrap on a sample Sharpe series with a small inline chart showing the 95% CI. Lopez-de-Prado proof-by-visualization.
8. **"What I won't do"** negative list: not sell-side black-box, not HFT colocation-dependent, not options-market-making. Sets expectations.

**P2**

9. **Versioned methodology** (`portfolio.os / methodology / v3.5.0`) — GSA Capital `OS 1.2.46` pattern.
10. **Optional video walkthrough** — embed a 90-second screencast narrating the process strip.

---

## 3. Home page — what world-class sites do

### 3.1 World-class patterns

| Site | Hero / home pattern |
|------|--------------------|
| **Hudson River Trading** | Period-separated cascading word list: "innovators. engineers. technologists. mathematicians. thinkers. scientists. tinkerers. strategists. developers. physicists. analysts. statisticians." — followed by "HRT is first and foremost a math and technology company." Single CTA "Join Our Team." Source: [hudsonrivertrading.com](https://www.hudsonrivertrading.com/) |
| **GSA Capital** | `// A ruthlessly, restlessly nice place to work.` terminal-style sub-headline. Odometer counters between sections. "GSA OS 1.2.46" build version as a togglable metadata block. |
| **Two Sigma** | Carousel of stats: "380+ PB · >$70B AUM · 5B+ trades · 10,000+ data sources · 250+ PhDs · 12 Math Olympiad medalists · 4,800+ person-years of R&D." CTA: "Get Curious With Us." |
| **Schonfeld** | Period-terminated h1: "Empowering people. Driving performance." Dense stat strip: "Founded 1988 · 140+ PM teams · $22bn+ AUM · 1,100+ employees." Named individuals as authority (Steven Schonfeld, Ryan Tolkin). |
| **Stripe** | Layered funnel: use-case cards → product index. Task-oriented at top, product-oriented below. Pure IA signal. |
| **Numerai** | (JS-only) known from search: tournament hero with stake + correlation call-to-action. |

### 3.2 Current portfolio state

`src/pages/index.astro` exists. v3.5 §6.1 plans hero with noun list + UTC+8 + version stamp + 64px headshot top-right + hex motif. **Missing for world-class:**

- No **"current open roles you'd interview for"** block. v3.5 plans `/positions` page; the home should also surface it.
- No **"papers I'd co-author if you asked me"** teaser.
- No **"most interesting thing I read this week"** sticky note. (nownownow.com `/now` pattern.)
- No **1-line pitchbook-style bio**: "I'd be useful on your desk because…"
- No **"talk to me about"** list (topics the candidate wants to discuss).

### 3.3 Delta — concrete action items

**P0**

1. **1-line pitchbook bio** at the very top of the hero, before the noun list. Pattern: "I'd be useful on your [desk / team] because I can take a [factor hypothesis → published, audited, deployable alpha] in 6–8 weeks, end-to-end." HRT-period-terminated single sentence.
2. **"Current open roles you'd interview for"** card cluster: 3–5 cards directly on the home linking to `/positions`. Each: `Senior Quantitative Researcher · Numerai · Remote` style.
3. **"Talk to me about"** sidebar / chip list: 6–10 chips linking to `/research/[slug]`. Examples: `deflated Sharpe`, `walk-forward validation`, `MCP for quant`, `RAG over q-fin`, `Lopez-de-Prado`, `factor decay`. Brittany Chiang numbered-sidebar pattern adapted to chips.
4. **Versioned hero stamp**: `portfolio.os / v6.0.0 · last deployed YYYY-MM-DD`. GSA Capital pattern, makes the site feel alive.

**P1**

5. **"Most interesting thing I read this week"** — pull from `/now` frontmatter `lastWeekHighlight` field. Render as a single muted pill at the top of the hero. Derek Sivers `/now` pattern.
6. **"Papers I'd co-author if you asked me"** — 3-item list of hypotheticals. Each: title, abstract sentence, why-it-matters. The aspirational-research-bet pattern. Recruiter credibility marker.
7. **Calendly block** (or `cal.com/christianmacion`) — Man Group `Meet our people` carousel pattern, distilled to one booking widget.

**P2**

8. **Reading-this-now widget** — pulls latest 3 items from `/research` via Astro content collection `getCollection('research')`.
9. **Honest-pricing pill** — if publicly disclosing desired comp range or "open to discussion," surface here.

---

## 4. Canonical IA patterns — cross-site synthesis

### 4.1 Cross-site IA inventory

| Site | Top nav | Body sections | Footer |
|------|---------|---------------|--------|
| **AQR** | Education · What We Do · Our Firm · MyAQR · Contact Us | Insights (with filter) · Approach · Strategies · Funds | Privacy · Terms · Disclaimers · Form CRS · EEO |
| **Two Sigma** | About · Businesses · Insights · Careers · Contact · Investor Hub | Tagline hero → stats carousel → scientific approach → people → businesses → science at work → real estate | Geographic offices (8 cities), academic partnerships |
| **Jane Street** | Who We Are · What We Do · The Latest · Culture · Join Jane Street | Hero → two candidate pathways → four department groups → puzzles → culture → offices | SEC/FINRA/FCA/HKSFC disclosures |
| **Man Group** | Insights · Technology · About Us | Insights tab (3 columns) · Technology · News · Careers | Regional offices · Jurisdiction-specific disclosures |
| **D. E. Shaw** | Who We Are · What We Do · How To Join · News · Library · Contact | Logo + tagline → 3 link clusters → footer | Terms · Privacy · Disclosures · Impersonation notice |
| **Optiver** | Trade with us · All Jobs · Join us | Tagline → 3 capability cards → process chips → KPIs → culture teaser → location ticker → careers → insights | Education · Foundation · Alumni · Contact |
| **Qube RT** | About Us · Careers · External Contributors · Commitments · Contact | Hero → 4-pillar image blocks (Research/Technology/Data/Trading) → CTA → disclaimer | FCA/SFC/AMF/MAS/DFSA/FINMA disclosures |
| **Numerai** | (JS-only) · known IA: Tournament · Signals · Earn · Docs · About | Hero with stake + correlation → tournament mechanics → leaderboard → payouts | Careers · Press · Brand |
| **HuggingFace** | Models · Datasets · Spaces · Buckets · Docs · Enterprise · Pricing · Resources · Log In | Trending Models → Spaces → Datasets → "Home of ML" 4 value props → Accelerate ML (paid) → enterprise logos → open source 12 libs | About · Brand · Terms · Privacy · Careers |
| **Replicate** | Explore · Blog · Popular · Featured · Official · I want to… · Latest | Featured model hero → sections (Latest, Popular, Featured, Official) → collections → blog posts | (not visible) |
| **Stripe** | (docs) layered funnel: use-cases grid → product index → API reference → changelog | Use-case cards (3×3 grid) · "Browse by product" (4 super-categories) | Country select · Status · Legal · Glossary |
| **Shreya Shankar** | Home · Papers · Blog | Mentorship · About / Research statement · Academic Service · Publications · **"A Note for AI Agents"** · Footer | Social icons + builder credit |
| **Neel Nanda** | About · Blog · Top Posts · Mechanistic Interpretability · Merch | Pinned CTA · Numbered chronological feed · Older Posts pagination | Subscribe newsletter · RSS · Feedback form |
| **Chris Olah** | Blog · About · Contact | Recent Exciting Things → Neural Networks (general/RNN/CNN/Visualizing) → Circuits → Miscellaneous → Rough Notes → Personal Writing → Selected Twitter Threads → Traditional Papers | (none visible) |
| **Gwern** | Topic clusters as anchor links | Newest → Popular → Notable → Blog → Thematic (Statistics / Meta-Science / AI / Crypto / etc.) → Self/Research → Cultural → Creative → References → Personal | About · Help · Changelog · Substack |
| **Sebastian Raschka** | Home · Blog · Books · Courses · LLM Gallery · LLMs From Scratch · Reasoning Models · Talks · More | Hero bio → Recent Articles → Quick Notes → Books → Footer | Newsletter · Contact · YouTube · GitHub · Scholar · LinkedIn |
| **Max Woolf** | Posts · Search · GitHub · Patreon | Bio · Blog cards (image-led) · pagination | Hugo PaperMod credit |
| **Brittany Chiang** | (fixed right sidebar) 01 About · 02 Experience · 03 Projects | About → Experience → Projects → Writing → Footer | Figma/VS Code/Next.js/Tailwind/Vercel/Inter credits |
| **Letian Wang** | Home · Archives · Sitemap | Chronological feed with Disqus counts · LaTeX math · external Colab / GitHub | Hexo + NexT.Muse credit |

### 4.2 Recurring IA motifs (top-tier patterns to adopt)

1. **Three-pillar layout** (Qube's Research / Technology / Data / Trading) — group work by capability, not by chronology.
2. **Tabbed top-level content** (Man Insights macro/asset-class/client-solutions) — task-oriented slicing of a single content type.
3. **Period-terminated headlines** (Schonfeld / HRT / Optiver) — institutional cadence.
4. **Version stamp** (GSA `OS 1.2.46`) — liveness signal.
5. **Numbered section nav** (Brittany Chiang) — fixed sidebar with 01 / 02 / 03.
6. **Author byline on every research item** (Jane Street blog) — institutional voice.
7. **Status badges** (HF Spaces Running / Zero / CPU Upgrade; Replicate Official) — liveness + tier.
8. **Two-axis filter** (AQR Topic × Type; Man Series × Format) — discoverability.
9. **Read-time on every post** (Jane Street 5–21 min, Max Woolf 8–33 min) — depth signaling.
10. **Pagination > 1 page** (Jane Street 14 pages, Man 68 pages) — archive credibility.
11. **Pub-date + last-updated** (HF "about 8 hours ago" / "16 days ago") — freshness.
12. **Run-count / popularity count** (HF Spaces likes, Replicate runs) — traction.
13. **Cover image as output sample** (Replicate) — proof at a glance.
14. **"Meet our people" carousel** (Man Group) — humanizes the institution.
15. **Process-strip typography** (Optiver Build → … → Compound) — six-chip pipeline.
16. **Dedicated /now page** (Derek Sivers /nownownow.com; used by Neel Nanda, Max Woolf) — dated, opinionated, monthly.
17. **Dedicated /uses page** (uses.tech convention) — hardware, editor, terminal, server.
18. **"A Note for AI Agents"** (Shreya Shankar) — emerging pattern, prepares the site for LLM scrapers.
19. **Dual-blog taxonomy** (Raschka articles + quick notes) — long-form + short-form.
20. **Section-grouped, not chronological** (Chris Olah, Gwern) — research-as-portfolio.

### 4.3 Current portfolio IA inventory (against the synthesis)

| Current page | Maps to world-class motif | Gap |
|--------------|---------------------------|-----|
| `/` (index) | Hero + stat row + proof + research + AI showcase + OSS + experience + about | Add pitchbook bio, role chips, "talk to me about", version stamp |
| `/proof` | Work showcase | Add 2-axis filter, status badges, freshness, pagination, deep pages |
| `/projects` | Subset of proof | Already linked from feed-projects.xml.ts; verify dual-feed (project vs. research) |
| `/methodology` | Process / capability | Add process diagram, week-N scope, kill criteria, screening funnel |
| `/glossary` | Stripe-glossary pattern | Already exists — verify completeness (200+ entries target) |
| `/publications` | AQR Insights archive | Verify pagination, 2-axis filter, author byline, SSRN/arXiv links |
| `/positions` | Open roles | Verify each role has location · comp range · WFH status · ATS link |
| `/now` | nownownow.com | Verify dated, opinionated, 200–400 words, monthly cadence, freshness pill |
| `/uses` | uses.tech | Verify 1 paragraph per category (hardware, editor, terminal, server, finance data, AI infra) |
| `/for-recruiters` | Man Group hiring-manager surface | Verify PDF resume link, ATS tips, NDA-controlled-conversation protocol |
| `/contact` | Calendly + email + LinkedIn + GitHub | Verify Cal.com slot picker; add PGP fingerprint |
| `/404` | Pattern A error | Already exists — verify it lists quick links |

### 4.4 Delta — concrete action items

**P0**

1. **Add `/talks`** — Pattern A trust signal. v3.5 plans it; not yet built.
2. **Add `/colophon`** — built-with disclosure. Standard for static sites (Stripe / Stripe-doc, Brittany Chiang, Raschka).
3. **Add `/cv` (PDF generator)** — single-column, print-optimized, ATS-clean. v3.5 plans it via Playwright/Chromium.
4. **Add `/chat`** — RAG agent over portfolio content. The standout AI capability demo; HuggingFace `HuggingChat` pattern.
5. **Add `/disclosures`** — NDA scope, controlled-conversation protocol. Privacy/regulatory hygiene.
6. **Add `/privacy`** — no cookies, Plausible disclosure, GDPR statement.

**P1**

7. **Add `/positions` deep pages** — each role gets a `[slug].astro` with: scope · requirements · location · WFH status · application link · ATS keywords.
8. **Add `/research/[slug]` deep pages** — Pattern A (AQR Insights article-page). Already in MDX form probably; verify pagination + TOC + footnotes.
9. **Add `/glossary/[slug]`** — Stripe-glossary pattern. Each term: bold name · 1–3 sentence definition · nested sub-defs · cross-links to related terms.
10. **Reorganize `/publications` as AQR-style uniform list** — verify Topic × Type filter works.

**P2**

11. **Add `/sitemap-visual`** — human-readable table-of-pages. Stripe-docs landing pattern.
12. **Add `/tags/[tag]`** — Astro dynamic route, taxo pages.

---

## 5. Site-wide features missing or to verify

### 5.1 Audit against the v3.5 proposal checklist

| Feature | Current state (v3.5 proposal) | Verification needed |
|---------|-------------------------------|----------------------|
| **Search (Pagefind)** | Planned; not yet built | Verify build runs Pagefind, produces `/search/index.html`, has search input in nav |
| **RSS / Atom feed** | `@astrojs/rss` planned; `feed.xml.ts` exists for `/feed.xml`, `/feed-projects.xml.ts`, `/feed-solutions.xml.ts` | Verify all three emit valid RSS 2.0 + Atom; verify `<atom:link rel="self">`; submit to quantocracy.com |
| **Dark mode** | `prefers-color-scheme: dark` rule exists in `tokens.css`; manual toggle planned | Verify toggle button is in the **top-right of nav**, not buried in footer. Verify localStorage persistence. Verify no flash-of-light on reload (`<script>` blocking or CSS-only via `data-theme` attribute). |
| **Mobile tap targets ≥ 44px** | v3.5 mentions | Verify all nav links, social icons, and CTAs hit ≥ 44×44 px. Run through axe-core. |
| **Reading time per article** | v3.5 mentions `reading-time` package | Verify surfaced as `5 min read` pill on every `/research/[slug]` and `/proof/[slug]`. |
| **TOC on long pages** | v3.5 plans TOC | Verify generated from h2/h3 headings, sticky on scroll, collapses sub-trees, current-section highlight. |
| **Numbered citations / footnotes** | v3.5 does not explicitly plan | **Missing.** Add `[^1]` Markdown footnote pattern + bibliography at bottom. Lopez-de-Prado / AQR / Raschka all do this. |
| **"Talk to me" calendar link** | v3.5 plans `cal.com/christianmacion` | Verify the link is in the nav, not just `/contact`. Verify it surfaces 3-slot windows (Tue–Thu 18:00–22:00 PHT per v3.5 §6.4). |
| **PDF download pattern** | v3.5 plans `/cv` PDF via Playwright | Verify each research post has a "Download PDF" link. Verify consistent header/footer/typography across PDFs. |
| **"Pinned / highlighted" feature in /projects** | not yet | **Missing.** Add a `pinned: true` frontmatter flag. Render at the top with a star or "Pinned" pill. Neel Nanda pinned-post pattern. |

### 5.2 Other features typically expected

| Feature | Notes | Priority |
|---------|-------|----------|
| **`<html lang="en">`** | v3.5 mentions | P0 — accessibility WCAG 2.2 AA |
| **Skip-to-content link** | WCAG 2.4.1 | P0 |
| **`<meta name="theme-color">`** | v3.5 mentions `#FAF7F0` | P0 |
| **`<link rel="canonical">`** | v3.5 mentions | P0 |
| **`<link rel="alternate" type="application/rss+xml">`** | in `<head>` | P0 |
| **Favicon set** (16, 32, 180, maskable) | v3.5 plans | P0 |
| **Web App Manifest** | v3.5 plans `/manifest.json` | P0 |
| **OG image** | v3.5 mentions amber+black banner | P0 |
| **JSON-LD `Person`** | v3.5 plans via `Schema.astro` | P0 |
| **JSON-LD `Article`** on each post | v3.5 plans | P0 |
| **JSON-LD `BreadcrumbList`** | v3.5 plans | P1 |
| **`/llms.txt`** | v3.5 plans per llmstxt.org spec | P0 — emerging pattern, prepares for LLM scrapers |
| **`/robots.txt`** with named AI-bot user-agents | v3.5 plans | P0 — explicit `User-agent: GPTBot` etc. |
| **`/humans.txt`** | v3.5 plans | P2 |
| **404 page** | exists | P0 — verify (already in v3.5) |
| **Print stylesheet** | v3.5 plans `@media print` | P1 |
| **Reduced motion guard** | v3.5 plans `prefers-reduced-motion` | P0 |
| **Visible focus ring** | v3.5 plans `:focus-visible` | P0 |

### 5.3 Delta — concrete action items

**P0**

1. **Run a verification pass** for each feature listed in §5.1 — produce a checklist in `/colophon` (e.g. "RSS feed: yes, <https://christianmacion26.github.io/portfolio/feed.xml>").
2. **Add `pinned: true` frontmatter to 3 projects**. Render with star icon + "Pinned" pill at top of `/projects` and `/proof`. (Currently no pin mechanism.)
3. **Add `/llms.txt`** — Markdown site summary, one section per page, with link list. Per llmstxt.org spec. Pattern adopted by Anthropic, Vercel, Stripe.
4. **Add `/llms-full.txt`** — concatenated Markdown of every page, for LLM ingestion.
5. **Add `[^1]` footnote pattern** via `remark-gfm` + custom transformer. Citation list at bottom of each `/research/[slug]`.
6. **Dark mode toggle button** in top-right of nav. localStorage persistence. `data-theme="dark"` attribute pattern; no flash on reload via `<script>` in `<head>` reading localStorage before paint.

**P1**

7. **`<link rel="me">` for Mastodon / Bluesky** verification — if applicable.
8. **"Updated YYYY-MM-DD" freshness pill** on each project. Already planned but verify the field name + display.
9. **Print stylesheet** for `/cv` and `/research/[slug]`.
10. **`<link rel="alternate" type="application/rss+xml" title="…" href="/feed.xml">`** in `<head>`.

**P2**

11. **Service worker / offline-first** via Workbox. Astro integration exists.
12. **`/uses/[category]` deep pages** (optional).
13. **"Last deployed" timestamp** in footer (`portfolio.os / v6.0.0 · deployed 2026-07-09`).

---

## 6. Error pages, 404s, and edge-cases

### 6.1 World-class patterns

| Site | Error / edge-case treatment |
|------|-----------------------------|
| **Stripe Docs** | Custom 404 with a search box + "common destinations" list |
| **Astro docs** | 404 with friendly mascot, link to `/`, search box |
| **Gwern** | Search-friendly 404; everything is one HTML file anyway |
| **Shreya Shankar** | Built-with-Astro credit suggests default 404 (not customized) |
| **astro.build/themes** | "Houston, we have a problem." 404 with full nav preserved |

### 6.2 Current state

`/Users/christianmacion/Contingency/christianmacion.github.io/src/pages/404.astro` exists. v3.5 plans: same design system, search box, "try `/research` or `/contact`".

### 6.3 Delta — concrete action items

**P0**

1. **Verify 404 page renders** — visit `christianmacion26.github.io/portfolio/nonexistent` and screenshot. Check: status code is 404 (not 200), full nav preserved, search box present, 3 quick-link cards (`/research`, `/proof`, `/contact`).
2. **Add `meta name="robots" content="noindex"` to 404** — prevent SEO leakage.
3. **Verify OG image fallback** — when a social-share URL is broken, OG image still renders the site's amber+black banner.

**P1**

4. **Loading states for any dynamic content** — Pagefind search box, RAG chat widget. Skeleton loaders, not spinners. Astro `client:visible` directives help.
5. **Custom error messages on broken images** — `onerror="this.src='/fallback.png'; this.alt='Image unavailable';"` on every `<img>`. Add fallback amber+black SVG.
6. **Empty states** — for `/projects` if filtered to zero matches: "No projects match. Reset filter →".

**P2**

7. **410 Gone for retired routes** — if `/positions/some-old-role` is removed, return 410 with a "this role has been filled" message.
8. **Sitemap `lastmod`** — accurate per page.

---

## 7. Animations / interactions / "polish"

### 7.1 World-class patterns

| Pattern | Source |
|---------|--------|
| **Odometer counter** | GSA Capital, v3.5 already added |
| **Subtle hover lift on cards** | Brittany Chiang, Sebastian Raschka (1px translate, 150ms ease, no shadow) |
| **Hover-zoom on photos** | Brittany Chiang (1.02 scale, 300ms ease) |
| **Background grain / paper texture** | Gwern (CSS `background-image: url(/grain.svg)` at 4% opacity) |
| **Sticky section nav** | v3.5 already added; Brittany Chiang fixed-sidebar pattern |
| **Scroll-progress indicator** | Medium.com / Stripe-docs (top 2px amber line that fills as user scrolls) |
| **"Read time" pill** | Max Woolf, Sebastian Raschka, Jane Street |
| **"Updated YYYY-MM-DD" freshness pill** | v3.5 already added |
| **Browser-native View Transitions** | Astro 7 supports natively; zero JS |
| **Tooltip popups on links** | Gwern (`title` attribute everywhere) |
| **Floating toolbar** | Gwern (dark-mode, reader-mode, popup toggle, search) |
| **Animated SVG process strip** | Optiver chips; can add subtle 1px underline animation on hover |
| **Number-counter IntersectionObserver** | v3.5 already added |

### 7.2 Current state (per v3.5)

Already added: odometer, version stamp, sticky nav, freshness pill, hex motif.
Planned: View Transitions API, IntersectionObserver stat counter, hover reveals.

### 7.3 Delta — concrete action items

**P0**

1. **Verify scroll-progress indicator** on long pages (`/research/[slug]`, `/proof/[slug]`). 2px amber line at top of viewport. `IntersectionObserver` on a sentinel at top + `scrollY / docHeight` math. ~20 LOC.
2. **Verify hover lift on project cards** — `transform: translateY(-1px)` on `:hover` with `transition: 150ms ease`. WCAG-safe: also `transform: none` under `prefers-reduced-motion`.
3. **Verify hover-zoom on headshot** — `transform: scale(1.02)` on `:hover`. WCAG-safe.
4. **Verify all animations have `prefers-reduced-motion: reduce` guards** — global rule in `tokens.css` already planned in v3.5.

**P1**

5. **Background grain / paper texture** — single 4% opacity SVG noise, fixed-position, `pointer-events: none`. Gwern pattern. Cream-base aesthetic.
6. **Footnote tooltips on hover** — hover any `[^1]` superscript, see inline citation preview. Gwern `title` attribute pattern.
7. **Floating TOC sidebar** on `/research/[slug]` and `/proof/[slug]` (≥1200px viewport). Sticky. Current section highlighted. Brittany Chiang sidebar pattern.

**P2**

8. **Subtle "command palette"** (`Cmd-K` opens a search modal). Pagefind + a thin Svelte/preact island. Stripe-docs / Linear pattern.
9. **Image lightbox** on project screenshots. Click to enlarge. ~30 LOC with Astro + minimal JS.
10. **Animated SVG hex motif** — gentle 30s rotation in hero, paused on `prefers-reduced-motion`.

---

## 8. Prioritized action summary

### 8.1 P0 — ship in v6.0 (≤10 working days)

**Content & IA**
- [ ] Add 1-line pitchbook bio to hero (HRT pattern)
- [ ] Add "open roles you'd interview for" card cluster on `/`
- [ ] Add "talk to me about" chip list on `/`
- [ ] Add `portfolio.os / v6.0.0 · last deployed YYYY-MM-DD` version stamp
- [ ] Add 5-card `/proof` redesign: status badge, freshness pill, read-time, lead visual, 2-axis filter (Topic × Type)
- [ ] Add `/proof/[slug]` deep pages for top 5 projects (problem / methodology / chart / code / results / limitations / citations)
- [ ] Add `/proof` pagination (6 per page)
- [ ] Add `TrackRecord.astro` block with Numerai, GitHub, arXiv, Kaggle, HF, Replicate links
- [ ] Add `/methodology` process diagram (Optiver strip + SVG funnel)
- [ ] Add `/methodology` week-1 / week-4 / week-12 scope block
- [ ] Add `/methodology` kill-criterion table
- [ ] Add `/methodology` one-pager vs PDF comparison table
- [ ] Add `/talks` page (Pattern A)
- [ ] Add `/colophon` page
- [ ] Add `/cv` PDF generator (Playwright/Chromium)
- [ ] Add `/chat` RAG agent island
- [ ] Add `/disclosures` page (NDA scope + controlled-conversation protocol)
- [ ] Add `/privacy` page
- [ ] Add `/llms.txt` + `/llms-full.txt`

**Site-wide**
- [ ] Verify Pagefind search builds and is wired into nav
- [ ] Verify RSS feeds (3) emit valid Atom 2.0; submit to quantocracy
- [ ] Verify dark mode toggle (top-right nav, localStorage, no flash)
- [ ] Verify mobile tap targets ≥ 44px (axe-core)
- [ ] Verify reading time per article (research + proof)
- [ ] Verify TOC on long pages
- [ ] Verify all animations guarded by `prefers-reduced-motion`
- [ ] Add `pinned: true` frontmatter + UI on `/projects` and `/proof`
- [ ] Add `/robots.txt` with named AI-bot user-agents
- [ ] Verify 404 page (status 404, full nav, noindex, search box, 3 quick links)
- [ ] Add `<html lang="en">`, skip-to-content link, visible `:focus-visible`, alt text on all images
- [ ] Add JSON-LD `Person` (home), `Article` (per post), `BreadcrumbList` (per page)
- [ ] Add favicon set (16, 32, 180, maskable), manifest.json, theme-color
- [ ] Add footnote `[^1]` pattern on `/research/[slug]`

**Verification**
- [ ] Lighthouse: Perf ≥ 95, A11y ≥ 95, BP ≥ 95, SEO = 100
- [ ] `npm run audit` (NDA) returns 0 violations
- [ ] axe-core in CI; 0 violations
- [ ] Plausible instrumentation on `/proof`, `/research`, `/cv.pdf`

### 8.2 P1 — ship in v6.1 (next sprint)

- [ ] Add `/positions/[slug]` deep pages per role
- [ ] Add `/research/[slug]` deep-page audit (TOC, citations, PDF download)
- [ ] Add `/glossary/[slug]` deep pages (Stripe-glossary pattern)
- [ ] Add a "papers I'd co-author" teaser on `/`
- [ ] Add "most interesting thing I read this week" pill on `/` (sourced from `/now`)
- [ ] Add Cal.com inline widget on `/contact`
- [ ] Add a "Featured by" badge block
- [ ] Add scroll-progress indicator on long pages
- [ ] Add hover-lift + hover-zoom + background-grain polish
- [ ] Add floating TOC sidebar (≥1200px)
- [ ] Add footnote tooltips on hover
- [ ] Add `Last-deployed` timestamp in footer
- [ ] Add `<link rel="alternate" type="application/rss+xml">` in `<head>`
- [ ] Add print stylesheet for `/cv` and `/research/[slug]`
- [ ] Add loading-skeleton states for Pagefind search and `/chat`
- [ ] Add 410 Gone handling for retired `/positions/[slug]`

### 8.3 P2 — backlog

- [ ] Add `Cmd-K` command palette
- [ ] Add image lightbox on project screenshots
- [ ] Add animated SVG hex motif (paused on `prefers-reduced-motion`)
- [ ] Add citation count from Semantic Scholar API per arXiv ID
- [ ] Add `/uses/[category]` deep pages
- [ ] Add service worker / offline-first
- [ ] Add `<link rel="me">` for Mastodon / Bluesky
- [ ] Add `/humans.txt`
- [ ] Add `/sitemap-visual` human-readable table
- [ ] Add `/tags/[tag]` dynamic taxo pages

---

## 9. Critical anti-patterns to avoid (recruiter-eye check)

Distilled from the world-class sites surveyed. These trip up even experienced practitioners:

1. **No emoji in body copy.** AQR, Jane Street, GSA, Schonfeld — none use emoji in prose. v3.5 §4.4 plans to enforce via ESLint.
2. **No gradient mesh, no glassmorphism, no abstract 3D.** v3.5 §4.4 plans to enforce.
3. **No "Hi, I'm [name]" hero opener.** Man Group, Schonfeld, GSA — all third-person or fragment-led.
4. **No "Get in touch" pill button.** Man Group pattern: text-link CTA only.
5. **No stock photos.** Qube RT, AQR, Schonfeld — all original photography or no imagery.
6. **No "What I do" icon-grid section.** Brittany Chiang / Neel Nanda pattern: prose, not 4-card icon grid.
7. **No "Welcome to my portfolio."** Direct opening, never apologetic.
8. **No first-person hero.** HRT word-cloud is third-person cascading nouns.
9. **No color-alone signals.** v3.5 §4.1 plans: status colors always paired with icon or text label.
10. **No Tailwind.** v3.5 §3 explicitly anti-recommends shadcn/ui lock-in.
11. **No proprietary motion library** (GSAP). v3.5 §3 anti-recommends; View Transitions API only.
12. **No "Made with [stack] in [city]" footer.** v3.5 §4.4 plans to forbid.

---

## 10. Concrete narrative arc for the next 10-day sprint

Based on §8.1, the v6.0 rebuild arcs as:

**Day 1–2 — Hero + IA verification**
- Verify dark-mode toggle (top-right), version stamp, scroll-progress, mobile tap targets, axe-core baseline.
- Hero gets pitchbook bio + role chips + "talk to me about" + version stamp.

**Day 3–4 — /proof rebuild**
- New `ProofCard.astro` with status badge, freshness pill, read-time, lead visual.
- Two-axis filter (Topic × Type) reusing existing filter pattern.
- 5 deep pages `/proof/[slug]` for DSR / MCP / RAG / CombinedBook / Eval.
- Pagination 6 per page.

**Day 5 — /methodology**
- Process strip SVG, week-N scope, kill-criterion table, screening funnel, comparison table.

**Day 6 — Auxiliary pages**
- `/talks`, `/colophon`, `/cv` (PDF), `/chat` (RAG), `/disclosures`, `/privacy`, `/llms.txt`.

**Day 7 — Site-wide**
- `pinned: true` mechanism, footnote pattern, JSON-LD, robots.txt, favicon set, manifest.

**Day 8 — Verification**
- Lighthouse, axe-core, NDA audit, Plausible wiring, `feed.xml` validation.

**Day 9 — Polish**
- Background grain, hover lift/zoom, TOC sidebar, footnote tooltips.

**Day 10 — Outreach + monitoring**
- Cold-DM Tier-A WFH (Numerai, HF, Replicate, Anyscale, Together AI).
- ATS applications ×3.
- Lighthouse baseline recording.
- `git tag v6.0.0`. Final deploy to `christianmacion-portfolio.pages.dev` mirror.

---

## 11. Open questions for Christian

1. **Numerai signup status** — `/proof` needs your live profile ID. Without it, `TrackRecord.astro` will render the row but show "Coming soon."
2. **arXiv preprints** — do you have any co-authored SSRN/arXiv pieces? (v3.5 NDA rule still applies: not 19V-anything.) If yes, the methodology + publications pages should surface them.
3. **Talk history** — even one Lightning Talk / meetup / podcast guest spot qualifies for `/talks`. Without one, the page renders as "Upcoming."
4. **Public dashboards** — any QuantConnect / Numerai / Braintrust / Kaggle handles?
5. **GitHub contribution cadence** — `gh-contrib` SVG needs the username and an OAuth-free approach (GitHub's anonymous contribution-graph API is rate-limited; consider `github-readme-streak-stats` from `github-readme-stats` org).
6. **Recruiter NDA protocol** — for `/disclosures`, what's the explicit protocol for "I worked on X but cannot disclose" framing? v3.5 §7 lays out 5 approved phrasings.

---

## 12. Success metrics (carry over from v3.5 §10, updated)

| Metric | Target | Source |
|--------|--------|--------|
| Lighthouse Performance | ≥ 95 | Lighthouse CI |
| Lighthouse Accessibility | ≥ 95, 0 axe violations | axe-core / Playwright |
| Lighthouse Best Practices | ≥ 95 | Lighthouse |
| Lighthouse SEO | 100 | Lighthouse |
| LCP p75 | < 1.8s | Plausible + Web Vitals |
| INP p75 | < 200ms | Plausible + Web Vitals |
| CLS p75 | < 0.1 | Plausible + Web Vitals |
| Page weight (homepage) | < 100 KB HTML + < 80 KB JS (lazy) | `astro build` output |
| Inbound recruiter DMs | ≥ 5 in 4 weeks | LinkedIn, email |
| GitHub stars across OSS | +20 in 4 weeks | GitHub API |
| `/proof` CTR | ≥ 30% of visitors | Plausible |
| `/research` 2-axis filter usage | ≥ 15% of visitors | Plausible |
| Numerai Signals correlation | positive (any tier) | numer.ai profile |
| ATS parse rate | 100% | Jobscan, Resume Worded |
| Cold-DM response rate | ≥ 10% | LinkedIn |
| `/chat` engagement | ≥ 5% of visitors ask ≥ 1 question | Plausible + log |
| Pagefind search usage | ≥ 10% of visitors | Plausible |

**New v6.0 metrics:**
- `llms.txt` crawler hits (≥ 1 per week) — Plausible custom event
- `/talks` view count (if talks exist)
- `/chat` satisfaction (thumb-up / thumb-down per response)

---

## 13. Source corpus (18 institutional + 7 personal + 2 frameworks)

### Institutional (18)
1. [aqr.com/Insights](https://www.aqr.com/Insights) — AQR Insights archive
2. [aqr.com/Our-Firm/Careers](https://www.aqr.com/Our-Firm/Careers) — AQR careers
3. [twosigma.com](https://www.twosigma.com/) — Two Sigma
4. [janestreet.com/join-jane-street](https://www.janestreet.com/join-jane-street) — Jane Street
5. [blog.janestreet.com](https://blog.janestreet.com/) — Jane Street blog
6. [man.com/careers](https://www.man.com/careers) — Man Group careers
7. [man.com/insights](https://www.man.com/insights) — Man Insights
8. [deshaw.com](https://www.deshaw.com/) — D. E. Shaw
9. [optiver.com](https://www.optiver.com/) — Optiver
10. [schonfeld.com](https://www.schonfeld.com/) — Schonfeld
11. [gsacapital.com](https://www.gsacapital.com/) — GSA Capital
12. [qube-rt.com](https://www.qube-rt.com/) — Qube RT
13. [hudsonrivertrading.com](https://www.hudsonrivertrading.com/) — HRT
14. [numer.ai](https://numer.ai) — Numerai (JS-only, search-supplemented)
15. [huggingface.co](https://huggingface.co/) — HuggingFace home
16. [huggingface.co/spaces](https://huggingface.co/spaces) — HF Spaces
17. [replicate.com/explore](https://replicate.com/explore) — Replicate
18. [docs.stripe.com](https://docs.stripe.com/) · [docs.stripe.com/glossary](https://docs.stripe.com/glossary) — Stripe docs + glossary

### Personal reference (7)
19. [shreyashankar.com](https://www.sh-reya.com/) — Shreya Shankar (redirected from `shreya-shankar.com`)
20. [neelnanda.io](https://www.neelnanda.io/) — Neel Nanda
21. [colah.github.io](https://colah.github.io/) — Chris Olah
22. [gwern.net](https://www.gwern.net/) — Gwern Branwen
23. [sebastianraschka.com](https://sebastianraschka.com/) — Sebastian Raschka
24. [minimaxir.com](https://minimaxir.com/) — Max Woolf
25. [brittanychiang.com](https://brittanychiang.com/) — Brittany Chiang
26. [letianzj.github.io](https://letianzj.github.io/) — Letian Wang (quant-researcher reference)

### Frameworks (2)
27. [github.com/adityatelange/hugo-PaperMod](https://github.com/adityatelange/hugo-PaperMod) — Hugo PaperMod (Minimaxir's stack)
28. [astro.build/themes](https://astro.build/themes/) — Astro themes reference (Astro Astronomy theme returned 404)

### Supplementary research
29. [wandb.ai/site/articles/architecting-alpha](https://wandb.ai/site/articles/architecting-alpha-the-modern-quant-lifecycle/) — Cubist / W&B quant lifecycle
30. [byfire.substack.com/p/2025-buy-side-quant-job-advice](https://byfire.substack.com/p/2025-buy-side-quant-job-advice) — Gappy's buy-side quant career advice
31. [llmstxt.org](https://llmstxt.org/) — `/llms.txt` spec
32. [uses.tech](https://uses.tech/) — `/uses` convention
33. [nownownow.com/about](https://nownownow.com/about) — `/now` convention
34. [wilsonfreitas/awesome-quant](https://github.com/wilsonfreitas/awesome-quant) — quant resource list

---

**Next step:** review §8.1 with Christian; pick P0 cut-line for v6.0 sprint. Recommended start: **Monday 2026-07-13**. Ship `v6.0.0` on **Friday 2026-07-24** (matches v3.5 target). Re-verify lighthouse and `npm run audit` (NDA) before final tag.