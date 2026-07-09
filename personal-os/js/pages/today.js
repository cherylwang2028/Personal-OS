document.addEventListener('DOMContentLoaded', () => {
  const main = document.getElementById('main');
  const key = todayKey();
  const dayData = getDayData(key);

  main.appendChild(el('header', { className: 'page-header' },
    el('h1', { className: 'page-title' }, 'Today'),
    el('p', { className: 'page-subtitle' }, formatDate(new Date()))
  ));

  main.appendChild(section('To-do List', editableDayTodos(key, 'Add a task…')));
  main.appendChild(section("Today's Wins",
    editableTextarea('What went well today?', dayData.wins, v => {
      dayData.wins = v;
      setDayData(key, dayData);
    }, 3)
  ));
  main.appendChild(section('Daily Reflection',
    editableTextarea('Reflect on your day…', dayData.reflection, v => {
      dayData.reflection = v;
      setDayData(key, dayData);
    }, 5)
  ));
});
