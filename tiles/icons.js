/**
 * Tabler Icons — maps config icon names to Tabler webfont classes.
 * Config can use Lucide-style (github) or Tabler-style (brand-github).
 * @see https://tabler.io/icons
 */

const LUCIDE_TO_TABLER = {
  github: "brand-github",
  mail: "mail",
  instagram: "brand-instagram",
  twitter: "brand-x",
  x: "brand-x",
  globe: "world",
  link: "link",
  external: "external-link",
  youtube: "brand-youtube",
  linkedin: "brand-linkedin",
  facebook: "brand-facebook",
  rss: "rss",
  heart: "heart",
  star: "star",
  share: "share",
  calendar: "calendar",
  map: "map-pin",
  phone: "phone",
};

export function getTablerClass(iconName) {
  if (!iconName || typeof iconName !== "string") return null;
  const name = iconName.trim().toLowerCase();
  if (!name) return null;
  const tablerName = LUCIDE_TO_TABLER[name] ?? name;
  return `ti ti-${tablerName}`;
}

export function createIconEl(iconName) {
  const cls = getTablerClass(iconName);
  if (!cls) return null;
  const i = document.createElement("i");
  i.className = cls;
  i.setAttribute("aria-hidden", "true");
  return i;
}
