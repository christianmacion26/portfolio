# Visual Diff Audit v6 — christianmacion-portfolio.pages.dev

**Date:** 2026-07-10
**Method:** CDP-driven headless Chrome screenshots (`Emulation.setDeviceMetricsOverride`) at 1280×800 (desktop) and 375×812 (mobile). One full pass over 18 pages × 2 viewports = 36 shots in `/tmp/shots-audit-v6/`. All issues observed on the live Cloudflare Pages mirror at `https://christianmacion-portfolio.pages.dev/` (the GH Pages mirror at `christianmacion26.github.io/portfolio/` is CDN-blocked in PH, so not shot here).

**Overall verdict:** the system reads institutional and senior-mostly; the visual brand (amber+black on near-black "tape") holds. **However there is one P0 production bug** (broken Proof TOC) and a cluster of template-y, "vibe-coded" decorations on every stats/eyebrow tile that undermine the institutional feel. Below are 30 concrete findings grouped P0/P1/P2.

---

## P0 — Blockers

### P0-1. `/proof/` TOC permanently says "Loading sections…" — the canonical proof gallery has no in-page nav

- **Live URL:** https://christianmacion-portfolio.pages.dev/proof/ (desktop + mobile)
- **Local source:** `/Users/christianmacion/Contingency/christianmacion.github.io/src/components/SectionTOC.astro` (lines 50–55, 61–76)
- **Issue:** Below the page eyebrow the reader sees a pill bar containing a single skeleton placeholder `Loading sections…` that **never resolves**. After 9 s of settle the bar is still empty. The actual section blocks (Identity, Credentials, Code, Research, Track, Disclosure) are present in the DOM (`data-toc-id` confirmed via `curl`) — only the TOC pill labels are missing.
- **Why it matters:** `/proof/` is the centerpiece of the v3.5 plan ("proof-before-bio IA reorder", "5-card proof section"). A hiring manager hitting `/proof/` from a forwarded link sees an empty nav and has to scroll-blind to find any proof. This is the single highest-stakes page on the site and it ships broken.
- **Fix:** Either
  1. **Quickest:** Pass explicit `items={[...]}` from `proof.astro` to `<SectionTOC />` instead of relying on the auto-discovery `<script>` (which seems to be silently failing — possibly because the inline `<script>` is hoisted by Astro but the `[data-toc-id]` selector runs before `data-reveal` finishes, or the script is being stripped by CSP — `script-src 'self'` on `pages.dev` may reject the hoisted module).
  2. **Right fix:** Audit the inline `<script>` block in `SectionTOC.astro:61–76`. Confirm it is being emitted as a hoisted module (look for the section-id selector in `_astro/*.js`). If it's missing, move the population to a build-time pass: in `proof.astro`, query `getCollection('proof-section')` (or whatever the section source is) and pass `items={[{id:'identity', label:'Identity'}, …]}` directly. The page already declares `data-toc-id` on six blocks; build-time item rendering removes the JS race entirely.

### P0-2. Mobile text overflow on the `for-recruiters/` facts table — table cells horizontally overflow 375px

- **Live URL:** https://christianmacion-portfolio.pages.dev/for-recruiters/ (mobile)
- **Local source:** `/Users/christianmacion/Contingency/christianmacion.github.io/src/pages/for-recruiters.astro` (the `<dl class="facts">` block)
- **Issue:** On mobile, the right column ("Quant Researcher (primary) · QR-Rotational · Quant Research Engineer · Research Engineer") is clipped — only "Quant Researcher (primar…" is visible, then the "LOCATION" cell runs off the right edge ("…remote-first" cut). Every row from `TARGET SEATS` down is clipped.
- **Why it matters:** `/for-recruiters/` is the most likely landing page for a hiring manager who received a forwarded link. Cut-off text on the first scroll-fold is a deal-breaker — it reads as broken.
- **Fix:** In the `<dl class="facts">` rules, at ≤600px set `grid-template-columns: 1fr` (or `minmax(0, 1fr)` for both columns) and put `<dt>` on its own line above `<dd>` (label-on-top pattern). Add `overflow-wrap: anywhere` and `min-width: 0` to the `<dd>` so long lists wrap instead of pushing the row. Concretely, change the breakpoint in `facts` CSS from `grid-template-columns: 18rem 1fr` to `grid-template-columns: 1fr; gap: 0.25rem 0` and bold the `<dt>`.

