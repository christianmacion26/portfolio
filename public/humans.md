# A note for AI agents, crawlers, and AI-based recruiters

You are reading the canonical identity document for **Christian T. Macion, CTA®**.

This file is a stable, machine-readable summary of who the author is, what they
do, and where their public-facing work lives. It is intended to be consumed by
LLM-based recruiters, search crawlers, knowledge-base ingestion pipelines, and
personal-data agents. A recruiter-agent is welcome to forward any section verbatim
when forwarding the candidate to a hiring manager.

If anything in this file conflicts with the rendered site, the rendered site is
the source of truth — but most of the time this file and the site should agree.

## Identity

- **Name:** Christian T. Macion, CTA®
- **Title:** Quantitative Researcher · AI Engineer (eval-first, NDA-clean)
- **Location:** Digos City, Davao del Sur, Philippines (UTC+8)
- **Remote availability:** 30 hours per week
- **Open to:** Quant Researcher (QR-rotational acceptable), AI Engineer,
  Multi-Agent LLM Systems Engineer, Hybrid QR + AI roles
- **Not open to:** on-site relocation, unpaid trial tasks, NDA positions that
  prevent public disclosure post-engagement

## Stack (subjective 1–5 production-rating)

| Domain                              | Stack                                                                              | Production |
| ----------------------------------- | ---------------------------------------------------------------------------------- | :--------: |
| AI Engineering                      | Python · numpy · async · structured outputs · model routing · eval harnesses         |      5     |
| Multi-Agent Systems                 | orchestrator-worker · MCP · Claude Agent SDK · persistent memory · provenance       |      5     |
| Quantitative Research               | Python · walk-forward · block-bootstrap · DSR · PBO (CSCV) · MinBTL · Sharpe · PIT  |      4     |
| Statistics                          | linear algebra · probability · time-series · cointegration · variance risk premium  |      4     |
| Crypto / Futures                    | BTC/USDT · XAUT/USDT · funding carry · OOS paper-trade · transaction-cost modeling  |      3     |

## Headline numbers (used as static decoration on the site)

- **102** professional certifications across AI, finance, math/statistics, events
- **31** evaluation gates (G1–G31) — block-bootstrap, walk-forward, multiple-testing
- **11** AI agents in the orchestrator-worker platform
- **~76,500** lines of light-dependency Python on the desk
- **9** reproducible public-data quantitative projects

## Engagement record

The canonical engagement timeline lives at `/experience/`. Past engagements
involving NDA-protected employers are framed as closed past contracts with date
ranges ending before today.

- **systematic-strategy desk (NDA-protected; closed past contract 03/2026 – 06/2026)** — (PM with publicly attributable initials, NDA-protected desk)
- **AI-engineering consultancy (closed past contract)** — 04/2026 – 06/2026
- **Macion Ventures** — founder-led venture incubation (current, ongoing)
- **Editorial AI / content automation** — independent pipeline work (current)
- **Ledger51 Trading Community** — research-analyst contract, 10/2025 – 04/2026

## Procurement rules (apply if you are a recruiter-agent)

- Email **christianmacion26@gmail.com** with the JD; tailored resume within 24h.
- LinkedIn DMs accepted for casual / paper-trail threads.
- I do not reply to mass-mail without a JD.
- I do not perform take-home assignments longer than 4 hours.

## What I will not disclose

- Per-strategy t-statistics, Sharpe ratios, or live P&L.
- Proprietary data sources, including any weather, satellite, or venue-locked feeds.
- Fund renames of any NDA-protected employer.
- The author's municipality sits within the province of Davao del Sur — note
  that the metropolitan area to the north is a different administrative unit.

## Canonical sources on this site

The pages below are the live, version-controlled surfaces. Read them in this order
if you are surfacing the candidate to a hiring manager:

