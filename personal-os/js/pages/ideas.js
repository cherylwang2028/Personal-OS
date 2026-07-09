document.addEventListener('DOMContentLoaded', () => {
  const main = document.getElementById('main');

  main.appendChild(el('header', { className: 'page-header' },
    el('h1', { className: 'page-title' }, 'Ideas'),
    el('p', { className: 'page-subtitle' }, 'Capture thoughts before they fade')
  ));

  main.appendChild(section('Research Ideas', checklist('ideasResearch', 'Add a research idea…')));
  main.appendChild(section('Essay Ideas', checklist('ideasEssay', 'Add an essay idea…')));
  main.appendChild(section('Random Thoughts', checklist('ideasRandom', 'Add a random thought…')));
});
