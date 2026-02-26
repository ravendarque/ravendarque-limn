import { FILES, getBaseUrl, STORAGE_KEY } from "./constants.js";
import { getConfigState, loadConfigState, saveConfigState, debouncedSave } from "./state.js";
import { buildConfig } from "./config-builder.js";
import { createPageGroup, updatePageMoveButtons, initPageManager } from "./page-manager.js";
import { createTileBlock } from "./configuratiles/registry.js";
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
  const btn = e.target.closest(".add-tile-btn-main");
  if (btn) {
    e.stopPropagation();
    const wrap = btn.closest(".add-tile-wrap");
    const dropdown = wrap?.querySelector(".add-tile-dropdown");
    if (!wrap || !dropdown) return;
    const isOpen = dropdown.classList.contains("open");
    document.querySelectorAll(".add-tile-dropdown.open").forEach(function(d) { d.classList.remove("open"); });
    document.querySelectorAll(".add-tile-wrap.open").forEach(function(w) { w.classList.remove("open"); });
    if (!isOpen) {
      dropdown.classList.add("open");
      wrap.classList.add("open");
      btn.setAttribute("aria-expanded", "true");
    } else {
      btn.setAttribute("aria-expanded", "false");
    }
    return;
  }
  const opt = e.target.closest(".add-tile-option");
  if (opt) {
    e.stopPropagation();
    const wrap = opt.closest(".add-tile-wrap");
    const pg = wrap?.closest(".page-group");
    const container = pg?.querySelector(".page-tiles");
    if (!container) return;
    createTileBlock(opt.dataset.type, container);
    wrap?.classList.remove("open");
    wrap?.querySelector(".add-tile-dropdown")?.classList.remove("open");
    const mainBtn = wrap?.querySelector(".add-tile-btn-main");
    if (mainBtn) mainBtn.setAttribute("aria-expanded", "false");
    return;
  }
  if (!e.target.closest(".add-tile-wrap")) {
    document.querySelectorAll(".add-tile-dropdown.open").forEach(function(d) { d.classList.remove("open"); });
    document.querySelectorAll(".add-tile-wrap.open").forEach(function(w) { w.classList.remove("open"); });
    document.querySelectorAll(".add-tile-btn-main[aria-expanded='true']").forEach(function(b) { b.setAttribute("aria-expanded", "false"); });
  }
});

document.addEventListener("keydown", function(e) {
  if (e.key === "Escape") {
    document.querySelectorAll(".add-tile-dropdown.open").forEach(function(d) { d.classList.remove("open"); });
    document.querySelectorAll(".add-tile-wrap.open").forEach(function(w) { w.classList.remove("open"); });
    document.querySelectorAll(".add-tile-btn-main[aria-expanded='true']").forEach(function(b) { b.setAttribute("aria-expanded", "false"); });
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
  if (e.target.closest(".add-link, .add-tile-option, #addPageBtn, .page-remove, .tile-remove, .link-remove, .page-move-up, .page-move-down, .tile-move-up, .tile-move-down, .link-move-up, .link-move-down")) {
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
