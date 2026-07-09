/* Line icons — low-saturation palette, distinct hues */

const NAV_ICONS = {
  home: '<path d="M4 10.5L12 4l8 6.5V19a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-8.5z"/><path d="M9 20v-6h6v6"/>',
  today: '<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M8 3v4M16 3v4M4 10h16"/>',
  calendar: '<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M8 3v4M16 3v4M4 10h16"/><path d="M8 14h2M14 14h2M8 18h2"/>',
  academics: '<path d="M12 3L3 8l9 5 9-5-9-5z"/><path d="M6 12v4c0 2 2.7 4 6 4s6-2 6-4v-4"/>',
  research: '<path d="M10 2h4v7l4.5 9.5a1.5 1.5 0 0 1-1.35 2H6.85a1.5 1.5 0 0 1-1.35-2L10 9V2z"/><path d="M9 2h6"/><path d="M8 14h8"/>',
  competitions: '<path d="M8 21h8M12 17v4M7 4h10l1 6H6l1-6z"/><path d="M7 10h10a4 4 0 0 1-4 4 4 4 0 0 1-4-4z"/>',
  reading: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',
  life: '<path d="M11 20A7 7 0 0 1 9.8 6.1C10.8 5.4 12 5 13 5c3 0 5 2 5 5 0 3.5-3 6.5-7 10z"/><path d="M13 5c-1 2-3 3-4 5"/>',
  ideas: '<path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2a6 6 0 0 0-3 11v1h6v-1a6 6 0 0 0-3-11z"/>',
  goals: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="1"/>',
  achievements: '<path d="M12 2l2.4 4.8 5.3.8-3.8 3.7.9 5.3L12 14.8 7.2 16.6l.9-5.3L4.3 7.6l5.3-.8L12 2z"/>',
  settings: '<path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
};

const NAV_COLORS = {
  home: '#8BA4B4',
  today: '#C4A882',
  calendar: '#9B8FB0',
  academics: '#8FAD8F',
  research: '#6A9FB8',
  competitions: '#D4A3A3',
  reading: '#9BA8C4',
  life: '#7FA87F',
  ideas: '#D4B87A',
  goals: '#A88BB8',
  achievements: '#D9CF8F',
  settings: '#6B6B6B',
};

function iconSvg(name) {
  const paths = NAV_ICONS[name];
  if (!paths) return '';
  return `<svg viewBox="0 0 24 24" aria-hidden="true">${paths}</svg>`;
}

function navIconEl(name) {
  const span = document.createElement('span');
  span.className = 'nav-icon';
  span.style.color = NAV_COLORS[name] || '#6b6b6b';
  span.innerHTML = iconSvg(name);
  return span;
}

function folderIconSvg(color) {
  return `<svg viewBox="0 0 20 16" aria-hidden="true" class="folder-row-icon">
    <path d="M1 4.5C1 3.1 2.1 2 3.5 2H8l1.5 2H16.5C17.9 4 19 5.1 19 6.5V13.5C19 14.9 17.9 16 16.5 16H3.5C2.1 16 1 14.9 1 13.5V4.5Z" fill="${color}" stroke="${color}" stroke-width="0.5"/>
  </svg>`;
}
