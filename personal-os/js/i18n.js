const STRINGS = {
  en: {
    nav: {
      home: 'Home', today: 'Today', calendar: 'Calendar',
      academics: 'Academics', research: 'Research', competitions: 'Competitions',
      reading: 'Reading', life: 'Life', ideas: 'Ideas',
      goals: 'Goals', achievements: 'Achievements',
      settings: 'Settings',
    },
    settings: {
      title: 'Settings', subtitle: 'Name, theme, and language',
      name: 'Name',
      theme: 'Appearance', light: 'Light', dark: 'Dark',
      language: 'Language', english: 'English', chinese: '中文',
    },
    academics: {
      title: 'Academics',
      subtitle: 'A flexible academic resume — organize your way, see everything at a glance',
      summary: 'Overview',
      summaryHint: 'Auto-generated from all sections below. Add entries by grade, semester, subject, or any grouping you prefer.',
      organize: 'Your sections',
      organizeHint: 'Name each section however you like — G10, Fall 2024, AP Exams, etc.',
      addEntry: 'Add section',
      gpa: 'GPA',
      sectionGpa: 'Section GPA',
      courses: 'Courses',
      clubs: 'Clubs',
      courseName: 'Course',
      grade: 'Grade',
      semester: 'Semester',
      courseGpa: 'Course GPA',
      apExamGrade: 'AP Exam',
      notes: 'Notes',
      clubName: 'Club',
      role: 'Role',
      group: 'Section',
      noGpa: 'No GPA recorded yet.',
      noCourses: 'No courses yet.',
      noClubs: 'No clubs yet.',
      remove: 'Remove',
    },
    greeting: { morning: 'Good morning', afternoon: 'Good afternoon', evening: 'Good evening' },
  },
  zh: {
    nav: {
      home: '首页', today: '今日', calendar: '日历',
      academics: '学业', research: '研究', competitions: '竞赛',
      reading: '阅读', life: '生活', ideas: '灵感',
      goals: '目标', achievements: '成就',
      settings: '设置',
    },
    settings: {
      title: '设置', subtitle: '姓名、主题与语言',
      name: '姓名',
      theme: '外观', light: '浅色', dark: '深色',
      language: '语言', english: 'English', chinese: '中文',
    },
    academics: {
      title: '学业',
      subtitle: '灵活的学业简历——按你的方式整理，一览全貌',
      summary: '总览',
      summaryHint: '根据下方所有分区自动生成。可按年级、学期、科目等任意方式添加分区。',
      organize: '你的分区',
      organizeHint: '分区名称随意取——G10、2024 秋季、AP 考试等。',
      addEntry: '添加分区',
      gpa: 'GPA',
      sectionGpa: '分区 GPA',
      courses: '课程',
      clubs: '社团',
      courseName: '课程',
      grade: '成绩',
      semester: '学期',
      courseGpa: '课程 GPA',
      apExamGrade: 'AP 考试',
      notes: '备注',
      clubName: '社团',
      role: '角色',
      group: '分区',
      noGpa: '暂无 GPA。',
      noCourses: '暂无课程。',
      noClubs: '暂无社团。',
      remove: '删除',
    },
    greeting: { morning: '早上好', afternoon: '下午好', evening: '晚上好' },
  },
};

function getLang() {
  return getData('settings', { theme: 'light', lang: 'en' }).lang || 'en';
}

function t(key) {
  const parts = key.split('.');
  let obj = STRINGS[getLang()] || STRINGS.en;
  for (const p of parts) {
    obj = obj?.[p];
  }
  return obj ?? STRINGS.en[parts[0]]?.[parts[1]] ?? key;
}

function applyLanguage() {
  const lang = getLang();
  document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
}

function setLanguage(lang) {
  const settings = getData('settings', { theme: 'light', lang: 'en' });
  settings.lang = lang;
  setData('settings', settings);
  applyLanguage();
  window.dispatchEvent(new Event('languagechange'));
}

applyLanguage();
