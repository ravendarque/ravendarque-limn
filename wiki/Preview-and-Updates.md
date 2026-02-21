# Preview & Updates

---

## Local preview

You can't just double-click `index.html`. The page loads `config.yaml` via JavaScript, which needs a web server.

**VS Code Live Server**
1. Install the "Live Server" extension
2. Right-click `index.html` → **Open with Live Server**

**Command line**
```bash
npx serve .
```
Then open `http://localhost:3000`

---

## Updating your page

Edit `config.yaml` (or swap images). Commit and push. Page updates within a minute.

---

## Updating the Limn engine

**If you use git** (deployed from a clone or release zip):

```bash
git remote add limn https://github.com/ravendarque/ravendarque-limn.git   # one-time
git fetch limn
git merge limn/main
```

Keep your `config.yaml`. Accept changes to `index.html`, `tiles/`, `themes/`.

**If you used the configurator:** Download a fresh zip from the [configurator](https://ravendarque.github.io/ravendarque-limn/configurator.html), copy your `config.yaml` into it, and redeploy.

---

**Next:** [Troubleshooting](Troubleshooting) · [FAQ](FAQ)
