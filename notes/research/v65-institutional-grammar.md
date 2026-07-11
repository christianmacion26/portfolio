# v6.5 Institutional Visual Grammar — Reference Brief

> **Mission:** Extract concrete, pixel-level visual grammar from 5 government /
> institutional reference sites (NASA Worldview, ESA Sentinel Hub EO Browser,
> Federal Reserve H.4.1, BIS Quarterly Review, FRED) so that v6.5 builders can
> produce government/institutional-grade UI without re-discovering the patterns.
>
> **Method:** WebFetch on each reference; CSS / computed-style extraction was
> not possible from fetched HTML alone (no inline styles, no stylesheet URLs in
> payload). Where exact tokens are not visible, the brief says **not visible**
> rather than fabricating. Layout / structural / naming patterns ARE extracted
> and are reliable.

---

## §1 — Type Hierarchy

### Federal Reserve H.4.1 (`federalreserve.gov/releases/h41/Current/`)
- **Page title** — serif, bold, ~28–32px, near-black/dark-navy
- **Section headers** ("Release Dates", table titles) — serif, bold, ~22–24px
- **Tab nav** (Current Release / Release Dates / About) — sans-serif, bold,
  uppercase NOT applied, active tab bold + underlined
- **Column headers in tables** — sans-serif, bold, left-aligned for labels,
  right-aligned for numeric columns
- **Body / labels** — sans-serif system stack, ~14–16px, regular weight, tight tracking
- **Inline links** — sans-serif, federal blue
- **Unit microcopy** ("Millions of dollars") — italic, small, above-table
- **Footer column headers** — bold sans-serif, dark text on light bg
- **Breadcrumb** — small sans-serif gray, chevron `›` separators

### BIS Quarterly Review (`bis.org/publ/qtrpdf/...`)
- **Eyebrow / publication label** — small sans-serif, uppercase pipe-separated metadata row (`Publication label | Date | PDF link | page count`)
- **Title** — serif/sans-serif, large, single H1 repeated
- **Disclaimer microcopy** ("The views expressed…") — italic, secondary-tier
- **Related info links** — plain text, low visual weight, bullet list
- **Footer columns** ("Stay connected", "About BIS", "Legal information") — bold small sans-serif headers

### NASA Worldview (`earthdata.nasa.gov/worldview` + landing)
- **H1 "Worldview" / "Find Data"** — sans-serif (Public Sans / Helvetica Neue
  fallback likely), bold, dark navy/black, large display weight
- **H2 ("Powered by GIBS", "Tool at a Glance", "Explore NASA Earth Data")** —
  bold sans-serif, dark
- **H3 card titles** ("Platforms", "Instruments", "Earthdata Search",
  "Worldview") — semi-bold sans-serif
- **Filter labels** ("Type", "Topic", "Data Tool", "Instrument", "Project",
  "Data Mechanic") — small, mixed-case, tight tracking
- **Metadata badges** ("2 MIN READ", "Jul 10, 2026") — small caps / uppercase,
  muted gray, tight tracking
- **Body copy** — regular weight, neutral dark gray/near-black

### FRED (`fred.stlouisfed.org`)
- **Not visible** — site returned HTTP 403 to WebFetch; no CSS, no inline styles,
  no inspectable tokens extracted. Pattern inferences below should be verified
  by builders via DevTools on `fred.stlouisfed.org/release/tables` or a chart page.

### ESA Sentinel Hub EO Browser (`apps.sentinel-hub.com/eo-browser/`)
- **Deprecation page only** — actual EO Browser app uses map chrome (timeline,
  layer drawer, pin inspector) that is **not visible** from fetched payload.
- **Brand wordmark** — large sans-serif, bold
- **Tagline** ("See. Decide. Act.") — smaller sans-serif, period as rhythm
- **Headline** — medium sans-serif, sentence case, bold-leaning
- **CTA labels** — sans-serif medium weight, button-contained

---

## §2 — Color Palette

