# Themes

Colours and tile shape. One line in config.

```yaml
theme: dark
```

Use any filename from `themes/` (drop the `.yaml`).

---

## Built-in themes

| Theme | Vibe |
|-------|------|
| `dark` | Default. Purple accent. |
| `scarlet` | Dark with red |
| `light` | Light mode |
| `nord` | Cool blues |
| `dracula` | Purple |
| `catppuccin` | Soft pastels |
| `gruvbox` | Warm, retro |
| `solarized` | Easy on the eyes |
| `retro` | CMYK arcade, pixel corners |
| `monokai` | Code-editor energy |
| `pink-pony-club` | Pink, playful |
| `mocha` | Warm browns |

> **Preview before you commit:** Open `themes.html` in your browser. Add `?theme=scarlet` to the URL to jump straight to one.

---

## Roll your own

Create `themes/mytheme.yaml`:

```yaml
background: "#0f0f0f"
surface:    "#1a1a1a"
text:       "#f0f0f0"
textMuted:  "#a0a0a0"
accent:     "#7c6aff"
accentText: "#ffffff"
border:     "#2e2e2e"
corners:    rounded
```

**Corner styles:** `rounded` | `square` | `clipped` | `pixel`

Then: `theme: mytheme`

---

**Next:** [Tiles](Tiles) · [Profile](Profile)
