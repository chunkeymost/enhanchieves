const STATUS_LABEL = {
  draft: "Draft",
  review: "On Review",
  accepted: "Accepted",
  declined: "Declined",
  "finish-uat": "Finish UAT",
  done: "Done",
};

function renderMediaGroup(containerId, items) {
  const tpl = document.getElementById("mediaBlockTpl");
  const container = document.getElementById(containerId);
  if (!items || items.length === 0) {
    container.innerHTML = `<p class="body-text" style="color:var(--muted);">Belum ada data.</p>`;
    return;
  }
  items.forEach((item) => {
    const node = tpl.content.firstElementChild.cloneNode(true);
    node.querySelector(".media-caption").textContent = item.caption || "(no caption)";
    node.querySelector(".media-desc").textContent = item.description || "";
    const frame = node.querySelector(".media-frame");
    if (item.image) {
      const img = node.querySelector("img");
      img.src = item.image;
      img.alt = item.caption || "";
      img.classList.add("loaded");
      node.querySelector(".media-frame-placeholder").style.display = "none";
    }
    renderContentBlocks(node.querySelector(".media-content"), item.content);
    container.appendChild(node);
  });
}

function renderApiGroup(items) {
  const tpl = document.getElementById("apiBlockTpl");
  const container = document.getElementById("apiBlocks");
  if (!items || items.length === 0) {
    container.innerHTML = `<p class="body-text" style="color:var(--muted);">Belum ada endpoint.</p>`;
    return;
  }
  items.forEach((item) => {
    const node = tpl.content.firstElementChild.cloneNode(true);
    const method = node.querySelector(".api-method");
    method.textContent = item.method || "GET";
    method.classList.add(item.method || "GET");
    node.querySelector(".api-endpoint").textContent = item.endpoint || "";
    node.querySelector(".api-request").textContent = item.request || "{}";
    node.querySelector(".api-response").textContent = item.response || "{}";
    container.appendChild(node);
  });
}

function renderUpdatesGroup(items) {
  const tpl = document.getElementById("updateBlockTpl");
  const container = document.getElementById("updatesBlocks");
  if (!items || items.length === 0) {
    container.innerHTML = `<p class="body-text" style="color:var(--muted);">Belum ada update.</p>`;
    return;
  }
  items.forEach((item) => {
    const node = tpl.content.firstElementChild.cloneNode(true);
    node.querySelector(".update-date").textContent = formatDate(item.date) || "-";
    node.querySelector(".media-desc").textContent = item.description || "";
    const frame = node.querySelector(".media-frame");
    if (item.image) {
      const img = node.querySelector("img");
      img.src = item.image;
      img.alt = item.date || "";
      img.classList.add("loaded");
      node.querySelector(".media-frame-placeholder").style.display = "none";
    }
    renderContentBlocks(node.querySelector(".media-content"), item.content);
    container.appendChild(node);
  });
}

function formatDate(iso) {
  if (!iso) return "-";
  return new Date(iso).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
}

function renderFilesGroup(items) {
  const container = document.getElementById("filesBlocks");
  if (!items || items.length === 0) {
    container.innerHTML = `<p class="body-text" style="color:var(--muted);">Belum ada file.</p>`;
    return;
  }
  items.forEach((item) => {
    if (!item.name || !item.data) return;
    const div = document.createElement("div");
    div.className = "file-item";
    const icon = document.createElement("i");
    const ext = item.name.split(".").pop().toLowerCase();
    if (["pdf"].includes(ext)) icon.className = "bi bi-file-earmark-pdf";
    else if (["xlsx", "xls"].includes(ext)) icon.className = "bi bi-file-earmark-spreadsheet";
    else if (["doc", "docx"].includes(ext)) icon.className = "bi bi-file-earmark-word";
    else if (["ppt", "pptx"].includes(ext)) icon.className = "bi bi-file-earmark-slides";
    else icon.className = "bi bi-file-earmark";
    const a = document.createElement("a");
    a.href = item.data;
    a.download = item.name;
    a.textContent = item.name;
    div.appendChild(icon);
    div.appendChild(a);
    container.appendChild(div);
  });
}

