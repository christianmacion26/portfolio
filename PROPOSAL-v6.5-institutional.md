# PROPOSAL — v6.5 Institutional Rebuild

**Date:** 2026-07-11
**Status:** PLAN ONLY — builders did not deliver. See AAR at `~/.claude/cache/corporate/aars/2026-07-11-v65-institutional.md` for ship decision.
**Goal:** Promote the v6.4 "Earth Mission Control" from "rich institutional" to "million-dollar institutional" by adding five primitives that close the remaining UI/UX gaps from the v6.4 integrated audit.

---

## Why this exists

v6.4 hit 88/88 = 100% but left four loose ends on home:

1. **EarthGlobe v2 looks static.** The 16 cities + bathymetry + hillshade + chrome read as a still map; nothing animates the rotation itself. Mission-control cred demands live motion.
2. **Entry-strip is too dense.** Three side-by-side chips on one row + adjacent AiEntryPoints second-tier chips fight each other. Need a 4-station landing grid that absorbs the previous entry-strip + AiEntryPoints pattern with breathing room.
3. **Type + palette still gradients slathered on.** A "tape amber" + "ink #0b0b0b" combo fights `var(--c-primary)` in places. Need 7 institutional tokens (HUD-bg/border, 2 grid-line, 3 data-up/down/flat) so terminals read as terminals and not Bloomberg fan-art.
4. **Home has no continuous telemetry row.** v6.2 leaned hard on the TraderDesk but gave no "heartbeat" between hero and the desk — should have a 4-stat live-tape mini-row that says "we're live RIGHT NOW" in mono before users scroll to the desk.

---

## Scope (4 builder agents)

| Builder                    | Files                                                                                                                  | LOC est. |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------- | -------- |
| **B1 EarthGlobe rotation** | edit `src/components/EarthGlobe.astro`                                                                                 | +60      |
| **B2 EntryStations IA**    | create `src/components/EntryStations.astro` + edit `src/pages/index.astro` (mount between Workspace and AiEntryPoints) | +300     |
| **B3 Type/Palette polish** | edit `src/styles/tokens.css` (+7 tokens) + edit `src/styles/global.css` (+5 utility classes)                           | +80      |
| **B4 Home integration**    | new live-tape mini-row + 4 section transitions                                                                         | +180     |

---

## Acceptance criteria

- **Audit pass rate:** 94/94 = 100% (88 carried from v6.4 + 6 new v6.5)
- **NDA + forbidden-string + determinism scans:** 0 violations
- **Build:** `npm run build:mirror` exit 0
- **Deploy:** `npm run deploy:mirror` exit 0
- **Live URL:** HTTP 200, byte count > 491 KB (v6.4 baseline)
- **Source checks:** `animateTransform` ≥ 1, `entry-stations` ≥ 1
- **Screenshots:** 12 PNGs (6 pages × 2 viewports) with manifest

---

## 6 new v6.5 audit checks

### 1. `globeRotating`

Load `/`. Query `svg.eg__svg`. Confirm `querySelectorAll('animateTransform').length >= 1` AND one of them has `type` containing "rotate" AND has a `dur` attribute. The rotate element wraps the globe group `<g transform-origin="center">` and animates `rotate(0 → 360)` over a long `dur` (e.g. `120s`).

### 2. `stationsGrid`

Load `/`. Query `.entry-stations` (or `[class*="entry-stations"]`). Confirm `cellCount === 4` AND each cell has:

- `[class*="id-bar"]` or `[class*="station-id"]` (e.g. "STN-01")
- `[class*="title"]` (e.g. "Methodology")
- `[class*="big-num"]` (headline number)
- `[class*="stat"]` × 3 supporting stats
- `[class*="status"]` row (status pill)

### 3. `hudChrome`

The `globeRotating` check and the existing `earthChrome` check overlap; `hudChrome` is a stricter form that confirms the chrome wrap (`.eg__chrome`) contains all 4 institutional elements (legend, scale, north, scrubber) **with non-zero bounding boxes**.

### 4. `liveTape`

Load `/`. Query `.live-tape`. Confirm `numericCount >= 4` AND `monoNumericCount >= 4` (each numeric stat uses mono font or tabular-nums). The live-tape is between hero and workspace.

### 5. `sectionTransitions`

Load `/`. Count `[class*="section-transition"]` elements. Confirm `>= 4`. Targets the 4 heaviest sections: hero → workspace, workspace → entry-strip/EntryStations, EarthGlobe → MathBehindTape, work → numbers.

### 6. `v65Tokens` (smoke test)

Load `/`. Read 7 new CSS custom properties from `:root`:

- `--c-hud-bg` (HUD panel background, dim navy)
- `--c-hud-border` (HUD panel border, faded amber)
- `--c-grid-line` (graph paper line, low alpha)
- `--c-grid-line-2` (graph paper line, stronger alpha)
- `--c-data-up` (positive delta, institutional green)
- `--c-data-down` (negative delta, institutional red)
- `--c-data-flat` (unchanged, ink-2)

All must be present and non-empty.

---

## Concrete deliverables (per builder)

### Builder 1 — EarthGlobe rotation

