/**
 * hero-video.ts — driver for HeroVideo's reduced-motion video pause.
 *
 * The SVG fallback branch of HeroVideo.astro has no <video> element, so
 * this script is a no-op there — it's only meaningful on builds that
 * actually ship a `public/ambient/workspace-loop.mp4`.
 *
 * Wired via BaseLayout (not as a per-component `<script>`) because
 * Astro 7 sometimes drops inline component scripts during build — see
 * the v6.0.12 carousel bundle-fix note.
 *
 * Behavior:
 *   - On `prefers-reduced-motion: reduce`, find every `.hero-video__video`
 *     and pause it (mute autoplay is harmless, but pausing is the
 *     audited-correct behavior per the a11y checklist).
 *   - React to the media-query change so a system setting flip while
 *     the tab is open takes effect immediately.
 */
function apply(): void {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduced) return;
  const vids = document.querySelectorAll<HTMLVideoElement>('.hero-video__video');
  vids.forEach((v) => {
    v.pause();
    v.removeAttribute('autoplay');
  });
}

function init(): void {
  if (typeof window === 'undefined') return;
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (mq.addEventListener) {
    mq.addEventListener('change', apply);
  } else if ('addListener' in mq) {
    // Safari < 14 fallback. `addListener` is deprecated in the TS lib
    // (ts(6385)) but still exists at runtime for the legacy browsers.
    (mq as unknown as { addListener: (cb: () => void) => void }).addListener(apply);
  }
  apply();
}

if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
}

export {};
