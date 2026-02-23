export const PICKER_ICONS = [
  "brand-github", "brand-instagram", "brand-x", "brand-linkedin", "brand-youtube",
  "brand-facebook", "brand-tiktok", "brand-discord", "brand-mastodon", "brand-bluesky",
  "brand-telegram", "brand-whatsapp", "brand-slack", "brand-spotify", "brand-twitch",
  "brand-reddit", "brand-pinterest", "brand-snapchat", "brand-apple", "brand-android",
  "brand-google", "brand-paypal", "brand-strava", "brand-soundcloud",
  "brand-vimeo", "brand-kickstarter", "brand-patreon", "brand-dribbble", "brand-behance",
  "brand-figma", "brand-framer", "brand-codepen", "brand-npm", "brand-css3",
  "brand-html5", "brand-javascript", "brand-python", "brand-react", "brand-vue",
  "mail", "mail-opened", "world", "link", "external-link", "rss",
  "heart", "star", "share",
  "calendar", "calendar-event", "map-pin", "map-pins", "phone", "phone-call",
  "message", "message-circle", "message-2", "send", "at", "home",
  "user", "users", "user-plus", "settings", "search", "bookmark",
  "tag", "camera", "photo", "file", "file-text", "folder", "download", "upload",
  "inbox", "bell", "gift", "coffee", "music", "video", "microphone",
  "pencil", "trash", "plus", "minus", "check", "x", "arrow-right", "arrow-left",
  "brand-amazon", "brand-medium"
];

export { getTablerIconName } from "../site/tiles/icons.js";

export const FILES = [
  "index.html", "limn-engine.css", "limn-engine.js", "themes.html",
  "avatar.jpg", "example.ics",
  "tiles/base.css", "tiles/calendar.css", "tiles/calendar.js",
  "tiles/embed.css", "tiles/embed.js", "tiles/heading.css", "tiles/heading.js",
  "tiles/image.css", "tiles/image.js", "tiles/index.js", "tiles/icons.js", "tiles/link.css",
  "tiles/link.js", "tiles/linksbar.css", "tiles/linksbar.js", "tiles/pagenav.js",
  "tiles/text.css", "tiles/text.js", "tiles/tiles.css", "tiles/utils.js",
  "themes/catppuccin.yaml", "themes/dark.yaml", "themes/dracula.yaml",
  "themes/gruvbox.yaml", "themes/light.yaml", "themes/mocha.yaml",
  "themes/monokai.yaml", "themes/nord.yaml", "themes/pink-pony-club.yaml",
  "themes/retro.yaml", "themes/scarlet.yaml", "themes/solarized.yaml",
  "examples/calendar.yaml", "examples/embed.yaml", "examples/heading.yaml",
  "examples/image.yaml", "examples/link.yaml", "examples/linksbar.yaml",
  "examples/text.yaml"
];

export const WIKI_BASE = "https://github.com/ravendarque/ravendarque-limn/wiki";

export const STORAGE_KEY = "limn-configurator-state";

export function getBaseUrl() {
  return new URL("../site/", location.href).href;
}

export function getTileWikiUrl(type) {
  if (type === "embed") return `${WIKI_BASE}/Embeds`;
  if (type === "calendar") return `${WIKI_BASE}/Calendar`;
  if (type === "pagenav") return `${WIKI_BASE}/Pages`;
  return `${WIKI_BASE}/Tiles#${type}`;
}
