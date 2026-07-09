# Personal OS

A lightweight, minimal personal growth documentation website. Inspired by Apple, Notion, and GitHub — focused on daily reflection and long-term growth, not achievement showcasing.

## Quick Start

No build step required. Open with any static file server:

```bash
cd ~/Desktop/personal-os
python3 -m http.server 8080
```

Then visit [http://localhost:8080](http://localhost:8080)

> Data is stored in your browser's `localStorage`. Back up by exporting from browser dev tools if needed.

## Pages (12 total)

| Page | Modules |
|------|---------|
| Home | Greeting, Bio, Today's Goals, Projects, Achievements |
| Today | Date, To-do, Wins, Reflection |
| Calendar | Monthly view + day detail |
| Academics | GPA, Courses, Semester Notes |
| Research | Projects, Progress, Milestones, Notes |
| Competitions | Status, Result, Reflection |
| Reading | Currently Reading, Finished, Quotes |
| Life | Exercise, Travel, Memories, Reflection |
| Ideas | Research, Essay, Random Thoughts |
| Goals | Daily / Weekly / Monthly / Yearly |
| Achievements | Academic, Research, Competition, Personal |
| Settings | Profile, Theme, Basic Search |

## Design

- **Palette:** White, off-white, light gray, dark gray, low-saturation blue/orange/pink
- **Style:** Minimal, calm, distraction-free
- **No charts, heatmaps, analytics, or notifications** in this MVP

## Architecture

```
personal-os/
├── index.html          # Home (+ 12 other pages)
├── css/style.css       # Design system
└── js/
    ├── storage.js      # localStorage layer (expandable)
    ├── ui.js           # Reusable UI components
    ├── layout.js       # Sidebar navigation
    └── pages/          # Page-specific logic
```

Each page loads only what it needs. Core pages (Home, Today, Research, Reading) are optimized for fast load with minimal scripts.

## Future Iterations

The structure supports adding later without rewrites:

- Backend sync (replace `storage.js` calls)
- Rich text editing
- Calendar notes field on Today page
- Export/import data

## License

Personal use.
