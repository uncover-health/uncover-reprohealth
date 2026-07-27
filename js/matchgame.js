// "Match the symptom", pick a condition for every symptom, then check all
// answers at once. Right or wrong, each pairing gets a short explanation.
document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('match-game');
  if (!root) return;

  const pairs = [
    {
      symptom: "Severe cramps, pain during bowel movements",
      condition: "Endometriosis",
      explanation: "Endometriosis often causes pain beyond the uterus, including during bowel movements, because the tissue can grow near the bowel."
    },
    {
      symptom: "Knifelike cramps, heavy bleeding with large clots",
      condition: "Adenomyosis",
      explanation: "Adenomyosis happens when tissue grows into the muscular wall of the uterus itself, which is why it's linked to especially heavy bleeding and clots."
    },
    {
      symptom: "Irregular or absent periods, excess hair growth",
      condition: "PCOS",
      explanation: "PCOS is a hormone condition driven by androgen and insulin changes, which can affect periods and hair growth."
    },
    {
      symptom: "Severe mood changes the week before your period",
      condition: "PMDD",
      explanation: "PMDD symptoms are specifically tied to the week before your period and ease shortly after it starts, unlike general PMS."
    },
    {
      symptom: "Heavy periods, frequent urination, pelvic pressure",
      condition: "Fibroids",
      explanation: "Fibroids are growths in the uterus, and their size and location often press on the bladder, causing frequent urination and pelvic pressure."
    }
  ];

  function shuffled(arr) {
    return [...arr].sort(() => Math.random() - 0.5);
  }
  const conditionOptions = shuffled(pairs.map(p => p.condition));

  function render() {
    root.innerHTML = `
      <div id="match-rows"></div>
      <button class="btn btn-primary" id="match-check" style="margin-top:24px;">Check my answers <span class="btn-arrow">→</span></button>
      <p class="form-note" id="match-hint" style="margin-top:12px;">Pick a condition for every symptom, then check your answers together.</p>
      <div id="match-results" style="display:none;"></div>
    `;
    const rows = root.querySelector('#match-rows');
    pairs.forEach((pair, i) => {
      const row = document.createElement('div');
      row.className = 'field';
      row.style.marginBottom = '18px';
      row.innerHTML = `
        <label for="match-select-${i}">${pair.symptom}</label>
        <select id="match-select-${i}" data-index="${i}">
          <option value="">Choose a condition...</option>
          ${conditionOptions.map(c => `<option value="${c}">${c}</option>`).join('')}
        </select>
      `;
      rows.appendChild(row);
    });

    root.querySelector('#match-check').addEventListener('click', checkAnswers);
  }

  function checkAnswers() {
    const selects = root.querySelectorAll('#match-rows select');
    const answers = Array.from(selects).map(s => s.value);

    if (answers.some(a => !a)) {
      root.querySelector('#match-hint').textContent = "Choose a condition for every symptom before checking.";
      root.querySelector('#match-hint').style.color = 'var(--highlight)';
      return;
    }

    let correctCount = 0;
    const resultsHtml = pairs.map((pair, i) => {
      const chosen = answers[i];
      const isCorrect = chosen === pair.condition;
      if (isCorrect) correctCount++;
      return `
        <div class="card" style="margin-bottom:14px; border-color:${isCorrect ? 'var(--wellness)' : 'var(--highlight)'};">
          <p style="font-weight:600;">${pair.symptom}</p>
          <p style="margin-top:8px;">
            ${isCorrect
              ? `✓ You matched this correctly with <strong>${pair.condition}</strong>.`
              : `You chose <strong>${chosen}</strong>. The correct match is <strong>${pair.condition}</strong>.`}
          </p>
          <p class="form-note" style="margin-top:8px;">${pair.explanation}</p>
        </div>
      `;
    }).join('');

    root.querySelector('#match-rows').style.display = 'none';
    root.querySelector('#match-check').style.display = 'none';
    root.querySelector('#match-hint').style.display = 'none';
    const resultsEl = root.querySelector('#match-results');
    resultsEl.style.display = 'block';
    resultsEl.innerHTML = `
      <p class="eyebrow">You got ${correctCount} of ${pairs.length} right</p>
      ${resultsHtml}
      <button class="btn btn-outline" id="match-retry" style="margin-top:6px;">Try again <span class="btn-arrow">→</span></button>
    `;
    resultsEl.querySelector('#match-retry').addEventListener('click', render);
  }

  render();
});