### P0-3. Mobile KaTeX formula overflow on Methodology, Certifications, Mistakes

- **Live URLs:**
  - https://christianmacion-portfolio.pages.dev/methodology/ — `Pr(ship) = Pr(ship | passes G1–G31) · Π Pr(Gᵢ | evidenceᵢ)` clipped to `…passes G1–G3` (the product term is gone)
  - https://christianmacion-portfolio.pages.dev/certifications/ — `cert_density = c(t)/t = 102 certs/11 months ≈` clipped (result `9.3 certs/month` missing)
  - https://christianmacion-portfolio.pages.dev/mistakes/ — `book_quality = min(wins, postmort…` clipped (closing `)` missing)
- **Local source:** KaTeX wrapper styles likely in `src/styles/global.css` or wherever `.katex-display` is styled.
- **Issue:** The math blocks render at desktop `font-size` and don't scale to 375px — the closing tokens are scrolled off-screen to the right. The hire-page centerpiece formulas are unreadable on iPhone.
- **Why it matters:** For a Quant Researcher pitch, the math is the *brand*. If the headline formula is unreadable on a phone, the credibility "passes G1–G31" promise is undermined before the reader gets past the fold.
- **Fix:** At ≤600px: `.katex-display { font-size: 0.78em; overflow-x: auto; padding-bottom: 0.25rem; }` and let the math container become `white-space: nowrap; overflow-x: auto;` so it scrolls horizontally inside the card instead of pushing past the viewport edge. Better: render the `katex` HTML at build-time with a mobile-aware `displayMode` size step.

### P0-4. Header `Resume ↓` CTA on the home page is invisible against the dark navbar

- **Live URL:** https://christianmacion-portfolio.pages.dev/ (desktop top-right; also visible in every other page header)
- **Local source:** `/Users/christianmacion/Contingency/christianmacion.github.io/src/components/Nav.astro` (line 112, `.btn--primary.btn--sm.nav__cta`)
- **Issue:** The Resume button renders as near-cream text on a near-cream background — extremely low contrast against the dark nav band. It reads as a placeholder, not a CTA. The token collision is because in dark nav context `--c-primary` flips to `#e6edf3` (line 156/219 of `tokens.css`), so `background: var(--c-primary)` becomes "white-ish button", and the text colour for primary button is inherited `--c-primary` again → light-on-light.
- **Why it matters:** The Resume download is the single most-valuable CTA on the site (a recruiter clicking it should get a PDF). Right now it looks like a disabled UI element.
- **Fix:** Two options:
  1. Give `.nav__cta` an explicit override: `background: var(--c-amber); color: var(--c-tape);` so it always reads as amber on dark nav regardless of theme.
  2. Better: in `Nav.astro` add `.nav__cta { background: var(--c-amber-deep); color: #fff; border: 1px solid var(--c-amber); }` and hover → `--c-amber`. The amber colour signals "download action" in a way that the eyebrow tags already use.

---

## P1 — High-leverage (changes that meaningfully elevate perceived quality)

### P1-1. Stat-tile corner labels are template-y noise — every numeric tile carries a tiny scribble

- **Live URLs:** Every page with stat tiles — `/solutions/`, `/experience/`, `/certifications/`, `/about/`, `/skills/`, `/resume/`
- **Local source:** A single `<StatTile>` / `<KPI>` component, likely in `src/components/`.
- **Issue:** Each stat tile shows a tiny, near-unreadable glyph in the top-right corner: `|S|`, `c(t)`, `Σcₑ`, `Σpₑ`, `Δt`, `|𝒜|`, `|𝒞|`, `g`, `C_shown`, `|D|`, `|R|`, `¬N`, `|P_q|`, `|P_a|`. These are the math notation of each metric — but they're rendered at ~10pt, half-faded, in a position that reads as "broken layout leftover", not as institutional notation. On the Skills page one tile literally says "rated" in the corner (a label for a label).
- **Why it matters:** For a hedge-fund / AQR / Jane Street reader, math notation is a vocabulary — but only when it's *legible*. Floating tiny glyphs in corners look like a CSS template that the author forgot to clean up. They distract more than they add.
- **Fix:** Either
  1. Remove all corner decorations. The big number + label is enough.
  2. Make them a proper `<dfn>` in the same amber, set at ~12pt, and place them inline *with* the label (e.g. "Solutions shipped |S| = 10") so they read as semantic math, not as ornaments.

