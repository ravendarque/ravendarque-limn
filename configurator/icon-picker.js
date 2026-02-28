import { PICKER_ICONS, getTablerIconName } from "./constants.js";

let picker = null;
let currentIconInput = null;
let onIconSelected = null;

export function initIconPicker(callback) {
  onIconSelected = callback;
}

export function updateIconTrigger(trigger) {
  const input = trigger.closest(".link-row-fields")?.querySelector(".link-icon")
    || trigger.closest(".page-header-field")?.querySelector(".page-icon-input");
  const i = trigger.querySelector("i");
  if (i && input) {
    const name = getTablerIconName(input.value);
    i.className = "ti ti-" + name;
  }
}

function createIconPicker() {
  const overlay = document.createElement("div");
  overlay.className = "icon-picker-overlay";
  overlay.hidden = true;

  const popover = document.createElement("div");
  popover.className = "icon-picker-popover";

  const header = document.createElement("div");
  header.className = "icon-picker-header";
  header.innerHTML = "<span>Pick an icon</span><button type=\"button\" class=\"icon-picker-close\" title=\"Close\" aria-label=\"Close\"><i class=\"ti ti-x\"></i></button>";
  header.querySelector(".icon-picker-close").onclick = closePicker;

  const scroll = document.createElement("div");
  scroll.className = "icon-picker-scroll";

  const grid = document.createElement("div");
  grid.className = "icon-picker-grid";
  for (const icon of PICKER_ICONS) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "icon-picker-btn";
    btn.title = icon;
    btn.setAttribute("aria-label", icon);
    const i = document.createElement("i");
    i.className = "ti ti-" + icon;
    btn.appendChild(i);
    btn.dataset.icon = icon;
    grid.appendChild(btn);
  }
  scroll.appendChild(grid);
  const footer = document.createElement("div");
  footer.className = "icon-picker-footer";
  footer.innerHTML = "6,000+ icons at <a href=\"https://tabler.io/icons\" target=\"_blank\" rel=\"noopener noreferrer\">Tabler Icons</a> — use any icon name in your downloaded config.";
  popover.appendChild(header);
  popover.appendChild(scroll);
  popover.appendChild(footer);
  overlay.appendChild(popover);

  overlay.onclick = (e) => {
    if (e.target === overlay) closePicker();
  };

  grid.onclick = (e) => {
    const btn = e.target.closest(".icon-picker-btn");
    if (!btn) return;
    const icon = btn.dataset.icon;
    if (currentIconInput) {
      currentIconInput.value = icon;
      const trigger = currentIconInput.closest(".link-row-fields")?.querySelector(".icon-picker-trigger")
        || currentIconInput.closest(".page-header-field")?.querySelector(".page-icon-trigger");
      if (trigger) updateIconTrigger(trigger);
      if (onIconSelected) onIconSelected(currentIconInput);
    }
    closePicker();
  };

  document.body.appendChild(overlay);
  return { overlay, popover, grid };
}

function updatePickerPosition() {
  if (!picker || !currentIconInput || picker.overlay.hidden) return;
  const wrap = currentIconInput.closest(".link-row-fields") || currentIconInput.closest(".page-header-field");
  const trigger = wrap?.querySelector(".icon-picker-trigger") || wrap?.querySelector(".page-icon-trigger");
  const rect = (trigger || currentIconInput).getBoundingClientRect();
  const popover = picker.popover;
  const popoverH = 360;
  const spaceBelow = window.innerHeight - rect.bottom;
  const spaceAbove = rect.top;
  const showBelow = spaceBelow >= popoverH || spaceBelow >= spaceAbove;
  popover.style.left = Math.min(Math.max(rect.left, 8), window.innerWidth - 328) + "px";
  popover.style.top = showBelow ? (rect.bottom + 8) + "px" : "auto";
  popover.style.bottom = showBelow ? "auto" : (window.innerHeight - rect.top + 8) + "px";
}

export function openPicker(input) {
  if (!picker) picker = createIconPicker();
  currentIconInput = input;
  picker.overlay.hidden = false;

  updatePickerPosition();

  const current = getTablerIconName(input.value);
  picker.grid.querySelectorAll(".icon-picker-btn").forEach(btn => {
    btn.dataset.selected = btn.dataset.icon === current ? "true" : "false";
  });

  const onKey = (e) => {
    if (e.key === "Escape") closePicker();
  };
  document.addEventListener("keydown", onKey);
  picker.overlay._escapeHandler = onKey;

  const onScrollOrResize = () => updatePickerPosition();
  window.addEventListener("scroll", onScrollOrResize, true);
  window.addEventListener("resize", onScrollOrResize);
  picker.overlay._scrollHandler = onScrollOrResize;
}

export function closePicker() {
  if (picker) {
    picker.overlay.hidden = true;
    if (picker.overlay._escapeHandler) {
      document.removeEventListener("keydown", picker.overlay._escapeHandler);
      picker.overlay._escapeHandler = null;
    }
    if (picker.overlay._scrollHandler) {
      window.removeEventListener("scroll", picker.overlay._scrollHandler, true);
      window.removeEventListener("resize", picker.overlay._scrollHandler);
      picker.overlay._scrollHandler = null;
    }
  }
  currentIconInput = null;
}
