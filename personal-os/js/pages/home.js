document.addEventListener('DOMContentLoaded', () => {
  const main = document.getElementById('main');
  const bio = getData('bio', '');

  main.appendChild(renderHomeHeader());
  main.appendChild(renderBioQuote(bio));
  main.appendChild(section('To-do List', editableDayTodos(todayKey(), 'Add a task…')));
  main.appendChild(section('Current Projects', editableProjects('No active projects yet.')));

  const achievements = getData('achievements', { academic: [], research: [], competition: [], personal: [] });
  main.appendChild(section('Recent Achievements', renderRecentAchievements(achievements)));
});

function renderHomeHeader() {
  const profile = getData('profile', { name: '' });
  const header = el('header', { className: 'page-header home-header' });

  const greetingRow = el('div', { className: 'home-greeting-row' },
    el('span', { className: 'greeting-text' }, `${getGreeting()}, `),
  );

  const nameInput = el('input', {
    className: 'greeting-name',
    type: 'text',
    placeholder: 'your name',
    value: profile.name,
    spellcheck: 'false',
  });
  nameInput.addEventListener('input', () => {
    profile.name = nameInput.value;
    setData('profile', profile);
  });
  greetingRow.appendChild(nameInput);
  header.appendChild(greetingRow);
  header.appendChild(el('p', { className: 'home-date' }, formatDate(new Date())));

  const todos = getDayData(todayKey()).todos || [];
  const done = todos.filter(t => t.done).length;
  const todoSummary = todos.length
    ? `${done} of ${todos.length} tasks done today`
    : 'No tasks yet';

  header.appendChild(el('div', { className: 'home-quick-links' },
    el('span', { className: 'home-stat' }, todoSummary),
  ));

  return header;
}

function renderBioQuote(value) {
  const block = el('blockquote', { className: 'bio-quote' },
    el('span', { className: 'bio-quote-mark', 'aria-hidden': 'true' }, '\u201C'),
  );

  const textarea = el('textarea', {
    className: 'bio-quote-text editable',
    placeholder: 'Write something about yourself…',
    rows: '2',
  });
  textarea.value = value || '';
  let timer;
  textarea.addEventListener('input', () => {
    clearTimeout(timer);
    timer = setTimeout(() => setData('bio', textarea.value), 400);
  });

  block.appendChild(textarea);
  block.appendChild(el('span', { className: 'bio-quote-mark bio-quote-mark-end', 'aria-hidden': 'true' }, '\u201D'));

  return block;
}

function renderRecentAchievements(data) {
  const all = [
    ...data.academic.map((a, i) => ({ ...a, group: 'academic', groupLabel: 'Academic', index: i })),
    ...data.research.map((a, i) => ({ ...a, group: 'research', groupLabel: 'Research', index: i })),
    ...data.competition.map((a, i) => ({ ...a, group: 'competition', groupLabel: 'Competition', index: i })),
    ...data.personal.map((a, i) => ({ ...a, group: 'personal', groupLabel: 'Personal', index: i })),
  ].sort((a, b) => (b.date || '').localeCompare(a.date || '')).slice(0, 5);

  const container = el('div');
  if (all.length === 0) {
    container.appendChild(el('p', { className: 'section-empty' }, 'No achievements recorded yet.'));
    return container;
  }

  all.forEach(item => {
    const card = el('div', { className: 'entry-card entry-card-inline' });
    const title = el('input', {
      className: 'field-input field-input-full',
      placeholder: 'Title',
      value: item.title || '',
    });
    title.addEventListener('input', () => {
      data[item.group][item.index].title = title.value;
      setData('achievements', data);
    });

    const date = el('input', {
      className: 'field-input field-input-full',
      type: 'date',
      value: item.date || '',
    });
    date.addEventListener('input', () => {
      data[item.group][item.index].date = date.value;
      setData('achievements', data);
    });

    const reflection = el('input', {
      className: 'field-input field-input-full',
      placeholder: 'Reflection',
      value: item.reflection || '',
    });
    reflection.addEventListener('input', () => {
      data[item.group][item.index].reflection = reflection.value;
      setData('achievements', data);
    });

    card.appendChild(el('span', { className: 'entry-meta' }, item.groupLabel));
    card.appendChild(title);
    card.appendChild(date);
    card.appendChild(reflection);
    container.appendChild(card);
  });

  return container;
}