### P1-2. Heading yellow underline bleeds past the period on every H1

- **Live URLs:** `/about/` ("Two hats."), `/proof/` ("only."), `/positions/` ("running."), `/uses/` ("work."), `/now/` ("now."), `/skills/` ("stack."), `/methodology/` ("gate.")
- **Local source:** `src/styles/global.css` (the `.h-underline` / `text-decoration: underline` / `border-bottom` rule)
- **Issue:** The yellow underline that sits under the *last meaningful word* of the H1 actually extends across the trailing space and the period. So "Two hats." appears with "_______." where the underscore is a fat amber line that runs under the period too. Looks like a typesetting bug.
- **Why it matters:** Senior typography (think Stripe, Jane Street, AQR reports) would never let a heading underline visually clip a period. It reads as a CSS mistake.
- **Fix:** Apply the underline via a `<span class="hl">` wrapping only the last word, *not* via `text-decoration: underline` on the H1 or via an H1 pseudo-element that extends to the period. Already partially done — the `.hl` class exists — but the rule is being applied too widely. Add `padding-right: 0.15em;` to `.hl` and ensure `.h-underline` markup uses `<span class="hl">word</span>` only.

### P1-3. Empty vertical band between intro and the first content section on `/glossary/`

- **Live URL:** https://christianmacion-portfolio.pages.dev/glossary/
- **Local source:** `src/pages/glossary.astro`
- **Issue:** Below the "A short dictionary…" intro paragraph there's an empty band of ~120px of pure dark background before the first section heading "Quant terms · 18" appears. This band does not appear on any other page. Reads as missing content / un-rendered TOC.
- **Why it matters:** A glossary that visually *gaps* between the intro and the first entry makes the reader think the page has stopped rendering.
- **Fix:** Find what's emitting the empty `<div>` / `<section>` — likely a placeholder for a sticky TOC that's been removed. Inspect in DevTools; likely a `<aside>` or empty grid item. Remove or reduce to zero-height.

### P1-4. `/proof/` page says "Loading sections…" — duplicate of P0-1, but flagging the visible "ON THIS PROOF PAGE" label too

- **Live URL:** `/proof/` desktop footer area
- **Local source:** `src/components/SectionTOC.astro` line 38 (`<span class="toc__label mono">{label}</span>`)
- **Issue:** The TOC sticky bar has a label `ON THIS PROOF PAGE` rendered *next to* the `Loading sections…` skeleton. So the user sees literally the words "ON THIS PROOF PAGE — Loading sections…" pinned to the bottom of the page. The label is fine; the dead skeleton is what kills it.
- **Fix:** Same as P0-1.

### P1-5. `/contact/` desktop headshot floats awkwardly into the H1 row

- **Live URL:** https://christianmacion-portfolio.pages.dev/contact/ (desktop)
- **Local source:** `src/pages/contact.astro`
- **Issue:** A circular avatar sits to the right of the H1 "Five channels. Pick the one that fits." at a small (~96px) size, half-overlapping the right margin. It looks like a sticker slapped on the heading. On mobile it's correct (large avatar above content).
- **Why it matters:** The contact page is a transactional page; a tiny floating face isn't a warm cue, it's a layout bug.
- **Fix:** Either hide the desktop avatar entirely (the avatar already appears in the `/about/` page header), or give it a clear container — e.g. `width: 240px; float: right; shape-outside: circle(); margin-left: 2rem;`. Or move it above the H1 with `display: flex; align-items: center; gap: 1.5rem;` so the avatar + H1 row reads as a single header block.

### P1-6. `/contact/` mobile shows large vertical empty space between avatar and eyebrow

