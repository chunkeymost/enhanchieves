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

  const imageSlot = node.querySelector(".image-slot");
  if (imageSlot) setupImageUpload(imageSlot);

  if (data) {
    node.querySelectorAll("[class]").forEach((el) => {
      if (el.classList.contains("f-caption")) el.value = data.caption || "";
      if (el.classList.contains("f-description")) el.value = data.description || "";
      if (el.classList.contains("f-method")) el.value = data.method || "POST";
      if (el.classList.contains("f-endpoint")) el.value = data.endpoint || "";
      if (el.classList.contains("f-request")) el.value = data.request || "";
      if (el.classList.contains("f-response")) el.value = data.response || "";
      if (el.classList.contains("f-date")) el.value = data.date || "";
      if (el.classList.contains("f-update-desc")) el.value = data.description || "";
      if (el.classList.contains("f-note-point")) el.value = data.text || data || "";
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
    const notePoint = el.querySelector(".f-note-point");
    if (notePoint) return notePoint.value.trim();

    const dateField = el.querySelector(".f-date");
    if (dateField) {
      const slot = el.querySelector(".image-slot");
      return {
        date: dateField.value.trim(),
        description: el.querySelector(".f-update-desc").value.trim(),
        image: slot ? slot.dataset.image || "" : "",
      };
    }
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
  document.getElementById("addUpdates").addEventListener("click", () =>
    addRepeatItem("updates", "updatesTpl", "updatesList")
  );
  document.getElementById("addNote").addEventListener("click", () =>
    addRepeatItem("notes", "notesTpl", "notesList")
  );
}

function bindSectionToggle(sectionId, targetIds) {
  const section = document.getElementById(sectionId);
  const toggle = section.querySelector(".toggle-input");
  const label = section.querySelector(".toggle-label");

  function apply(state) {
    section.classList.toggle("section--disabled", !state);
    label.textContent = state ? "On" : "Off";
    targetIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.disabled = !state;
    });
  }

  apply(toggle.checked);
  toggle.addEventListener("change", () => apply(toggle.checked));
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

  const apiToggle = document.querySelector("#sec-api .toggle-input");
  if (apiToggle) {
    apiToggle.checked = doc.apiEnabled !== false;
    apiToggle.dispatchEvent(new Event("change"));
  }
  const notesToggle = document.querySelector("#sec-notes .toggle-input");
  if (notesToggle) {
    notesToggle.checked = doc.notesEnabled !== false;
    notesToggle.dispatchEvent(new Event("change"));
  }
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
  (doc.updates || []).forEach((u) => addRepeatItem("updates", "updatesTpl", "updatesList", u));
  (doc.notes || []).forEach((n) => addRepeatItem("notes", "notesTpl", "notesList", n));
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

    const apiEnabled = document.querySelector("#sec-api .toggle-input").checked;
    const notesEnabled = document.querySelector("#sec-notes .toggle-input").checked;

    const payload = {
      project: val("project"),
      module: val("module"),
      feature: val("feature"),
      platform: val("platform"),
      version: val("version"),
      author: val("author"),
      status: val("status"),
      overview: val("overview"),
      notes: notesEnabled ? collectGroup("notesList").filter(Boolean) : [],
      screenshots: collectGroup("screenshotList"),
      flow: collectGroup("flowList"),
      api: apiEnabled ? collectGroup("apiList") : [],
      updates: collectGroup("updatesList"),
      apiEnabled,
      notesEnabled,
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
  bindSectionToggle("sec-api", ["addApi"]);
  bindSectionToggle("sec-notes", ["addNote"]);
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
    addRepeatItem("updates", "updatesTpl", "updatesList");
    addRepeatItem("notes", "notesTpl", "notesList");
  }
}

boot();
