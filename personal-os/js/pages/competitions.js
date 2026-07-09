document.addEventListener('DOMContentLoaded', () => {
  const main = document.getElementById('main');

  main.appendChild(el('header', { className: 'page-header' },
    el('h1', { className: 'page-title' }, 'Competitions'),
    el('p', { className: 'page-subtitle' }, 'Title, status, result, and reflection')
  ));

  main.appendChild(section('Entries', entryList('competitions', [
    { key: 'title', label: 'Title', placeholder: 'Competition name' },
    { key: 'status', label: 'Status', placeholder: 'e.g. Ongoing, Completed' },
    { key: 'result', label: 'Result', placeholder: 'e.g. 2nd place' },
    { key: 'reflection', label: 'Reflection', placeholder: 'What did you learn?' },
  ], 'No competition entries yet.')));
});
