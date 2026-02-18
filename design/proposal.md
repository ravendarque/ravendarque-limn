# Limn — Detailed Implementation Proposal

## Context

Limn is a static bio/links page (think Linktree, but self-hosted). It should be deployable to GitHub Pages with zero backend and **zero build step**. The spec calls for a profile header, a configurable collection of typed tiles (simplex: heading/text/image; complex: link/embed/calendar), and a declarative schema-driven config format.

This proposal uses a no-build vanilla JS approach: two files, no tooling required locally or in CI.

---

## Tech Stack

| Concern | Choice | Rationale |
|---|---|---|
| Language | Vanilla JS (ES2022 modules) | No compilation needed; runs directly in the browser |
| Styling | Plain CSS + CSS custom properties | No build step; same variable-based theming as any Tailwind setup |
| Config format | YAML | Readable, supports comments; parsed at runtime via CDN |
| YAML parser | js-yaml (CDN) | ~50 KB; loaded as a UMD script tag, no npm required |
| Icons | Lucide (CDN) | SVG icon set; vanilla JS build available via CDN |
| Deployment | GitHub Pages — deploy from branch | No Actions workflow needed; push YAML, page is live |

---

## Directory Structure

```
index.html             # All rendering logic + inline base styles
config.yaml            # User-editable layout configuration (only file users touch)
```

That's it. No `package.json`, no `node_modules`, no build config.

---

## Schema Design

### Root Config (`config.yaml`)

Identical schema to what a build-based approach would use. js-yaml parses it in the browser at page load — no preprocessing required.

```yaml
profile:
  name: Jane Doe
  bio: Developer & designer
  image: https://example.com/avatar.jpg

# Colour palette — all values are CSS colour strings (hex, hsl, rgb, named)
theme:
  background: "#0f0f0f"
  surface: "#1a1a1a"       # tile/card background
  text: "#f0f0f0"
  textMuted: "#a0a0a0"     # secondary text (bio, calendar descriptions)
  accent: "#7c6aff"        # link buttons, hover states
  accentText: "#ffffff"    # text on accent-coloured surfaces
  border: "#2e2e2e"        # tile borders, separators

tiles:
  - type: heading
    text: Welcome!

  - type: text
    content: Some body copy.

  - type: image
    url: https://example.com/photo.jpg
    alt: Photo

  - type: link
    icon: github
    url: https://github.com/...
    label: GitHub

  - type: embed
    html: '<iframe width="560" height="315" src="https://www.youtube.com/embed/VqNqDFCrjWs" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>'
    title: My Playlist   # optional visible label above the embed

  - type: calendar
    window: week
    items:
      - title: Team Standup
        description: Daily sync
        start: "2026-02-19T09:00:00"
        end: "2026-02-19T09:30:00"
        location: Zoom
```

---

## Theming

Theme colours are applied as CSS custom properties on `:root` immediately after the YAML is parsed:

```js
function applyTheme(theme) {
  const s = document.documentElement.style;
  s.setProperty("--color-bg",          theme.background);
  s.setProperty("--color-surface",     theme.surface);
  s.setProperty("--color-text",        theme.text);
  s.setProperty("--color-text-muted",  theme.textMuted  ?? "#888");
  s.setProperty("--color-accent",      theme.accent);
  s.setProperty("--color-accent-text", theme.accentText ?? "#fff");
  s.setProperty("--color-border",      theme.border     ?? "transparent");
}
```

All CSS in `index.html` references these variables (`var(--color-bg)`, etc.) — no hardcoded colours anywhere.

---

## Rendering Architecture

The page initialises in one async sequence:

```js
fetch("./config.yaml")
  .then(r => r.text())
  .then(text => {
    const config = jsyaml.load(text);
    validate(config);          // lightweight manual validation with clear errors
    applyTheme(config.theme);
    renderProfile(config.profile);
    config.tiles.forEach(tile => renderTile(tile));
  })
  .catch(err => showError(err));
```

### Tile Registry

A plain object maps type strings to render functions — same pattern as a React tile registry, without the framework:

```js
const tileRenderers = {
  heading:  renderHeadingTile,
  text:     renderTextTile,
  image:    renderImageTile,
  link:     renderLinkTile,
  embed:    renderEmbedTile,
  calendar: renderCalendarTile,
};

function renderTile(tile) {
  const fn = tileRenderers[tile.type];
  if (!fn) throw new Error(`Unknown tile type: "${tile.type}"`);
  document.getElementById("tiles").appendChild(fn(tile));
}
```

New tile types: add a render function, register it in `tileRenderers`. No other changes needed.

### Profile Header

```js
function renderProfile({ name, bio, image }) {
  // <img> with onerror fallback to initials <div>
  // name styled with --color-text, bio with --color-text-muted
}
```

### Layout

