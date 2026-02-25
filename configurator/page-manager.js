import { WIKI_BASE } from "./constants.js";
import { openPicker, updateIconTrigger, initIconPicker } from "./icon-picker.js";
import { createTileBlock } from "./configuratiles/registry.js";
import { getAddTileOptions } from "./configuratiles/registry.js";

export function updatePageTitleBar(pg) {
  const label = pg.querySelector(".page-title-label");
  const title = pg.querySelector(".page-title-input")?.value?.trim() || "Home";
  const icon = pg.querySelector(".page-icon-input")?.value?.trim() || "home";
  if (label) {
    label.innerHTML = "<i class=\"ti ti-" + icon.replace(/"/g, "&quot;") + "\"></i> " + title.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
}

export function updatePageMoveButtons() {
  const pages = document.querySelectorAll("#pages-stack > .page-group:not(.page-home)");
  pages.forEach(function(pg, i) {
    const up = pg.querySelector(".page-move-up");
    const down = pg.querySelector(".page-move-down");
    if (up) up.disabled = i === 0;
    if (down) down.disabled = i === pages.length - 1;
  });
}

export function createPageGroup(pageId, title, icon, isHome) {
  pageId = pageId || "home";
  title = title || "Home";
  icon = icon || "home";

  const pagesStack = document.getElementById("pages-stack");
  const pg = document.createElement("div");
  pg.className = "page-group" + (isHome ? " page-home" : "");
  pg.dataset.pageId = pageId;

  const iconEsc = icon.replace(/"/g, "&quot;");
  const titleEsc = title.replace(/"/g, "&quot;");
  const idEsc = pageId.replace(/"/g, "&quot;");

  pg.innerHTML = '<div class="page-title-bar"><span class="page-title-label"><i class="ti ti-' + iconEsc + '"></i> ' + titleEsc + '</span><a href="' + WIKI_BASE + '/Pages" target="_blank" rel="noopener noreferrer" class="tile-help-link" title="View docs"><i class="ti ti-help-circle"></i></a><div class="tile-block-actions page-actions"><button type="button" class="btn btn-secondary page-move-up" title="Move up"><i class="ti ti-chevron-up"></i></button><button type="button" class="btn btn-secondary page-move-down" title="Move down"><i class="ti ti-chevron-down"></i></button><button type="button" class="btn btn-secondary page-remove" title="Remove">×</button></div></div><div class="page-header"><div class="page-header-fields"><div class="page-header-field"><button type="button" class="btn btn-secondary icon-picker-trigger page-icon-trigger" title="Pick icon"><i class="ti ti-' + iconEsc + '"></i></button><input type="hidden" class="page-icon-input" value="' + iconEsc + '"></div><div class="page-header-field"><label>ID</label><input type="text" class="page-id-input" placeholder="home" value="' + idEsc + '" pattern="[a-z0-9_-]+" title="Lowercase letters, numbers, hyphens, underscores only" maxlength="64"></div><div class="page-header-field"><label>Title</label><input type="text" class="page-title-input" placeholder="Home" value="' + titleEsc + '" maxlength="80"></div><div class="page-header-field page-header-field-nav"><label>Navigation</label><label class="toggle-switch"><input type="checkbox" class="page-show-in-nav" checked><span class="toggle-slider"></span></label></div></div></div><div class="page-tiles"></div><div class="add-tile-wrap"><button type="button" class="btn btn-secondary add-tile-btn-main" aria-haspopup="true" aria-expanded="false"><i class="ti ti-circle-plus"></i> Add tile <i class="ti ti-chevron-down add-tile-chevron"></i></button><div class="add-tile-dropdown" role="menu"></div></div>';

  const tilesContainer = pg.querySelector(".page-tiles");
  const dropdown = pg.querySelector(".add-tile-dropdown");

  const options = getAddTileOptions();
  const typeIcons = { heading: "heading", text: "article", image: "photo", link: "link", linksbar: "apps", pagenav: "layout-navbar", embed: "video", calendar: "calendar", quote: "quote", codeblock: "code" };
  for (let i = 0; i < options.length; i++) {
    const opt = options[i];
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "add-tile-option";
    btn.setAttribute("role", "menuitem");
    btn.dataset.type = opt.type;
    const iconName = typeIcons[opt.type] || "link";
    btn.innerHTML = '<i class="ti ti-' + iconName + '"></i> ' + opt.label;
    dropdown.appendChild(btn);
  }

  pg.onclick = function(e) {
    if (e.target.closest(".add-tile-wrap")) return;
    document.querySelectorAll(".page-group.selected").forEach(function(p) { p.classList.remove("selected"); });
    pg.classList.add("selected");
  };

  if (!isHome) {
    pg.querySelector(".page-move-up").onclick = function(e) {
      e.stopPropagation();
      const prev = pg.previousElementSibling;
      if (prev) {
        pagesStack.insertBefore(pg, prev);
        updatePageMoveButtons();
      }
    };
    pg.querySelector(".page-move-down").onclick = function(e) {
      e.stopPropagation();
      const next = pg.nextElementSibling;
      if (next) {
        pagesStack.insertBefore(next, pg);
        updatePageMoveButtons();
      }
    };
    pg.querySelector(".page-remove").onclick = function(e) {
      e.stopPropagation();
      if (pagesStack.querySelectorAll(".page-group").length <= 1) return;
      pg.remove();
      updatePageMoveButtons();
    };
  }

  pagesStack.appendChild(pg);
  if (isHome) {
    pg.querySelector(".page-actions")?.remove();
  }
  pg.classList.add("selected");

  const iconTrigger = pg.querySelector(".page-icon-trigger");
  const iconInput = pg.querySelector(".page-icon-input");
  if (iconTrigger && iconInput) {
    updateIconTrigger(iconTrigger);
    iconTrigger.onclick = function(e) {
      e.stopPropagation();
      openPicker(iconInput);
    };
  }

  const titleInput = pg.querySelector(".page-title-input");
  if (titleInput) {
    titleInput.oninput = function() { updatePageTitleBar(pg); };
  }

  const idInput = pg.querySelector(".page-id-input");
  if (idInput) {
    idInput.oninput = function() {
      const v = idInput.value.replace(/[^a-z0-9_-]/g, "").toLowerCase();
      if (v !== idInput.value) idInput.value = v;
      pg.dataset.pageId = idInput.value.trim() || "home";
    };
  }

  updatePageMoveButtons();
  return tilesContainer;
}

export function initPageManager() {
  initIconPicker(function(input) {
    const pg = input.closest(".page-group");
    if (pg) updatePageTitleBar(pg);
  });
}
