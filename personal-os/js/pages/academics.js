function slugify(text) {
  return String(text).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'item';
}

function emptyCourse() {
  return { name: '', semester: '', grade: '', gpa: '', apExamGrade: '', notes: '' };
}

function emptyClub() {
  return { name: '', role: '', semester: '', notes: '' };
}

function normalizeCourse(c) {
  return {
    name: c?.name || '',
    semester: c?.semester || '',
    grade: c?.grade || '',
    gpa: c?.gpa || '',
    apExamGrade: c?.apExamGrade || '',
    notes: c?.notes || '',
  };
}

function normalizeClub(c) {
  return {
    name: c?.name || '',
    role: c?.role || '',
    semester: c?.semester || '',
    notes: c?.notes || '',
  };
}

function courseFieldDefs() {
  return [
    { key: 'name', label: t('academics.courseName'), required: true },
    { key: 'semester', label: t('academics.semester') },
    { key: 'grade', label: t('academics.grade') },
    { key: 'gpa', label: t('academics.courseGpa') },
    { key: 'apExamGrade', label: t('academics.apExamGrade') },
    { key: 'notes', label: t('academics.notes') },
  ];
}

function clubFieldDefs() {
  return [
    { key: 'name', label: t('academics.clubName'), required: true },
    { key: 'role', label: t('academics.role') },
    { key: 'semester', label: t('academics.semester') },
    { key: 'notes', label: t('academics.notes') },
  ];
}

function defaultAcademics() {
  return {
    entries: ['G10', 'G11', 'G12'].map((title, i) => ({
      id: slugify(title) + '-' + i,
      title,
      gpa: '',
      courses: [],
      clubs: [],
    })),
    selectedId: null,
  };
}

function migrateAcademics(raw) {
  if (raw.entries) {
    raw.entries.forEach(e => {
      e.courses = (e.courses || []).map(normalizeCourse);
      e.clubs = (e.clubs || []).map(normalizeClub);
    });
    return raw;
  }
  const entries = [];
  if (raw.grades) {
    raw.grades.forEach(g => {
      if (g.semesters?.length) {
        g.semesters.forEach(s => {
          entries.push({
            id: s.id || slugify(g.name + '-' + s.name) + Date.now(),
            title: `${g.name} · ${s.name}`,
            gpa: s.gpa || '',
            courses: (s.courses || []).map(normalizeCourse),
            clubs: (s.clubs || []).map(normalizeClub),
          });
        });
      } else {
        entries.push({
          id: g.id || slugify(g.name) + Date.now(),
          title: g.name,
          gpa: '',
          courses: [],
          clubs: [],
        });
      }
    });
  }
  const result = { entries: entries.length ? entries : defaultAcademics().entries, selectedId: null };
  result.entries.forEach(e => {
    e.courses = (e.courses || []).map(normalizeCourse);
    e.clubs = (e.clubs || []).map(normalizeClub);
  });
  return result;
}

function getAcademics() {
  const raw = getData('academicsTree', null);
  if (raw) {
    const data = migrateAcademics(raw);
    setData('academicsTree', data);
    return data;
  }
  const fresh = defaultAcademics();
  setData('academicsTree', fresh);
  return fresh;
}

function saveAcademics(data) {
  setData('academicsTree', data);
}

function saveInputRow(placeholder, onSave) {
  const row = el('div', { className: 'add-row academics-save-row' });
  const input = el('input', { className: 'add-input', type: 'text', placeholder });
  const saveBtn = el('button', { className: 'btn btn-sm btn-save', type: 'button', title: 'Save' }, '✓');

  function commit() {
    const value = input.value.trim();
    if (!value) return;
    onSave(value);
    input.value = '';
  }

  input.addEventListener('keydown', e => { if (e.key === 'Enter') commit(); });
  saveBtn.addEventListener('click', commit);
  row.appendChild(input);
  row.appendChild(saveBtn);
  return row;
}

function draftRecordCard(fieldDefs, emptyFn, onSave) {
  const card = el('div', { className: 'entry-card entry-card-draft' });
  const inputs = {};

  fieldDefs.forEach(f => {
    const input = el('input', { className: 'field-input', placeholder: f.label });
    inputs[f.key] = input;
    card.appendChild(el('div', { className: 'field-row' },
      el('span', { className: 'field-label' }, f.label), input));
  });

  function commit() {
    const record = emptyFn();
    fieldDefs.forEach(f => { record[f.key] = inputs[f.key].value.trim(); });
    if (fieldDefs.find(f => f.required) && !record.name) return;
    onSave(record);
    fieldDefs.forEach(f => { inputs[f.key].value = ''; });
    inputs.name?.focus();
  }

  fieldDefs.forEach(f => {
    inputs[f.key].addEventListener('keydown', e => { if (e.key === 'Enter') commit(); });
  });

  card.appendChild(el('div', { className: 'draft-save-row' },
    el('button', { className: 'btn btn-sm btn-save', type: 'button', onClick: commit }, '✓')
  ));
  return card;
}

