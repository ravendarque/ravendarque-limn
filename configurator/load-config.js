/**
 * Load existing config.yaml into the configurator for editing.
 */

import { load } from "https://esm.sh/js-yaml@4";
import { loadConfigState, saveConfigState, getConfigState } from "./state.js";

function configToState(config) {
  if (!config || typeof config !== "object") return null;
  const profile = config.profile || {};
  const theme = config.theme || "dark";
  let pages = config.pages;
  if (!pages && Array.isArray(config.tiles)) {
    pages = [{ id: "home", title: "Home", icon: "home", tiles: config.tiles }];
  }
  if (!Array.isArray(pages) || pages.length === 0) return null;
  return {
    profile: {
      name: profile.name ?? "",
      bio: profile.bio ?? "",
      image: profile.image ?? "avatar.jpg"
    },
    theme,
    pages: pages.map((p) => ({
      id: p.id ?? "home",
      title: p.title ?? "Home",
      icon: p.icon ?? "home",
      hideFromNavbar: p["hide-from-navbar"] ?? false,
      tiles: Array.isArray(p.tiles) ? p.tiles : []
    }))
  };
}

export function initLoadConfig() {
  const wrap = document.getElementById("loadConfigWrap");
  const btn = document.getElementById("loadConfigBtn");
  const input = document.getElementById("loadConfigFile");
  const status = document.getElementById("loadConfigStatus");

  if (!wrap || !btn || !input) return;

  btn.addEventListener("click", () => input.click());

  input.addEventListener("change", async () => {
    const file = input.files?.[0];
    input.value = "";
    if (!file) return;
    status.textContent = "";
    status.className = "";

    try {
      const text = await file.text();
      const config = load(text);
      const state = configToState(config);
      if (!state) {
        throw new Error("Invalid config: needs profile, theme, and pages (or tiles)");
      }
      loadConfigState(state);
      saveConfigState(getConfigState);
      status.textContent = "Config loaded.";
      status.className = "success";
    } catch (err) {
      status.textContent = err.message || "Failed to load config";
      status.className = "error";
    }
  });
}
