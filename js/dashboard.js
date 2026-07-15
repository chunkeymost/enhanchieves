const STATUS_LABEL = {
  draft: "Draft",
  review: "On Review",
  accepted: "Accepted",
  declined: "Declined",
};

let state = {
  search: "",
  status: "",
  platform: "",
  sortDir: "desc", // by lastUpdate
};

async function boot() {
  await DocsStore.init();
  bindControls();
  render();
}

function bindControls() {
  document.getElementById("searchInput").addEventListener("input", (e) => {
    state.search = e.target.value.trim().toLowerCase();
    render();
  });
  document.getElementById("statusFilter").addEventListener("change", (e) => {
    state.status = e.target.value;
    render();
  });
  document.getElementById("platformFilter").addEventListener("change", (e) => {
    state.platform = e.target.value;
    render();
  });
  document.getElementById("sortDate").addEventListener("click", () => {
    state.sortDir = state.sortDir === "desc" ? "asc" : "desc";
    render();
  });
  document.getElementById("exportBtn").addEventListener("click", () => DocsStore.exportJSON());
  document.getElementById("importBtn").addEventListener("click", () =>
    document.getElementById("importFile").click()
  );
  document.getElementById("importFile").addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    await DocsStore.importJSON(file);
    render();
  });
}

function renderOverview() {
  const c = DocsStore.counts();
  const cards = [
    { key: "draft", label: "Draft", value: c.draft },
    { key: "review", label: "On Review", value: c.review },
    { key: "accepted", label: "Accepted", value: c.accepted },
    { key: "declined", label: "Declined", value: c.declined },
    { key: "total", label: "Total Documentation", value: c.total },
  ];
  document.getElementById("overviewGrid").innerHTML = cards
    .map(
      (c) => `
    <div class="overview-card overview-card--${c.key}">
      <div class="num">${c.value}</div>
      <div class="label">${c.label}</div>
    </div>`
    )
    .join("");
}

function getFilteredDocs() {
  let docs = DocsStore.getAll();

  if (state.search) {
    docs = docs.filter((d) =>
      [d.feature, d.project, d.module, d.author]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(state.search)
    );
  }
  if (state.status) docs = docs.filter((d) => d.status === state.status);
  if (state.platform) docs = docs.filter((d) => d.platform === state.platform);

  docs.sort((a, b) => {
    const cmp = new Date(a.lastUpdate) - new Date(b.lastUpdate);
    return state.sortDir === "desc" ? -cmp : cmp;
  });

  return docs;
}

function renderTable() {
  const docs = getFilteredDocs();
  const tbody = document.getElementById("tableBody");
  const empty = document.getElementById("emptyState");
  document.getElementById("resultCount").textContent = `${docs.length} dokumentasi`;
  document.querySelector("#sortDate .arrow").textContent = state.sortDir === "desc" ? "↓" : "↑";

  if (docs.length === 0) {
    tbody.innerHTML = "";
    empty.hidden = false;
    return;
  }
  empty.hidden = true;

  tbody.innerHTML = docs
    .map(
      (d) => `
    <tr>
      <td class="cell-title">${escapeHtml(d.feature)}</td>
      <td>${escapeHtml(d.project)}</td>
      <td>${escapeHtml(d.platform)}</td>
      <td class="cell-muted">${escapeHtml(d.version)}</td>
      <td><span class="stamp stamp--${d.status}">${STATUS_LABEL[d.status] || d.status}</span></td>
      <td class="cell-muted">${formatDate(d.lastUpdate)}</td>
      <td class="row-actions">
        <a class="btn btn-sm btn-ghost" href="preview.html?id=${d.id}">Preview</a>
        <a class="btn btn-sm btn-ghost" href="cms.html?id=${d.id}">Edit</a>
        <button class="btn btn-sm btn-danger" data-delete="${d.id}">Delete</button>
      </td>
    </tr>`
    )
    .join("");

  tbody.querySelectorAll("[data-delete]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.delete;
      const doc = DocsStore.getById(id);
      if (confirm(`Hapus dokumentasi "${doc.feature}"? Tindakan ini tidak bisa dibatalkan.`)) {
        DocsStore.remove(id);
        render();
      }
    });
  });
}

function render() {
  renderOverview();
  renderTable();
}

function formatDate(iso) {
  if (!iso) return "-";
  const d = new Date(iso);
  return d.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
}

function escapeHtml(str) {
  return String(str ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c]));
}

boot();
