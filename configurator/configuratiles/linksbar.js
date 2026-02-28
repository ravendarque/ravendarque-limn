import { addLinkRow } from "../link-row.js";

export default {
  type: "linksbar",
  label: "Links bar",
  extractFromBlock(block) {
    const linkRows = block.querySelectorAll(".link-row");
    const items = [];
    for (const row of linkRows) {
      const label = row.querySelector(".link-label")?.value?.trim();
      const url = row.querySelector(".link-url")?.value?.trim();
      const icon = row.querySelector(".link-icon")?.value?.trim();
      if (!url || !icon) continue;
      items.push({ icon, url, label: label || icon });
    }
    const showLabels = block.querySelector(".linksbar-show-labels")?.checked ?? false;
    return { type: "linksbar", showLabels, items };
  },
  toYaml(tile, escapeYaml) {
    if (!tile.items || tile.items.length === 0) return "";
    let yaml = "  - type: linksbar\n    surface: hide\n";
    if (tile.showLabels) yaml += "    showLabels: true\n";
    yaml += "    items:\n";
    for (const item of tile.items) {
      yaml += "      - icon: " + item.icon + "\n        url: " + escapeYaml(item.url) + "\n        label: " + escapeYaml(item.label) + "\n";
    }
    return yaml;
  },
  toState(tile) {
    return { type: "linksbar", showLabels: tile.showLabels ?? false, items: tile.items ?? [] };
  },
  renderBody(body) {
    body.innerHTML = '<div class="tile-field tile-field-toggle"><label>Label visibility</label><label class="toggle-switch"><input type="checkbox" class="linksbar-show-labels"><span class="toggle-slider"></span></label></div>';
    const linksDiv = document.createElement("div");
    linksDiv.className = "links-section";
    body.appendChild(linksDiv);
    const addLinkWrap = document.createElement("div");
    addLinkWrap.className = "add-link-wrap";
    const addBtn = document.createElement("button");
    addBtn.type = "button";
    addBtn.className = "btn btn-secondary add-link";
    addBtn.innerHTML = '<i class="ti ti-circle-plus"></i> Add link';
    addBtn.onclick = function() { addLinkRow(linksDiv); };
    addLinkWrap.appendChild(addBtn);
    body.appendChild(addLinkWrap);
    addLinkRow(linksDiv, "GitHub", "https://github.com/yourname", "github");
    addLinkRow(linksDiv, "Email", "mailto:you@example.com", "mail");
  },
  populate(block, tile) {
    block.querySelector(".linksbar-show-labels").checked = !!tile.showLabels;
    const linksDiv = block.querySelector(".links-section");
    linksDiv.querySelectorAll(".link-row").forEach(function(r) { r.remove(); });
    const items = tile.items || [];
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      addLinkRow(linksDiv, item.label || "", item.url || "", item.icon || "link");
    }
  }
};
