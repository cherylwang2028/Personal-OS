document.addEventListener('DOMContentLoaded', () => {
  const main = document.getElementById('main');

  main.appendChild(el('header', { className: 'page-header' },
    el('h1', { className: 'page-title' }, 'Research'),
    el('p', { className: 'page-subtitle' }, 'Current projects and notes')
  ));

  main.appendChild(section('Current Projects', editableProjects('No research projects yet.')));
  main.appendChild(section('Project Progress', renderProjectProgress()));
  main.appendChild(section('Milestones', entryList('researchMilestones', [
    { key: 'title', label: 'Milestone' },
    { key: 'date', label: 'Date', type: 'date' },
    { key: 'status', label: 'Status' },
  ], 'No milestones yet.')));
  main.appendChild(section('Research Notes',
    editableTextarea('Write research notes…', getData('researchNotes', ''), v => setData('researchNotes', v), 8)
  ));
});

function renderProjectProgress() {
  const container = el('div');
  let projects = getData('projects', []);
  let progress = getData('projectProgress', {});

  function render() {
    container.innerHTML = '';
    if (projects.length === 0) {
      container.appendChild(el('p', { className: 'section-empty' }, 'Add projects above to track progress.'));
      return;
    }
    projects.forEach((p, i) => {
      const id = `project-${i}`;
      if (progress[id] == null) progress[id] = 0;
      const pct = progress[id];
      const wrap = el('div', { className: 'progress-item' });
      wrap.appendChild(el('div', { className: 'progress-label' },
        el('span', null, p.name || `Project ${i + 1}`),
        el('span', { className: 'pct-label' }, `${pct}%`)
      ));
      wrap.appendChild(el('div', { className: 'progress-bar' },
        el('div', { className: 'progress-fill orange', style: `width:${pct}%` })
      ));
      const input = el('input', {
        type: 'range', min: '0', max: '100', value: String(pct),
        style: 'width:100%;margin-top:0.35rem;accent-color:var(--orange)',
      });
      input.addEventListener('input', () => {
        progress[id] = Number(input.value);
        setData('projectProgress', progress);
        wrap.querySelector('.pct-label').textContent = `${progress[id]}%`;
        wrap.querySelector('.progress-fill').style.width = `${progress[id]}%`;
      });
      wrap.appendChild(input);
      container.appendChild(wrap);
    });
  }

  render();
  return container;
}