- Add `<animateTransform>` inside `svg.eg__svg` wrapping the existing globe `<g transform-origin="50% 50%">` group
- `attributeName="transform"` `type="rotate"` `from="0 50 50"` `to="360 50 50"` `dur="120s"` `repeatCount="indefinite"`
- Add `@media (prefers-reduced-motion: reduce)` to disable the animation
- Update `src/components/EarthGlobe.astro` comment header to note the new rotation

### Builder 2 — EntryStations IA

- Create `src/components/EntryStations.astro` (~300 LOC)
- 4-station responsive grid: `grid-template-columns: repeat(2, minmax(0, 1fr))` desktop / `1fr` mobile
- Each station: top ID-bar (mono, "STN-01" through "STN-04"), big mono number, title, 3 supporting stats, status row at bottom
- Stations ship from compiled data (e.g. methodology gate count, research corpus size, proof count, AI entry counts)
- Replace existing `<section class="entry-strip">` in `src/pages/index.astro` with `<EntryStations />`
- Drop AiEntryPoints reference from index.astro (the EntryStations absorb that function)
- Mount order: Hero → Workspace → **EntryStations** → DataIngestion → TraderDesk → Ticker → EarthGlobe → MathBehindTape → what → work → numbers → StatementCarousel → creds → CTABanner → Collaborators → KeyHintPanel

### Builder 3 — type/palette polish

- `src/styles/tokens.css`: append 7 new tokens (hud-bg, hud-border, grid-line, grid-line-2, data-up, data-down, data-flat)
- `src/styles/global.css`: append 5 utility classes:
  - `.mono-micro` — font-size 10px / line-height 14px / letter-spacing 0.04em
  - `.hud` — background `var(--c-hud-bg)` border `1px solid var(--c-hud-border)` padding 12px
  - `.data-up` — color `var(--c-data-up)` + arrow prefix
  - `.data-down` — color `var(--c-data-down)` + arrow prefix
  - `.data-flat` — color `var(--c-data-flat)`
  - `.grid-line` — `background-image: linear-gradient(...)` for paper grid on 8px grid
  - `.grid-line-2` — same with stronger alpha

### Builder 4 — home integration (live-tape + transitions)

- Add a `<section class="live-tape">` between hero and workspace in `src/pages/index.astro`
- 4 mono stats: "OPEN 14:32 UTC+8" / "POSITIONS 6" / "TARGETS 23" / "BUILDS 312 KB"
- Each stat: mono font, tabular-nums, mini-icon glyph prefix
- Add 4 section transition dividers: `<hr class="section-transition">` between Hero→Workspace, Workspace→EntryStations, EarthGlobe→MathBehindTape, Work→Numbers
- Each divider: amber rail + tiny mono caption ("END · WORKSPACE" / "BEGIN · ENTRY STATIONS" / etc.)

---

## Risk register

| Risk                                                                                       | Probability | Mitigation                                                                              |
| ------------------------------------------------------------------------------------------ | ----------- | --------------------------------------------------------------------------------------- |
| EarthGlobe rotation breaks existing 88/88 baseline (e.g. transform-origin zeros)           | low         | re-run v64-integrated-shot.mjs before/after                                             |
| EntryStations collides with existing `entry-strip` styling                                 | medium      | drop `entry-strip` entirely — EntryStations absorbs it                                  |
| Tokens leak into AiEntryPoints or Collaborators styles (regression on 88/88 visual checks) | low         | token names start with `--c-` so grep catches any drift in v65-integrated-shot manifest |
| Live-tape appears below the fold on 1440×900                                               | high        | position it just after hero, before workspace — uses top-of-fold real estate            |

---

## Ship gate

- All 6 new v6.5 checks PASS
- All 88 carried v6.4 checks still PASS
- Live URL HTTP 200, byte count > 491 KB
- 12 screenshots captured with manifest at `notes/screenshots/v65-integrated-raw.json`
- AAR at `~/.claude/cache/corporate/aars/2026-07-11-v65-institutional.md`
- Memory file at `~/.claude/projects/-Users-christianmacion/memory/portfolio-v65-institutional.md`
- Dashboard line added at `~/.claude/cache/corporate/dashboard.md`
- `package.json` bumped 6.4.0 → 6.5.0

---

## Current status (as of 2026-07-11 14:13 PST)

- **Builders:** 4 not started / no output.
  - `src/components/EntryStations.astro` does not exist
  - `src/components/EarthGlobe.astro` contains 0 `animateTransform` (only 1 `animateMotion` for arc flows)
  - `src/pages/index.astro` does not reference `EntryStations`
  - `src/styles/tokens.css` last modified Jul 10 23:44 (v6.4 baseline)
  - `src/styles/global.css` last modified Jul 11 10:40 (v6.2/v6.3 baseline)
- **Verifier (this session):** audit script authored, NDA + determinism scans run (0 violations). Did NOT deploy v6.5 because the builder work that would justify a 6.5.0 bump does not exist.
- **Verdict:** v6.5 institutional rebuild is BLOCKED. Builders must run and produce the 4 deliverables before this ship gate can fire.
