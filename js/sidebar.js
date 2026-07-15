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

  const chevronD = collapsed ? "M15 18l-6-6 6-6" : "M9 18l6-6-6-6";

  return `
    <aside class="sidebar${collapsed ? " sidebar--collapsed" : ""}">
      <div class="sidebar__brand">
        <span class="mark">*</span>
        <span class="name">Dokumentasi System</span>
      </div>
      <button class="sidebar__toggle" aria-label="${collapsed ? "Expand" : "Collapse"} sidebar">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="${chevronD}"/></svg>
      </button>
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

  const toggle = document.querySelector(".sidebar__toggle");
  if (!toggle) return;

  toggle.addEventListener("click", () => {
    const sidebar = document.querySelector(".sidebar");
    const isCollapsed = sidebar.classList.toggle("sidebar--collapsed");
    localStorage.setItem(LS_KEY, isCollapsed);

    toggle.setAttribute("aria-label", isCollapsed ? "Expand sidebar" : "Collapse sidebar");
    const path = toggle.querySelector("path");
    path.setAttribute("d", isCollapsed ? "M15 18l-6-6 6-6" : "M9 18l6-6-6-6");

    const links = sidebar.querySelectorAll("nav a");
    links.forEach((a) => {
      const link = a.querySelector("span");
      if (isCollapsed) a.setAttribute("title", link.textContent);
      else a.removeAttribute("title");
    });
  });
});
