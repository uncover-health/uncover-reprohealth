// REVIEW TOOL, not part of the finished site.
// Floating switcher (bottom left, clear of Quick exit) for comparing the five
// candidate palettes on the real pages. The choice is stored in localStorage
// so it survives navigation between pages.
//
// To remove once a palette is chosen: delete this file, delete css/palettes.css,
// drop both <script>/<link> tags and the data-palette line from the head
// bootstrap, then fold the winning block into the :root of style.css.
(function () {
  const KEY = 'uncover_palette';
  const root = document.documentElement;

  const PALETTES = [
    { id: '',   name: 'Current',            note: 'Persian Indigo, the palette on the site today', swatch: ['#3D1472', '#9580D4', '#75ADC9', '#FFDDBD'] },
    { id: 'v1', name: 'Cream & Aqua',       note: 'Airy and multi-hue',            swatch: ['#322C55', '#9B8EC7', '#B4D3D9', '#F2EAE0'] },
    { id: 'v2', name: 'Plum & Raspberry',   note: 'Bold, high contrast',           swatch: ['#3A0519', '#670D2F', '#A53860', '#EF88AD'] },
    { id: 'v3', name: 'Blush & Lavender',   note: 'The quietest of the five',      swatch: ['#3E3050', '#C5B3D3', '#F5CBCB', '#FFE2E2'] },
    { id: 'v4', name: 'Navy & White',       note: 'Professional, trustworthy',     swatch: ['#0F1E3A', '#1E2F4F', '#A7B6D0', '#FFFFFF'] },
    { id: 'v5', name: 'Dusty Pink & Gray',  note: 'Soft, editorial',               swatch: ['#3B3437', '#6F6F6F', '#D7B1B7', '#EAC5CC'] }
  ];

  function apply(id) {
    if (id) root.setAttribute('data-palette', id);
    else root.removeAttribute('data-palette');
    try { localStorage.setItem(KEY, id); } catch (e) { /* private mode */ }
  }

  document.addEventListener('DOMContentLoaded', () => {
    const current = root.getAttribute('data-palette') || '';

    const box = document.createElement('div');
    box.className = 'pal-switch';
    box.innerHTML =
      '<button type="button" class="pal-tab" aria-expanded="false">' +
        '<span class="pal-tab-dot"></span> Palette<span class="pal-tab-name"></span>' +
      '</button>' +
      '<div class="pal-panel" hidden>' +
        '<p class="pal-head">Compare palettes</p>' +
        '<div class="pal-list"></div>' +
        '<p class="pal-foot">Review tool. Your pick follows you across pages, and works with the dark mode toggle.</p>' +
      '</div>';

    const list = box.querySelector('.pal-list');
    PALETTES.forEach(p => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'pal-opt' + (p.id === current ? ' active' : '');
      b.dataset.pal = p.id;
      b.innerHTML =
        '<span class="pal-chips">' + p.swatch.map(c =>
          '<span style="background:' + c + '"></span>').join('') + '</span>' +
        '<span class="pal-meta"><strong>' + (p.id ? p.id.toUpperCase() + ' · ' : '') + p.name + '</strong>' +
        '<small>' + p.note + '</small></span>';
      b.addEventListener('click', () => {
        apply(p.id);
        list.querySelectorAll('.pal-opt').forEach(o => o.classList.remove('active'));
        b.classList.add('active');
        paintTab(p);
      });
      list.appendChild(b);
    });

    const tab = box.querySelector('.pal-tab');
    const panel = box.querySelector('.pal-panel');
    const nameEl = box.querySelector('.pal-tab-name');

    function paintTab(p) { nameEl.textContent = p.id ? ' · ' + p.id.toUpperCase() : ' · Current'; }
    paintTab(PALETTES.find(p => p.id === current) || PALETTES[0]);

    tab.addEventListener('click', () => {
      const open = panel.hasAttribute('hidden');
      if (open) panel.removeAttribute('hidden'); else panel.setAttribute('hidden', '');
      tab.setAttribute('aria-expanded', String(open));
      box.classList.toggle('open', open);
    });

    document.addEventListener('click', e => {
      if (!box.contains(e.target) && box.classList.contains('open')) tab.click();
    });

    document.body.appendChild(box);
  });
})();