- Centered, max-width 640px container, vertically stacked
- `body` uses `var(--color-bg)`; each tile card uses `var(--color-surface)`
- Profile header at top, then tiles in config order
- CSS handles mobile/tablet/desktop with a single `max-width` + padding rule

---

## Tile Designs

| Tile | Element | Notes |
|---|---|---|
| Heading | `<h2>` | `color: var(--color-text)` |
| Text | `<p>` | `color: var(--color-text-muted)`; line-height for readability |
| Image | `<img>` | `aspect-ratio: 16/9` or `1/1`; `object-fit: cover` |
| Link | `<a>` styled as pill button | `background: var(--color-accent)`, `color: var(--color-accent-text)`; icon via Lucide CDN |
| Embed | raw `<iframe>` via `innerHTML` | Accepts the full iframe snippet from YouTube/Spotify/etc "Share → Embed"; CSS forces `width: 100%` + `aspect-ratio: 16/9` to make fixed-size embeds responsive |
| Calendar | `<ul>` of items | `<hr>` separators with `border-color: var(--color-border)`; titles in `--color-text`, descriptions in `--color-text-muted` |

**Calendar window filtering** — items are filtered client-side at render time:
- `today` — same calendar day as `Date.now()`
- `week` — next 7 days
- `month` — next 30 days

**Embed tile** — the `html` field is injected directly via `innerHTML` into a wrapper `<div class="embed-wrapper">`. CSS then overrides the iframe's baked-in `width`/`height` attributes:

```css
.embed-wrapper iframe {
  width: 100%;
  height: auto;
  aspect-ratio: 16 / 9;
  border: none;
}
```

This works for any service that provides a standard `<iframe>` embed snippet (YouTube, Spotify, Vimeo, SoundCloud, etc.). Since `config.yaml` is user-controlled, injecting the raw HTML directly is acceptable — no third-party content can reach this field without the user placing it there.

**Icons on LinkTile**: Lucide provides a `createIcons()` function in its vanilla CDN build. After tiles are rendered, one call to `lucide.createIcons()` replaces `<i data-lucide="github">` placeholders with inline SVGs. Icon name comes directly from `config.yaml`'s `icon:` field.

---

## Validation

Runtime validation replaces Zod. A lightweight `validate(config)` function checks required fields and known tile types, and throws a descriptive `Error` if anything is wrong. The `showError()` fallback renders the message visibly on the page so misconfigured YAMLs are immediately obvious:

```
Config error: tiles[3].url is not a valid URL
```

---

## Responsive Design

- **Mobile (<640px)**: full-width tiles, 16px horizontal padding
- **Tablet/Desktop (≥640px)**: max-width 640px centered, increased vertical spacing

One CSS block handles all of this — no utility class framework needed.

---

## Deployment

No build step, no CI workflow required.

1. Enable GitHub Pages: **Settings → Pages → Source: Deploy from branch → `main` / `/ (root)`**
2. That's it. `index.html` and `config.yaml` are served directly.

To update the site: edit `config.yaml`, `git push`. The page reflects the change as soon as GitHub Pages picks up the commit (typically under a minute).

---

## Key CDN Dependencies

Loaded via `<script>` tags in `index.html` — no npm, no install:

```
https://cdn.jsdelivr.net/npm/js-yaml@4/dist/js-yaml.min.js   # YAML parser (~50 KB)
https://unpkg.com/lucide@latest/dist/umd/lucide.min.js        # Icons (~100 KB)
```

---

## Implementation Order

1. Create `index.html` skeleton: CDN script tags, base CSS with custom property variables, loading state
2. Implement `applyTheme()` and wire it to the CSS variable names
3. Implement `fetch` → `jsyaml.load` → `validate()` → render pipeline with `showError()` fallback
4. Build `renderProfile()`
5. Build simplex tile renderers: `renderHeadingTile`, `renderTextTile`, `renderImageTile`
6. Build complex tile renderers: `renderLinkTile` (with Lucide icon), `renderEmbedTile`, `renderCalendarTile` (with window filtering)
7. Register all renderers in `tileRenderers`
8. Create `config.yaml` with sample content covering all tile types and a full theme block
9. Test locally by opening `index.html` via a local file server (e.g. `python -m http.server`)
10. Enable GitHub Pages and verify the deployed URL renders correctly on mobile and desktop
11. Write README with config reference

---

## Verification

- Open `index.html` via a local file server → profile + all tile types render with correct theme colours
- Edit `config.yaml` (change theme colours, add/reorder tiles) → refresh browser → changes reflected
- No build command is ever required
- Supply a malformed `config.yaml` → `showError()` renders a clear validation message on the page
- Deploy to GitHub Pages → confirm public URL renders correctly on mobile and desktop
- Confirm that updating `config.yaml` and pushing to `main` is the only step needed to update the live page
