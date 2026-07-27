// Self-scoring symptom awareness checklist. Counts checked [data-flag] items,
// shows a plain-language interpretation, never a diagnosis.
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('score-checklist');
  if (!form) return;
  const result = document.getElementById('score-result');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const checked = form.querySelectorAll('input[type="checkbox"]:checked').length;
    const total = form.querySelectorAll('input[type="checkbox"]').length;

    const ratio = checked / total;
    let message;
    if (checked === 0) {
      message = "Nothing checked, that's a good sign, but if something's been on your mind, it's still okay to ask.";
    } else if (ratio <= 0.25) {
      message = `You checked ${checked} of ${total}. Worth keeping an eye on, mention it at your next checkup if it continues.`;
    } else {
      message = `You checked ${checked} of ${total}. Consider speaking with a trusted adult or healthcare provider, that's enough to be worth a real conversation.`;
    }
    result.innerHTML = `<strong>${message}</strong><p class="form-note" style="margin-top:10px;">This checklist is educational, not diagnostic, only a healthcare provider can tell you what's going on.</p>`;
    result.classList.add('show');
  });
});
