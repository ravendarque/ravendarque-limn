import { STORAGE_KEY } from "./constants.js";
import { createPageGroup, updatePageMoveButtons } from "./page-manager.js";
import { createTileBlock, populateTileBlock, extractTileFromBlock, tileToState } from "./configuratiles/registry.js";
import { getProfileImageConfig, setProfileImageFromState } from "./profile-image.js";

export function getConfigState() {
  const name = document.getElementById("name").value.trim();
  const bio = document.getElementById("bio").value.trim();
  const theme = document.getElementById("theme").value;
  const profileImage = getProfileImageConfig();
  const profile = { name, bio };
  if (profileImage.mode === "url" && profileImage.image) profile.image = profileImage.image;
  const pages = [];
  const pageGroups = document.querySelectorAll("#pages-stack > .page-group");
  for (const pg of pageGroups) {
    const pageId = pg.querySelector(".page-id-input")?.value?.trim() || "home";
    const pageTitle = pg.querySelector(".page-title-input")?.value?.trim() || "Home";
    const pageIcon = pg.querySelector(".page-icon-input")?.value?.trim() || "home";
    const hideFromNavbar = !(pg.querySelector(".page-show-in-nav")?.checked ?? true);
    const tiles = [];
    const blocks = pg.querySelectorAll(".page-tiles > .tile-block");
    for (const block of blocks) {
      const tile = extractTileFromBlock(block);
      tiles.push(tileToState(tile));
    }
    pages.push({ id: pageId, title: pageTitle, icon: pageIcon, hideFromNavbar, tiles });
  }
  return { profile, theme, pages };
}

export function loadConfigState(state) {
  if (!state || !state.pages || state.pages.length === 0) return;
  document.getElementById("name").value = state.profile?.name ?? "";
  document.getElementById("bio").value = state.profile?.bio ?? "";
  document.getElementById("theme").value = state.theme ?? "light";
  setProfileImageFromState(state);
  const pagesStack = document.getElementById("pages-stack");
  pagesStack.innerHTML = "";
  for (let i = 0; i < state.pages.length; i++) {
    const p = state.pages[i];
    const isHome = i === 0;
    const tilesContainer = createPageGroup(p.id || "home", p.title || "Home", p.icon || "home", isHome);
    const pg = tilesContainer.closest(".page-group");
    pg.querySelector(".page-show-in-nav").checked = !(p.hideFromNavbar ?? false);
    for (const tile of p.tiles || []) {
      if (!tile.type) continue;
      const block = createTileBlock(tile.type, tilesContainer);
      if (block) populateTileBlock(block, tile);
    }
  }
  document.querySelectorAll(".page-group.selected").forEach(function(p) { p.classList.remove("selected"); });
  const first = pagesStack.querySelector(".page-group");
  if (first) first.classList.add("selected");
  updatePageMoveButtons();
}

let saveTimeout = null;

export function saveConfigState(getState) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(getState()));
  } catch (_) {}
}

export function debouncedSave(getState) {
  if (saveTimeout) clearTimeout(saveTimeout);
  saveTimeout = setTimeout(function() { saveConfigState(getState); }, 300);
}
