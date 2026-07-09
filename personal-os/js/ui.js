/* Shared UI components */

function el(tag, attrs, ...children) {
  const node = document.createElement(tag);
  if (attrs) {
    Object.entries(attrs).forEach(([k, v]) => {
      if (k === 'className') node.className = v;
      else if (k === 'dataset') Object.assign(node.dataset, v);
      else if (k.startsWith('on') && typeof v === 'function') node.addEventListener(k.slice(2).toLowerCase(), v);
      else if (v != null) node.setAttribute(k, v);
    });
  }
  children.flat().forEach(c => {
    if (c == null) return;
    node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
  });
  return node;
}

function section(title, content) {
  const node = el('div', { className: 'section' });
  if (title) node.appendChild(el('h2', { className: 'section-title' }, title));
  node.appendChild(content);
  return node;
}

function editableTextarea(placeholder, value, onSave, rows) {
  const ta = el('textarea', {
    className: 'editable editable-textarea',
    placeholder,
    rows: rows || 3,
  });
  ta.value = value || '';
  let timer;
  ta.addEventListener('input', () => {
    clearTimeout(timer);
    timer = setTimeout(() => onSave(ta.value), 400);
  });
  return ta;
}

function editableInput(placeholder, value, onSave) {
  const input = el('input', {
    className: 'editable',
    type: 'text',
    placeholder,
  });
  input.value = value || '';
  let timer;
  input.addEventListener('input', () => {
    clearTimeout(timer);
    timer = setTimeout(() => onSave(input.value), 400);
  });
  return input;
}

function checklist(storageKey, placeholder) {
  const container = el('div');
  const items = getData(storageKey, []);

  function render() {
    container.innerHTML = '';
    const list = el('ul', { className: 'item-list' });
    items.forEach((item, i) => {
      const text = el('input', {
        className: `item-text${item.done ? ' done' : ''}`,
        type: 'text',
        value: item.text,
      });
      text.addEventListener('input', () => {
        items[i].text = text.value;
        setData(storageKey, items);
      });
      const row = el('li', { className: 'item-row' },
        el('input', {
          type: 'checkbox',
          checked: item.done ? '' : null,
          onChange: () => {
            items[i].done = !items[i].done;
            setData(storageKey, items);
            render();
          },
        }),
        text,
        el('button', {
          className: 'item-delete',
          onClick: () => {
            items.splice(i, 1);
            setData(storageKey, items);
            render();
          },
        }, '×')
      );
      list.appendChild(row);
    });
    container.appendChild(list);

    const addRow = el('div', { className: 'add-row' });
    const addInput = el('input', { className: 'add-input', type: 'text', placeholder });
    const addBtn = el('button', { className: 'btn btn-sm', onClick: addItem }, 'Add');
    addInput.addEventListener('keydown', e => { if (e.key === 'Enter') addItem(); });

    function addItem() {
      const text = addInput.value.trim();
      if (!text) return;
      items.push({ text, done: false });
      setData(storageKey, items);
      addInput.value = '';
      render();
    }

    addRow.appendChild(addInput);
    addRow.appendChild(addBtn);
    container.appendChild(addRow);
  }

  render();
  return container;
}

function editableDayTodos(dateKey, placeholder) {
  const container = el('div');
  let dayData = getDayData(dateKey);
  if (!dayData.todos) dayData.todos = [];

  function render() {
    container.innerHTML = '';
    const list = el('ul', { className: 'item-list' });
    dayData.todos.forEach((item, i) => {
      const text = el('input', {
        className: `item-text${item.done ? ' done' : ''}`,
        type: 'text',
        value: item.text,
      });
      text.addEventListener('input', () => {
        dayData.todos[i].text = text.value;
        setDayData(dateKey, dayData);
      });
      list.appendChild(el('li', { className: 'item-row' },
        el('input', {
          type: 'checkbox',
          checked: item.done ? '' : null,
          onChange: () => {
            dayData.todos[i].done = !dayData.todos[i].done;
            setDayData(dateKey, dayData);
            render();
          },
        }),
        text,
        el('button', {
          className: 'item-delete',
          onClick: () => {
            dayData.todos.splice(i, 1);
            setDayData(dateKey, dayData);
            render();
          },
        }, '×')
      ));
    });
    container.appendChild(list);

    const addRow = el('div', { className: 'add-row' });
    const addInput = el('input', { className: 'add-input', type: 'text', placeholder: placeholder || 'Add a task…' });

    function addItem() {
      const text = addInput.value.trim();
      if (!text) return;
      dayData.todos.push({ text, done: false });
      setDayData(dateKey, dayData);
      addInput.value = '';
      render();
    }

    addInput.addEventListener('keydown', e => { if (e.key === 'Enter') addItem(); });
    addRow.appendChild(addInput);
    addRow.appendChild(el('button', { className: 'btn btn-sm', onClick: addItem }, 'Add'));
    container.appendChild(addRow);
  }

  render();
  return container;
}

