export default {
  type: "pagenav",
  label: "Navigation bar",
  extractFromBlock(block) {
    const showLabels = block.querySelector(".pagenav-show-labels")?.checked ?? true;
    return { type: "pagenav", showLabels };
  },
  toYaml(tile) {
    let yaml = "  - type: pagenav\n    surface: hide\n";
    if (tile.showLabels) yaml += "    showLabels: true\n";
    return yaml;
  },
  toState(tile) {
    return { type: "pagenav", showLabels: tile.showLabels ?? true };
  },
  renderBody(body) {
    body.innerHTML = '<p class="links-hint" style="margin-bottom:12px">Links to pages are built from each page\'s icon, title, and visibility. Use move buttons to reorder.</p><div class="tile-field tile-field-toggle"><label>Label visibility</label><label class="toggle-switch"><input type="checkbox" class="pagenav-show-labels" checked><span class="toggle-slider"></span></label></div>';
  },
  populate(block, tile) {
    block.querySelector(".pagenav-show-labels").checked = !!tile.showLabels;
  }
};