- **Live URL:** https://christianmacion-portfolio.pages.dev/contact/ (mobile)
- **Local source:** `src/pages/contact.astro` + the page's responsive CSS
- **Issue:** The avatar renders large, then there's a substantial empty band, then the `CONTACT/ · 24H REPLY · NDA-SAFE` eyebrow. The band is roughly 60px of unused screen.
- **Fix:** Tighten the top padding on mobile: `@media (max-width: 600px) { .contact-head { padding-top: 1.25rem; } }` and reduce the margin between the avatar block and the eyebrow.

### P1-7. `/publications/` CTA "Want a specific paper or talk?" uses a jarring cream panel mid-page

- **Live URL:** https://christianmacion-portfolio.pages.dev/publications/ (mobile mid-scroll)
- **Local source:** `src/pages/publications.astro` (CTA section near bottom)
- **Issue:** A `<CTABanner>` component switches the local background from the dark `--c-tape` to a cream `--c-paper` panel. On mobile, this is fine, but the contrast jump is abrupt: the text on the cream panel reads as near-black on cream while the page above is amber-on-near-black. The reader's eye reads it as a different site.
- **Why it matters:** The cream CTA banner appears on multiple pages (Methodology, Proof, Publications). If it stays, it should be visibly a CTA *section*, not a background flip. Right now it reads as a stylesheet error.
- **Fix:** Either make the cream panel an explicit "card" with a 1px amber border + small drop-shadow, or invert: keep the dark background and use amber text for the CTA. Best option: replace the `<CTABanner>` `bg: paper` style with `bg: tape-2` (a slightly lighter shade of the same near-black) so the panel reads as a tonal divider, not a colour swap.

### P1-8. `/now/` paragraph link `Inspired by /now.` shows two underlines

- **Live URL:** https://christianmacion-portfolio.pages.dev/now/ (desktop + mobile)
- **Local source:** `src/pages/now.astro` (the `<a href="https://nownownow.com/about">/now</a>` markup)
- **Issue:** The link text reads "/now" and the trailing period is *not* part of the anchor — but the underlined range visually overlaps the period and the leading slash, creating the impression of a double underline.
- **Fix:** Either include the period inside the anchor: `<a href="...">/now</a>.` (so the period gets the same underline colour as the text), or apply `text-decoration-skip-ink: auto;` so the underline only appears under the glyph strokes.

### P1-9. `/publications/` eyebrow wraps awkwardly on desktop

- **Live URL:** https://christianmacion-portfolio.pages.dev/publications/ (desktop)
- **Local source:** `src/pages/publications.astro`
- **Issue:** The eyebrow `PUBLICATIONS/ · PUBLIC WORK LOG · 23 ARTIFACTS` wraps onto two lines. Compare to other pages (`MISTAKES/ · PUBLIC POSTMORTEMS` — one line) which fit. The wider content here pushes the eyebrow to break.
- **Fix:** Either shorten to `PUBLICATIONS/ · 23 ARTIFACTS` (the "PUBLIC WORK LOG" is implied) or use `<wbr>` after `WORK LOG` so wrap only happens at the intentional break.

### P1-10. `/home/` H1 fills only the left half — large dead space on the right at desktop

- **Live URL:** https://christianmacion-portfolio.pages.dev/ (desktop)
- **Local source:** `src/pages/index.astro`
- **Issue:** The H1 wraps over four lines and occupies only ~55% of the column. The right half is empty until you scroll to the headshot. The H2 deck ("Open to remote QR…") is even narrower. For a senior pitch, the H1 should fill the page width like an institutional landing page does.
- **Why it matters:** An HR reader sees lots of empty negative space on a senior portfolio's first fold — it reads as "loose" rather than "considered".
- **Fix:** Increase the H1 to span a wider container (e.g. `max-width: 64ch` on the H1, with the deck underneath capped at `48ch`). Or make the headshot float to the right of the H1 on desktop with `display: grid; grid-template-columns: 1.4fr 1fr; gap: 3rem;`.

### P1-11. `/publications/` filter chips layout looks like a default WordPress widget

