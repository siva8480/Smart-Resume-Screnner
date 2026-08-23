# 🚀 Smart Resume Scanner & ATS Intelligence Platform

> An AI-powered, client-side Applicant Tracking System (ATS) intelligence suite that scans resumes against job descriptions, pinpoints critical skill gaps, audits project architecture & depth, optimizes bullet points with power action verbs, and generates tailored executive summaries.

![Smart Resume Scanner Preview](https://raw.githubusercontent.com/antigravity-ai/assets/main/banner.png)

---

## ✨ Features

- **⚡ Live ATS Scanner Simulation & Keyword Highlighter**: Visualizes how ATS parsers extract skills from your resume with interactive glowing highlights.
- **🎓 Fresher & Project-Depth Intelligence Engine**: Automatically identifies student/fresher profiles and evaluates candidate potential based on full-stack project architecture, live deployment links, and GitHub repositories rather than penalizing for lack of years of experience.
- **🎯 5-Dimensional Deterministic ATS Scoring**:
  - Hard Skills Match (35%)
  - Project Depth & Technical Execution (25%) / Industry Experience Fit (20%)
  - Soft Skills & Core CS Fundamentals (15%)
  - ATS Formatting & Parseability (15%)
  - Semantic Cosine Relevancy (10%)
- **🪄 1-Click Bullet Point Optimizer**: Detects weak verbs and missing quantifiable metrics, providing 1-click in-place resume rewrites.
- **🔍 Skill Gap Matrix with Live Search**: Instant filtering across 10 skill domains (Frontend, Backend, Cloud/DevOps, AI/ML, Databases, etc.).
- **📄 Client-Side In-Browser Parsing**: Fast local parsing for PDF (`pdfjs-dist`), DOCX (`mammoth`), and raw text.
- **🌓 Deep Space Dark & Clean Slate Light Modes**: Fluid themes with custom glassmorphism and aurora glows.
- **🤖 AI Resume Tailor & Cover Letter Hook**: Generates tailored summaries, optimized bullets, interview questions, and cover letter intros with Google Gemini.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, JavaScript (ES6+ / JSX), Vite
- **Styling**: Vanilla CSS (Cyberpunk Slate tokens, glassmorphism, responsive grid)
- **Parsing**: PDF.js (`pdfjs-dist`), Mammoth.js (`mammoth`)
- **Icons & Effects**: Lucide React, Canvas Confetti
- **AI Integration**: Google Gemini API

---

## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone <YOUR_GITHUB_REPO_URL>
cd "Smart Resume Scanner"
```

### 2. Install dependencies
```bash
npm install
```

### 3. (Optional) Configure Gemini API Key
Create a `.env` file in the root directory:
```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Start development server
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 5. Build for production
```bash
npm run build
```

---

## 📄 License

MIT License © 2026
