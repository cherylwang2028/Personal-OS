document.addEventListener('DOMContentLoaded', () => {
  const main = document.getElementById('main');
  let viewDate = new Date();
  let selectedKey = todayKey();
  let zoom = 'month'; // week | month | year

  main.appendChild(el('header', { className: 'page-header' },
    el('h1', { className: 'page-title' }, 'Calendar'),
    el('p', { className: 'page-subtitle' }, 'Tasks, wins, and reflections by day')
  ));

  main.appendChild(el('div', { className: 'section', style: 'padding:1.25rem 1.5rem' },
    el('div', { id: 'calendar-root' })
  ));

  function dateKeyFromParts(y, m, d) {
    return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  }

  function hasDayData(key) {
    const d = getDayData(key);
    return (d.todos && d.todos.length > 0) || d.wins || d.reflection;
  }

  function startOfWeek(date) {
    const d = new Date(date);
    d.setDate(d.getDate() - d.getDay());
    d.setHours(0, 0, 0, 0);
    return d;
  }

  function renderCalendar() {
    const root = document.getElementById('calendar-root');
    root.innerHTML = '';

    root.appendChild(renderToolbar());

    if (zoom === 'week') root.appendChild(renderWeekView());
    else if (zoom === 'month') root.appendChild(renderMonthView());
    else root.appendChild(renderYearView());

    if (zoom !== 'year') {
      root.appendChild(renderDayDetail(selectedKey));
    }
  }

  function renderToolbar() {
    const bar = el('div', { className: 'calendar-toolbar' });

    const nav = el('div', { className: 'calendar-nav' });
    nav.appendChild(el('button', { className: 'btn btn-sm', onClick: () => { navigate(-1); renderCalendar(); } }, '←'));
    nav.appendChild(el('strong', { className: 'calendar-title' }, getTitle()));
    nav.appendChild(el('button', { className: 'btn btn-sm', onClick: () => { navigate(1); renderCalendar(); } }, '→'));
    bar.appendChild(nav);

    const zoomCtrl = el('div', { className: 'calendar-zoom' });
    ['week', 'month', 'year'].forEach(z => {
      zoomCtrl.appendChild(el('button', {
        className: 'btn btn-sm' + (zoom === z ? ' active-zoom' : ''),
        onClick: () => { zoom = z; renderCalendar(); },
      }, z.charAt(0).toUpperCase() + z.slice(1)));
    });
    bar.appendChild(zoomCtrl);

    return bar;
  }

  function getTitle() {
    if (zoom === 'year') return String(viewDate.getFullYear());
    if (zoom === 'week') {
      const start = startOfWeek(viewDate);
      const end = new Date(start);
      end.setDate(end.getDate() + 6);
      const opts = { month: 'short', day: 'numeric' };
      return `${start.toLocaleDateString('en-US', opts)} – ${end.toLocaleDateString('en-US', { ...opts, year: 'numeric' })}`;
    }
    return viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }

  function navigate(dir) {
    if (zoom === 'year') viewDate.setFullYear(viewDate.getFullYear() + dir);
    else if (zoom === 'month') viewDate.setMonth(viewDate.getMonth() + dir);
    else viewDate.setDate(viewDate.getDate() + dir * 7);
  }

  function renderWeekView() {
    const wrap = el('div', { className: 'calendar-week' });
    const start = startOfWeek(viewDate);
    const today = todayKey();

    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      const key = dateKeyFromParts(d.getFullYear(), d.getMonth(), d.getDate());
      const col = el('div', {
        className: 'calendar-week-day' +
          (key === today ? ' today' : '') +
          (key === selectedKey ? ' selected' : '') +
          (hasDayData(key) ? ' has-data' : ''),
        onClick: () => { selectedKey = key; viewDate = new Date(d); renderCalendar(); },
      });
      col.appendChild(el('div', { className: 'calendar-week-label' },
        d.toLocaleDateString('en-US', { weekday: 'short' })
      ));
      col.appendChild(el('div', { className: 'calendar-week-num' }, String(d.getDate())));
      if (hasDayData(key)) {
        col.appendChild(el('div', { className: 'calendar-week-dot' }));
      }
      wrap.appendChild(col);
    }
    return wrap;
  }

  function renderMonthView() {
    const wrap = el('div');
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const grid = el('div', { className: 'calendar-grid' });
    ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].forEach(d => {
      grid.appendChild(el('div', { className: 'calendar-day-name' }, d));
    });

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = todayKey();

    for (let i = 0; i < firstDay; i++) {
      grid.appendChild(el('div', { className: 'calendar-day empty' }));
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const key = dateKeyFromParts(year, month, d);
      const classes = ['calendar-day'];
      if (key === today) classes.push('today');
      if (key === selectedKey) classes.push('selected');
      if (hasDayData(key)) classes.push('has-data');
      grid.appendChild(el('div', {
        className: classes.join(' '),
        onClick: () => { selectedKey = key; renderCalendar(); },
      }, String(d)));
    }
    wrap.appendChild(grid);
    return wrap;
  }

  function renderYearView() {
    const wrap = el('div', { className: 'calendar-year-grid' });
    const year = viewDate.getFullYear();

    for (let m = 0; m < 12; m++) {
      const mini = el('div', {
        className: 'calendar-year-month',
        onClick: () => { viewDate.setMonth(m); zoom = 'month'; renderCalendar(); },
      });
      mini.appendChild(el('div', { className: 'calendar-year-month-name' },
        new Date(year, m, 1).toLocaleDateString('en-US', { month: 'short' })
      ));
      const daysInMonth = new Date(year, m + 1, 0).getDate();
      const dots = el('div', { className: 'calendar-year-dots' });
      let count = 0;
      for (let d = 1; d <= daysInMonth; d++) {
        const key = dateKeyFromParts(year, m, d);
        if (hasDayData(key)) count++;
      }
      if (count) dots.appendChild(el('span', { className: 'calendar-year-count' }, `${count} day${count > 1 ? 's' : ''}`));
      mini.appendChild(dots);
      wrap.appendChild(mini);
    }
    return wrap;
  }

  function renderDayDetail(key) {
    const data = getDayData(key);
    const wrap = el('div', { className: 'day-detail' });
    wrap.appendChild(el('h3', { className: 'section-title', style: 'font-size:0.9rem' }, key));

    if (data.todos && data.todos.length > 0) {
      const list = el('ul', { className: 'item-list' });
      data.todos.forEach(t => {
        list.appendChild(el('li', { className: 'item-row', style: 'pointer-events:none' },
          el('input', { type: 'checkbox', checked: t.done ? '' : null, disabled: '' }),
          el('span', { className: 'item-text' + (t.done ? ' done' : ''), style: 'border:none' }, t.text)
        ));
      });
      wrap.appendChild(section('To-do', list));
    }
    if (data.wins) wrap.appendChild(section("Today's Wins", el('p', { style: 'font-size:0.875rem;white-space:pre-wrap' }, data.wins)));
    if (data.reflection) wrap.appendChild(section('Daily Reflection', el('p', { style: 'font-size:0.875rem;white-space:pre-wrap' }, data.reflection)));
    if (!hasDayData(key)) wrap.appendChild(el('p', { className: 'section-empty' }, 'No entries for this day. Add content on the Today page.'));
    wrap.appendChild(el('a', { href: 'today.html', className: 'btn btn-sm', style: 'margin-top:1rem;display:inline-block' }, 'Edit on Today →'));
    return wrap;
  }

  renderCalendar();
});