- **Live URL:** https://christianmacion-portfolio.pages.dev/publications/ (both viewports)
- **Local source:** `src/pages/publications.astro` (the filter row)
- **Issue:** The chips `all 23 · papers 9 · oss 6 · workbooks 3 · press 5` look like default Astro/Tailwind chips — rounded pills with light borders, the active one being pale. They don't echo the rest of the site's amber accent system.
- **Why it matters:** For a "vibe-coded" check, the single biggest tell is a default chip group. Senior portfolios have either no chips (just sections) or chips that feel *typed* (e.g. monospace label, amber-on-dark, no rounded corners).
- **Fix:** Replace with the project's existing mono-pill pattern: `font: 500 11px/1 var(--ff-mono); letter-spacing: 0.08em; text-transform: uppercase; padding: 6px 12px; border: 1px solid var(--c-rule); color: var(--c-ink-2); background: transparent;` and the active state `color: var(--c-tape); background: var(--c-amber); border-color: var(--c-amber);`. The amber-active chip is the institutional signal — matches the eyebrow system already in use.

### P1-12. Home mobile caption is clipped to one line

- **Live URL:** https://christianmacion-portfolio.pages.dev/ (mobile)
- **Local source:** `src/pages/index.astro` (figcaption)
- **Issue:** The CTA image caption is cut off at "Sitting with the Tier-1 Certified Technical" — the sentence continues below the fold, with no visual cue that more text exists. On mobile the reader might assume that's the whole caption.
- **Fix:** Either shorten the caption to fit, or add a `…` + `See more` affordance, or render the image block with a fade-out gradient at the bottom edge of the caption so truncation looks intentional.

### P1-13. `/contact/` URL wraps mid-domain for LinkedIn

- **Live URL:** https://christianmacion-portfolio.pages.dev/contact/ (desktop)
- **Local source:** `src/pages/contact.astro`
- **Issue:** `linkedin.com/in/christianmaci on` — the URL breaks at "maci" / "on", which looks like a typo. The line break should be at a slash, not inside the username.
- **Fix:** Apply `word-break: break-all; overflow-wrap: anywhere;` to the URL `<a>` so it can break anywhere, but more importantly reduce the LinkedIn display text to just `linkedin.com/in/christianmacion` (single token, breaks at the slash naturally). Or use `<wbr>` after the `in/`.

### P1-14. `/now/` eyebrow, `/uses/` eyebrow use inconsistent date formats

- **Live URL:** `/now/` says `LAST UPDATED 2026-07-10`; `/uses/` says `LAST UPDATED 2026-07-09`. One off.
- **Local source:** both page files
- **Issue:** Eyebrow dates should be consistent — if `/now/` is the canonical dated one-pager, `/uses/` should be on the same date stamp.
- **Fix:** Sync both dates; or remove the date from one of them and use just "QUARTERLY UPDATE" / "TOOLING-EVENT UPDATE" instead.

---

## P2 — Nice-to-have polish

### P2-1. `/glossary/` mobile shows "QUANT & AI · FOR NON-SPECIALISTS" wrapping into 3 lines

- The eyebrow `GLOSSARY · QUANT & AI · FOR NON-SPECIALISTS` wraps awkwardly. Consider shortening to `GLOSSARY · NON-SPECIALISTS` or adding `<wbr>`.

### P2-2. `/home/` "CTA panel between tagline and image" reads as a visual seam

- The amber gradient bar between the tagline paragraph and the headshot image looks like a section break, but it's really just a tonal divider. Replace with a hairline `<hr>` in `--c-rule-soft`, or remove and let the `margin` do the work.

### P2-3. `/positions/` mobile shows three KPI chips wrapping

- The `No live capital · Public data only · Weekly updates` chips wrap onto 3 lines on mobile. Acceptable, but a `flex-wrap` chip group with smaller gap would feel tighter.

### P2-4. `/uses/` table reads as a vanilla `<dl>`

- The hardware table is a basic three-column grid with no border between rows. Adding a `border-bottom: 1px solid var(--c-rule-soft)` on each row would feel more like a research-system inventory.

### P2-5. `/home/` H2 "Open to remote QR, QR-rotational, or research-engineer seats" reads cold

- For an HR first-fold, the senior phrasing would be warmer — "Open to senior QR, QR-rotational, or research-engineer seats. **Currently in a fast-iteration cycle; reply window 24h.**" The current copy is technically correct but reads like a config dump.

