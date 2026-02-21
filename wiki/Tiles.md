# Tiles

The building blocks. They show up in the order you list them.

---

## heading

Section label. No card, just text.

```yaml
- type: heading
  text: Links
```

---

## text

Body copy. One line or many.

```yaml
- type: text
  content: Some text here.
```

Multi-line — use `>` to fold:

```yaml
- type: text
  content: >
    Line one.
    Line two.
```

---

## image

A photo. URL or local file.

```yaml
- type: image
  url: https://example.com/photo.jpg
  alt: Description
```

`alt` is optional but your future self (and screen readers) will thank you.

---

## link

Single button. Icon optional.

```yaml
- type: link
  icon: brand-github
  url: https://github.com/yourname
  label: GitHub
```

`icon` = any [Tabler icon](https://tabler.io/icons). Skip it for a plain link.

---

## linksbar

Row of icon buttons. Social links, etc.

```yaml
- type: linksbar
  surface: hide
  items:
    - icon: brand-instagram
      url: https://instagram.com/you
      label: Instagram
    - icon: brand-github
      url: https://github.com/you
      label: GitHub
```

`surface: hide` strips the card background. `label` = tooltip + accessibility.

---

## embed

Vimeo, SoundCloud, or any service that provides an iframe. See [Embeds](Embeds) for step-by-step instructions per platform.

1. On the service: **Share** → **Embed**
2. Copy the `<iframe>...</iframe>` snippet
3. Paste it:

```yaml
- type: embed
  title: My video
  html: '<iframe src="..." ...></iframe>'
```

---

## calendar

Upcoming events. Full setup in [Calendar](Calendar).

```yaml
- type: calendar
  window: month
  src: https://gist.../events.ics
```

---

**Next:** [Calendar](Calendar) · [Examples](Examples)
