# 🚀 Capacity Connect — Enterprise Digital Capacity Building & Competency Intelligence Platform

**Capacity Connect** is a full-stack enterprise learning and competency management system built with **React 18**, **Node.js/Express**, **PostgreSQL**, and **Google Gemini Grounded RAG AI**.

---

## 🌟 Key Features

1. **Role-Based Portals**: Tailored workspaces for **Trainees** (Learners), **Trainers** (Instructors), and **Administrators** (Leadership).
2. **Grounded RAG AI Assistant**: AI assistant grounded in course curriculum chunks with persistent conversation memory in PostgreSQL.
3. **Capacity Radar™ & Skill Gap Engine**: Computes numeric skill deficits, department-level risk scores, and training ROI.
4. **Verifiable Cryptographic Certification**: Generates tamper-proof completion certificates with SHA-256 validation hashes.
5. **Interactive Gamification**: Streak tracking, experience points (XP), achievement badges, and leaderboards.
6. **Triple-Mode Authentication**: Secure Password Login (Bcrypt), 6-Digit Email OTPs (SHA-256), and Google OAuth 2.0.

---

## 🛠️ Technical Stack Summary

- **Frontend**: React 18, Vite 5, Tailwind CSS, Recharts, Lucide React, Axios, React Router DOM v6
- **Backend**: Node.js, Express.js (Layered MVC), Nodemailer (Gmail SMTP), Multer, Morgan, Winston logger
- **AI & RAG**: Google Gemini 1.5 / 2.0 Flash REST API, semantic passage extraction, multi-intent prompt engineering
- **Database & Security**: PostgreSQL (28 migrations) with Resilient In-Memory Datastore Fallback, JWT + RBAC, Bcrypt, SHA-256 hashing

---

## 📚 Documentation Index

- 📑 [**Technical Approach & PPT Reference**](./docs/TECHNICAL_APPROACH.md) — Presentation slide structure, speaking points, and source file traceability.
- 🏗️ [**System Architecture**](./docs/ARCHITECTURE.md) — Clean architecture diagrams, data flows, and subsystem specifications.
- 🔌 [**REST API Documentation**](./docs/API.md) — Detailed endpoint reference for all 15+ sub-routers.
- 🗄️ [**Database Architecture**](./docs/DATABASE.md) — PostgreSQL migrations and relational schema map.
- 💻 [**Development & Setup Guide**](./docs/DEVELOPMENT.md) — Setup instructions, environment variables, and build commands.

---

## ⚡ Quick Start

```bash
# 1. Start Backend Server (Port 5000)
cd backend
npm install
npm run dev

# 2. Start Frontend SPA (Port 5173)
cd frontend
npm install
npm run dev
```

Navigate to: `http://localhost:5173`
