# Architecture — DocsCMS v1

## Overview

DocsCMS v1 is a **client-only single-page application** built entirely with vanilla HTML, CSS, and JavaScript. There is no backend, no build step, and no framework. Data is persisted in the browser's `localStorage`, seeded from a static JSON file.

The architecture is intentionally designed with a future backend migration in mind — only one module (`storage.js`) needs to be swapped to connect to an Express + SQLite API (V2).

---

## Directory Structure

```
├── index.html         # Splash / boot page — redirects to frontend/dashboard.html
├── favicon.svg        # bi-file-code-fill icon with dark/light mode support
├── frontend/
│   ├── dashboard.html # List + overview cards + search/filter
│   ├── cms.html       # Create / Edit form (7 sections)
│   └── preview.html   # Read-only document detail
├── css/
│   ├── base.css       # Design tokens, layout, buttons, forms, tables
│   ├── dashboard.css  # Dashboard-specific styles
│   ├── cms.css        # CMS form styles
│   └── preview.css    # Preview page styles
├── js/
│   ├── storage.js     # Data layer — localStorage CRUD, import/export
│   ├── dashboard.js   # Dashboard page logic
│   ├── cms.js         # CMS form logic
│   └── preview.js     # Preview page logic
├── data/
│   └── docs.json      # Seed data (fetched once, copied to localStorage)
└── docs/
    ├── ARCHITECTURE.md
    └── SKILL.md
```

---

## Data Flow

```
/data/docs.json ──fetch──▶ localStorage ("docscms_v1_docs") ◀── CRUD ──▶ UI
                                  │
                          Export JSON (download)
                          Import JSON (upload)
                          Reset to seed
```

On first visit, `DocsStore.init()` fetches `/data/docs.json` (absolute path from root) and writes it to localStorage. All subsequent reads and writes hit localStorage directly. Export downloads the current state as `docs.json`; import replaces it from an uploaded file.

---

## Module Architecture

### Data Layer — `storage.js`

A singleton IIFE (`DocsStore`) that all pages import via `<script>`. Exposes:

| Method | Purpose |
|---|---|
| `init()` | Seed localStorage from JSON |
| `getAll()` / `getById(id)` | Read |
| `create(doc)` / `update(id, patch)` | Write |
| `remove(id)` | Delete |
| `counts()` | Aggregated status counts |
| `exportJSON()` / `importJSON(file)` | Bulk I/O |
| `resetToSeed()` | Wipe & re-seed |

**This is the only module that needs to change when migrating to V2.**

### Page Modules

| Page | Module | Responsibility |
|---|---|---|
| Dashboard | `dashboard.js` | Render doc list, overview cards, search/filter/sort, action buttons |
| CMS | `cms.js` | 7-section form, validation, populate for edit mode via `?id=` |
| Preview | `preview.js` | Render full doc view with sidebar TOC, breadcrumb, status stamp |

---

## Data Model

```typescript
interface Document {
  id: string;           // "DOC-001", auto-generated
  project: string;
  module: string;
  feature: string;
  platform: "Mobile" | "Web" | "Backend";
  version: string;      // semantic version
  author: string;
  status: "draft" | "review" | "accepted" | "declined" | "finish-uat" | "done";
  lastUpdate: string;   // ISO date (YYYY-MM-DD), auto-set
  overview: string;     // Markdown/Rich text overview
  screenshots: MediaItem[];
  flow: MediaItem[];
  api: ApiEndpoint[];
  notes: string[];
  updates: UpdateItem[];
  apiEnabled: boolean;
  notesEnabled: boolean;
}

interface MediaItem {
  caption: string;
  description: string;
  image?: string;       // base64 data URL
}

interface ApiEndpoint {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  endpoint: string;
  request: string;      // JSON string
  response: string;     // JSON string
}

interface UpdateItem {
  date: string;
  description: string;
  image?: string;
}
```

---

## Favicon

The favicon (`favicon.svg`) uses the Bootstrap Icons `bi-file-code-fill` design. It includes a `<style>` block with `@media (prefers-color-scheme: dark)` to automatically switch colours:
- **Light mode** — dark icon (`#1e1e1e`)
- **Dark mode** — light icon (`#e8e8ea`)

---

## Roadmap

| Version | Backend | Storage | Deployment |
|---|---|---|---|
| **V1** (current) | None (client-only) | localStorage | Static server / GitHub Pages |
| **V2** (planned) | Express + SQLite | Database | VPS / Railway / Render |
| **V3** (future) | Express + SQLite + Auth | Database + Sessions | Managed hosting |