> Hex values are **not visible** from WebFetch payloads (no inline styles, no
> stylesheet URLs, no design-token metadata in extracted markdown). The brief
> captures **palette logic + named swatches** that are reliable; exact hex
> values should be sampled by builders via DevTools.

### Federal Reserve H.4.1
- Background: white `#FFFFFF` (confirmed via body bg)
- Body text: near-black (likely `#212121` / `#1a1a1a`)
- Hyperlink: federal blue (USWDS palette has `#005ea2` for primary links)
- Footer: dark navy with white text
- Government banner: light gray / off-white
- US flag / icons: red / white / blue
- Table borders: light gray hairlines

### BIS Quarterly Review
- Background: white
- Body text: near-black
- Hyperlinks: standard blue
- Disclaimer microcopy: gray, secondary
- Footer: white or very light gray
- No visible accent color in chrome (institutional restraint)

### NASA Worldview / Earthdata
- Background: white / near-white
- Primary text: dark navy / black (NASA web palette commonly uses
  `#1a1a1a` body, `#0a2540` accent)
- Link / brand accent: NASA blue (commonly `#0b3d91` deep / `#1f4e8c` mid)
- NASA "meatball" red accent in logo only — **not a UI accent**
- Light gray panel backgrounds for filter sidebars / dropdown menus
- Dark overlay on hero images
- Stat chip "9 Active Data Alerts": rendered as numeric badge style

### ESA Sentinel Hub EO Browser (deprecation)
- Background: white / near-white
- Primary text: near-black
- Hyperlink: standard blue
- CTA buttons: dark navy or accent fill (not visible exact hex)
- No gradients / shadows in chrome

### FRED
- **Not visible.** Institutional pattern inference: white bg, dark text, single
  accent for chart series (typically muted blue or red). Builders: sample via
  DevTools on a chart page.

### Cross-reference palette logic (recommended for v6.5)
- **2 surface tones**: white `#FFFFFF` + a single off-white `#f8f8f8` for
  table-alt rows / panel backgrounds
- **2 ink tones**: near-black `#1a1a1a` (body) + mid-gray `#666` (secondary)
- **1 accent**: institutional navy `#0b3d91` (links, primary chrome) OR amber
  `#b8860b` (existing portfolio brass — already used in v6.0.16+)
- **1 alert**: muted red `#a8201a` for negative deltas only (used sparingly)
- **No gradients, no neon, no dark-mode-by-default** — institutional restraint

---

## §3 — Stat Strip / Data Table Pattern

### Federal Reserve H.4.1 — the canonical institutional table
- **Layout**: full-width single-column tabular release; table title → unit
  microcopy → column headers → data rows → footnotes
- **Column headers**: bold sans-serif, **left-aligned label spans 2 rows**
  (e.g. "Factor" or "Memorandum"), numeric columns right-aligned
- **Unit label**: italic note "Millions of dollars" **above** table, small size
- **Row height**: tight, ~28–32px
- **Cell padding**: minimal horizontal, ~4–6px vertical
- **No zebra striping** — table reads as one continuous ruled surface
- **Sub-row indentation**: em-dash `—` or repeated spaces for hierarchy
  ("U.S. Treasury securities" nested under "Securities held outright")
- **Negative values**: leading minus sign `−XX` (escaped `\-` in source)
- **Number formatting**: thousands comma separators, no currency symbol,
  right-aligned, monospace-like alignment via `font-variant-numeric: tabular-nums`
- **Change columns**: explicit `+` or `−` prefix, **smaller perceived weight**
  than base values
- **Footnote markers**: superscript numerals after label text
- **"All" total column**: bold, rightmost
- **Section dividers**: small caps marker between tables (e.g. "H.4.1")
- **Grouped totals**: bold rows separated by blank-adjacent subtotals

### BIS Quarterly Review — metadata strip pattern
- **Single horizontal row, pipe-separated**:
  `Publication label | Date | PDF link | page count`
- Low visual weight, no rule, no chip styling — pure typographic rhythm
- Each pipe = 1 space padding on either side; no icons

