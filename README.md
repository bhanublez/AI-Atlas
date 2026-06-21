# 🧠 AI Knowledge Atlas

> **The visual encyclopedia of Artificial Intelligence** — every concept, every algorithm, every architecture, visually connected.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Built with TanStack Start](https://img.shields.io/badge/framework-TanStack_Start-ff4154?logo=react)](https://tanstack.com/start)
[![Status: Active](https://img.shields.io/badge/status-active-brightgreen.svg)](.)

---

<p align="center">
  <img src="public/og-image.png" alt="AI Knowledge Atlas screenshot" width="800" />
</p>

An interactive, open‑source atlas of Artificial Intelligence and Machine Learning.  
It helps students, engineers, and the curious **navigate the entire AI landscape** through beautifully designed roadmaps, a deep topic encyclopedia, an animated timeline, and a fast full‑text search – all wrapped in a modern glass UI with a live neural‑network background.

---

## ✨ Features

- **📚 30+ AI Roadmaps** – Curated learning paths from Foundations to Frontier.
- **🧩 200+ Explained Topics** – Every concept (Transformers, LoRA, Diffusion, etc.) has a detailed definition, purpose, intuition, prerequisites, and related topics.
- **🔍 Instant Search** – Search across all roadmaps, topics, and glossary (`⌘K` or button).
- **📖 Glossary** – A‑Z quick definitions for the most important terms.
- **⏳ AI Timeline** – Scroll through 80 years of AI history, from McCulloch‑Pitts (1943) to today’s multimodal agents.
- **🎨 Neural Background** – A live, interactive particle‑network backdrop that reacts to mouse movement.
- **🌐 Fully Responsive** – Fluid grids with auto‑fill, works on all screen sizes and zoom levels.
- **⚡ Performance** – Built with TanStack Start (SSR + RSC) and Framer Motion for smooth, zero‑layout‑shift interactions.
- **🔓 100% Free & Open** – No ads, no tracking, no paywalls. MIT licensed.

---

## 🧱 Tech Stack

| Category | Technology |
|----------|-------------|
| Framework | [TanStack Start](https://tanstack.com/start) (React 19, File‑based routing, Server Functions) |
| Styling | [Tailwind CSS](https://tailwindcss.com) + custom glass‑morphism utilities |
| Animations | [Framer Motion](https://framer.com/motion) |
| Background | Canvas API (custom particle system with spatial hashing) |
| Icons | [Lucide React](https://lucide.dev) |
| Search | `useMemo` + full‑text matching on all topic/roadmap data |
| Data | Static TypeScript files (`src/data/roadmaps.ts`) – no external database |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **pnpm** (recommended) or npm

### Installation

```bash
git clone https://github.com/your-username/ai-atlas.git
cd ai-atlas
pnpm install