# Calendar

Show what's coming up. Two ways to feed it data.

---

## Option 1: ICS file (recommended)

Export from Google Calendar, Apple Calendar, Outlook — whatever spits out `.ics`. Host it somewhere public.

**Easiest: GitHub Gist**

1. Go to [gist.github.com](https://gist.github.com)
2. Create a **public** gist
3. Name the file `events.ics`
4. Paste your ICS content
5. **Create public gist**
6. Click **Raw** → copy the URL
7. Drop it in config:

```yaml
- type: calendar
  window: month
  src: https://gist.githubusercontent.com/you/abc123/raw/events.ics
```

> **Why Gist?** Edit the gist anytime to update events. No repo commits. No redeploys.

---

## Option 2: Static list

Hardcode a few events. Good for one-offs.

```yaml
- type: calendar
  window: week
  items:
    - title: Team Standup
      start: "2026-02-19T09:00:00"
      end:   "2026-02-19T09:30:00"
      description: Daily sync
      location: Zoom
```

---

## Window options

| Value | Shows events… |
|-------|---------------|
| `today` | Starting today |
| `week` | Next 7 days |
| `month` | Next 30 days |
| `year` | Next 365 days |

---

**Next:** [Tiles](Tiles) · [Troubleshooting](Troubleshooting)
