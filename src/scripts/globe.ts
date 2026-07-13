/**
 * globe.ts — v6.7.1.F12 + v6.10.51 — interactive Earth globe driver.
 *
 * Owner 2026-07-11: "i cant toggle and tocu and move the fucking globe"
 * Owner 2026-07-13: "whats the point of the pause button on the earth.
 *                   also I cant drag and spin the globe. I want complete
 *                   and accurate"
 *
 * Hooks the .eg__globe-rotating <g> in EarthGlobe.astro so the user can:
 *   • pointerdown / pointermove / pointerup  → drag-to-rotate (longitude)
 *   • wheel                                    → zoom (CSS scale on the SVG)
 *   • click on .eg__rotate-btn-svg             → play/pause (toggles the
 *                                                 existing checkbox; v6.10.51
 *                                                 fix — was previously
 *                                                 visual-only, no handler)
 *   • keyboard space on the checkbox           → play/pause (a11y)
 *   • double-click on the figure               → recenter to auto-rotate
 *
 * The CSS @keyframes eg-orbit already auto-rotates the globe; this driver
 * PAUSES the animation and applies an inline `transform: rotate(N deg)` to
 * .eg__globe-rotating the moment the user interacts, then resumes the
 * animation if the user double-clicks to recenter.
 *
 * Determinism: this script is purely additive. It does not modify the
 * server-rendered SVG. The server always emits the same DOM with the
 * same projection at the same longitude; rotation accumulates only on
 * the client. Server-side, BUILD_DATE controls the sun position only.
 *
 * Standing Orders honored:
 *   - No Math.random() / Date.now() (rotation is pointer-driven)
 *   - prefers-reduced-motion: reduce still disables animation (CSS only;
 *     this driver skips handlers in that mode)
 *   - Honors the existing .eg__rotate-toggle checkbox so the play/pause
 *     UI continues to work for keyboard + screen reader users.
 */

interface GlobeState {
  rotating: SVGGElement;
  svg: SVGSVGElement;
  figure: HTMLElement;
  cx: number; // SVG units — center x of disc
  cy: number; // SVG units — center y of disc
  R: number; // SVG units — disc radius
  rotation: number; // current rotation degrees (longitude offset)
  dragging: boolean;
  lastX: number;
  lastY: number;
  scale: number;
}

const STATE = new WeakMap<HTMLElement, GlobeState>();

function isReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function getState(fig: HTMLElement): GlobeState | null {
  let s = STATE.get(fig);
  if (s) return s;
  const rotating = fig.querySelector<SVGGElement>('.eg__globe-rotating');
  const svg = fig.querySelector<SVGSVGElement>('.eg__svg');
  if (!rotating || !svg) return null;
  // Read cx/cy/R from the ocean circle (single source of truth).
  const ocean = fig.querySelector<SVGCircleElement>('.eg__ocean');
  if (!ocean) return null;
  s = {
    rotating,
    svg,
    figure: fig,
    cx: parseFloat(ocean.getAttribute('cx') || '0'),
    cy: parseFloat(ocean.getAttribute('cy') || '0'),
    R: parseFloat(ocean.getAttribute('r') || '0'),
    rotation: 0,
    dragging: false,
    lastX: 0,
    lastY: 0,
    scale: 1,
  };
  STATE.set(fig, s);
  return s;
}

/**
 * Apply the current rotation + scale to the rotating group.
 * SVG <g> rotates around its transform-origin (50% 50%, view-box).
 * Scale is applied to the parent SVG so the whole composition grows.
 */
function applyTransform(s: GlobeState): void {
  s.rotating.style.transform = `rotate(${s.rotation.toFixed(3)}deg)`;
  s.svg.style.transformOrigin = '50% 50%';
  s.svg.style.transform = `scale(${s.scale.toFixed(3)})`;
}

/**
 * Pause the CSS auto-rotation animation by adding the data-paused
 * attribute. The CSS rule:
 *   .eg[data-paused] .eg__globe-rotating { animation-play-state: paused; }
 * is added below in the inline <style> block of EarthGlobe.astro.
 */
function pauseAuto(s: GlobeState): void {
  s.figure.setAttribute('data-paused', '');
}
function resumeAuto(s: GlobeState): void {
  s.figure.removeAttribute('data-paused');
  s.rotation = 0;
  s.scale = 1;
  s.rotating.style.transform = '';
  s.svg.style.transform = '';
}

