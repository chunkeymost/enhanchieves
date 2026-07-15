const STATUS_LABEL = {
  draft: "Draft",
  review: "On Review",
  accepted: "Accepted",
  declined: "Declined",
  "finish-uat": "Finish UAT",
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
      frame.style.backgroundImage = `url(${item.image})`;
      frame.style.backgroundSize = "contain";
      frame.style.backgroundPosition = "center";
      frame.style.backgroundRepeat = "no-repeat";
      frame.textContent = "";
    }
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

function formatDate(iso) {
  if (!iso) return "-";
  return new Date(iso).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
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
    document.getElementById("notesText").textContent = doc.notes || "Tidak ada catatan tambahan.";
  } else {
    pNotes.style.display = "none";
    document.querySelector('.doc-toc .step[data-n="5"]')?.remove();
  }

  renderMediaGroup("screenshotBlocks", doc.screenshots);
  renderMediaGroup("flowBlocks", doc.flow);
}

boot();
