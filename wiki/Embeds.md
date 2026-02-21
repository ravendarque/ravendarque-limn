# Embedding platforms

How to get the embed code from popular services. Same flow for all: find **Share** or **Embed**, copy the `<iframe>`, paste into your config.

---

## YouTube

1. Open the video
2. Click **Share** below the player
3. Click **Embed**
4. Copy the full `<iframe>...</iframe>` code
5. Paste into config:

```yaml
- type: embed
  title: My video
  html: '<iframe width="560" height="315" src="https://www.youtube.com/embed/VIDEO_ID" ...></iframe>'
```

---

## Spotify

**Track or album:**
1. Open the track/album on Spotify (app or web)
2. Click **⋯** (three dots) → **Share** → **Embed track** or **Embed album**
3. Copy the iframe code

**Playlist:**
1. Open the playlist
2. **⋯** → **Share** → **Embed playlist**
3. Copy the iframe code

```yaml
- type: embed
  title: My playlist
  html: '<iframe style="border-radius:12px" src="https://open.spotify.com/embed/..." ...></iframe>'
```

---

## Vimeo

1. Open the video
2. Click **Share** (paper plane icon)
3. Copy the embed code from the **Embed** tab
4. Paste into config

```yaml
- type: embed
  title: My video
  html: '<iframe src="https://player.vimeo.com/video/..." ...></iframe>'
```

---

## SoundCloud

1. Open the track
2. Click **Share**
3. Click **Embed** — choose size (e.g. Classic)
4. Copy the iframe code

```yaml
- type: embed
  title: My track
  html: '<iframe width="100%" height="166" scrolling="no" src="https://w.soundcloud.com/player/..." ...></iframe>'
```

---

## Bandcamp

1. Open the album/track
2. Scroll to the bottom — **Embed this album** or **Embed this track**
3. Copy the iframe code

```yaml
- type: embed
  title: My album
  html: '<iframe style="border: 0; width: 100%; height: 120px;" src="https://bandcamp.com/EmbeddedPlayer/..." ...></iframe>'
```

---

## Twitch

**Live stream or VOD:**
1. Go to the channel or video
2. Click **Share** below the player
3. Copy the embed code

```yaml
- type: embed
  title: Live stream
  html: '<iframe src="https://player.twitch.tv/?channel=USERNAME" ...></iframe>'
```

---

## TikTok

1. Open the video
2. Click **Share** → **Embed**
3. Copy the iframe code

```yaml
- type: embed
  title: TikTok
  html: '<iframe src="https://www.tiktok.com/embed/v2/..." ...></iframe>'
```

---

## Twitter / X

1. Open the tweet
2. Click **⋯** → **Embed post**
3. Copy the iframe code from the embed dialog

```yaml
- type: embed
  title: Tweet
  html: '<blockquote class="twitter-tweet">...</blockquote><script async src="https://platform.twitter.com/widgets.js"></script>'
```

> **Note:** Twitter embeds often use a `<blockquote>` + script, not a plain iframe. If the embed doesn't work in Limn, the service may require JavaScript that runs after load — try a different approach or link instead.

---

## Instagram

1. Open the post in a browser (instagram.com)
2. Click **⋯** → **Embed**
3. Copy the embed code

```yaml
- type: embed
  title: Instagram post
  html: '<blockquote class="instagram-media" ...></blockquote><script async src="//www.instagram.com/embed.js"></script>'
```

> **Note:** Like Twitter, Instagram embeds use blockquote + script. May not render in all contexts.

---

## CodePen

1. Open the pen
2. Click **Share** → **Embed**
3. Choose **Default** or **Result only**
4. Copy the iframe code

```yaml
- type: embed
  title: CodePen demo
  html: '<iframe src="https://codepen.io/username/embed/..." ...></iframe>'
```

---

## Figma

1. Open the file
2. **Share** → **Get link** → enable **Anyone with the link can view**
3. **⋯** (top right) → **Embed**
4. Copy the iframe code

```yaml
- type: embed
  title: Design
  html: '<iframe style="border: 1px solid rgba(0,0,0,0.1)" src="https://www.figma.com/embed?embed_host=share&url=..." ...></iframe>'
```

---

## Google Maps

1. Open [Google Maps](https://maps.google.com), find the location
2. Click **Share** → **Embed a map**
3. Copy the iframe code

```yaml
- type: embed
  title: Location
  html: '<iframe src="https://www.google.com/maps/embed?pb=..." ...></iframe>'
```

---

## Generic flow

Most platforms follow the same pattern:

1. **Share** or **⋯** (menu) → **Embed**
2. Copy the full snippet (usually `<iframe>...</iframe>`)
3. Paste as the `html` value in your config — keep the quotes

If a service uses `<blockquote>` + `<script>` instead of an iframe, it may not work — Limn renders the HTML but some scripts expect a specific environment. When in doubt, use a **link** tile instead.

---

**Next:** [Tiles](Tiles) · [Examples](Examples)
