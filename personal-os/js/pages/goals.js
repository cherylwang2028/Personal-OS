document.addEventListener('DOMContentLoaded', () => {
  const main = document.getElementById('main');

  main.appendChild(el('header', { className: 'page-header' },
    el('h1', { className: 'page-title' }, 'Goals'),
    el('p', { className: 'page-subtitle' }, 'Weekly, monthly, and yearly checklists')
  ));

  const grid = el('div', { className: 'goals-grid' });
  grid.appendChild(section('Weekly Goals', checklist('goalsWeekly', 'Add a weekly goal…')));
  grid.appendChild(section('Monthly Goals', checklist('goalsMonthly', 'Add a monthly goal…')));
  grid.appendChild(section('Yearly Goals', checklist('goalsYearly', 'Add a yearly goal…')));

  main.appendChild(grid);
});
