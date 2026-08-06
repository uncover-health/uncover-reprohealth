// The uterus diagram, used twice:
//   1. Learn -> Explore the body: tap a hotspot, the part is highlighted and
//      explained (name, what it does, why it matters). Stays on the page.
//   2. Games & Quizzes -> Explore the body game: the printed labels are covered
//      by blank slots. Tap a slot, tap a label, get instant feedback. Correct
//      answers explain the structure; wrong ones explain why they're wrong.
//
// Coordinates are percentages of the diagram image, so both stay aligned at
// every screen size.
(function () {
  const PARTS = [
    {
      id: 'fallopian',
      name: 'Fallopian tube',
      hotspot: { x: 26.5, y: 26.5 },
      slot: { left: 2.4, top: 34.2, w: 22.2, h: 10.6 },
      oneLiner: 'the narrow tube that curves out from the top of the uterus toward an ovary',
      locHint: 'look for the curved tube arcing out from the top corner of the uterus',
      fn: 'Carries the egg from the ovary to the uterus, and it is where fertilisation happens if sperm is present.',
      why: 'A tube that is blocked or inflamed can cause real pain and affect fertility later, which is one reason ongoing pelvic pain is worth looking into rather than waiting out.'
    },
    {
      id: 'ovary',
      name: 'Ovary',
      hotspot: { x: 30.5, y: 38.5 },
      slot: { left: 12.2, top: 51.4, w: 21.6, h: 13.2 },
      oneLiner: 'one of the two small organs that store your eggs',
      locHint: 'it is the rounded, textured oval sitting at the end of each tube',
      fn: 'Stores eggs and releases one during ovulation, and produces estrogen and progesterone, the hormones behind most of your cycle.',
      why: 'This is where ovarian cysts form and where PMOS (formerly PCOS) shows up, so symptoms like irregular or missing periods often trace back here.'
    },
    {
      id: 'endometrium',
      name: 'Endometrium',
      hotspot: { x: 57.5, y: 40.5 },
      slot: { left: 76.2, top: 44.6, w: 22.0, h: 14.8 },
      oneLiner: 'the lining on the inside of the uterus, not an organ of its own',
      locHint: 'it is the inner surface of the uterus wall',
      fn: 'The lining of the uterus that thickens each month and sheds during your period.',
      why: 'Endometriosis is named after it: tissue similar to this lining grows outside the uterus, where it still responds to your cycle every month and causes pain.'
    },
    {
      id: 'uterus',
      name: 'Uterus',
      hotspot: { x: 49.5, y: 30.0 },
      slot: { left: 65.9, top: 60.0, w: 21.6, h: 9.4 },
      oneLiner: 'the muscular, pear-shaped organ in the centre that everything else connects to',
      locHint: 'it is the large central organ, not the lining inside it',
      fn: 'A muscular organ where a pregnancy can grow, and the muscle that cramps as it sheds its lining each period.',
      why: 'Fibroids and adenomyosis both develop in this muscular wall, which is why heavy bleeding and knifelike cramps are worth mentioning to a doctor.'
    },
    {
      id: 'cervix',
      name: 'Cervix',
      hotspot: { x: 49.5, y: 70.0 },
      slot: { left: 12.0, top: 71.6, w: 25.4, h: 10.6 },
      oneLiner: 'the narrow neck where the uterus meets the vagina',
      locHint: 'it is the narrow neck at the bottom of the uterus',
      fn: 'The lower part of the uterus that opens into the vagina.',
      why: 'It is the part a doctor checks during a pelvic exam. You are always allowed to ask what is happening and why before it does.'
    },
    {
      id: 'vagina',
      name: 'Vagina',
      hotspot: { x: 49.5, y: 84.0 },
      slot: { left: 69.1, top: 75.4, w: 22.6, h: 12.6 },
      oneLiner: 'the canal that leads to the outside of the body',
      locHint: 'it is the canal below the cervix',
      fn: 'The canal that connects the cervix to the outside of the body.',
      why: 'Period blood passes through here, and so does anything used during an internal ultrasound. Pain with tampons or during an exam is not something you have to accept quietly.'
    }
  ];

  const shuffle = arr => arr.map(v => [Math.random(), v]).sort((a, b) => a[0] - b[0]).map(v => v[1]);

  /* ---------------- 1. Explore the body (hotspots) ---------------- */
  function initExplorer(root) {
    const figure = root.querySelector('[data-anatomy-figure]');
    const panel = root.querySelector('[data-anatomy-panel]');
    if (!figure || !panel) return;

    const intro = panel.innerHTML;

    PARTS.forEach((part, i) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'hotspot';
      dot.style.left = part.hotspot.x + '%';
      dot.style.top = part.hotspot.y + '%';
      dot.textContent = String(i + 1);
      dot.setAttribute('aria-label', 'Show ' + part.name);
      dot.addEventListener('click', () => {
        figure.querySelectorAll('.hotspot').forEach(d => d.classList.remove('active'));
        dot.classList.add('active');
        panel.innerHTML =
          '<span class="part-eyebrow">Part ' + (i + 1) + ' of ' + PARTS.length + '</span>' +
          '<h3>' + part.name + '</h3>' +
          '<dl>' +
          '<dt>What it does</dt><dd>' + part.fn + '</dd>' +
          '<dt>Why it matters</dt><dd>' + part.why + '</dd>' +
          '</dl>';
        panel.setAttribute('tabindex', '-1');
      });
      figure.appendChild(dot);
    });

    // tapping the panel's own reset link puts the intro copy back
    root.addEventListener('click', e => {
      if (!e.target.closest('[data-anatomy-clear]')) return;
      figure.querySelectorAll('.hotspot').forEach(d => d.classList.remove('active'));
      panel.innerHTML = intro;
    });
  }

  /* ---------------- 2. Explore the body game (labelling) ---------------- */
  function initGame(root) {
    const figure = root.querySelector('[data-game-figure]');
    const bank = root.querySelector('[data-label-bank]');
    const feedback = root.querySelector('[data-game-feedback]');
    const scoreEl = root.querySelector('[data-game-score]');
    const doneEl = root.querySelector('[data-game-done]');
    const resetBtn = root.querySelector('[data-game-reset]');
    if (!figure || !bank) return;

    let solved, attempts, firstTry, selectedSlot, selectedChip;

    function say(html, kind) {
      feedback.className = 'game-feedback show' + (kind ? ' ' + kind : '');
      feedback.innerHTML = html;
    }

    function updateScore() {
      scoreEl.textContent = solved.size + ' of ' + PARTS.length + ' labelled' +
        (attempts ? ' · ' + attempts + ' attempt' + (attempts === 1 ? '' : 's') : '');
    }

    function clearSelection() {
      figure.querySelectorAll('.label-slot').forEach(s => s.classList.remove('selected'));
      bank.querySelectorAll('.label-chip').forEach(c => c.classList.remove('selected'));
      selectedSlot = null;
      selectedChip = null;
    }

    function finish() {
      const pct = Math.round((firstTry / PARTS.length) * 100);
      doneEl.className = 'game-done show';
      doneEl.innerHTML =
        '<span class="done-num">' + pct + '%</span>' +
        '<p style="margin-top:8px; font-weight:600;">All six parts labelled.</p>' +
        '<p style="margin-top:6px;">You got ' + firstTry + ' of ' + PARTS.length +
        ' right on the first try, in ' + attempts + ' attempt' + (attempts === 1 ? '' : 's') +
        '. Knowing the names makes it much easier to describe what hurts, and where, at an appointment.</p>';
      doneEl.setAttribute('tabindex', '-1');
    }

    function resolve(slotEl, chipEl) {
      const slotId = slotEl.dataset.part;
      const chipId = chipEl.dataset.part;
      const target = PARTS.find(p => p.id === slotId);
      const chosen = PARTS.find(p => p.id === chipId);
      attempts++;

      if (slotId === chipId) {
        if (!slotEl.dataset.missed) firstTry++;
        solved.add(slotId);
        slotEl.classList.remove('selected', 'wrong');
        slotEl.classList.add('filled', 'correct');
        slotEl.textContent = target.name;
        slotEl.disabled = true;
        chipEl.classList.add('used');
        chipEl.disabled = true;
        say('<strong>' + target.name + ' — correct.</strong>' +
            target.fn + ' <em>Why it matters:</em> ' + target.why, 'good');
        clearSelection();
        updateScore();
        if (solved.size === PARTS.length) finish();
      } else {
        slotEl.dataset.missed = '1';
        slotEl.classList.add('wrong');
        say('<strong>Not this one.</strong>The ' + chosen.name.toLowerCase() + ' is ' +
            chosen.oneLiner + ', so it does not belong on this line. For the label you are ' +
            'filling in, ' + target.locHint + '. Try again, there is no penalty.', 'bad');
        setTimeout(() => slotEl.classList.remove('wrong'), 900);
        clearSelection();
        updateScore();
      }
    }

    function pair() {
      if (selectedSlot && selectedChip) resolve(selectedSlot, selectedChip);
    }

    function build() {
      solved = new Set();
      attempts = 0;
      firstTry = 0;
      selectedSlot = null;
      selectedChip = null;

      figure.querySelectorAll('.label-slot').forEach(el => el.remove());
      bank.innerHTML = '';
      feedback.className = 'game-feedback';
      feedback.innerHTML = '';
      doneEl.className = 'game-done';
      doneEl.innerHTML = '';

      PARTS.forEach(part => {
        const slot = document.createElement('button');
        slot.type = 'button';
        slot.className = 'label-slot';
        slot.dataset.part = part.id;
        slot.style.left = part.slot.left + '%';
        slot.style.top = part.slot.top + '%';
        slot.style.width = part.slot.w + '%';
        slot.style.height = part.slot.h + '%';
        slot.textContent = '?';
        slot.setAttribute('aria-label', 'Empty label slot');
        slot.addEventListener('click', () => {
          if (solved.has(part.id)) return;
          const wasSelected = slot.classList.contains('selected');
          figure.querySelectorAll('.label-slot').forEach(s => s.classList.remove('selected'));
          if (wasSelected) { selectedSlot = null; return; }
          slot.classList.add('selected');
          selectedSlot = slot;
          pair();
        });
        figure.appendChild(slot);
      });

      shuffle(PARTS.slice()).forEach(part => {
        const chip = document.createElement('button');
        chip.type = 'button';
        chip.className = 'label-chip';
        chip.dataset.part = part.id;
        chip.textContent = part.name;
        chip.addEventListener('click', () => {
          bank.querySelectorAll('.label-chip').forEach(c => c.classList.remove('selected'));
          chip.classList.add('selected');
          selectedChip = chip;
          if (!selectedSlot) {
            say('<strong>' + part.name + ' picked up.</strong>Now tap the empty box on the ' +
                'diagram where you think it belongs.');
            return;
          }
          pair();
        });
        bank.appendChild(chip);
      });

      updateScore();
    }

    if (resetBtn) resetBtn.addEventListener('click', build);
    build();
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-anatomy-explore]').forEach(initExplorer);
    document.querySelectorAll('[data-anatomy-game]').forEach(initGame);
  });
})();