function renderContentBlocks(container, content) {
  if (!content || content.length === 0) return;
  content.forEach((block) => {
    if (!block.text) return;
    let el;
    switch (block.type) {
      case "h1":
        el = document.createElement("div");
        el.className = "content-h1";
        el.textContent = block.text;
        break;
      case "h2":
        el = document.createElement("div");
        el.className = "content-h2";
        el.textContent = block.text;
        break;
      case "h3":
        el = document.createElement("div");
        el.className = "content-h3";
        el.textContent = block.text;
        break;
      case "bullet":
        el = document.createElement("div");
        el.className = "content-bullet";
        el.textContent = block.text;
        break;
      case "checklist":
        el = document.createElement("div");
        el.className = "content-checklist";
        const cb = document.createElement("input");
        cb.type = "checkbox";
        cb.disabled = true;
        cb.checked = !!block.checked;
        el.appendChild(cb);
        el.appendChild(document.createTextNode(block.text));
        break;
      case "note":
        el = document.createElement("div");
        el.className = "content-note";
        el.textContent = block.text;
        break;
      case "link":
        el = document.createElement("div");
        el.className = "content-link";
        const a = document.createElement("a");
        a.href = block.url || "#";
        a.target = "_blank";
        a.rel = "noopener";
        a.textContent = block.text;
        el.appendChild(a);
        break;
      default:
        el = document.createElement("div");
        el.className = "content-text";
        el.textContent = block.text;
    }
    container.appendChild(el);
  });
}

async function boot() {
  await DocsStore.init();
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const doc = id ? DocsStore.getById(id) : null;
  const main = document.getElementById("mainContent");

  if (!doc) {
    main.innerHTML = `<p style="color:var(--muted);">Dokumentasi tidak ditemukan. <a href="dashboard.html">Kembali ke dashboard</a>.</p>`;
    return;
  }

  const tpl = document.getElementById("pageTpl");
  main.innerHTML = "";
  main.appendChild(tpl.content.cloneNode(true));

  document.getElementById("breadcrumb").textContent = `${doc.project} / ${doc.module} / ${doc.id}`;
  document.getElementById("docTitle").textContent = doc.feature;
  document.getElementById("editLink").href = "cms.html?id=" + doc.id;

  document.getElementById("docMeta").innerHTML = `
    <span><b>Platform</b> ${doc.platform || "-"}</span>
    <span><b>Version</b> ${doc.version || "-"}</span>
    <span><b>Author</b> ${doc.author || "-"}</span>
    <span><span class="stamp stamp--${doc.status}">${STATUS_LABEL[doc.status] || doc.status}</span></span>
    <span><b>Last update</b> ${formatDate(doc.lastUpdate)}</span>
  `;

  document.getElementById("overviewText").textContent = doc.overview || "Belum ada overview.";

  const pApi = document.getElementById("p-api");
  if (doc.apiEnabled !== false) {
    renderApiGroup(doc.api);
  } else {
    pApi.style.display = "none";
    document.querySelector('.doc-toc .step[data-n="4"]')?.remove();
  }

  const pNotes = document.getElementById("p-notes");
  if (doc.notesEnabled !== false) {
    const notes = doc.notes || [];
    const el = document.getElementById("notesText");
    if (notes.length === 0) {
      el.textContent = "Tidak ada catatan tambahan.";
    } else {
      el.innerHTML = "<ol style='margin:0;padding-left:20px'><li>" + notes.join("</li><li>") + "</li></ol>";
    }
  } else {
    pNotes.style.display = "none";
    document.querySelector('.doc-toc .step[data-n="5"]')?.remove();
  }

  renderMediaGroup("screenshotBlocks", doc.screenshots);
  renderMediaGroup("flowBlocks", doc.flow);

  const pUpdates = document.getElementById("p-updates");
  if (doc.updatesEnabled !== false) {
    renderUpdatesGroup(doc.updates);
  } else {
    pUpdates.style.display = "none";
    document.querySelector('.doc-toc .step[data-n="6"]')?.remove();
  }

  renderFilesGroup(doc.files);
}

boot();
