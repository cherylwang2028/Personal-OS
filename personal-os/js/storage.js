/* Shared storage utilities — expandable schema for future iterations */

const STORAGE_PREFIX = 'personal-os:';

function getData(key, fallback) {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function setData(key, value) {
  localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
}

function formatDate(date) {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function formatShortDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function getDayData(dateKey) {
  return getData(`day:${dateKey}`, { todos: [], wins: '', reflection: '' });
}

function setDayData(dateKey, data) {
  setData(`day:${dateKey}`, data);
}

function getGreeting() {
  const hour = new Date().getHours();
  if (typeof t !== 'function') {
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  }
  if (hour < 12) return t('greeting.morning');
  if (hour < 17) return t('greeting.afternoon');
  return t('greeting.evening');
}

function getProfileName() {
  const profile = getData('profile', { name: '' });
  return profile.name || 'there';
}

function applyTheme() {
  const settings = getData('settings', { theme: 'light', lang: 'en' });
  document.documentElement.setAttribute('data-theme', settings.theme);
  if (typeof applyLanguage === 'function') applyLanguage();
}

function initTheme() {
  applyTheme();
}

applyTheme();
