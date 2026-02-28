export default {
  type: "heading",
  label: "Heading",
  extractFromBlock(block) {
    const text = block.querySelector(".heading-input")?.value?.trim();
    return { type: "heading", text };
  },
  toYaml(tile, escapeYaml) {
    if (!tile.text) return "";
    return "  - type: heading\n    text: " + escapeYaml(tile.text) + "\n";
  },
  toState(tile) {
    return { type: "heading", text: tile.text };
  },
  renderBody(body) {
    body.innerHTML = '<input type="text" class="heading-input" placeholder="e.g. About, Links" style="margin-bottom:0" maxlength="80">';
    body.querySelector(".heading-input").value = "Links";
  },
  populate(block, tile) {
    if (tile.text !== undefined) block.querySelector(".heading-input").value = tile.text;
  }
};
