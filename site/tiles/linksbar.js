import { makeTile } from "./utils.js";
import { createIconEl } from "./icons.js";

export function render(tile) {
  const el = makeTile("linksbar");
  const showLabels = !!tile.showLabels;
  const currentHash = (location.hash || "#").slice(1);

  if (showLabels) el.classList.add("tile-linksbar--with-labels");

  tile.items.forEach(({ icon, url, label }) => {
    const a = document.createElement("a");
    a.href = url;
    const isHash = url.startsWith("#");
    if (!isHash) {
      a.target = "_blank";
      a.rel = "noopener noreferrer";
    }
    if (label) {
      a.title = label;
      a.setAttribute("aria-label", label);
    }
    if (isHash && currentHash === url.slice(1)) {
      a.classList.add("tile-linksbar-link--active");
    }
    const i = createIconEl(icon);
    if (i) a.appendChild(i);
    if (showLabels && label) {
      const span = document.createElement("span");
      span.className = "tile-linksbar-label";
      span.textContent = label;
      a.appendChild(span);
    }
    el.appendChild(a);
  });
  return el;
}

export function validate(tile, at) {
  if (!Array.isArray(tile.items) || tile.items.length === 0)
    throw new Error(`${at} (linksbar) requires at least one item in "items"`);
  tile.items.forEach((item, j) => {
    if (!item.icon) throw new Error(`${at}.items[${j}] (linksbar) missing required field: icon`);
    if (!item.url) throw new Error(`${at}.items[${j}] (linksbar) missing required field: url`);
  });
}
