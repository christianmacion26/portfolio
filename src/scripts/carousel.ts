/**
 * carousel.ts — driver for the StatementCarousel component.
 *
 * The component lives at `src/components/StatementCarousel.astro` and renders
 * the static HTML (slides + dots). This module wires the live behavior:
 *
 *   - Auto-advances slides on a timer (default 5s; configured per-instance
 *     via `data-interval` on the root `[data-stmt-carousel]` element).
 *   - Pauses on `mouseenter` / `focusin`, resumes on `mouseleave` / `focusout`.
 *   - Manual nav via the dot buttons (`[data-stmt-dot]`).
 *   - Respects `prefers-reduced-motion` (no auto-advance when reduced).
 *
 * Why this lives in @scripts/ instead of an inline `<script>` in the component:
 * Astro 7 sometimes drops per-component `<script>` blocks during the build
 * (the chunk never materialises in dist/_astro/, and no `<script src>` is
 * emitted on the page). Wiring it through the BaseLayout bundle — like
 * reveal-on-scroll, odometer, active-nav, copy-button, scroll-progress —
 * guarantees the driver ships on every page that includes the carousel.
 */

function initCarousel(root: HTMLElement): void {
  const slides = Array.from(
    root.querySelectorAll<HTMLElement>('[data-stmt-index]'),
  );
  const dots = Array.from(root.querySelectorAll<HTMLElement>('[data-stmt-dot]'));
  if (slides.length === 0) return;

  const intervalMs = Number(root.dataset.interval ?? '5000');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let active = 0;
  let timer: ReturnType<typeof setInterval> | null = null;

  function show(i: number): void {
    active = ((i % slides.length) + slides.length) % slides.length;
    slides.forEach((s, idx) => {
      const on = idx === active;
      s.classList.toggle('is-active', on);
      s.setAttribute('aria-hidden', on ? 'false' : 'true');
    });
    dots.forEach((d, idx) => {
      const on = idx === active;
      d.classList.toggle('is-active', on);
      d.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  }

  function start(): void {
    if (reduced) return;
    stop();
    timer = setInterval(() => show(active + 1), intervalMs);
  }
  function stop(): void {
    if (timer) clearInterval(timer);
    timer = null;
  }

  dots.forEach((d) => {
    d.addEventListener('click', () => {
      const idx = Number(d.dataset.stmtDot);
      show(idx);
      start(); // restart timer after manual nav
    });
  });

  root.addEventListener('mouseenter', stop);
  root.addEventListener('mouseleave', start);
  root.addEventListener('focusin', stop);
  root.addEventListener('focusout', start);

  start();
}

function init(): void {
  const roots = document.querySelectorAll<HTMLElement>('[data-stmt-carousel]');
  if (roots.length === 0) return;
  roots.forEach(initCarousel);
}

if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
}