function onPointerDown(fig: HTMLElement, e: PointerEvent): void {
  if (isReducedMotion()) return;
  const s = getState(fig);
  if (!s) return;
  s.dragging = true;
  s.lastX = e.clientX;
  s.lastY = e.clientY;
  pauseAuto(s);
  (e.target as Element).setPointerCapture?.(e.pointerId);
  fig.style.cursor = 'grabbing';
}

function onPointerMove(fig: HTMLElement, e: PointerEvent): void {
  const s = getState(fig);
  if (!s || !s.dragging) return;
  const dx = e.clientX - s.lastX;
  const dy = e.clientY - s.lastY;
  // Map horizontal pixels to rotation. 1 px ≈ 0.4 deg gives a natural feel.
  s.rotation = (s.rotation + dx * 0.4) % 360;
  // Vertical drag = latitude tilt (limited to ±60° for orthographic).
  // We approximate by adjusting scale slightly when dragging vertically;
  // true tilt would require reprojecting the SVG, which the build-time
  // shader does not support. Use scale as a "zoom-by-drag-down" cue.
  if (Math.abs(dy) > 4) {
    const next = s.scale * (1 - dy * 0.0015);
    s.scale = Math.max(0.6, Math.min(2.4, next));
  }
  s.lastX = e.clientX;
  s.lastY = e.clientY;
  applyTransform(s);
}

function onPointerUp(fig: HTMLElement, e: PointerEvent): void {
  const s = getState(fig);
  if (!s) return;
  s.dragging = false;
  fig.style.cursor = 'grab';
  (e.target as Element).releasePointerCapture?.(e.pointerId);
}

function onWheel(fig: HTMLElement, e: WheelEvent): void {
  if (isReducedMotion()) return;
  const s = getState(fig);
  if (!s) return;
  e.preventDefault();
  pauseAuto(s);
  const factor = e.deltaY < 0 ? 1.08 : 1 / 1.08;
  s.scale = Math.max(0.6, Math.min(2.4, s.scale * factor));
  applyTransform(s);
}

function onDoubleClick(fig: HTMLElement, _e: MouseEvent): void {
  const s = getState(fig);
  if (!s) return;
  resumeAuto(s);
}

function bind(fig: HTMLElement): void {
  if (fig.dataset.globeBound === '1') return;
  fig.dataset.globeBound = '1';
  fig.style.cursor = 'grab';
  fig.style.touchAction = 'none';
  fig.addEventListener('pointerdown', (e) => onPointerDown(fig, e));
  fig.addEventListener('pointermove', (e) => onPointerMove(fig, e));
  fig.addEventListener('pointerup', (e) => onPointerUp(fig, e));
  fig.addEventListener('pointercancel', (e) => onPointerUp(fig, e));
  fig.addEventListener('wheel', (e) => onWheel(fig, e), { passive: false });
  fig.addEventListener('dblclick', (e) => onDoubleClick(fig, e));
  // Wire the existing checkbox so the play/pause UI stays in sync.
  const toggle = fig.querySelector<HTMLInputElement>('#eg-rotate-toggle');
  if (toggle) {
    toggle.addEventListener('change', () => {
      const s = getState(fig);
      if (!s) return;
      if (toggle.checked) {
        resumeAuto(s);
      } else {
        pauseAuto(s);
      }
    });
    // v6.10.51 — fix: SVG pause/play button is purely visual (no click
    // handler in v6.5). The HTML <label for="eg-rotate-toggle"> is
    // `display: none`, so the label never receives clicks. Wire a
    // delegated click on the SVG <g class="eg__rotate-btn-svg"> so
    // tapping the visible button actually toggles rotation. Stop
    // propagation so the click doesn't also start a drag operation.
    const btnSvg = fig.querySelector<SVGGElement>('.eg__rotate-btn-svg');
    if (btnSvg) {
      btnSvg.addEventListener('click', (e) => {
        e.stopPropagation();
        toggle.checked = !toggle.checked;
        toggle.dispatchEvent(new Event('change'));
      });
    }
  }
}

function init(): void {
  const figures = document.querySelectorAll<HTMLElement>('figure.eg');
  figures.forEach(bind);
}

// Multiple init paths — the script may be a module (deferred) or end of body.
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Re-bind on view transitions (Astro client routing)
document.addEventListener('astro:page-load', init);

export {};
