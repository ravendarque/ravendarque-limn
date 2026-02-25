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

  function updateAllMoveButtons() {
    stack.querySelectorAll(".tile-block").forEach(function(b) {
      const up = b.querySelector(".tile-move-up");
      const down = b.querySelector(".tile-move-down");
      if (up) up.disabled = !b.previousElementSibling;
      if (down) down.disabled = !b.nextElementSibling;
    });
  }
  block.querySelector(".tile-move-up").onclick = function() {
    const prev = block.previousElementSibling;
    if (prev) {
      stack.insertBefore(block, prev);
      updateAllMoveButtons();
    }
  };
  block.querySelector(".tile-move-down").onclick = function() {
    const next = block.nextElementSibling;
    if (next) {
      stack.insertBefore(next, block);
      updateAllMoveButtons();
    }
  };
  block.querySelector(".tile-remove").onclick = function() {
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
