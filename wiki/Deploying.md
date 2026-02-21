# Deploying

Step-by-step for each platform. You need either the [configurator zip](https://ravendarque.github.io/ravendarque-limn/configurator.html) or the [release zip](https://github.com/ravendarque/ravendarque-limn/releases).

---

## Deploy to Cloudflare Pages

**From a Git repo:**

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com) → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
2. Authorize GitHub and select your repo (or create one with the configurator zip contents)
3. **Build settings:** Leave empty — Limn is static, no build step
4. **Build command:** Leave empty
5. **Build output directory:** `/` (root)
6. **Save and Deploy**

Your site goes live. Edit `config.yaml` in the repo and push to update.

**From the configurator zip (no Git):**

1. **Workers & Pages** → **Create** → **Pages** → **Direct Upload**
2. Drag the unzipped folder (or run `npx wrangler pages deploy .` from the folder)
3. Done. To update, upload again or switch to Git.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/ravendarque/ravendarque-limn)

---

## Deploy to Netlify

**[Deploy to Netlify](https://app.netlify.com/start/deploy?repository=https://github.com/ravendarque/ravendarque-limn)** — deploys Limn in one click. You get a live site with the default config.

**To customize:** The button deploys the default config. To edit `config.yaml`, you need your own repo:
1. Create a new repo and upload the [configurator zip](https://ravendarque.github.io/ravendarque-limn/configurator.html) contents (or the [release zip](https://github.com/ravendarque/ravendarque-limn/releases))
2. In Netlify: **Site settings** → **Build & deploy** → **Link repository** → connect your repo
3. Edit `config.yaml` and push — Netlify redeploys automatically

**Or** use the configurator, download the zip, then drag-and-drop the folder into [Netlify Drop](https://app.netlify.com/drop). No Git needed.

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/ravendarque/ravendarque-limn)

---

## Deploy to GitHub Pages

**From a repo you own:**

1. Create a new repo (or use an existing one)
2. Upload the configurator zip contents (or release zip) and push
3. **Settings** → **Pages**
4. **Source:** Deploy from a branch
5. **Branch:** `main` (or your default) / **Folder:** `/ (root)`
6. **Save**

Your page is live at `https://yourusername.github.io/your-repo-name/`

**From the configurator zip:**

1. Create a new repo on GitHub
2. Upload all files from the zip (drag into the repo, or use Git)
3. Enable Pages as above

---

## Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New** → **Project**
2. Import your GitHub repo (or create one with the zip contents)
3. **Framework Preset:** Other (no framework)
4. **Build Command:** Leave empty
5. **Output Directory:** Leave as `.` or `/`
6. **Deploy**

Static files deploy as-is. No build needed.

---

## Deploy anywhere (static host)

Limn is just static files. Upload the folder to any host that serves HTML:

- **Cloudflare Pages** — Direct Upload
- **Netlify Drop** — drag and drop
- **Any web host** — FTP, SFTP, rsync to `public_html` or `www`
- **Your own server** — nginx, Apache, Caddy — point to the folder

No build. No Node. No database. Just files.

---

**Next:** [Getting Started](Getting-Started) · [Troubleshooting](Troubleshooting)
