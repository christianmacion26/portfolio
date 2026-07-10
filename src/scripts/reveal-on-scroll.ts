/**
 * reveal-on-scroll.ts — Phase D-7.
 *
 * One-shot fade-in for any element with [data-reveal].
 * Triggers when the element crosses 15% into the viewport.
 * Honors prefers-reduced-motion (CSS side) and unobserves after firing.
 *
 * Total bundle: ~600 bytes minified.
 */

// Mark JS-enabled BEFORE attaching the observer so CSS can layer the
// hidden-start state on top of `<html class="js">`. Without this, sections
// remain invisible if the observer never fires (pre-hydration, headless
// full-page screenshots, etc.).
document.documentElement.classList.add('js');

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function init(): void {
  const targets = document.querySelectorAll<HTMLElement>('[data-reveal]');
  if (targets.length === 0) return;

  if (reduced || !('IntersectionObserver' in window)) {
    // Reduced-motion or no IO support — show everything immediately.
    targets.forEach((el) => el.classList.add('is-revealed'));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        // Reveal as soon as ANY pixel of the target enters the viewport.
        // The previous threshold:0.15 with -40px rootMargin was too strict
        // for tall sections on mobile viewports — the user could scroll past
        // a section before it crossed 15% visible, leaving it invisible.
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0, rootMargin: '0px' },
  );

  targets.forEach((el) => io.observe(el));

  // Safety net: after 1.2s, reveal anything still hidden (slow loaders,
  // headless browsers with virtual time, JS-disabled users that gained
  // a `js` class late, etc.). Better to show late than never.
  window.setTimeout(() => {
    targets.forEach((el) => el.classList.add('is-revealed'));
  }, 1200);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}