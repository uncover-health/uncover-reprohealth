// Teacher training modules: click a module card to open a full-screen reader.
// Each card carries its structured content in a <template>; we clone it into
// one shared overlay. Esc, the close button, or a click outside closes it.
document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.module-card');
  if (!cards.length) return;

  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay module-reader';
  overlay.innerHTML = `
    <div class="modal-box mod-box" role="dialog" aria-modal="true" aria-labelledby="mod-title">
      <button class="modal-close" aria-label="Close module">✕</button>
      <div class="mod-head">
        <span class="mod-num"></span>
        <h3 class="mod-title" id="mod-title"></h3>
      </div>
      <div class="mod-scroll"></div>
    </div>`;
  document.body.appendChild(overlay);

  const numEl = overlay.querySelector('.mod-num');
  const titleEl = overlay.querySelector('.mod-title');
  const scrollEl = overlay.querySelector('.mod-scroll');
  const closeBtn = overlay.querySelector('.modal-close');
  let lastFocused = null;

  function open(card) {
    lastFocused = card;
    numEl.textContent = card.dataset.module;
    titleEl.textContent = card.querySelector('h3').textContent;
    const tpl = card.querySelector('template');
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

  cards.forEach(card => {
    card.addEventListener('click', () => open(card));
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(card); }
    });
  });

  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
  closeBtn.addEventListener('click', close);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && overlay.classList.contains('open')) close();
  });
});