### P2-6. `/publications/` mobile "trust/" pill row collides with the eyebrow above it

- The "trust/ tested reproducible NDA-clean RSS verified" row sits very close to the bottom edge of the filter chips. Add a `--sp-4` margin between sections on mobile.

### P2-7. Repeated `trust/ · tested · reproducible · NDA-clean · RSS · verified` microcopy

- This strip appears on `/proof/`, `/publications/`, `/methodology/`. It's a nice signal but rendering the labels as amber pills on every page feels template-y. Consider making it a single sticky footer rather than per-page repetition.

### P2-8. `/resume/` mobile formula card cuts off `where R = {…}`

- The `resume* = arg max fit(r, JD)  where  R = {R_unified, R_AI, R_quant}` card on desktop shows in full; on mobile only the LHS is visible. Same fix as P0-3 (allow horizontal scroll inside the math card on mobile).

### P2-9. `/projects/` desktop cards are dense — 4 cards per row at 1280px

- The 4-up grid makes each card very narrow. Consider 3-up at 1280, 2-up at tablet, 1-up at mobile for breathing room.

### P2-10. Every H1 in the system uses the same `font-size: clamp(...)` curve

- Hero pages (`/`, `/now/`) and section pages (`/glossary/`, `/mistakes/`) all hit the same clamp. For visual rhythm, drop section H1s one notch (e.g. `clamp(2rem, 4vw, 2.75rem)`) so the home page hero still feels "hero".

### P2-11. Eyebrow mono-spaced caps are great, but the period after `CTA` in the masthead is rendered as a `®` glyph

- Look at the home page: "Christian T. Macion, CTA®" — the trailing glyph reads as a registered-trademark mark. If the intent was "CTA" as the certification label, fine — but render it as a `<sup>®</sup>` so it sits high. Right now it's baseline, and it reads as a small "R" inside a circle at the same size as the CTA letters, looking like a brand mark.

### P2-12. `/contact/` "response_time ≤ 24h given JD attached" mono-styled callout is good, but lacks the green-dot status indicator used on `/now/`

- Consistency: the "open" status dot used on `/now/` and the experience page should appear here too.

### P2-13. `/about/` "One method. Two hats." underline bug (same family as P1-2)

- Already covered.

### P2-14. `/home/` mobile tagline "Open to remote QR, QR-rotational, or research-engineer seats…" wraps with one awkward break

- "Eleven-agent" reads better than "Eleven- agent" — adjust `hyphens` and `overflow-wrap` rules.

### P2-15. Site-wide: every page has the same fixed top-of-page eyebrow color/weight

- For visual rhythm across the 18 pages, one or two pages could break the eyebrow colour (e.g. `/proof/` could use `--c-amber-deep` instead of `--c-primary-2-deep`) to signal "you're now in the proof section". This is institutional design — think Stripe Docs section-headers.

---

## Summary scorecard

| Dimension | Score (1–10) | Note |
|---|---|---|
| Brand / palette cohesion | 8 | Amber+black+cream holds everywhere |
| Typography hierarchy | 6 | Heading-underline bug + corner-glyph noise drag this down |
| Desktop institutional feel | 7 | Strong on Proof, Methodology, Resume; weak on Contact, Home (empty right half) |
| Mobile rendering quality | 5 | Proof TOC broken; KaTeX overflow on 3 pages; for-recruiters facts table clipped; image caption clipped |
| Information density | 8 | Senior-research tone is consistent |
| "Vibe-coded" tells | 6 | Filter chips on Publications, corner-glyphs on stat tiles, underline past period — three big tells |
| Production correctness | 5 | `/proof/` is broken in production (P0-1) |

**Top three things to fix before any HR-facing share:**
1. P0-1 — proof page TOC (15-min fix if you pass `items={[...]}` explicitly).
2. P0-2 — for-recruiters mobile facts table (CSS breakpoint change, 30 min).
3. P1-1 — strip the corner-glyph decorations on stat tiles (one find/replace, 1 hour for the global component).

**One-liner for the user:** The portfolio is institutional-grade on content and palette; the only thing that breaks the spell for an AQR/Jane Street reader is the broken Proof TOC and the math-decorations on stat tiles — both small to fix.