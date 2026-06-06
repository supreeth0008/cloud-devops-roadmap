# ⚡ DevOpsPath — Cloud & DevOps Roadmap Generator

> **The most innovative, fully personalized Cloud & DevOps roadmap tool** — Upload your resume and get a gamified, AI-powered learning path with skill radar, XP system, badges, timeline planner, and export — all running 100% in your browser.

[![Deploy to GitHub Pages](https://github.com/YOUR_USERNAME/cloud-devops-roadmap/actions/workflows/deploy.yml/badge.svg)](https://github.com/YOUR_USERNAME/cloud-devops-roadmap/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-6366f1.svg)](https://opensource.org/licenses/MIT)
[![Built with React](https://img.shields.io/badge/React-19-61dafb?logo=react)](https://react.dev)
[![Built with Vite](https://img.shields.io/badge/Vite-8-646cff?logo=vite)](https://vite.dev)

🌐 **Live Demo:** `https://YOUR_USERNAME.github.io/cloud-devops-roadmap/`

---

## ✨ What Makes This Insanely Good

| Feature | Details |
|---|---|
| 🎨 **Animated Particle Canvas** | Interactive particle system with mouse repulsion, glowing DevOps symbols & neural-net-style connections |
| 🖥️ **Terminal Loader** | Cinematic hacker-style terminal animation while your PDF is being analyzed |
| 📡 **Skill Radar Chart** | Animated SVG radar showing your exact skill coverage across 10 DevOps dimensions |
| 🎮 **XP & Leveling System** | Earn XP from your known skills, level up from "Script Kiddie" → "DevOps Legend", unlock achievement badges |
| 🏅 **Achievement Badges** | 8 unlockable badges: Container Lord, K8s Pilot, Cloud Walker, SecOps Ranger & more |
| 🤖 **AI Insight Panel** | Live-streaming personalized insights, domain shortcuts, and learning style tips |
| 📅 **Timeline Planner** | Interactive Gantt-style timeline showing week-by-week progression across all 8 phases |
| 🌙 **Dark / Light Mode** | Smooth theme toggle with CSS variable transitions |
| 🃏 **3D Tilt Cards** | Profile card has perspective tilt effect on mouse hover |
| ✅ **Topic Checklist** | Click sub-topics to mark them done and track micro-progress with animated XP bar |
| 📤 **Multi-format Export** | Download your roadmap as `.md` (GitHub-ready), `.csv` (spreadsheet), or `.json` |
| 🔥 **Confetti on Phase Complete** | Physics-based confetti fires when you complete a phase |
| 🎬 **Staggered Animations** | Every card, phase, and insight slides in with spring animations |
| 🔍 **Live Search + Filter** | Search any tool/skill instantly across all 15 topics |
| 🎯 **Learning Style Detection** | Visual / Hands-On / Reading / Video — inferred from resume content |
| 🏷️ **Scrolling Tech Tag Ticker** | Infinite-scroll marquee of DevOps technologies |
| 🔒 **100% Private** | Zero API calls. PDF parsed locally via pdfjs-dist. Nothing leaves your browser. |

---

## 🗺️ 8-Phase Roadmap Coverage

| Phase | Topics | Tools Covered |
|---|---|---|
| 🏗️ **Foundations** | Linux, Networking, Git, Python | bash, grep, awk, ssh, TCP/IP, DNS |
| 🐳 **Containers** | Docker, Kubernetes | Dockerfile, Compose, K8s, Helm, EKS |
| 🔄 **CI/CD** | Pipelines, GitOps | GitHub Actions, Argo CD, Jenkins |
| 📜 **IaC** | Terraform, Ansible | HCL, Modules, Playbooks, Roles |
| ☁️ **Cloud** | AWS, GCP, Azure | EC2, GKE, AKS, Lambda, Pub/Sub |
| 📊 **Observability** | Monitoring, Logging, Tracing | Prometheus, Grafana, Loki, Jaeger |
| 🔐 **DevSecOps** | Security, Compliance | Trivy, Vault, OPA, Falco, SAST/DAST |
| 🚀 **SRE & Advanced** | SRE, Platform Eng, Certs | Istio, eBPF, Backstage, CKA, AWS SAA |

---

## 🚀 Quick Start

```bash
# Clone
git clone https://github.com/YOUR_USERNAME/cloud-devops-roadmap.git
cd cloud-devops-roadmap

# Install
npm install

# Run dev server
npm run dev
# → http://localhost:5173/cloud-devops-roadmap/

# Build for production
npm run build
```

---

## 🌐 Deploy to GitHub Pages (60 seconds)

1. Push this repo to GitHub
2. Go to **Settings → Pages → Source → GitHub Actions**
3. Push to `main` — auto-deploys via the included workflow

```bash
git init && git add . && git commit -m "feat: init DevOpsPath"
git remote add origin https://github.com/YOUR_USERNAME/cloud-devops-roadmap.git
git push -u origin main
# Live at: https://YOUR_USERNAME.github.io/cloud-devops-roadmap/
```

---

## 🧠 Resume Parser Intelligence

The rule-based parser is surprisingly smart — no AI API needed:

```
PDF Upload
    ↓
pdfjs-dist (in-browser text extraction)
    ↓
Regex year extraction → Experience Level (junior/mid/senior)
    ↓
100+ keyword scan → Known Topics (15 topics × n keywords)
    ↓
Domain scoring → Primary domain (Backend/Frontend/Data/Security/DevOps)
    ↓
Learning style keywords → Style preference (visual/handson/reading/video)
    ↓
Education detection → Degree level
    ↓
Name heuristic → Profile name
    ↓
Personalized roadmap with status: known/partial/todo
```

---

## 📁 Project Structure

```
src/
├── components/
│   ├── UploadScreen.jsx      ← Animated hero + drag & drop
│   ├── ParticleCanvas.jsx    ← WebGL-style particle system
│   ├── TerminalLoader.jsx    ← Hacker terminal analysis animation
│   ├── RoadmapView.jsx       ← Main 4-tab dashboard
│   ├── ProfileCard.jsx       ← 3D tilt profile + stats
│   ├── SkillRadar.jsx        ← Animated SVG radar chart
│   ├── XPSystem.jsx          ← Gamified XP + badges
│   ├── RoadmapPhase.jsx      ← Collapsible phases with ring progress
│   ├── TopicDetail.jsx       ← Tabbed: path / subtopics / resources / projects
│   ├── AIInsightPanel.jsx    ← Live streaming AI insight cards
│   ├── TimelineView.jsx      ← Gantt-style timeline planner
│   ├── QuickWins.jsx         ← Priority quick-start panel
│   ├── FilterBar.jsx         ← Live search + status filter
│   ├── StudyPlanExport.jsx   ← Export to .md / .csv / .json
│   └── ThemeToggle.jsx       ← Dark / light mode switch
├── data/
│   └── roadmapData.js        ← 8 phases, 15 topics, 100+ resources
├── utils/
│   ├── resumeParser.js       ← Rule-based AI analysis engine
│   └── pdfParser.js          ← In-browser PDF extraction
├── index.css                 ← Full design system + animations
└── App.jsx
```

---

## 🏆 Certification Paths

Auto-recommended based on your resume:

- **CKA** — Certified Kubernetes Administrator
- **CKAD** — Certified Kubernetes Application Developer  
- **CKS** — Certified Kubernetes Security Specialist
- **AWS SAA** — Solutions Architect Associate
- **AWS DOP** — DevOps Engineer Professional
- **GCP DevOps** — Professional Cloud DevOps Engineer
- **AZ-104** — Azure Administrator
- **AZ-400** — Azure DevOps Engineer Expert
- **Terraform Associate** — HashiCorp
- **Vault Associate** — HashiCorp

---

## 🛠️ Tech Stack

| Tech | Version | Purpose |
|---|---|---|
| React | 19 | UI framework |
| Vite | 8 | Build tool |
| pdfjs-dist | 5 | In-browser PDF parsing |
| canvas-confetti | latest | Celebration animations |
| GitHub Actions | — | CI/CD for Pages |
| CSS Variables + Animations | — | Full design system |

---

*Made with ❤️ and a lot of ☕ for the DevOps community*
