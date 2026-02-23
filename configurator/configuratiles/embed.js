export default {
  type: "embed",
  label: "Embed",
  extractFromBlock(block) {
    const html = block.querySelector(".embed-html")?.value?.trim();
    const title = block.querySelector(".embed-title")?.value?.trim();
    return { type: "embed", html, title };
  },
  toYaml(tile, escapeYaml) {
    if (!tile.html) return "";
    let yaml = "  - type: embed\n    html: " + escapeYaml(tile.html) + "\n";
    if (tile.title) yaml += "    title: " + escapeYaml(tile.title) + "\n";
    return yaml;
  },
  toState(tile) {
    const s = { type: "embed" };
    if (tile.html) s.html = tile.html;
    if (tile.title) s.title = tile.title;
    return s;
  },
  renderBody(body) {
    body.innerHTML = '<div class="tile-field"><label>Title (optional)</label><input type="text" class="embed-title" placeholder="e.g. Video" maxlength="80"></div><div class="tile-field"><label>Embed HTML</label><textarea class="embed-html" placeholder="Paste iframe from Share → Embed, or an Instagram URL (e.g. instagram.com/reel/ABC123)" rows="4" style="font-family:monospace;font-size:0.8rem" maxlength="8000"></textarea></div>';
  },
  populate(block, tile) {
    if (tile.html !== undefined) block.querySelector(".embed-html").value = tile.html;
    if (tile.title !== undefined) block.querySelector(".embed-title").value = tile.title;
  }
};
