const NAV_ITEMS = [
  { href: 'index.html', icon: 'home', labelKey: 'nav.home' },
  { divider: true },
  { href: 'today.html', icon: 'today', labelKey: 'nav.today' },
  { href: 'calendar.html', icon: 'calendar', labelKey: 'nav.calendar' },
  { divider: true },
  { href: 'academics.html', icon: 'academics', labelKey: 'nav.academics' },
  { href: 'research.html', icon: 'research', labelKey: 'nav.research' },
  { href: 'competitions.html', icon: 'competitions', labelKey: 'nav.competitions' },
  { href: 'reading.html', icon: 'reading', labelKey: 'nav.reading' },
  { href: 'life.html', icon: 'life', labelKey: 'nav.life' },
  { href: 'ideas.html', icon: 'ideas', labelKey: 'nav.ideas' },
  { divider: true },
  { href: 'goals.html', icon: 'goals', labelKey: 'nav.goals' },
  { href: 'achievements.html', icon: 'achievements', labelKey: 'nav.achievements' },
  { divider: true },
  { href: 'settings.html', icon: 'settings', labelKey: 'nav.settings' },
];

function renderSidebar() {
  const sidebar = document.getElementById('sidebar');
  if (!sidebar) return;

  const current = window.location.pathname.split('/').pop() || 'index.html';

  const nav = document.createElement('nav');
  nav.className = 'sidebar-nav';

  NAV_ITEMS.forEach(item => {
    if (item.divider) {
      nav.appendChild(Object.assign(document.createElement('div'), { className: 'nav-divider' }));
      return;
    }
    const link = document.createElement('a');
    link.href = item.href;
    link.className = 'nav-link' + (current === item.href ? ' active' : '');
    link.appendChild(navIconEl(item.icon));
    link.appendChild(Object.assign(document.createElement('span'), { textContent: t(item.labelKey) }));
    nav.appendChild(link);
  });

  sidebar.innerHTML = '<div class="sidebar-brand">Personal OS</div>';
  sidebar.appendChild(nav);
}

document.addEventListener('DOMContentLoaded', renderSidebar);
window.addEventListener('languagechange', renderSidebar);
