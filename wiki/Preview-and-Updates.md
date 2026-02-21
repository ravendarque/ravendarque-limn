# Preview & Updates

---

## Local preview

You can't double-click `index.html` — the page loads `config.yaml` via JavaScript, which needs a web server.

**VS Code Live Server**
1. Install "Live Server" extension
2. Right-click `index.html` → **Open with Live Server**

**Command line**
```bash
npx serve .
```
Then open `http://localhost:3000`

---

## Updating your page

1. Edit `config.yaml` (or add/replace images)
2. Commit and push
3. Page updates within a minute

---

## Updating the Limn engine

**If you use git** (e.g. you deployed from a clone or release zip and use git):

```bash
git remote add limn https://github.com/ravendarque/ravendarque-limn.git   # one-time
git fetch limn
git merge limn/main
```

Keep your `config.yaml`; accept changes to `index.html`, `tiles/`, `themes/`.

**If you used the configurator:** Download a fresh zip from the [configurator](https://ravendarque.github.io/ravendarque-limn/configurator.html), copy your `config.yaml` into it, and redeploy.

---

**Next:** [Troubleshooting](Troubleshooting) · [FAQ](FAQ)