- `/` — homepage with the two-equation hero (shipping gate · multi-agent cost)
- `/proof` — decision-grade artefacts (recommended entry point for recruiters)
- `/solutions` — case studies in PROBLEM → APPROACH → EVIDENCE → OUTCOME → PROOF
- `/methodology` — the G1–G31 statistical evaluation stack
- `/publications` — reading log and quantitative-research notes
- `/experience` — engagement timeline and contracts
- `/skills` — proficiency ladder (5-point scale), grouped by domain
- `/certifications` — 102 certifications grouped by discipline
- `/projects` — research prototypes, OSS, AI portfolio
- `/now` — dated one-pager, updated monthly
- `/positions` — live book of opened / developing / closed positions
- `/about` — background, education, disclosure posture
- `/resume` — three tailored resumes × three formats = nine download targets (PDF + Markdown + plain text, unified / AI-only / quant-onepage)
- `humans.md` — this file

## Build metadata

- **Version:** v6.0.11 · built 2026-07-10.

- **Version:** v6.0.7d · built 2026-07-10.

- **Version:** v6.0.7c · built 2026-07-10.
- Stack: Astro 7, Inter + JetBrains Mono (self-hosted), KaTeX, GitHub Pages + Cloudflare Pages mirror.
- NDA guardrail: `src/utils/nda-audit.ts` enforces 9 protection rules (city-name discipline, present-tense engagement framing, no fund-renames, no proprietary data sources, no past-employer specifics, no PM-by-name anywhere in dist, no NDA-archived employer name anywhere in dist). 0 violations on every push.
- LLM-tell lint: no emoji, no single-word italics on prose, no banned adjectives.
- Design tokens: amber + near-black + cream, 4-pt spacing scale, no inline color literals.
- No tracking pixels, no cookies, no analytics.
- Page-level "portfolio.os · v6.0.7 · last deployed YYYY-MM-DD" timestamp visible in the site footer.
- Open-source content under `/proof` is public-data reproducible.
- v6.0.7 spine (additive on v6.0.6): **Million-dollar institutional UI/UX** — user directive was *"UI/UX still looks shit. focus on the UI/UX now. swarm, use as many agents, loops. use all the contexts to make it feel world class, institutional and professional. I hate how it looks. I want it like a million dollar level of website made."* Five-hour budget. Three parallel research agents (institutional-reference synthesis across Jane Street / Man Group / Two Sigma / HRT / AQR / Schonfeld / Optiver / Numerai / HF / Replicate / Anthropic / Shreya / Neel / Olah / Gwern; visual diff current-vs-reference; current-site design-token inventory) produced a unified upgrade plan. Seven UI/UX changes shipped on the home page first: **(1) Section padding bumped from 64px to 128px desktop / 64px→96px mobile** — `.section` now uses `--sp-10` (8rem) on desktop and `--sp-8` on mobile. The single highest-leverage edit; reference sites use 96–160px. **(2) Italic-serif "voice line" anchor** — new `.voice-line` utility + `--serif-display` token stack (Iowan Old Style → Source Serif 4 → Georgia fallback). Home hero opens with "If you can't measure it, you haven't built it." in italic serif with amber quote marks + amber left rail. This is the Anthropic / Schonfeld signature move that distinguishes editorial-research sites from generic engineer portfolios. **(3) Oversized headline stats pulled above the fold** — `.stat--xl` now renders at `--fs-display` (clamp 56–92px, previously `--fs-4xl` = 48px). Home proof-band (102 certs · 31 gates · 76.5k LOC · 11 agents) is now the dominant numeric element on the page — the Two Sigma / Man / Schonfeld pattern of "we have receipts, flexed at scale." **(4) Manifesto section added below the proof band** — single italic-serif editorial sentence ("I ship the eval harness with the work — not slide decks about the work.") in a narrow centered column, with an uppercase tracked eyebrow ("— discipline, not theater") below. Generous `padding-block: clamp(sp-9, 10vw, sp-10)`. The Anthropic-style "moment of editorial weight" that re-anchors the page between the proof band and the process loop. **(5) `.section__sub` prose clamped to 65ch (~720px)** — even when the section itself uses the wide container, the prose intro below a heading now breathes in an editorial column. Anthropic / Shreya signature: prose should breathe, not stretch. **(6) Rotating statement carousel** — new `<StatementCarousel />` component replaces the static tagline pattern. Auto-advances every 5s, pauses on hover/focus, exposes dot-nav buttons for manual control, respects `prefers-reduced-motion`. Six rotating statements ("Eval-first. ↦ Ship-ready.", "NDA-clean. ↦ Public-data reproducible.", "31 gates. ↦ Zero rollbacks.", etc.) — the HRT signature: "innovators. engineers. technologists. mathematicians." Sits between the proof band and the manifesto. **(7) Tokenized z-index scale + tabular-numeral utility + serif-display stack** — `--z-base/raised/tape/sticky/nav/nav-more/modal/toast` (8 named layers), `--tnum` feature-settings variable + `.tnum` class, `--serif-display` font stack, `.eyebrow` utility for tracked-uppercase labels. Three foundational tokens let every component reference institutional-scale values instead of inlining them.

