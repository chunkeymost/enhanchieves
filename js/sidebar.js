const LS_KEY = "docs_sidebar_collapsed";

function renderSidebar(active) {
  const items = [
    { href: "dashboard.html", label: "Documentation", key: "dashboard" },
    { href: "cms.html", label: "Create Documentation", key: "cms" },
  ];

  const icons = {
    dashboard: '<i class="fa-solid fa-home fa-fw"></i>',
    list: '<i class="fa-solid fa-list-ul fa-fw"></i>',
    cms: '<i class="fa-solid fa-book-open fa-fw"></i>',
    settings: '<i class="fa-solid fa-gear fa-fw"></i>',
  };

  const collapsed = localStorage.getItem(LS_KEY) !== "false";

  const nav = items
    .map((it) => {
      const cls = it.key === active ? "active" : "";
      return `<a class="${cls}" href="${it.href}"${collapsed ? ` title="${it.label}"` : ""}>${icons[it.key]}<span>${it.label}</span></a>`;
    })
    .join("");

  return `
    <aside class="sidebar${collapsed ? " sidebar--collapsed" : ""}">
      <div class="sidebar__brand">
        <span class="mark" role="button" aria-label="${collapsed ? "Expand sidebar" : "Collapse sidebar"}">${collapsed ? '<i class="bi bi-list"></i>' : '<i class="bi bi-arrow-left-short"></i>'}</span>
        <span class="name">Dokumentasi System</span>
      </div>
      <nav>${nav}</nav>
      <div class="sidebar__footer">
        v1.0
      </div>
    </aside>`;
}

document.addEventListener("DOMContentLoaded", () => {
  const mount = document.getElementById("sidebar-mount");
  if (!mount) return;
  mount.outerHTML = renderSidebar(mount.dataset.active);

  const mark = document.querySelector(".sidebar__brand .mark");
  if (!mark) return;

  mark.addEventListener("click", () => {
    const sidebar = document.querySelector(".sidebar");
    const isCollapsed = sidebar.classList.toggle("sidebar--collapsed");
    localStorage.setItem(LS_KEY, isCollapsed);

    mark.setAttribute("aria-label", isCollapsed ? "Expand sidebar" : "Collapse sidebar");
    mark.innerHTML = isCollapsed ? '<i class="bi bi-list"></i>' : '<i class="bi bi-arrow-left-short"></i>';

    const links = sidebar.querySelectorAll("nav a");
    links.forEach((a) => {
      const link = a.querySelector("span");
      if (isCollapsed) a.setAttribute("title", link.textContent);
      else a.removeAttribute("title");
    });
  });
});
