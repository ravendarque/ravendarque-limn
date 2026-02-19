# limn

A self-hosted, no-build bio and links page. Edit one YAML file — that's it.

## Setup

1. Fork or clone this repo
2. Edit `config.yaml` with your details
3. Enable GitHub Pages: **Settings → Pages → Source: Deploy from branch → `main` / `/ (root)`**
4. Push to `main` — your page is live

No Node, no build step, no CI pipeline required.

---

## config.yaml reference

### Profile

```yaml
profile:
  name: Jane Doe              # required
  bio: Developer & designer   # optional
  image: https://...          # optional — falls back to initials if omitted or broken
```

### Theme

All values are CSS colour strings (hex, hsl, rgb, or named colours).

```yaml
theme:
  background: "#0f0f0f"   # page background          — required
  surface:    "#1a1a1a"   # tile card background      — required
  text:       "#f0f0f0"   # primary text              — required
  accent:     "#7c6aff"   # link buttons, highlights  — required
  textMuted:  "#a0a0a0"   # secondary text            — optional (default: #888)
  accentText: "#ffffff"   # text on accent surfaces   — optional (default: #fff)
  border:     "#2e2e2e"   # tile borders              — optional (default: transparent)
```

### Tiles

Tiles are rendered in the order they appear in the list.

#### heading

```yaml
- type: heading
  text: Welcome!
```

#### text

```yaml
- type: text
  content: Some body copy here.
```

#### image

```yaml
- type: image
  url: https://example.com/photo.jpg
  alt: Description of image   # optional but recommended
```

#### link

```yaml
- type: link
  url: https://github.com/yourname
  label: GitHub
  icon: github   # optional — any Lucide icon name (https://lucide.dev/icons)
```

#### embed

Paste the full `<iframe>` snippet from a service's "Share → Embed" dialog.

```yaml
- type: embed
  html: '<iframe src="https://www.youtube.com/embed/..." ...></iframe>'
  title: Optional label shown above the embed
```

Works with YouTube, Spotify, Vimeo, SoundCloud, and any other service that provides a standard iframe embed.

#### calendar

```yaml
- type: calendar
  window: week   # today | week | month
  items:
    - title: Team Standup
      start: "2026-02-19T09:00:00"
      end:   "2026-02-19T09:30:00"
      description: Daily sync       # optional
      location: Zoom                # optional
```

Items outside the window are automatically hidden. Items are sorted by start time.

---

## Local preview

Because `index.html` fetches `config.yaml` via `fetch()`, you need a local file server (not `file://`):

```bash
python -m http.server
# then open http://localhost:8000
```

Or use any static server (VS Code Live Server, `npx serve`, etc.).
