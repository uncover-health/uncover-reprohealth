// Builds a plain-text pain summary from the pain-map table + impact/relief
// checklists on students.html, nothing here is sent or stored anywhere.
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('pain-generate');
  if (!btn) return;
  const summaryEl = document.getElementById('pain-summary');

  btn.addEventListener('click', () => {
    const areas = {};
    document.querySelectorAll('#pain-map input[type="checkbox"]:checked').forEach(cb => {
      const area = cb.dataset.area;
      (areas[area] = areas[area] || []).push(cb.dataset.when);
    });
    const impact = Array.from(document.querySelectorAll('#pain-impact input:checked')).map(cb => cb.value);
    const relief = Array.from(document.querySelectorAll('#pain-relief input:checked')).map(cb => cb.value);

    const areaLines = Object.keys(areas).length
      ? Object.entries(areas).map(([area, whens]) => `- ${area} (${whens.join(', ')})`).join('\n')
      : '- Nothing marked yet';

    const summary =
`Pain locations:
${areaLines}

How it affects my day:
${impact.length ? impact.map(i => `- ${i}`).join('\n') : '- Nothing marked yet'}

What helps:
${relief.length ? relief.map(r => `- ${r}`).join('\n') : '- Nothing marked yet'}

Built with Uncover's pain tracker, this is not a diagnosis, just notes for a doctor's visit.`;

    summaryEl.innerHTML = `
      <p class="pain-summary-text">${summary.replace(/</g, '&lt;')}</p>
      <button class="btn btn-outline" id="pain-copy" style="margin-top:16px;">Copy summary <span class="btn-arrow">→</span></button>
    `;
    summaryEl.classList.add('show');
    summaryEl.dataset.raw = summary;

    document.getElementById('pain-copy').addEventListener('click', (e) => {
      navigator.clipboard.writeText(summaryEl.dataset.raw).then(() => {
        e.target.closest('button').textContent = 'Copied!';
      });
    });

    summaryEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
});
