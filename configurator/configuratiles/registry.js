import { getTileWikiUrl } from "../constants.js";
import heading from "./heading.js";
import text from "./text.js";
import image from "./image.js";
import link from "./link.js";
import linksbar from "./linksbar.js";
import pagenav from "./pagenav.js";
import embed from "./embed.js";
import calendar from "./calendar.js";
import quote from "./quote.js";
import codeblock from "./codeblock.js";

const CONFIGURATILE_TYPES = {
  heading,
  text,
  image,
  link,
  linksbar,
  pagenav,
  embed,
  calendar,
  quote,
  codeblock
};

export function createTileBlock(type, container, insertBefore) {
  const def = CONFIGURATILE_TYPES[type];
  if (!def) return null;

  const stack = container;
  const block = document.createElement("div");
  block.className = "tile-block";
  block.dataset.type = type;

  const wikiUrl = getTileWikiUrl(type);

  block.innerHTML = '<div class="tile-block-header"><span class="tile-block-type">' + def.label + '</span><a href="' + wikiUrl + '" target="_blank" rel="noopener noreferrer" class="tile-help-link" title="View docs"><i class="ti ti-help-circle"></i></a><div class="tile-block-actions"><button type="button" class="btn btn-secondary tile-move-up" title="Move up"><i class="ti ti-chevron-up"></i></button><button type="button" class="btn btn-secondary tile-move-down" title="Move down"><i class="ti ti-chevron-down"></i></button><button type="button" class="btn btn-secondary tile-remove" title="Remove">×</button></div></div><div class="tile-block-body"></div>';

  const body = block.querySelector(".tile-block-body");
  def.renderBody(body);

  function prevTileBlock(el) {
    let p = el.previousElementSibling;
    while (p && !p.classList.contains("tile-block")) p = p.previousElementSibling;
    return p;
  }
  function nextTileBlock(el) {
    let n = el.nextElementSibling;
    while (n && !n.classList.contains("tile-block")) n = n.nextElementSibling;
    return n;
  }
  function updateAllMoveButtons() {
    stack.querySelectorAll(".tile-block").forEach(function(b) {
      const up = b.querySelector(".tile-move-up");
      const down = b.querySelector(".tile-move-down");
      if (up) up.disabled = !prevTileBlock(b);
      if (down) down.disabled = !nextTileBlock(b);
    });
  }
  block.querySelector(".tile-move-up").onclick = function() {
    const prev = prevTileBlock(block);
    if (prev) {
      stack.insertBefore(block, prev);
      updateAllMoveButtons();
    }
  };
  block.querySelector(".tile-move-down").onclick = function() {
    const next = nextTileBlock(block);
    if (next) {
      stack.insertBefore(next, block);
      updateAllMoveButtons();
    }
  };
  block.querySelector(".tile-remove").onclick = function() {
    const next = block.nextElementSibling;
    if (next && next.classList.contains("add-tile-slot")) next.remove();
    block.remove();
    updateAllMoveButtons();
  };

  if (insertBefore) {
    stack.insertBefore(block, insertBefore);
  } else {
    stack.appendChild(block);
  }
  updateAllMoveButtons();
  return block;
}

export function populateTileBlock(block, tile) {
  const def = CONFIGURATILE_TYPES[tile.type];
  if (def && def.populate) def.populate(block, tile);
}

export function extractTileFromBlock(block) {
  const type = block.dataset.type;
  const def = CONFIGURATILE_TYPES[type];
  if (!def) return { type };
  return def.extractFromBlock(block);
}

export function tileToYaml(tile, escapeYaml) {
  const def = CONFIGURATILE_TYPES[tile.type];
  if (!def || !def.toYaml) return "";
  return def.toYaml(tile, escapeYaml);
}

export function tileToState(tile) {
  const def = CONFIGURATILE_TYPES[tile.type];
  if (!def || !def.toState) return { type: tile.type };
  return def.toState(tile);
}

export function getAddTileOptions() {
  return Object.entries(CONFIGURATILE_TYPES).map(function(entry) {
    return { type: entry[0], label: entry[1].label };
  });
}

export function createAddTileSlot() {
  const typeIcons = { heading: "heading", text: "article", image: "photo", link: "link", linksbar: "apps", pagenav: "layout-navbar", embed: "video", calendar: "calendar", quote: "quote", codeblock: "code" };
  const options = getAddTileOptions().map(function(o) {
    const icon = typeIcons[o.type] || "link";
    return '<button type="button" class="add-tile-option add-tile-slot-option" data-type="' + o.type.replace(/"/g, "&quot;") + '" role="menuitem"><i class="ti ti-' + icon + '"></i> ' + o.label.replace(/</g, "&lt;") + '</button>';
  }).join("");
  const slot = document.createElement("div");
  slot.className = "add-tile-slot";
  slot.innerHTML = '<button type="button" class="add-tile-slot-btn" title="Add tile" aria-haspopup="true" aria-expanded="false"><i class="ti ti-plus"></i></button><div class="add-tile-slot-dropdown" role="menu">' + options + '</div>';
  return slot;
}
