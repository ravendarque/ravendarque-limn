export default {
  type: "text",
  label: "Text",
  extractFromBlock(block) {
    const content = block.querySelector(".text-content")?.value?.trim();
    return { type: "text", content };
  },
  toYaml(tile, escapeYaml) {
    if (!tile.content) return "";
    return `  - type: text
    content: ${escapeYaml(tile.content)}
`;
  },
  toState(tile) {
    return { type: "text", content: tile.content };
  },
  renderBody(body) {
    body.innerHTML = "<textarea class=\"text-content\" placeholder=\"Body copy, supports multiple lines...\" rows=\"3\" style=\"margin-bottom:0;resize:vertical;width:100%\" maxlength=\"3000\"></textarea>";
    body.querySelector(".text-content").value = "Some body copy here.";
  },
  populate(block, tile) {
    if (tile.content !== undefined) block.querySelector(".text-content").value = tile.content;
  }
};
