document.addEventListener('DOMContentLoaded', () => {
  const main = document.getElementById('main');

  main.appendChild(el('header', { className: 'page-header' },
    el('h1', { className: 'page-title' }, 'Reading'),
    el('p', { className: 'page-subtitle' }, 'Books and quotes')
  ));

  main.appendChild(section('Currently Reading', entryList('readingCurrent', [
    { key: 'title', label: 'Title' },
    { key: 'author', label: 'Author' },
    { key: 'notes', label: 'Notes' },
  ], 'Not reading anything right now.')));

  main.appendChild(section('Finished Books', entryList('readingFinished', [
    { key: 'title', label: 'Title' },
    { key: 'author', label: 'Author' },
    { key: 'date', label: 'Finished', type: 'date' },
  ], 'No finished books yet.')));

  main.appendChild(section('Favorite Quotes', entryList('readingQuotes', [
    { key: 'quote', label: 'Quote' },
    { key: 'source', label: 'Source' },
  ], 'No quotes saved yet.')));
});
