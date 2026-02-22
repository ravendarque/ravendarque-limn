import { openPicker, updateIconTrigger } from "../icon-picker.js";

export default {
  type: "link",
  label: "Link",
  extractFromBlock(block) {
    const url = block.querySelector(".link-tile-url")?.value?.trim();
    const label = block.querySelector(".link-tile-label")?.value?.trim();
    const icon = block.querySelector(".link-tile-icon")?.value?.trim();
    return { type: "link", url, label, icon };
  },
  toYaml(tile, escapeYaml) {
    if (!tile.url || !tile.label) return "";
    let yaml = "  - type: link\n    url: " + escapeYaml(tile.url) + "\n    label: " + escapeYaml(tile.label) + "\n";
    if (tile.icon) yaml += "    icon: " + tile.icon + "\n";
    return yaml;
  },
  toState(tile) {
    const s = { type: "link", url: tile.url, label: tile.label };
    if (tile.icon) s.icon = tile.icon;
    return s;
  },
  renderBody(body) {
    body.innerHTML = '<div class="link-row-fields"><button type="button" class="btn btn-secondary icon-picker-trigger" title="Pick icon"><i class="ti ti-link"></i></button><input type="hidden" class="link-icon link-tile-icon" value="brand-github"><div class="link-field"><label>Label</label><input type="text" class="link-tile-label" placeholder="e.g. GitHub" value="" maxlength="50"></div><div class="link-field"><label>URL</label><input type="url" class="link-tile-url" placeholder="https://..." value="" maxlength="1000"></div></div>';
    body.querySelector(".link-tile-label").value = "GitHub";
    body.querySelector(".link-tile-url").value = "https://github.com/yourname";
    const linkIconInput = body.querySelector(".link-tile-icon");
    const linkTrigger = body.querySelector(".icon-picker-trigger");
    updateIconTrigger(linkTrigger);
    linkTrigger.onclick = function() { openPicker(linkIconInput); };
  },
  populate(block, tile) {
    if (tile.url !== undefined) block.querySelector(".link-tile-url").value = tile.url;
    if (tile.label !== undefined) block.querySelector(".link-tile-label").value = tile.label;
    if (tile.icon !== undefined) {
      block.querySelector(".link-tile-icon").value = tile.icon;
      updateIconTrigger(block.querySelector(".icon-picker-trigger"));
    }
  }
};
