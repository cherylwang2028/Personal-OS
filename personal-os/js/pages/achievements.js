document.addEventListener('DOMContentLoaded', () => {
  const main = document.getElementById('main');

  main.appendChild(el('header', { className: 'page-header' },
    el('h1', { className: 'page-title' }, 'Achievements'),
    el('p', { className: 'page-subtitle' }, 'Title, date, and reflection')
  ));

  const groups = [
    { key: 'academic', label: 'Academic' },
    { key: 'research', label: 'Research' },
    { key: 'competition', label: 'Competition' },
    { key: 'personal', label: 'Personal' },
  ];

  groups.forEach(g => {
    main.appendChild(section(g.label, renderAchievementGroup(g.key)));
  });
});

function renderAchievementGroup(groupKey) {
  const container = el('div');
  const storageKey = 'achievements';
  let data = getData(storageKey, { academic: [], research: [], competition: [], personal: [] });
  if (!data[groupKey]) data[groupKey] = [];

  function render() {
    container.innerHTML = '';
    const entries = data[groupKey];
    if (entries.length === 0) {
      container.appendChild(el('p', { className: 'section-empty' }, 'No achievements yet.'));
    }
    entries.forEach((entry, i) => {
      const card = el('div', { className: 'entry-card' });
      ['title', 'date', 'reflection'].forEach(field => {
        const label = field.charAt(0).toUpperCase() + field.slice(1);
        const input = el('input', {
          className: 'field-input',
          type: field === 'date' ? 'date' : 'text',
          placeholder: label,
          value: entry[field] || '',
        });
        input.addEventListener('input', () => {
          data[groupKey][i][field] = input.value;
          setData(storageKey, data);
        });
        card.appendChild(el('div', { className: 'field-row' },
          el('span', { className: 'field-label' }, label),
          input
        ));
      });
      card.appendChild(el('button', { className: 'btn btn-sm', style: 'margin-top:0.5rem', onClick: () => {
        data[groupKey].splice(i, 1);
        setData(storageKey, data);
        render();
      }}, 'Remove'));
      container.appendChild(card);
    });
    container.appendChild(el('button', { className: 'btn btn-sm', onClick: () => {
      data[groupKey].push({ title: '', date: '', reflection: '' });
      setData(storageKey, data);
      render();
    }}, '+ Add achievement'));
  }

  render();
  return container;
}
