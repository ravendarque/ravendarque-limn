# Pages

Multiple pages, one config. Each page has its own tiles and can appear in a navigation bar.

---

## Structure

```yaml
pages:
  - id: home
    title: Home
    icon: home
    tiles:
      - type: heading
        text: Welcome
      - type: text
        content: Your bio here.
  - id: links
    title: Links
    icon: link
    tiles:
      - type: linksbar
        surface: hide
        items:
          - icon: brand-github
            url: https://github.com/you
            label: GitHub
```

---

## Page fields

| Field | Required | Description |
|-------|----------|-------------|
| `id` | Yes | Unique slug for the page. Used in the URL hash (`#home`, `#links`). |
| `title` | No | Display name. Defaults to "Home" for the first page. |
| `icon` | No | [Tabler icon](https://tabler.io/icons) name. Used in nav bars. |
| `tiles` | Yes | List of [tiles](Tiles) for this page. |
| `hide-from-navbar` | No | Set to `true` to exclude this page from linksbar navigation. |

---

## Page nav tile

Add a `pagenav` tile where you want the page links to appear. It builds the nav from each page's icon, title, and visibility — no manual items list.

```yaml
- type: pagenav
  surface: hide
  showLabels: true
```

Links use each page's `id` as the hash (`#home`, `#links`). Same-page navigation, no reload. Pages with `hide-from-navbar: true` are excluded.

---

## Hidden pages

Pages with `hide-from-navbar: true` won't appear in the `pagenav` tile. Use this for pages you want to link to directly but not show in the main nav:

```yaml
- id: secret
  title: Secret page
  icon: lock
  hide-from-navbar: true
  tiles:
    - type: text
      content: Shh.
```

---

## Legacy format

A root-level `tiles` list (no `pages`) still works. It's treated as a single page with `id: home`, `title: Home`, `icon: home`. Prefer `pages` for new configs.

---

**Next:** [Tiles](Tiles) · [Config Basics](Config-Basics)
