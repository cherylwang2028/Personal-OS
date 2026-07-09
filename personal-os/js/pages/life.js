document.addEventListener('DOMContentLoaded', () => {
  const main = document.getElementById('main');

  main.appendChild(el('header', { className: 'page-header' },
    el('h1', { className: 'page-title' }, 'Life'),
    el('p', { className: 'page-subtitle' }, 'Exercise, travel, memories, reflection')
  ));

  main.appendChild(section('Exercise Records', entryList('lifeExercise', [
    { key: 'activity', label: 'Activity' },
    { key: 'date', label: 'Date', type: 'date' },
    { key: 'notes', label: 'Notes' },
  ], 'No exercise records yet.')));

  main.appendChild(section('Travel Logs', entryList('lifeTravel', [
    { key: 'place', label: 'Place' },
    { key: 'date', label: 'Date', type: 'date' },
    { key: 'notes', label: 'Notes' },
  ], 'No travel logs yet.')));

  main.appendChild(section('Memory Collection', entryList('lifeMemories', [
    { key: 'title', label: 'Memory' },
    { key: 'date', label: 'Date', type: 'date' },
    { key: 'notes', label: 'Notes' },
  ], 'No memories saved yet.')));

  main.appendChild(section('Life Reflection',
    editableTextarea('Reflect on life…', getData('lifeReflection', ''), v => setData('lifeReflection', v), 6)
  ));
});