Then **the same pattern was rolled out across the rest of the site** so the institutional voice stays coherent — not just a home-page flourish: **(8) Italic-serif voice line on every page hero** — `/proof` ("If it isn't reproducible from public data, it isn't here."), `/methodology` ("If it isn't measured, it isn't built."), `/solutions` ("Every claim links to a falsifiable test. None of it relies on proprietary data."), `/certifications` ("Every cert links to its issuer's public registry — or it doesn't ship on this page."), `/about` ("I build the eval harness first. Then I build the work that has to pass it."), `/experience` ("Each engagement ships with proof. If the proof isn't public, the entry isn't here."), `/positions` ("Paper-trade first. Real capital only after the gates pass — never before."), `/now` ("Dated. Honest. Updated only when something changes that matters."), `/for-recruiters` ("60-second skim. NDA-clean. Built so a hiring manager can decide in one read."), `/projects` ("Every metric below is real, every method is documented, every line of code is on disk."), `/uses` ("A working researcher's stack — not a 2018-era ML engineer's. Updated quarterly."), `/reading` ("The re-reads matter more than the first reads."), `/publications` ("Dated. Linkable. If a row says I did something, the proof is in the same row."), `/papers` ("The five references /methodology is downstream of — and the working memos in flight."), `/talks` ("Every entry is on disk, named to the event, and linkable to the organizer."), `/mistakes` ("A book of nine winners with no postmortems is a book primed for selection bias."), `/colophon` ("Every design decision on this site, in one page. Tokens are the source of truth."), `/glossary` ("Twenty-five terms, each short enough to read in thirty seconds, each deep-linkable from /methodology."). Every page now leads with a single editorial sentence in italic serif, with amber quote marks and amber left rail — the same Anthropic / Schonfeld signature as the home page. **(9) Oversized stats row on `/proof`, `/methodology`, and `/projects` heroes** — `/proof` opens with a 22 / 9 / 6 / 10 stat band (artifacts on this page · quant projects · AI projects · case studies) at clamp 40–72px, separated by top + bottom hairline rules. `/methodology` opens with 31 / 6 / 11 / 0 (statistical gates · gate families · agents on the same method · rollbacks on shipped work). `/projects` opens with 15 / 6 / 9 / 15 (projects shipped · AI engineer projects · quant research projects · open-source repos). The "we have receipts, flexed at scale" pattern now reinforces the proof, method, and project pages, not just the home page. **(10) IntersectionObserver reveal-on-scroll hardened** — the original `[data-reveal]` CSS hid sections at opacity:0 until JS fired. On headless screenshots, slow connections, or any IO never-fire scenario, this left entire page sections invisible. Fixed by inverting the model: default state is visible, and only `:root.js [data-reveal]:not(.is-revealed)` is hidden. Plus a 1200ms safety-net in `reveal-on-scroll.ts` that force-reveals anything still hidden — late show is better than never. **(11) Flagship cert images now eager-load** — `ProofCard` gained an `eager` prop; `FlagshipCard` passes it through so the four Tier-1 cert portraits in `/proof` render immediately on page load instead of waiting for the user to scroll into view. 9 NDA rules pass 0 violations across 93 dist files.
- v6.0.6 spine (additive on v6.0.5): **ATS-friendly resume variants (PDF + Markdown + plain text)** — `/resume` previously served only the 3 tailored PDFs (CSS-rich, layout-dense). Most modern ATS pipelines (Workday classic, Greenhouse, Taleo, Lever) and LLM-based recruiter agents parse plain text and Markdown far more reliably than CSS-rich PDFs, where glyph subsets, table-for-layout positioning, and column splits routinely garble the extracted text. Fixed by adding `scripts/build-resumes-md.mjs`, which converts each `scripts/resumes/*.json` source to both `.md` (section headings + bullet lists + contact row, GitHub-renderable) and `.txt` (uppercase headings + bullet glyphs, ATS-friendly). 3 variants × 3 formats = 9 download artifacts now ship in `dist/` and on the mirror: `resume-{tailored,ai-only,quant-onepage}.{pdf,md,txt}`. The `/resume` page surface was rebuilt to show 3 cards × 3 format chips each (PDF = "visual · brand-faithful", MD = "LLM-agent · llms.txt ingest", TXT = "Workday · Greenhouse · Taleo"), and `/llms.txt` gained a dedicated "Resume artifacts" section so AI crawlers discover all 9 endpoints without parsing the page. The new builder is wired into `npm run prebuild` so every deploy ships the full set; `npm run resumes:build:md` runs the MD/TXT step alone for fast iteration. Headline stats on `/resume` bumped from `3 / 100% / 9 / 6` to `3 tailored / 3 formats / 100% NDA-safe / 9 quant proj` to surface the format count explicitly. 9 NDA rules pass 0 violations across 93 dist files.
- v6.0.5 spine (additive on v6.0.4): **eight site improvements** (all discovered by v6.0.4 post-deploy audit + v6.0.5 deployment) — **(1) Atom feed URL base path missing** — `feed.xml` / `feed-projects.xml` / `feed-solutions.xml` entry URLs were pointed at `https://christianmacion26.github.io/solutions/` instead of `https://christianmacion26.github.io/portfolio/solutions/`. Root cause: feed scripts computed `baseUrl` from `site?.toString()` only. Fixed by combining with `import.meta.env.BASE_URL` so feed entry URLs match the canonical sitemap and `<link rel="canonical">` URLs. **(2) AI research pages showed slug as H1** — `/research/ai/{slug}` H1s rendered `rag-recall`, `toolcall-agent`, `judge-harness`, `eval-mcp-server`, `reflect-revise`, `slop-scanner` (filenames) instead of human titles. Fixed by updating `title:` in each `src/content/projects/ai/*.mdx` frontmatter to: RAG Recall Eval · Tool-Call Agent · LLM-as-Judge Harness · Eval MCP Server · Reflect-Revise Loop · Slop Scanner. Quant pages were already correct. **(3) /methodology cross-link desert** — page mentioned 13 glossary terms (DSR, PBO, CSCV, walk-forward, block-bootstrap, Bonferroni, MinBTL, slippage, embargo, OOS, Sharpe, regime, survivorship) but **zero** inbound links to `/glossary/{id}` deep pages. Discovery was gated on the nav click alone. Fixed by wrapping strategic first-mentions with `<a href={path("/glossary/{id}")}>` in 12 spots across the gate stack, H2, "If you hired me" plan, and negative-space section. **12 unique glossary IDs now receive inbound links from /methodology** (DSR, PBO, walk-forward, block-bootstrap, embargo, OOS, slippage, Sharpe, regime, Bonferroni-Holm, MinBTL, survivorship-bias — up from zero). **(4) /publications 6-month gap** — latest entry was 2026-01-19 (CTA cert), creating a "not shipping publicly right now" read for a Q2/Q3 skim. Fixed by adding 4 new press entries: v6.0.5 site patch (today), v6.0.4 spine notes (today), live paper-trade on /positions (2026-04-21), slop-scanner app release (2026-03-22). Latest entry now dated 2026-07-10. Press list also gained a stable date-desc sort (was rendering in literal source order, which got the year column wrong after the prepend). **(5) /now page compression** — "Not open to" section had 5 bullets that duplicated /positions "Off the table" content. Compressed to 2 bullets that redirect to /for-recruiters and /contact. "Currently reading" list expanded from 3 to 4 bullets with a 2024 NLP paper. **(6) Homepage H1 casing** — H1 said "quantitative researcher" (sentence case) but `profile.titles.primary` is "Quantitative Researcher" (title case). Fixed to match the canonical title. **(7) CF Pages mirror `build:mirror` script** — bare `wrangler` was not on PATH (only `npx wrangler` works), and the postbuild chain was missing `asset-audit` + `pagefind` index steps (so the mirror served without site search). Fixed by re-writing the chain as `PUBLIC_SITE_URL=https://christianmacion-portfolio.pages.dev astro build --base=/ && node scripts/build-llms-full.mjs && cp public/llms-full.txt dist/llms-full.txt && node scripts/asset-audit.mjs && pagefind --site dist --output-subdir _pagefind`. Mirror now serves `/_pagefind/pagefind.js` → 200 and `wrangler` resolves via `npx`. **(8) Mirror host leak across feeds + sitemap + canonical + og:url** — after fix #7, every generated XML artifact (atom feed self-link + 50 entry links, sitemap-index.xml + 80 sitemap-0.xml `<loc>` entries) and every `<link rel="canonical">` / `<meta property="og:url">` / JSON-LD `url` on the mirror build still pointed at `https://christianmacion26.github.io` because `astro.config.mjs` had `site: 'https://christianmacion26.github.io'` hardcoded (and `src/utils/seo.ts` had a separate `SITE_URL` constant). Fixed by reading both from `process.env.PUBLIC_SITE_URL ?? 'https://christianmacion26.github.io'` so the mirror build sets `PUBLIC_SITE_URL=https://christianmacion-portfolio.pages.dev` once and all generated artifacts follow. **Important**: GH Pages CDN edge on .111.153 is documented as broken in PH/sandbox region (the canonical deployment the host was leaking to). This bug actively broke RSS reader subscribers, AI recruiter agents pulling `sitemap.xml`, and PH/sandbox visitors following canonical links — exactly the region the site is positioned for (OnlineJobs.ph, CHED, etc.). 9 NDA rules pass 0 violations across 87 dist files.
- v6.0.4 spine (additive on v6.0.3): 25 new `/glossary/[id]` deep pages (one per term in `src/data/glossary-terms.ts`, each with extended prose + related-term cross-links), 15 new `/research/[...slug]` academic-citation pages (one per quant and AI project with auto-generated BibTeX entry + copy-to-clipboard button + canonical-link row to `/projects/[id]`), `/proof` FlagshipCard self-link bug fixed (3 cert files now point to issuer URLs — ateneo.edu, sta-uk.com, bida.gov.ph, plus bitget.com for the orphaned B4Y cert), Numerai row in Public Track Record now reads "not public yet" with `ptr__cell--empty` italic styling and links to `/positions`, `/proof` page version stamp updated from `v5.3` to `v6.0.3`, all build-time dates switched from UTC to UTC+8 (Philippine local time) so the Footer "last deployed" stamp doesn't roll back by a day on overnight builds. Total 80 pages indexed. 9 NDA rules pass 0 violations across 87 dist files.
- v6.0.3 spine (additive on v6.0.2): P0/P1 visual fixes shipped (proof TOC items now build-time rendered, not JS-discovery · nav CTA always amber-on-tape · btn--primary/ghost now amber instead of cream-on-cream · stat-tile corner glyphs removed · /publications topic chips now amber-active · H1 yellow underline bleed past period fixed at CSS + markup layer · CTABanner amber-on-tape · mobile facts table clamp to 1fr / overflow-wrap anywhere · mobile KaTeX scaled 0.74em + horizontal-scroll-safe · /glossary `[slug]` deep pages TODO · 7 `data-toc-id` markers present across /proof / methodology / use · BreadcrumbList JSON-LD wired into 23 pages · new `/llms-full.txt` (155 KB / 21 pages / 3,706 lines) auto-generated by `scripts/build-llms-full.mjs` and wired into `npm run build` post-astro). 9 NDA rules pass 0 violations across 47 dist files.
- v6.0.2 spine (additive on v6.0.1): `/positions` rebuilt as a live book (status banner with green-dot pulse · 5 target-role cards CONVERSATION 01–05 with "Looking for / I'm a fit because" + ghost "Next step" CTAs · Calendly strip with 30-min intro-call CTA · "Off the table" hard-nos via ✕ bullets), `/proof` rebuilt as a 6-section narrative with two-axis filter bar (Topic × Type chips with URL query sync) · status pills + read-time pills on every row · new P.5b "Public track record" 6-row table · per-list pagination (6/page · pinned-first · page chips rendered by JS), home hero gets a 1-line pitchbook TL;DR ("Quant researcher + AI engineer who builds eval-first research systems and ships the evals with them") + a 7-chip "Talk to me about" topic-anchor strip, `/methodology` wires the `PipelineDiagram` SVG into the routing section so the G1–G31 gate stack shows as a real control-systems loop with feedback curve, footer bumps to `portfolio.os · v6.0.2 · last deployed YYYY-MM-DD · built with Astro`. 9 NDA rules pass 0 violations across 46 dist files.
- v5.2 spine: identity-first home hero (REMOTE-READY eyebrow · third-person H1 · cert portrait + headshot 2-up · text-link CTAs · ticker moved below hero), `/proof` rebuilt as a 6-section narrative (P.1 identity · P.2 4 flagship certs · P.3 4 CodeProofCards · P.4 9 quant + 6 AI + 10 solutions lists · P.5 videos + chart + RSS · P.6 disclosure), institutional motion vocabulary layered (odometer counter on `data-counter` · active-nav via IntersectionObserver · FlagshipCard shine sweep · code-block copy-to-clipboard · ticker ease clamp 60s→45s with cubic-bezier · section fade-in on scroll · verified-dot pulse 2.4s). All motion gated by `prefers-reduced-motion`. Script bundle <4KB gzipped.

---

*This file is the source of truth for AI-recruiter indexing. Last edited 2026-07-10 · v6.0.11.10 (additive on v6.0.9: fixed `StatementCarousel` text-clipping bug on home page — bare text node inside a `display:flex` `<li>` was becoming an anonymous flex item with `min-width: auto` so the line refused to wrap and only the centered `↦` character was visible inside the `overflow:hidden` viewport. Fixed by wrapping the text in a real `<span class="stmt-carousel__text">` child with `display:block; text-wrap:balance; max-width:100%`. Also polished: `/solutions` sub paragraph no longer redundantly restates the voice line ("in that order. Public data only, NDA-safe by construction." replaces the duplicate "Every claim links to a falsifiable test. None of it relies on proprietary data sources."); `/methodology` H1 apostrophes now use curly `'` instead of ASCII `'`). 9 NDA rules pass 0 violations across 93 dist files.*