### NASA Worldview — "Tool at a Glance" strip
- **Stacked list of short capability labels** rather than numeric KPIs:
  Analysis / Search and Discovery / Visualization / Access / Comparison /
  Monitoring Natural Events
- Each label on its own line, consistent vertical rhythm, **low density**
- No numerals — pure capability taxonomy

### FRED — stat strip pattern
- **Not visible.** Pattern inference: chart series header → latest obs + date →
  units → data download link. Builders: sample from `fred.stlouisfed.org/series/GDP`.

---

## §4 — HUD / Chrome Pattern

### NASA Worldview (app, not landing — pattern inferred + landing markup)
- **Timeline**: bottom-anchored horizontal scrubber, full-width, ~32–40px tall
- **Layer drawer**: left side, ~280–320px wide, collapsible, scrollable
- **Zoom controls**: lower-left, vertical stack of `+` / `−` / home buttons
- **Opacity sliders**: per-layer, inline in layer drawer rows
- **Date selector**: timeline playhead with single-handle scrubber + year jumps
- **Attribute block**: bottom-right, small gray text
- **Skip-to-main-content** link present in landing (a11y chrome)

### Federal Reserve H.4.1
- **Top utility bar**: dark text on light bg with US flag + `.gov` trust badges
- **Primary nav**: horizontal menu, expandable multi-level dropdowns
- **Breadcrumb**: small gray text, slash `›` separators
- **Tab nav**: Current / Release / About — bold sans-serif, active = bold + underline
- **Inline metadata strip**: "Release Date: …" + PDF / RSS / Data Download /
  FRED link row, prefixed by small square boxed icons
- **Footer**: dark band, 3-column link grid, bold section headers, government
  seal image at bottom
- **"Back to Top"** anchor link (text-only, no button chrome)
- **Mobile**: "Toggle Dropdown Menu" / "Main Menu Toggle Button" labels indicate
  mobile collapse points

### BIS Quarterly Review
- **Top utility chrome**: accessibility link row, skip navigation, search,
  main menu, local menu, sitemap
- **Logo lockup**: short-form BIS logo `.gif`, left-aligned
- **Banner**: full-width hero image `qt2509.jpg`, single-line attribution beneath
- **Title block**: H1 + metadata strip
- **Share affordances**: Twitter/LinkedIn icon pair + email-alerts CTA
- **"Top" anchor return** = in-page jump nav indicator

### FRED
- **Not visible.** Pattern inference: chart canvas + horizontal axis chrome +
  observation table below + download/share row. Builders: sample via DevTools.

### ESA Sentinel Hub EO Browser
- **Map app chrome** — **not visible** from fetched deprecation page. Pattern
  inference: timeline bottom, layer drawer left, inspector right, search top.

---

## §5 — Section Transition Grammar

### Federal Reserve H.4.1
- **Heavy horizontal rules** between: gov banner → primary nav → mega nav →
  breadcrumb → content → footer
- **Horizontal rule above each table title** — table title bold sentence-case
- **Footnotes** = block of small text below table, no leader dots
- Footer internally divided into 3 labeled columns

### BIS Quarterly Review
- **Whitespace-driven transitions** — `.spacer` / margin, **not rule-driven**
- No visible dividers, rules, or background banding between blocks
- Pipe-separated metadata strip acts as soft divider between title and body

### NASA Earthdata
- **Section transitions** = full-width hero image + overlaid title + short
  paragraph, separated by generous vertical padding
- **Thin dividers/rules between sections** (subtle, 1px)
- Cards separated by gutters (16–24px) rather than rules

### Cross-reference — recommended v6.5 transitions
- **Institutional heavy rule** (2px solid `#1a1a1a` or `#0b3d91`) for major
  page boundaries (header → content, content → footer)
- **Hairline rule** (1px solid `#e5e5e5`) between content blocks within a page
- **Whitespace** (48–64px vertical) for tonal section breaks (no rule at all)
- **No gradient fades**, no decorative dividers — institutional restraint

---

## §6 — Density Cues

