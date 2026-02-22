export default {
  type: "image",
  label: "Image",
  extractFromBlock(block) {
    const url = block.querySelector(".image-url")?.value?.trim();
    const alt = block.querySelector(".image-alt")?.value?.trim();
    return { type: "image", url, alt };
  },
  toYaml(tile, escapeYaml) {
    if (!tile.url) return "";
    let yaml = `  - type: image
    url: ${escapeYaml(tile.url)}
`;
    if (tile.alt) yaml += `    alt: ${escapeYaml(tile.alt)}\n`;
    return yaml;
  },
  toState(tile) {
    const s = { type: "image" };
    if (tile.url) s.url = tile.url;
    if (tile.alt) s.alt = tile.alt;
    return s;
  },
  renderBody(body) {
    body.innerHTML = `
      <div class="tile-field">
        <label>URL</label>
        <input type="text" class="image-url" placeholder="avatar.jpg or https://..." value="avatar.jpg" maxlength="500">
      </div>
      <div class="tile-field">
        <label>Alt text (optional)</label>
        <input type="text" class="image-alt" placeholder="Description for screen readers" maxlength="200">
      </div>
    `;
  },
  populate(block, tile) {
    if (tile.url !== undefined) block.querySelector(".image-url").value = tile.url;
    if (tile.alt !== undefined) block.querySelector(".image-alt").value = tile.alt;
  }
};
