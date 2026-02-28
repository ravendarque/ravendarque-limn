export default {
  type: "codeblock",
  label: "Code block",
  extractFromBlock(block) {
    const content = block.querySelector(".codeblock-content")?.value?.trimEnd();
    const language = block.querySelector(".codeblock-language")?.value?.trim();
    return { type: "codeblock", content, language: language || undefined };
  },
  toYaml(tile, escapeYaml) {
    if (!tile.content) return "";
    let out = "  - type: codeblock\n    content: " + escapeYaml(tile.content) + "\n";
    if (tile.language) out += "    language: " + escapeYaml(tile.language) + "\n";
    return out;
  },
  toState(tile) {
    return { type: "codeblock", content: tile.content, language: tile.language };
  },
  renderBody(body) {
    body.innerHTML =
      '<textarea class="codeblock-content" placeholder="Code snippet..." rows="6" style="margin-bottom:8px;resize:vertical;width:100%;font-family:ui-monospace,monospace;font-size:0.9rem" maxlength="5000"></textarea>' +
      '<input type="text" class="codeblock-language" placeholder="Language (optional, e.g. javascript, yaml)" style="margin-bottom:0" maxlength="32">';
    body.querySelector(".codeblock-content").value = "pages:\n  - id: home\n    title: Home\n    tiles: []";
    body.querySelector(".codeblock-language").value = "";
  },
  populate(block, tile) {
    const contentEl = block.querySelector(".codeblock-content");
    const langEl = block.querySelector(".codeblock-language");
    if (contentEl && tile.content !== undefined) contentEl.value = tile.content;
    if (langEl && tile.language !== undefined) langEl.value = tile.language;
  }
};
