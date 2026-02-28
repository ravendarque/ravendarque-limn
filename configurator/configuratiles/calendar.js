export default {
  type: "calendar",
  label: "Calendar",
  extractFromBlock(block) {
    const window = block.querySelector(".calendar-window")?.value;
    const src = block.querySelector(".calendar-src")?.value?.trim();
    return { type: "calendar", window, src };
  },
  toYaml(tile, escapeYaml) {
    if (!tile.window || !tile.src) return "";
    return `  - type: calendar
    window: ${tile.window}
    src: ${escapeYaml(tile.src)}
`;
  },
  toState(tile) {
    const s = { type: "calendar" };
    if (tile.window) s.window = tile.window;
    if (tile.src) s.src = tile.src;
    return s;
  },
  renderBody(body) {
    body.innerHTML = `
      <div class="tile-field">
        <label>Window</label>
        <select class="calendar-window">
          <option value="today">Today</option>
          <option value="week">Week</option>
          <option value="month" selected>Month</option>
          <option value="year">Year</option>
        </select>
      </div>
      <div class="tile-field">
        <label>URL (relative or absolute)</label>
        <input type="text" class="calendar-src" placeholder="example.ics or https://..." value="example.ics" maxlength="500">
      </div>
    `;
  },
  populate(block, tile) {
    if (tile.window !== undefined) block.querySelector(".calendar-window").value = tile.window;
    if (tile.src !== undefined) block.querySelector(".calendar-src").value = tile.src;
  }
};
