# Skill Set — DocsCMS Team

## About

Kami adalah tim pengembang yang membangun **DocsCMS**, sebuah Documentation Content Management System untuk kebutuhan dokumentasi software internal. Fokus kami adalah menciptakan alat yang ringan, mudah digunakan, dan mudah dimigrasi ke infrastruktur yang lebih besar.

---

## Core Competencies

### Frontend Development
- **Vanilla JavaScript (ES6+)** — Modular pattern (IIFE), DOM manipulation, event delegation, template rendering
- **HTML5** — Semantic markup, `template` elements, responsive meta, accessible forms
- **CSS3** — Custom properties (design tokens), flexbox, responsive breakpoints, no framework

### Data & Persistence
- **localStorage API** — Client-side key-value store, JSON serialization
- **File I/O** — Blob download, FileReader upload, base64 image encoding
- **Data Modeling** — Structured document schema with nested collections

### UI/UX Design
- **Design Tokens** — Centralized `:root` variables for colors, fonts, spacing
- **Responsive Layout** — Breakpoints at 900px and 1100px
- **Visual Motif** — Status stamps, dark sidebar + light content area, blue accent
- **Iconography** — Font Awesome 6 + Bootstrap Icons
- **Adaptive Favicon** — SVG favicon with `@media (prefers-color-scheme)` for dark/light mode

### Tools & Workflow
- **Git** — Version control, conventional commits
- **No Build Step** — Zero-config deployment, works directly from file system or any static server

---

## Tech Stack

| Area | Teknologi |
|---|---|
| Markup | HTML5 |
| Styling | CSS3 (custom properties) |
| Fonts | Inter (UI), JetBrains Mono (code) |
| Icons | Font Awesome 6.7.2, Bootstrap Icons |
| Logic | Vanilla JS (ES6+) |
| Storage | localStorage |
| Seed Data | JSON |

---

## Methodologies

- **Modular Architecture** — Separation of concerns: data layer (`storage.js`), page logic
- **Migration-First Design** — V1 data layer designed to be the only file replaced when moving to V2 (Express + SQLite)
- **Progressive Enhancement** — Core functionality works without JavaScript disabled features
- **Mobile-First** — Responsive design scales from mobile to desktop

---

## Collaboration

- Git-based workflow
- Bahasa Indonesia untuk UI dan dokumentasi internal
- Kode bersih tanpa framework agar mudah dipahami dan dimodifikasi oleh seluruh anggota tim
