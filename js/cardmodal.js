// Click-to-read popup for cards marked [data-modal]. The card's full content
// is cloned into the dialog, so a card with several paragraphs (the condition
// cards, for instance) reads in full rather than being truncated to the first.
// Clicking outside the box, pressing Close, or pressing Esc returns to the page.
document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('[data-modal]');
  if (!cards.length) return;

  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `
    <div class="modal-box" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <button class="modal-close" aria-label="Close">✕</button>
      <div class="modal-content"></div>
    </div>`;
  document.body.appendChild(overlay);

  const content = overlay.querySelector('.modal-content');
  const box = overlay.querySelector('.modal-box');
  let lastFocused = null;

  function openModal(card) {
    const clone = card.cloneNode(true);
    // strip the helpers that only make sense on the card itself
    clone.querySelectorAll('.card-cover, .expand-open, .tag-link.more').forEach(el => el.remove());
    const title = clone.querySelector('h3');
    if (title) title.id = 'modal-title';

    content.innerHTML = '';
    while (clone.firstChild) content.appendChild(clone.firstChild);

    lastFocused = document.activeElement;
    overlay.classList.add('open');
    box.scrollTop = 0;
    overlay.querySelector('.modal-close').focus({ preventScroll: true });
  }

  function closeModal() {
    overlay.classList.remove('open');
    if (lastFocused && lastFocused.focus) lastFocused.focus({ preventScroll: true });
  }

  cards.forEach(card => {
    // a real button covering the card fires on the first tap on every device,
    // iPad in desktop mode included
    const cover = document.createElement('button');
    cover.type = 'button';
    cover.className = 'card-cover';
    const heading = card.querySelector('h3');
    cover.setAttribute('aria-label', 'Read more about ' + (heading ? heading.textContent.trim() : 'this'));
    cover.addEventListener('click', () => openModal(card));
    card.style.position = card.style.position || 'relative';
    card.appendChild(cover);
  });

  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
  overlay.querySelector('.modal-close').addEventListener('click', closeModal);
  document.addEventListener('keydown', e => {
    // Esc is the site-wide quick exit, so only swallow it while a dialog is open
    if (e.key === 'Escape' && overlay.classList.contains('open')) {
      e.stopImmediatePropagation();
      closeModal();
    }
  }, true);
});
