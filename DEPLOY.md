# 🚀 Step-by-Step: Publish to GitHub & Deploy for Free

---

## Prerequisites

Install these first if you haven't:

| Tool | Download | Check |
|---|---|---|
| Git | https://git-scm.com | `git --version` |
| Node.js 18+ | https://nodejs.org | `node --version` |
| GitHub account | https://github.com | Free |

---

## PART 1 — Local Setup

### Step 1 — Clone or enter the project folder

```bash
# If you got this as a zip, unzip it first, then:
cd cloud-devops-roadmap

# Install dependencies
npm install

# Test it locally first
npm run dev
# → opens at http://localhost:5173/cloud-devops-roadmap/
```

### Step 2 — Build once to verify

```bash
npm run build
# Should say "✓ built in ~300ms" with no errors
```

---

## PART 2 — Create GitHub Repository

### Step 3 — Create repo on GitHub

1. Go to **https://github.com/new**
2. Fill in:
   - **Repository name**: `cloud-devops-roadmap` ← must match exactly
   - **Visibility**: Public (required for free GitHub Pages)
   - **Do NOT** tick "Add README" or any initializers
3. Click **Create repository**

### Step 4 — Initialize git and push

Run these commands **inside the `cloud-devops-roadmap` folder**:

```bash
# Initialize git (skip if already done)
git init

# Stage all files
git add .

# First commit
git commit -m "feat: DevOpsPath — personalized Cloud & DevOps roadmap generator"

# Set your GitHub username (replace with yours)
git remote add origin https://github.com/YOUR_USERNAME/cloud-devops-roadmap.git

# Rename branch to main (GitHub default)
git branch -M main

# Push to GitHub
git push -u origin main
```

> **If prompted for credentials:** Use your GitHub username + a Personal Access Token (not your password).
> Get a token at: https://github.com/settings/tokens → "Generate new token (classic)" → check `repo` scope.

---

## PART 3 — Enable GitHub Pages (Free Hosting)

### Step 5 — Turn on GitHub Pages

1. Go to your repo: `https://github.com/YOUR_USERNAME/cloud-devops-roadmap`
2. Click **Settings** tab (top nav)
3. Left sidebar → scroll to **Pages**
4. Under **Source**: select **GitHub Actions**
5. Click **Save**

That's it. The workflow file at `.github/workflows/deploy.yml` handles everything automatically.

### Step 6 — Watch it deploy

1. Go to the **Actions** tab in your repo
2. You'll see a workflow run called "🚀 Deploy to GitHub Pages"
3. Click it to watch live logs
4. When it shows a green ✓, your site is live!

**Your live URL will be:**
```
https://YOUR_USERNAME.github.io/cloud-devops-roadmap/
```

---

## PART 4 — Every Future Update

```bash
# Make your changes, then:
git add .
git commit -m "feat: describe what you changed"
git push

# GitHub Actions automatically rebuilds and deploys in ~60 seconds
```

---

## Troubleshooting

### ❌ "404 Not Found" on GitHub Pages

Make sure `vite.config.js` has:
```js
base: '/cloud-devops-roadmap/',
```
(It already does — don't change it unless your repo is named differently.)

### ❌ Build fails in Actions

Check the Actions tab → click the failed run → expand steps to see the error.
Most common cause: Node version. The workflow uses Node 20 which matches.

### ❌ "Permission denied" on push

Generate a Personal Access Token:
1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token → check `repo` → copy it
3. Use it as your password when git prompts

### ❌ PDF doesn't parse

The PDF must be **text-based** (not a scanned image). Most resumes exported from Word, Google Docs, or Canva work fine.

---

## Alternative: Deploy to Vercel (even faster)

If you prefer Vercel over GitHub Pages:

1. Go to **https://vercel.com** → Sign up with GitHub
2. Click **"New Project"** → Import your `cloud-devops-roadmap` repo
3. **Framework preset**: Vite
4. **Build command**: `npm run build`
5. **Output directory**: `dist`
6. Click **Deploy**

> ⚠️ For Vercel, change `vite.config.js` `base` to `'/'` instead of `'/cloud-devops-roadmap/'`

---

## Alternative: Deploy to Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build
npm run build

# Deploy (one-time setup)
netlify deploy --prod --dir=dist
```

> ⚠️ Same note: change `base: '/'` in vite.config.js for Netlify.

---

## Cost Summary

| Platform | Cost | Custom Domain | Auto-Deploy |
|---|---|---|---|
| **GitHub Pages** | **Free forever** | ✅ | ✅ (via Actions) |
| **Vercel**       | Free (hobby)    | ✅ | ✅ |
| **Netlify**      | Free (starter)  | ✅ | ✅ |

---

## File Structure Reference

```
cloud-devops-roadmap/
├── .github/workflows/deploy.yml   ← Auto-deploy workflow (don't touch)
├── src/
│   ├── components/                ← All React UI components
│   ├── data/roadmapData.js        ← All roadmap content (edit to add topics)
│   ├── utils/
│   │   ├── resumeParser.js        ← Resume analysis engine
│   │   └── db.js                  ← IndexedDB + localStorage layer
│   ├── hooks/useDB.js             ← React DB hook
│   └── App.jsx                    ← Root component
├── demo/
│   └── index.html                 ← Self-contained interactive preview
├── dist/                          ← Built output (auto-generated, don't commit)
├── vite.config.js                 ← Build config
└── package.json
```

---

*Made with ❤️ for the DevOps community*
