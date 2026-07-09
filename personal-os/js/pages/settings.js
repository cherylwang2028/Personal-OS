document.addEventListener('DOMContentLoaded', () => {
  const main = document.getElementById('main');
  const settings = getData('settings', { theme: 'light', lang: 'en' });
  const profile = getData('profile', { name: '' });

  main.appendChild(el('header', { className: 'page-header' },
    el('h1', { className: 'page-title' }, t('settings.title')),
    el('p', { className: 'page-subtitle' }, t('settings.subtitle'))
  ));

  const card = el('div', { className: 'section settings-card' });

  card.appendChild(el('div', { className: 'settings-row' },
    el('span', { className: 'settings-label' }, t('settings.name')),
    el('input', {
      className: 'settings-input',
      type: 'text',
      placeholder: 'Your name',
      value: profile.name,
      onInput: e => {
        profile.name = e.target.value;
        setData('profile', profile);
      },
    })
  ));

  card.appendChild(renderThemeToggle(settings));
  card.appendChild(renderLanguageToggle(settings));

  main.appendChild(card);
});

function renderThemeToggle(settings) {
  const wrap = el('div', { className: 'settings-row' },
    el('span', { className: 'settings-label' }, t('settings.theme')),
    el('div', { className: 'theme-toggle' })
  );
  const toggle = wrap.querySelector('.theme-toggle');

  ['light', 'dark'].forEach(theme => {
    const label = theme === 'light' ? t('settings.light') : t('settings.dark');
    const btn = el('button', {
      className: 'theme-btn' + (settings.theme === theme ? ' active' : ''),
      onClick: () => {
        settings.theme = theme;
        setData('settings', settings);
        document.documentElement.setAttribute('data-theme', theme);
        toggle.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      },
    }, label);
    toggle.appendChild(btn);
  });

  return wrap;
}

function renderLanguageToggle(settings) {
  const wrap = el('div', { className: 'settings-row' },
    el('span', { className: 'settings-label' }, t('settings.language')),
    el('div', { className: 'theme-toggle' })
  );
  const toggle = wrap.querySelector('.theme-toggle');

  [
    { code: 'en', label: t('settings.english') },
    { code: 'zh', label: t('settings.chinese') },
  ].forEach(({ code, label }) => {
    const btn = el('button', {
      className: 'theme-btn' + ((settings.lang || 'en') === code ? ' active' : ''),
      onClick: () => {
        setLanguage(code);
        location.reload();
      },
    }, label);
    toggle.appendChild(btn);
  });

  return wrap;
}

window.addEventListener('languagechange', () => location.reload());
