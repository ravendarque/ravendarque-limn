import { openPicker, updateIconTrigger } from "./icon-picker.js";

export function updateLinkRowMoveButtons(container) {
  const rows = container.querySelectorAll(".link-row");
  rows.forEach((row, i) => {
    const up = row.querySelector(".link-move-up");
    const down = row.querySelector(".link-move-down");
    if (up) up.disabled = i === 0;
    if (down) down.disabled = i === rows.length - 1;
  });
}

export function addLinkRow(container, label = "", url = "", icon = "link") {
  const div = document.createElement("div");
  div.className = "link-row";
  div.innerHTML = `
    <div class="link-row-header">
      <div class="link-row-actions">
        <button type="button" class="btn btn-secondary link-move-up" title="Move up"><i class="ti ti-chevron-up"></i></button>
        <button type="button" class="btn btn-secondary link-move-down" title="Move down"><i class="ti ti-chevron-down"></i></button>
        <button type="button" class="btn btn-secondary link-remove" title="Remove">×</button>
      </div>
    </div>
    <div class="link-row-fields">
      <button type="button" class="btn btn-secondary icon-picker-trigger" title="Pick icon" aria-label="Pick icon"><i class="ti ti-link"></i></button>
      <input type="hidden" class="link-icon" value="${(icon || "link").replace(/"/g, "&quot;")}">
      <div class="link-field">
        <label>Label</label>
        <input type="text" class="link-label" placeholder="e.g. GitHub, Email" value="${(label || "").replace(/"/g, "&quot;")}" maxlength="50">
      </div>
      <div class="link-field">
        <label>URL</label>
        <input type="url" class="link-url" placeholder="https://..." value="${(url || "").replace(/"/g, "&quot;")}" required maxlength="1000">
      </div>
    </div>
  `;
  div.querySelector(".link-move-up").onclick = () => {
    const prev = div.previousElementSibling;
    if (prev) {
      container.insertBefore(div, prev);
      updateLinkRowMoveButtons(container);
    }
  };
  div.querySelector(".link-move-down").onclick = () => {
    const next = div.nextElementSibling;
    if (next) {
      container.insertBefore(next, div);
      updateLinkRowMoveButtons(container);
    }
  };
  div.querySelector(".link-remove").onclick = () => {
    div.remove();
    updateLinkRowMoveButtons(container);
  };
  const iconInput = div.querySelector(".link-icon");
  const trigger = div.querySelector(".icon-picker-trigger");
  updateIconTrigger(trigger);
  trigger.onclick = () => openPicker(iconInput);
  container.appendChild(div);
  updateLinkRowMoveButtons(container);
}
