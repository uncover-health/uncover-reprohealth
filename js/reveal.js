// [data-reveal="#target"] expands a panel in place, animated from 0 to its
// natural height, then released to `auto` so the panel can still grow when the
// expandable cards inside it are opened.
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-reveal]').forEach(trigger => {
    const panel = document.querySelector(trigger.dataset.reveal);
    if (!panel) return;

    panel.hidden = false;
    panel.style.height = '0px';

    let open = false;

    function setLabel() {
      trigger.setAttribute('aria-expanded', String(open));
      const label = trigger.closest('.expand-card')?.querySelector('.expand-open');
      if (label && label.dataset.openText) {
        label.textContent = open ? label.dataset.closeText : label.dataset.openText;
      }
    }

    panel.addEventListener('transitionend', e => {
      if (e.propertyName === 'height' && open) panel.style.height = 'auto';
    });

    trigger.addEventListener('click', () => {
      open = !open;
      panel.classList.toggle('open', open);
      if (open) {
        panel.style.height = panel.scrollHeight + 'px';
        setTimeout(() => {
          if (open) panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 260);
      } else {
        panel.style.height = panel.scrollHeight + 'px';
        requestAnimationFrame(() => { panel.style.height = '0px'; });
      }
      setLabel();
    });

    setLabel();
  });
});