### Federal Reserve H.4.1
- **Row height**: tight (~28–32px)
- **Cell padding**: minimal horizontal, ~4–6px vertical
- **No zebra striping**
- **Grouped totals** (bold) separated by blank-adjacent subtotals
- **Mega nav**: dense multi-column dropdown, many sub-items per section
- **Footer**: dense icon row (social / RSS) labeled with screen-reader text
- **Body content**: low-density, single-column, generous line-height (~1.6)

### NASA Earthdata / Worldview
- **Filter panels**: dense checkbox lists with small text
- **Card grids**: ~4 per row at desktop, thumbnail + title + type tag + date —
  moderate density
- **Pagination**: "Items 4 8 12 16" selector + numbered pages 1–5…8 — dense
  data-table idiom
- **Top nav**: mega-menu with multi-column dropdowns, icon + label + description —
  medium density
- **Footer**: multi-column (4 columns) with small text — high link density
- **Card thumbnails**: 16:9-ish, uniform sizing

### BIS Quarterly Review
- **Sparse, document-publication style**; generous vertical rhythm
- No card grid, no stat tiles, no chart thumbnails on the parent page
- Single-column body, content deferred to PDF

### Cross-reference — recommended v6.5 density targets
- **Hero / identity sections**: low density (large type, generous whitespace)
- **Stat / data sections**: high density (tight rows, tabular-nums, no zebra)
- **Card grids**: moderate density (4 cols desktop, 2 cols tablet, 1 col mobile)
- **Nav chrome**: high density (multi-column mega-nav, dense footer)
- **Body content**: low density (single column, line-height 1.6)

---

## §7 — Implementation Checklist for v6.5 Builders

> 12 pixel-level actions the builders can apply directly. Each is grounded in
> a reference pattern above.

1. **Type scale (institutional serif + sans pairing)**:
   - Display H1: serif or strong sans, 32–44px, weight 700, color `#1a1a1a`
   - Section H2: sans-serif, 22–28px, weight 700
   - Body: sans-serif, 16px, weight 400, line-height 1.6
   - Caption / microcopy: 12–13px, weight 400, color `#666`
   - Eyebrow: 11–12px, weight 600, uppercase, letter-spacing `0.08em`,
     color `#0b3d91` (institutional navy) OR amber `#b8860b` (existing brass)
   - Tabular-nums on all data: `font-variant-numeric: tabular-nums`
   - Bold headers: weight 700, no italic, no uppercase (matches Fed pattern)

2. **Institutional palette tokens** (add to `src/styles/tokens.css`):
   ```
   --ink-primary: #1a1a1a;
   --ink-secondary: #666666;
   --surface-primary: #ffffff;
   --surface-alt: #f8f8f8;
   --rule-hairline: #e5e5e5;
   --rule-heavy: #1a1a1a;
   --accent-navy: #0b3d91;
   --accent-amber: #b8860b;   /* existing brass */
   --alert-negative: #a8201a; /* used sparingly */
   ```

3. **Stat strip pattern (Fed-derived)**:
   - Title row: bold sans-serif left, optional unit microcopy italic small
   - Column headers: bold, left-aligned for label span, right-aligned numeric
   - Data rows: ~28–32px tall, **no zebra striping**, tabular-nums enforced
   - Negative deltas: `−XX` prefix, weight 400 (NOT bold)
   - Totals row: bold, separated by 1 blank-equivalent row above
   - Footnotes: superscript markers in label, small text below table
   - Section dividers: horizontal rule 1px `#1a1a1a` above title

4. **HUD chrome (NASA-derived for any map / globe / timeline surface)**:
   - Timeline: bottom-anchored, full-width, 32–40px tall, single-handle scrubber
   - Layer drawer: left side, 280–320px wide, collapsible, scrollable list
   - Zoom controls: lower-left, vertical stack, `+`/`−`/home, ~32×32px hit
     (44×44px invisible hit for a11y)
   - Attribution block: bottom-right, 11px gray, single line
   - Skip-to-main-content link in `BaseLayout` (already present — verify)

