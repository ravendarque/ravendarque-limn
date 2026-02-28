export default {
  type: "quote",
  label: "Quote",
  extractFromBlock(block) {
    const content = block.querySelector(".quote-content")?.value?.trim();
    const attribution = block.querySelector(".quote-attribution")?.value?.trim();
    return { type: "quote", content, attribution: attribution || undefined };
  },
  toYaml(tile, escapeYaml) {
    if (!tile.content) return "";
    let out = "  - type: quote\n    content: " + escapeYaml(tile.content) + "\n";
    if (tile.attribution) out += "    attribution: " + escapeYaml(tile.attribution) + "\n";
    return out;
  },
  toState(tile) {
    return { type: "quote", content: tile.content, attribution: tile.attribution };
  },
  renderBody(body) {
    body.innerHTML =
      '<textarea class="quote-content" placeholder="Quote text..." rows="2" style="margin-bottom:8px;resize:vertical;width:100%" maxlength="2000"></textarea>' +
      '<input type="text" class="quote-attribution" placeholder="— Attribution (optional)" style="margin-bottom:0" maxlength="200">';
    body.querySelector(".quote-content").value = "Darkness cannot drive out darkness; only light can do that. Hate cannot drive out hate; only love can do that.";
    body.querySelector(".quote-attribution").value = "";
  },
  populate(block, tile) {
    const contentEl = block.querySelector(".quote-content");
    const attrEl = block.querySelector(".quote-attribution");
    if (contentEl && tile.content !== undefined) contentEl.value = tile.content;
    if (attrEl && tile.attribution !== undefined) attrEl.value = tile.attribution;
  }
};
