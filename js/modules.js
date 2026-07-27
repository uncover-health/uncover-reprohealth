// Full-screen reader for Teacher training modules and grade-band lesson plans.
// Any opener (.module-card or .lesson-pill) carries its structured content in a
// <template>; we clone it into one shared overlay. Module cards show a number
// badge; lesson pills show an eyebrow line (grade band + time). Esc, the close
// button, or a click outside closes it.
document.addEventListener('DOMContentLoaded', () => {
  const openers = document.querySelectorAll('.module-card, .lesson-pill');
  if (!openers.length) return;

  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay module-reader';
  overlay.innerHTML = `
    <div class="modal-box mod-box" role="dialog" aria-modal="true" aria-labelledby="mod-title">
      <button class="modal-close" aria-label="Close">✕</button>
      <div class="mod-head">
        <span class="mod-num"></span>
        <div class="mod-headings">
          <span class="mod-eyebrow"></span>
          <h3 class="mod-title" id="mod-title"></h3>
        </div>
      </div>
      <div class="mod-scroll"></div>
    </div>`;
  document.body.appendChild(overlay);

  const numEl = overlay.querySelector('.mod-num');
  const eyebrowEl = overlay.querySelector('.mod-eyebrow');
  const titleEl = overlay.querySelector('.mod-title');
  const scrollEl = overlay.querySelector('.mod-scroll');
  const closeBtn = overlay.querySelector('.modal-close');
  let lastFocused = null;

  function open(el) {
    lastFocused = el;
    const badge = el.dataset.module || '';
    const eyebrow = el.dataset.eyebrow || '';
    const heading = el.querySelector('h3');
    const title = el.dataset.title || (heading ? heading.textContent : '');

    numEl.textContent = badge;
    numEl.hidden = !badge;
    eyebrowEl.textContent = eyebrow;
    eyebrowEl.hidden = !eyebrow;
    titleEl.textContent = title;

    const tpl = el.querySelector('template');
    scrollEl.innerHTML = '';
    if (tpl) scrollEl.appendChild(tpl.content.cloneNode(true));
    scrollEl.scrollTop = 0;

    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function close() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    if (lastFocused) lastFocused.focus();
  }

  openers.forEach(el => {
    el.addEventListener('click', () => open(el));
    el.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(el); }
    });
  });

  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
  closeBtn.addEventListener('click', close);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && overlay.classList.contains('open')) close();
  });
});
