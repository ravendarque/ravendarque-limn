import { extractTileFromBlock, tileToYaml } from "./configuratiles/registry.js";
import { getProfileImageConfig } from "./profile-image.js";

export function escapeYaml(str) {
  if (!str) return "";
  if (/[:\#\*&\{\}\[\]\|>'"%@`\s]/.test(str)) return JSON.stringify(str);
  return str;
}

export function buildConfig() {
  const name = document.getElementById("name").value.trim();
  const bio = document.getElementById("bio").value.trim();
  const theme = document.getElementById("theme").value;

  let pagesYaml = "";
  const pageGroups = document.querySelectorAll("#pages-stack > .page-group");
  for (const pg of pageGroups) {
    const pageId = pg.querySelector(".page-id-input")?.value?.trim() || "home";
    const pageTitle = pg.querySelector(".page-title-input")?.value?.trim() || "Home";
    const pageIcon = pg.querySelector(".page-icon-input")?.value?.trim() || "home";
    const hideFromNavbar = !(pg.querySelector(".page-show-in-nav")?.checked ?? true);

    let tilesYaml = "";
    const blocks = pg.querySelectorAll(".page-tiles > .tile-block");
    for (const block of blocks) {
      const tile = extractTileFromBlock(block);
      tilesYaml += tileToYaml(tile, escapeYaml);
    }

    pagesYaml += "  - id: " + escapeYaml(pageId) + "\n";
    pagesYaml += "    title: " + escapeYaml(pageTitle) + "\n";
    pagesYaml += "    icon: " + pageIcon + "\n";
    if (hideFromNavbar) pagesYaml += "    hide-from-navbar: true\n";
    pagesYaml += "    tiles:\n";
    pagesYaml += tilesYaml.split("\n").map(function(line) { return line ? "    " + line : ""; }).join("\n");
  }

  const profileImage = getProfileImageConfig();
  let out = "profile:\n  name: " + escapeYaml(name) + "\n";
  if (bio) out += "  bio: " + escapeYaml(bio) + "\n";
  out += "  image: " + (profileImage.image.indexOf(":") >= 0 ? escapeYaml(profileImage.image) : profileImage.image) + "\n\ntheme: " + theme + "\n\npages:\n" + pagesYaml;
  return out;
}