function editableProjects(emptyText) {
  const container = el('div');
  let projects = getData('projects', []);

  function render() {
    container.innerHTML = '';
    if (projects.length === 0) {
      container.appendChild(el('p', { className: 'section-empty' }, emptyText || 'No projects yet.'));
    }
    projects.forEach((p, i) => {
      const card = el('div', { className: 'entry-card entry-card-inline' });
      const name = el('input', {
        className: 'field-input field-input-full',
        placeholder: 'Project name',
        value: p.name || '',
      });
      name.addEventListener('input', () => {
        projects[i].name = name.value;
        setData('projects', projects);
      });
      card.appendChild(name);
      card.appendChild(el('button', {
        className: 'btn btn-sm',
        style: 'margin-top:0.5rem',
        onClick: () => {
          projects.splice(i, 1);
          setData('projects', projects);
          render();
        },
      }, 'Remove'));
      container.appendChild(card);
    });
    container.appendChild(el('button', {
      className: 'btn btn-sm',
      onClick: () => {
        projects.push({ name: '' });
        setData('projects', projects);
        render();
      },
    }, '+ Add project'));
  }

  render();
  return container;
}

function entryList(storageKey, fields, emptyText) {
  const container = el('div');
  let entries = getData(storageKey, []);

  function render() {
    container.innerHTML = '';
    if (entries.length === 0) {
      container.appendChild(el('p', { className: 'section-empty' }, emptyText));
    }
    entries.forEach((entry, i) => {
      const card = el('div', { className: 'entry-card' });
      const grid = el('div', { className: 'entry-fields' });
      fields.forEach(f => {
        const input = el('input', {
          className: 'field-input',
          type: f.type || 'text',
          placeholder: f.placeholder || f.label,
          value: entry[f.key] || '',
        });
        input.addEventListener('input', () => {
          entries[i][f.key] = input.value;
          setData(storageKey, entries);
        });
        grid.appendChild(el('div', { className: 'field-row' },
          el('span', { className: 'field-label' }, f.label),
          input
        ));
      });
      card.appendChild(grid);
      card.appendChild(el('button', {
        className: 'btn btn-sm',
        style: 'margin-top:0.5rem',
        onClick: () => {
          entries.splice(i, 1);
          setData(storageKey, entries);
          render();
        },
      }, 'Remove'));
      container.appendChild(card);
    });

    container.appendChild(el('button', {
      className: 'btn btn-sm',
      onClick: () => {
        const entry = {};
        fields.forEach(f => { entry[f.key] = ''; });
        entries.push(entry);
        setData(storageKey, entries);
        render();
      },
    }, '+ Add entry'));
  }

  render();
  return container;
}

function progressBar(label, value, colorClass) {
  const pct = Math.min(100, Math.max(0, Number(value) || 0));
  return el('div', { className: 'progress-item' },
    el('div', { className: 'progress-label' },
      el('span', null, label),
      el('span', null, `${pct}%`)
    ),
    el('div', { className: 'progress-bar' },
      el('div', {
        className: 'progress-fill' + (colorClass ? ' ' + colorClass : ''),
        style: `width:${pct}%`,
      })
    )
  );
}

function editableProgress(storageKey, categories) {
  const container = el('div');
  let data = getData(storageKey, {});

  categories.forEach(cat => {
    if (data[cat.key] == null) data[cat.key] = cat.default || 0;
  });

  categories.forEach(cat => {
    const wrap = el('div', { className: 'progress-item' });
    const pctSpan = el('span', null, `${data[cat.key]}%`);
    wrap.appendChild(el('div', { className: 'progress-label' },
      el('span', null, cat.label),
      pctSpan
    ));
    wrap.appendChild(el('div', { className: 'progress-bar' },
      el('div', {
        className: 'progress-fill' + (cat.color ? ' ' + cat.color : ''),
        style: `width:${data[cat.key]}%`,
      })
    ));
    const input = el('input', {
      type: 'range',
      min: '0',
      max: '100',
      value: String(data[cat.key]),
      style: 'width:100%;margin-top:0.35rem;accent-color:var(--accent)',
    });
    input.addEventListener('input', () => {
      data[cat.key] = Number(input.value);
      pctSpan.textContent = `${data[cat.key]}%`;
      wrap.querySelector('.progress-fill').style.width = `${data[cat.key]}%`;
      setData(storageKey, data);
    });
    wrap.appendChild(input);
    container.appendChild(wrap);
  });

  return container;
}
