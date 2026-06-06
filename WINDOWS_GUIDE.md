# DevOpsPath — Windows PowerShell Setup & Deploy Guide

## What Went Wrong
You ran `cd cloud-devops-roadmap` in `D:\` but the folder doesn't exist there yet.
The project lives in the Arena workspace — you need to download it first, then run commands INSIDE it.

---

## PART 1 — Download & Extract the Project

### Option A: Download the ZIP (Easiest)
1. Download the `cloud-devops-roadmap.zip` from the Arena workspace files panel
2. Right-click the zip → **Extract All** → choose `C:\Users\YourName\` as destination
3. You should now have `C:\Users\YourName\cloud-devops-roadmap\`

### Option B: Copy files manually
Copy the entire `cloud-devops-roadmap` folder from Arena to anywhere on your PC.
Recommended location: `C:\Users\supreeth\cloud-devops-roadmap\`

---

## PART 2 — Open PowerShell in the Right Folder

**Method 1 (Easiest):**
1. Open Windows Explorer
2. Navigate to the `cloud-devops-roadmap` folder
3. Click the address bar → type `powershell` → press Enter
4. PowerShell opens already inside that folder ✓

**Method 2:**
```powershell
# Open PowerShell and navigate manually
cd C:\Users\supreeth\cloud-devops-roadmap

# Verify you're in the right place
dir
# You should see: package.json, src, vite.config.js etc.
```

---

## PART 3 — Install Node.js (if not installed)

Open PowerShell and check:
```powershell
node --version
```

If you see an error, download Node.js from https://nodejs.org (click "LTS" version)
After installing, **close and reopen PowerShell**, then check again.

---

## PART 4 — Install & Build (run from INSIDE project folder)

```powershell
# Make sure you're in the project folder first!
# Your prompt should show the folder name, e.g.: PS C:\Users\supreeth\cloud-devops-roadmap>

# Install dependencies
npm install

# Test the build
npm run build

# Expected output:
# ✓ built in ~300ms
```

---

## PART 5 — Create GitHub Repo & Push

```powershell
# Initialize git
git init

# Stage all files
git add .

# First commit
git commit -m "feat: DevOpsPath v4"

# Rename branch to main
git branch -M main

# Connect to GitHub — REPLACE supreeth with YOUR GitHub username
git remote add origin https://github.com/supreeth/cloud-devops-roadmap.git

# Push
git push -u origin main
```

When asked for **Username**: type your GitHub username
When asked for **Password**: paste your Personal Access Token (NOT your GitHub password)

Get a token at: https://github.com/settings/tokens → Generate new token (classic) → check `repo` → copy it

---

## PART 6 — Enable GitHub Pages

1. Go to: `https://github.com/supreeth/cloud-devops-roadmap`
2. Click **Settings** → **Pages** (left sidebar)
3. Source → **GitHub Actions** → Save
4. Go to **Actions** tab → watch "🚀 Deploy to GitHub Pages" run
5. Green ✓ = Your site is live at:
   `https://supreeth.github.io/cloud-devops-roadmap/`

---

## Every Future Update

```powershell
git add .
git commit -m "update: what changed"
git push
# Auto-deploys in ~60 seconds
```
