let editingId = null;

function setupImageUpload(slot) {
  const input = slot.querySelector(".image-input");
  const placeholder = slot.querySelector(".image-placeholder");
  const preview = slot.querySelector(".image-preview");

  function loadImage(file) {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      preview.src = e.target.result;
      slot.classList.add("has-image");
      slot.dataset.image = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  slot.addEventListener("click", () => input.click());
  input.addEventListener("change", () => loadImage(input.files[0]));

  slot.addEventListener("dragover", (e) => { e.preventDefault(); slot.classList.add("drag-over"); });
  slot.addEventListener("dragleave", () => slot.classList.remove("drag-over"));
  slot.addEventListener("drop", (e) => {
    e.preventDefault();
    slot.classList.remove("drag-over");
    loadImage(e.dataTransfer.files[0]);
  });
}

function addRepeatItem(groupKey, tplId, listId, data) {
  const tpl = document.getElementById(tplId);
  const node = tpl.content.firstElementChild.cloneNode(true);
  const list = document.getElementById(listId);

  setupImageUpload(node.querySelector(".image-slot"));

  if (data) {
    node.querySelectorAll("[class]").forEach((el) => {
      if (el.classList.contains("f-caption")) el.value = data.caption || "";
      if (el.classList.contains("f-description")) el.value = data.description || "";
      if (el.classList.contains("f-method")) el.value = data.method || "POST";
      if (el.classList.contains("f-endpoint")) el.value = data.endpoint || "";
      if (el.classList.contains("f-request")) el.value = data.request || "";
      if (el.classList.contains("f-response")) el.value = data.response || "";
    });
    if (data.image) {
      const slot = node.querySelector(".image-slot");
      const preview = slot.querySelector(".image-preview");
      preview.src = data.image;
      slot.classList.add("has-image");
      slot.dataset.image = data.image;
    }
  }

  node.querySelector(".remove-item").addEventListener("click", () => node.remove());
  list.appendChild(node);
}

function collectGroup(listId) {
  const items = [...document.getElementById(listId).children];
  return items.map((el) => {
    const caption = el.querySelector(".f-caption");
    if (caption) {
      const slot = el.querySelector(".image-slot");
      return {
        caption: caption.value.trim(),
        description: el.querySelector(".f-description").value.trim(),
        image: slot ? slot.dataset.image || "" : "",
      };
    }
    return {
      method: el.querySelector(".f-method").value,
      endpoint: el.querySelector(".f-endpoint").value.trim(),
      request: el.querySelector(".f-request").value.trim(),
      response: el.querySelector(".f-response").value.trim(),
    };
  });
}

function bindAddButtons() {
  document.getElementById("addScreenshot").addEventListener("click", () =>
    addRepeatItem("screenshots", "screenshotTpl", "screenshotList")
  );
  document.getElementById("addFlow").addEventListener("click", () =>
    addRepeatItem("flow", "flowTpl", "flowList")
  );
  document.getElementById("addApi").addEventListener("click", () =>
    addRepeatItem("api", "apiTpl", "apiList")
  );
}

function fillBasicInfo(doc) {
  document.getElementById("project").value = doc.project || "";
  document.getElementById("module").value = doc.module || "";
  document.getElementById("feature").value = doc.feature || "";
  document.getElementById("platform").value = doc.platform || "";
  document.getElementById("version").value = doc.version || "";
  document.getElementById("author").value = doc.author || "";
  document.getElementById("status").value = doc.status || "draft";
  document.getElementById("overview").value = doc.overview || "";
  document.getElementById("notes").value = doc.notes || "";
}

function loadForEdit(id) {
  const doc = DocsStore.getById(id);
  if (!doc) return;
  editingId = id;
  document.getElementById("pageTitle").textContent = "Edit Documentation";
  document.querySelector('button[type="submit"]').textContent = "Update Documentation";
  fillBasicInfo(doc);
  (doc.screenshots || []).forEach((s) => addRepeatItem("screenshots", "screenshotTpl", "screenshotList", s));
  (doc.flow || []).forEach((f) => addRepeatItem("flow", "flowTpl", "flowList", f));
  (doc.api || []).forEach((a) => addRepeatItem("api", "apiTpl", "apiList", a));
}

function bindScrollSpy() {
  const links = [...document.querySelectorAll(".form-toc a")];
  const sections = links.map((l) => document.querySelector(l.getAttribute("href")));
  window.addEventListener("scroll", () => {
    let current = sections[0];
    for (const sec of sections) {
      if (sec.getBoundingClientRect().top - 100 <= 0) current = sec;
    }
    links.forEach((l) => l.classList.toggle("current", l.getAttribute("href") === "#" + current.id));
  });
}

function bindSubmit() {
  document.getElementById("docForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const payload = {
      project: val("project"),
      module: val("module"),
      feature: val("feature"),
      platform: val("platform"),
      version: val("version"),
      author: val("author"),
      status: val("status"),
      overview: val("overview"),
      notes: val("notes"),
      screenshots: collectGroup("screenshotList"),
      flow: collectGroup("flowList"),
      api: collectGroup("apiList"),
    };

    if (!payload.project || !payload.feature || !payload.platform) {
      alert("Mohon lengkapi Basic Information (Project, Feature, Platform).");
      return;
    }

    const saved = editingId ? DocsStore.update(editingId, payload) : DocsStore.create(payload);
    window.location.href = "preview.html?id=" + saved.id;
  });
}

function val(id) {
  return document.getElementById(id).value.trim();
}

async function boot() {
  await DocsStore.init();
  bindAddButtons();
  bindSubmit();
  bindScrollSpy();

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  if (id) {
    loadForEdit(id);
  } else {
    // Start every new doc with one empty block per repeatable section,
    // matching the fixed image → caption → description layout.
    addRepeatItem("screenshots", "screenshotTpl", "screenshotList");
    addRepeatItem("flow", "flowTpl", "flowList");
    addRepeatItem("api", "apiTpl", "apiList");
  }
}

boot();
