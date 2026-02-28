import { FILES, getBaseUrl, STORAGE_KEY } from "./constants.js";
import { getConfigState, loadConfigState, saveConfigState, debouncedSave } from "./state.js";
import { buildConfig } from "./config-builder.js";
import { createPageGroup, updatePageMoveButtons, initPageManager } from "./page-manager.js";
import { createTileBlock, createAddTileSlot } from "./configuratiles/registry.js";
import { initProfileImagePicker, getProfileImageConfig, PROFILE_IMAGE_FILENAME } from "./profile-image.js";
import { initLoadConfig } from "./load-config.js";

initPageManager();
initProfileImagePicker();
initLoadConfig();

function initConfigurator() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) {
      const state = JSON.parse(raw);
      loadConfigState(state);
      return;
    }
  } catch (_) {}
  createPageGroup("home", "Home", "home", true);
}
initConfigurator();

document.addEventListener("click", function(e) {
  const slotBtn = e.target.closest(".add-tile-slot-btn");
  if (slotBtn) {
    e.stopPropagation();
    const slot = slotBtn.closest(".add-tile-slot");
    const dropdown = slot?.querySelector(".add-tile-slot-dropdown");
    if (!slot || !dropdown) return;
    const isOpen = dropdown.classList.contains("open");
    document.querySelectorAll(".add-tile-slot-dropdown.open").forEach(function(d) { d.classList.remove("open"); });
    document.querySelectorAll(".add-tile-slot.open").forEach(function(s) { s.classList.remove("open"); });
    document.querySelectorAll(".add-tile-slot-btn[aria-expanded='true']").forEach(function(b) { b.setAttribute("aria-expanded", "false"); });
    if (!isOpen) {
      dropdown.classList.add("open");
      slot.classList.add("open");
      slotBtn.setAttribute("aria-expanded", "true");
    } else {
      slotBtn.setAttribute("aria-expanded", "false");
    }
    return;
  }
  const opt = e.target.closest(".add-tile-option");
  if (opt) {
    e.stopPropagation();
    const slotOpt = opt.classList.contains("add-tile-slot-option");
    const slot = opt.closest(".add-tile-slot");
    const pg = slot?.closest(".page-group");
    const container = pg?.querySelector(".page-tiles");
    if (!container) return;
    const insertBefore = slot ? slot.nextElementSibling : null;
    if (slotOpt) {
      const newSlot = createAddTileSlot();
      if (insertBefore) {
        createTileBlock(opt.dataset.type, container, insertBefore);
        container.insertBefore(newSlot, insertBefore);
      } else {
        createTileBlock(opt.dataset.type, container);
        container.appendChild(newSlot);
      }
    }
    slot?.classList.remove("open");
    slot?.querySelector(".add-tile-slot-dropdown")?.classList.remove("open");
    slot?.querySelector(".add-tile-slot-btn")?.setAttribute("aria-expanded", "false");
    return;
  }
  if (!e.target.closest(".add-tile-slot")) {
    document.querySelectorAll(".add-tile-slot-dropdown.open").forEach(function(d) { d.classList.remove("open"); });
    document.querySelectorAll(".add-tile-slot.open").forEach(function(s) { s.classList.remove("open"); });
    document.querySelectorAll(".add-tile-slot-btn[aria-expanded='true']").forEach(function(b) { b.setAttribute("aria-expanded", "false"); });
  }
});

document.addEventListener("keydown", function(e) {
  if (e.key === "Escape") {
    document.querySelectorAll(".add-tile-slot-dropdown.open").forEach(function(d) { d.classList.remove("open"); });
    document.querySelectorAll(".add-tile-slot.open").forEach(function(s) { s.classList.remove("open"); });
    document.querySelectorAll(".add-tile-slot-btn[aria-expanded='true']").forEach(function(b) { b.setAttribute("aria-expanded", "false"); });
  }
});

document.querySelector(".configurator").addEventListener("input", function(e) {
  const el = e.target;
  if (el.tagName === "INPUT" && el.type === "text" && /[\r\n]/.test(el.value)) {
    el.value = el.value.replace(/[\r\n]+/g, " ");
  }
  debouncedSave(getConfigState);
});

document.querySelector(".configurator").addEventListener("change", function() {
  debouncedSave(getConfigState);
});

document.querySelector(".configurator").addEventListener("click", function(e) {
  if (e.target.closest(".add-link, .add-tile-option, .add-tile-slot-btn, #addPageBtn, .page-remove, .tile-remove, .link-remove, .page-move-up, .page-move-down, .tile-move-up, .tile-move-down, .link-move-up, .link-move-down")) {
    debouncedSave(getConfigState);
  }
});

document.getElementById("addPageBtn").onclick = function() {
  const pages = document.querySelectorAll("#pages-stack > .page-group");
  const n = pages.length + 1;
  const newPage = createPageGroup("page" + n, "Page " + n, "link");
  createTileBlock("pagenav", newPage);
};

document.getElementById("form").onsubmit = async function(e) {
  e.preventDefault();
  const btn = document.getElementById("downloadBtn");
  const status = document.getElementById("status");
  btn.disabled = true;
  status.textContent = "Building zip…";
  status.className = "loading";

  try {
    const { default: JSZip } = await import("https://esm.sh/jszip@3.10.1");
    const zip = new JSZip();
    const baseUrl = getBaseUrl();
    const profileImage = getProfileImageConfig();

    const filesToFetch = FILES.filter(function(f) {
      if (f !== PROFILE_IMAGE_FILENAME) return true;
      if (profileImage.mode === "upload" && profileImage.file) return false;
      if (profileImage.mode === "url") return false;
      return true;
    });

    const state = getConfigState();
    const ogTitle = state.profile.name
      ? `${state.profile.name} x Limn: ${(state.pages[0]?.title || "Home")}`
      : "Limn";
    const ogDesc = (state.profile.bio || "").replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

    for (let i = 0; i < filesToFetch.length; i++) {
      const file = filesToFetch[i];
      const res = await fetch(baseUrl + file);
      if (!res.ok) throw new Error("Failed to fetch " + file + ": " + res.status);
      let blob = await res.blob();
      if (file === "index.html") {
        let html = await blob.text();
        const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
        html = html.replace(/<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="${esc(ogTitle)}">`);
        html = html.replace(/<meta property="og:description" content="[^"]*">/, `<meta property="og:description" content="${esc(ogDesc)}">`);
        html = html.replace(/<meta name="twitter:title" content="[^"]*">/, `<meta name="twitter:title" content="${esc(ogTitle)}">`);
        html = html.replace(/<meta name="twitter:description" content="[^"]*">/, `<meta name="twitter:description" content="${esc(ogDesc)}">`);
        blob = new Blob([html], { type: "text/html" });
      }
      zip.file(file, blob);
    }

    if (profileImage.mode === "upload" && profileImage.file) {
      zip.file(PROFILE_IMAGE_FILENAME, profileImage.file);
    }

    zip.file("config.yaml", buildConfig());

    const blob = await zip.generateAsync({ type: "blob" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "limn.zip";
    a.click();
    URL.revokeObjectURL(a.href);

    status.textContent = "Download started.";
    status.className = "";
  } catch (err) {
    status.textContent = err.message;
    status.className = "error";
  }
  btn.disabled = false;
};
