/**
 * storage.js
 * V1 data layer for the Documentation CMS.
 *
 * There is no backend in V1, so this module simulates the
 * "data/docs.json" file described in the spec:
 *   1. On first run it loads data/docs.json as seed data.
 *   2. From then on, all reads/writes go through localStorage
 *      (key: "docscms_v1_docs") so edits persist across reloads.
 *   3. "Export JSON" downloads the current state as docs.json,
 *      so it can be committed back to the data/ folder or handed
 *      to a V2 backend as-is.
 *
 * When V2 (Express + SQLite) ships, only this file needs to be
 * swapped for one that calls a real API — every page above it
 * talks to DocsStore, never to localStorage directly.
 */
const DocsStore = (() => {
  const LS_KEY = "docscms_v1_docs";
  const SEED_URL = "data/docs.json";

  async function ensureSeeded() {
    const existing = localStorage.getItem(LS_KEY);
    if (existing) return;
    try {
      const res = await fetch(SEED_URL);
      const seed = await res.json();
      localStorage.setItem(LS_KEY, JSON.stringify(seed));
    } catch (e) {
      // No network / opened as file:// without a server — start empty.
      localStorage.setItem(LS_KEY, JSON.stringify([]));
    }
  }

  function readAll() {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : [];
  }

  function writeAll(docs) {
    localStorage.setItem(LS_KEY, JSON.stringify(docs));
  }

  function nextId(docs) {
    const nums = docs
      .map((d) => parseInt((d.id || "").replace("DOC-", ""), 10))
      .filter((n) => !isNaN(n));
    const next = (nums.length ? Math.max(...nums) : 0) + 1;
    return "DOC-" + String(next).padStart(3, "0");
  }

  function todayISO() {
    return new Date().toISOString().slice(0, 10);
  }

  return {
    async init() {
      await ensureSeeded();
    },
    getAll() {
      return readAll();
    },
    getById(id) {
      return readAll().find((d) => d.id === id) || null;
    },
    create(doc) {
      const docs = readAll();
      const record = {
        id: nextId(docs),
        lastUpdate: todayISO(),
        screenshots: [],
        flow: [],
        api: [],
        ...doc,
      };
      docs.unshift(record);
      writeAll(docs);
      return record;
    },
    update(id, patch) {
      const docs = readAll();
      const idx = docs.findIndex((d) => d.id === id);
      if (idx === -1) return null;
      docs[idx] = { ...docs[idx], ...patch, id, lastUpdate: todayISO() };
      writeAll(docs);
      return docs[idx];
    },
    remove(id) {
      const docs = readAll().filter((d) => d.id !== id);
      writeAll(docs);
    },
    counts() {
      const docs = readAll();
      const c = { draft: 0, review: 0, accepted: 0, declined: 0, total: docs.length };
      docs.forEach((d) => {
        if (d.status === "draft") c.draft++;
        else if (d.status === "review") c.review++;
        else if (d.status === "accepted") c.accepted++;
        else if (d.status === "declined") c.declined++;
      });
      return c;
    },
    exportJSON() {
      const blob = new Blob([JSON.stringify(readAll(), null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "docs.json";
      a.click();
      URL.revokeObjectURL(url);
    },
    async importJSON(file) {
      const text = await file.text();
      const parsed = JSON.parse(text);
      writeAll(parsed);
    },
    resetToSeed() {
      localStorage.removeItem(LS_KEY);
      return ensureSeeded();
    },
  };
})();