function savedRecordCard(record, fieldDefs, onChange, onDelete) {
  const card = el('div', { className: 'entry-card entry-card-saved' });

  fieldDefs.forEach(f => {
    const input = el('input', {
      className: 'field-input',
      placeholder: f.label,
      value: record[f.key] || '',
    });
    input.addEventListener('input', () => {
      record[f.key] = input.value;
      onChange();
    });
    card.appendChild(el('div', { className: 'field-row' },
      el('span', { className: 'field-label' }, f.label), input));
  });

  card.appendChild(el('button', {
    className: 'entry-delete',
    type: 'button',
    title: t('academics.remove'),
    onClick: onDelete,
  }, '×'));

  return card;
}

function summaryCell(text) {
  const span = el('span', { className: 'summary-cell' }, text || '—');
  if (!text) span.classList.add('empty');
  return span;
}

document.addEventListener('DOMContentLoaded', () => {
  const main = document.getElementById('main');
  let data = getAcademics();

  main.appendChild(el('header', { className: 'page-header' },
    el('h1', { className: 'page-title' }, t('academics.title')),
    el('p', { className: 'page-subtitle' }, t('academics.subtitle'))
  ));

  main.appendChild(el('div', { id: 'academics-root' }));
  render();

  function refreshSummary() {
    const old = document.querySelector('.academics-summary');
    if (!old) return;
    old.replaceWith(renderSummary());
  }

  function render() {
    const container = document.getElementById('academics-root');
    container.innerHTML = '';

    container.appendChild(renderSummary());
    container.appendChild(section(t('academics.organize'), renderList()));

    if (data.selectedId) {
      const entry = data.entries.find(e => e.id === data.selectedId);
      if (entry) container.appendChild(renderDetail(entry));
    }
  }

  function renderSummary() {
    const wrap = el('div', { className: 'section academics-summary' });
    wrap.appendChild(el('h2', { className: 'section-title' }, t('academics.summary')));
    wrap.appendChild(el('p', { className: 'summary-hint' }, t('academics.summaryHint')));

    wrap.appendChild(renderGpaSummary());
    wrap.appendChild(renderCoursesSummary());
    wrap.appendChild(renderClubsSummary());
    return wrap;
  }

  function renderGpaSummary() {
    const block = el('div', { className: 'summary-block' });
    block.appendChild(el('h3', { className: 'summary-heading' }, t('academics.gpa')));
    const lines = el('div', { className: 'summary-lines' });
    let found = false;

    data.entries.forEach(entry => {
      if (entry.gpa) {
        found = true;
        lines.appendChild(el('div', { className: 'summary-line' },
          el('span', { className: 'summary-tag' }, entry.title),
          el('span', { className: 'summary-value' }, entry.gpa)
        ));
      }
      (entry.courses || []).forEach(c => {
        if (c.gpa) {
          found = true;
          lines.appendChild(el('div', { className: 'summary-line' },
            el('span', { className: 'summary-tag' }, `${entry.title} · ${c.name || 'Course'}`),
            el('span', { className: 'summary-value' }, c.gpa)
          ));
        }
      });
    });

    if (!found) lines.appendChild(el('p', { className: 'section-empty' }, t('academics.noGpa')));
    block.appendChild(lines);
    return block;
  }

  function renderCoursesSummary() {
    const block = el('div', { className: 'summary-block' });
    block.appendChild(el('h3', { className: 'summary-heading' }, t('academics.courses')));

    const rows = [];
    data.entries.forEach(entry => {
      (entry.courses || []).forEach(c => {
        if (c.name) rows.push({ group: entry.title, ...c });
      });
    });

    if (!rows.length) {
      block.appendChild(el('p', { className: 'section-empty' }, t('academics.noCourses')));
      return block;
    }

    const table = el('div', { className: 'summary-table' });
    table.appendChild(el('div', { className: 'summary-table-head summary-table-row' },
      summaryCell(t('academics.group')),
      summaryCell(t('academics.courseName')),
      summaryCell(t('academics.semester')),
      summaryCell(t('academics.grade')),
      summaryCell(t('academics.apExamGrade')),
    ));

    rows.forEach(r => {
      table.appendChild(el('div', { className: 'summary-table-row' },
        summaryCell(r.group),
        summaryCell(r.name),
        summaryCell(r.semester),
        summaryCell(r.grade),
        summaryCell(r.apExamGrade),
      ));
    });

    block.appendChild(table);
    return block;
  }

  function renderClubsSummary() {
    const block = el('div', { className: 'summary-block' });
    block.appendChild(el('h3', { className: 'summary-heading' }, t('academics.clubs')));

    const rows = [];
    data.entries.forEach(entry => {
      (entry.clubs || []).forEach(c => {
        if (c.name) rows.push({ group: entry.title, ...c });
      });
    });

    if (!rows.length) {
      block.appendChild(el('p', { className: 'section-empty' }, t('academics.noClubs')));
      return block;
    }

    const table = el('div', { className: 'summary-table summary-table-clubs' });
    table.appendChild(el('div', { className: 'summary-table-head summary-table-row' },
      summaryCell(t('academics.group')),
      summaryCell(t('academics.clubName')),
      summaryCell(t('academics.role')),
      summaryCell(t('academics.semester')),
    ));

    rows.forEach(r => {
      table.appendChild(el('div', { className: 'summary-table-row' },
        summaryCell(r.group),
        summaryCell(r.name),
        summaryCell(r.role),
        summaryCell(r.semester),
      ));
    });

    block.appendChild(table);
    return block;
  }

  function renderList() {
    const wrap = el('div');
    wrap.appendChild(el('p', { className: 'summary-hint', style: 'margin:0 0 0.75rem' }, t('academics.organizeHint')));

    const list = el('div', { className: 'academics-list' });
    data.entries.forEach((entry, i) => {
      const row = el('div', {
        className: 'academics-item' + (data.selectedId === entry.id ? ' selected' : ''),
      });
      row.appendChild(el('span', { className: 'academics-item-title' }, entry.title || 'Untitled'));
      row.addEventListener('click', () => {
        data.selectedId = entry.id;
        saveAcademics(data);
        render();
      });
      row.appendChild(el('button', {
        className: 'academics-item-delete',
        type: 'button',
        title: t('academics.remove'),
        onClick: e => {
          e.stopPropagation();
          if (data.selectedId === entry.id) data.selectedId = null;
          data.entries.splice(i, 1);
          saveAcademics(data);
          render();
        },
      }, '×'));
      list.appendChild(row);
    });

    wrap.appendChild(list);
    wrap.appendChild(saveInputRow(t('academics.addEntry') + '…', title => {
      data.entries.push({
        id: slugify(title) + '-' + Date.now(),
        title,
        gpa: '',
        courses: [],
        clubs: [],
      });
      data.selectedId = data.entries[data.entries.length - 1].id;
      saveAcademics(data);
      render();
    }));
    return wrap;
  }

  function renderDetail(entry) {
    const wrap = el('div', { className: 'academics-detail' });
    const titleInput = el('input', {
      className: 'academics-detail-title',
      type: 'text',
      value: entry.title,
    });
    titleInput.addEventListener('input', () => {
      entry.title = titleInput.value;
      saveAcademics(data);
      refreshSummary();
    });
    wrap.appendChild(el('div', { className: 'academics-detail-header' }, titleInput));

    wrap.appendChild(section(t('academics.sectionGpa'),
      editableInput('e.g. 3.85', entry.gpa, v => { entry.gpa = v; saveAcademics(data); refreshSummary(); })
    ));
    wrap.appendChild(section(t('academics.courses'), renderCourses(entry)));
    wrap.appendChild(section(t('academics.clubs'), renderClubs(entry)));
    return wrap;
  }

  function renderCourses(entry) {
    const container = el('div');
    if (!entry.courses) entry.courses = [];
    const defs = courseFieldDefs();

    function renderList() {
      container.innerHTML = '';
      entry.courses.forEach((c, i) => {
        container.appendChild(savedRecordCard(c, defs, () => {
          saveAcademics(data);
          refreshSummary();
        }, () => {
          entry.courses.splice(i, 1);
          saveAcademics(data);
          renderList();
          refreshSummary();
        }));
      });
      container.appendChild(draftRecordCard(defs, emptyCourse, record => {
        entry.courses.push(record);
        saveAcademics(data);
        renderList();
        refreshSummary();
      }));
    }

    renderList();
    return container;
  }

  function renderClubs(entry) {
    const container = el('div');
    if (!entry.clubs) entry.clubs = [];
    const defs = clubFieldDefs();

    function renderList() {
      container.innerHTML = '';
      entry.clubs.forEach((c, i) => {
        container.appendChild(savedRecordCard(c, defs, () => {
          saveAcademics(data);
          refreshSummary();
        }, () => {
          entry.clubs.splice(i, 1);
          saveAcademics(data);
          renderList();
          refreshSummary();
        }));
      });
      container.appendChild(draftRecordCard(defs, emptyClub, record => {
        entry.clubs.push(record);
        saveAcademics(data);
        renderList();
        refreshSummary();
      }));
    }

    renderList();
    return container;
  }
});

window.addEventListener('languagechange', () => location.reload());
