/**
 * odometer.ts — Phase D-1.
 *
 * Animates [data-counter="N"] once when scrolled into view. Counter goes
 * from 0 → N over 1.2s with an ease-out cubic-bezier curve. Monospace
 * tabular-nums prevents layout shift. One-shot per element.
 *
 * Honors prefers-reduced-motion (instant snap to final value).
 *
 * Total bundle: ~500 bytes minified.
 */

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function init(): void {
  const targets = document.querySelectorAll<HTMLElement>('[data-counter]');
  if (targets.length === 0) return;

  targets.forEach((el) => {
    const finalStr = el.dataset.counter ?? '0';
    const final = Number.parseFloat(finalStr);
    if (!Number.isFinite(final)) return;

    if (reduced || !('IntersectionObserver' in window)) {
      el.textContent = finalStr;
      return;
    }

    el.textContent = '0';
    const duration = 1200;
    const start = performance.now();
    let fired = false;

    const animate = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      // ease-out cubic-bezier(0.16, 1, 0.3, 1)
      const eased = 1 - Math.pow(1 - t, 3);
      const current = Math.round(final * eased);
      el.textContent = String(current);
      if (t < 1) requestAnimationFrame(animate);
      else el.textContent = finalStr; // ensure exact final value
    };

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !fired) {
            fired = true;
            requestAnimationFrame(animate);
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.3 },
    );
    io.observe(el);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}