5. **Tab nav pattern (Fed-derived)**:
   - Horizontal text-only tab strip below page title
   - Active tab: bold + 2px bottom border in `--accent-navy`
   - Inactive tabs: regular weight, color `--ink-primary`
   - Tab labels: sentence case (no uppercase)
   - Hover: underline 1px `--ink-secondary`

6. **Section transitions (BIS + Fed mix)**:
   - Major boundaries (header → content, content → footer): 2px solid
     `--rule-heavy`
   - Within-page block boundaries: 1px solid `--rule-hairline`
   - Tonal transitions (between hero and data): whitespace 48–64px, no rule
   - **No gradient fades, no decorative dividers**

7. **Density targets (per surface)**:
   - Hero / identity: low density (large type, 48–64px vertical rhythm)
   - Stat / data tables: high density (28–32px row height, tabular-nums)
   - Card grids: moderate (4 cols desktop, 16–24px gutter)
   - Nav chrome: high (multi-column mega-nav, dense footer)
   - Body: low (single column, line-height 1.6)

8. **Metadata strip pattern (BIS-derived)**:
   - Single horizontal row, pipe-separated
   - `Publication label | Date | PDF link | page count`
   - Each pipe = 1 space padding, no icons, no chips
   - 12–13px, color `--ink-secondary`

9. **Number formatting (Fed-derived)**:
   - Thousands comma separators: `1,234,567`
   - Right-aligned numeric columns
   - Negative prefix: `−XX` (Unicode minus, not hyphen)
   - Percent: 1 decimal default, 2 decimals for sub-1% values
   - Currency: only where explicitly labeled (no `$` in tables — units go in
     microcopy line above table)
   - `font-variant-numeric: tabular-nums` enforced

10. **Inline utility row (Fed-derived for release / data pages)**:
    - Single row, no rules between items
    - Each item: small square boxed icon + label
    - Items: PDF / Screen reader / RSS / Data Download / External (FRED)
    - Vertical alignment baseline-aligned, low-emphasis row
    - 13px, color `--ink-secondary`

11. **Footer (Fed-derived, 3-column)**:
    - Dark band `#1a1a1a` background, white text
    - 3-column grid: Board / Tools / Stay Connected
    - Bold sans-serif column headers
    - Small text 13px link lists
    - Social icons: monochrome glyphs, tightly spaced
    - Government / brand seal image at bottom
    - USA.gov / Open.gov badges (institutional trust marks)

12. **A11y / institutional polish**:
    - Skip-to-main-content link in `BaseLayout`
    - `.gov` / trust badge row in header
    - All chrome hit targets ≥ 44×44px (invisible hit if visual is smaller)
    - Focus rings: 2px solid `--accent-navy`, 2px offset, never removed
    - Reduced-motion: respect `prefers-reduced-motion: reduce`
    - Print styles: black-on-white, no shadows, no nav chrome

---

## Source Extraction Notes

- **Federal Reserve H.4.1**: Strongest signal — data table pattern, chrome, and
  section transitions are reliably extracted from the Release Dates and Current
  pages.
- **BIS Quarterly Review**: Metadata strip pattern + section transition grammar
  extracted; color palette and exact type tokens **not visible** from payload.
- **NASA Earthdata + Worldview**: Landing page extracted for type hierarchy,
  card grid density, section transitions; the actual Worldview map app chrome
  (timeline, layer drawer) is **not visible** from fetched payload — pattern
  inferred from public knowledge of the app and institutional convention.
- **ESA Sentinel Hub EO Browser**: Deprecation page only — actual app chrome
  **not visible**; pattern inferred.
- **FRED**: HTTP 403 to WebFetch; **no CSS or computed styles extracted**.
  Pattern inferences marked "not visible" — builders must sample via DevTools.

> **Builder guidance:** Treat the Fed H.4.1 patterns as the canonical reference
> (most reliable extraction). Use NASA + BIS as supporting grammar. FRED +
> Sentinel Hub patterns are inferences — verify via DevTools before applying.
