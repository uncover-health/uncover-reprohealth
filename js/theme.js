// Dark / light mode toggle, top-right of the navigation.
// The preference is written to localStorage and re-applied by a tiny inline
// script in each page's <head>, so a returning visitor never sees a flash of
// the wrong theme before this file loads.
(function () {
  const KEY = 'uncover_theme';
  const root = document.documentElement;

  const current = () => (root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light');

  function paintButton(btn, theme) {
    const dark = theme === 'dark';
    btn.querySelector('.t-icon').textContent = dark ? '☀' : '☾';
    btn.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
    btn.setAttribute('aria-pressed', String(dark));
    btn.title = dark ? 'Light mode' : 'Dark mode';
  }

  function apply(theme) {
    if (theme === 'dark') root.setAttribute('data-theme', 'dark');
    else root.removeAttribute('data-theme');
    try { localStorage.setItem(KEY, theme); } catch (e) { /* private mode */ }
    document.querySelectorAll('[data-theme-toggle]').forEach(b => paintButton(b, theme));
  }

  document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('[data-theme-toggle]');
    if (!buttons.length) return;
    buttons.forEach(btn => paintButton(btn, current()));

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const next = current() === 'dark' ? 'light' : 'dark';

        // the icon's own half-turn runs regardless of how the page crossfades
        btn.classList.add('spin');
        setTimeout(() => btn.classList.remove('spin'), 450);

        // View Transitions give a true crossfade of the whole page, including
        // the gradient backgrounds CSS transitions can't interpolate. Where
        // they aren't supported, the colour/border transitions in the
        // stylesheet still carry the change.
        //
        // `run` is idempotent and also armed on a short timer: if the browser
        // exposes startViewTransition but never invokes the callback (headless
        // and some embedded webviews do exactly that), the theme still flips.
        let applied = false;
        const run = () => { if (!applied) { applied = true; apply(next); } };

        if (document.startViewTransition && !reduced) {
          try {
            const vt = document.startViewTransition(run);
            if (vt && vt.ready && vt.ready.catch) vt.ready.catch(() => {});
          } catch (e) { /* fall through to the timer */ }
          setTimeout(run, 120);
        } else {
          run();
        }
      });
    });
  });
})();
