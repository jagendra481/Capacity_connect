# Development & Setup Guide

This guide details how to configure, run, and build the **Capacity Connect** full-stack application.

---

## 1. Prerequisites

- **Node.js**: `v18.0.0` or higher
- **npm**: `v9.0.0` or higher
- **PostgreSQL**: `v14+` (Optional: The backend includes an automated in-memory datastore fallback if PostgreSQL is not active)

---

## 2. Environment Configuration

Create a `.env` file in the `backend/` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Security & JWT
JWT_SECRET=capacity_connect_super_secret_jwt_key_2026
JWT_EXPIRES_IN=7d

# Database (PostgreSQL)
DATABASE_URL=postgres://postgres:postgres@localhost:5432/capacity_connect

# AI & LLM Provider Configuration
AI_PROVIDER=gemini
AI_MODEL=gemini-2.0-flash
AI_API_KEY=your_gemini_api_key_here

# Nodemailer / Gmail SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_gmail_app_password

# Google OAuth 2.0
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

---

## 3. Quick Start Commands

### Backend Service (Port 5000)
```bash
cd backend
npm install
npm run dev
```

### Frontend Application (Port 5173)
```bash
cd frontend
npm install
npm run dev
```

---

## 4. Build & Testing

### Build Frontend for Production:
```bash
cd frontend
npm run build
```

### Run Backend Tests:
```bash
cd backend
npm test
```

---

## 5. Project Directory Map

```
Capacity_connect/
├── backend/
│   ├── src/
│   │   ├── config/          # AI, DB, and environment configurations
│   │   ├── controllers/     # HTTP endpoint handlers
│   │   ├── middleware/      # JWT auth, role validation, error handlers, multer
│   │   ├── models/          # Relational entities and memory fallback
│   │   ├── routes/          # RESTful route definitions
│   │   ├── services/        # Business logic, RAG engine, Gemini AI orchestrator
│   │   ├── utils/           # JWT signer, bcrypt, response helpers, validators
│   │   └── server.js        # Express application entrypoint
│   └── package.json
├── database/
│   ├── migrations/          # 28 production SQL schema migrations
│   └── seed/                # Seed data for departments, roles, and demo users
├── docs/
│   ├── API.md               # REST API documentation
│   ├── ARCHITECTURE.md      # System & subsystem architecture diagrams
│   ├── DATABASE.md          # PostgreSQL migrations and schema reference
│   ├── DEVELOPMENT.md       # Setup, environment, and build guide
│   └── TECHNICAL_APPROACH.md# Slide deck & PPT technical reference
├── frontend/
│   ├── src/
│   │   ├── components/      # UI components (auth, capacity radar, courses, quizzes)
│   │   ├── context/         # AuthContext, AppContext
│   │   ├── hooks/           # useAuth, useFetch, useNotifications
│   │   ├── pages/           # Trainee, Trainer, Admin, AI, and Public views
│   │   ├── routes/          # AppRoutes declarative routing & ProtectedRoute
│   │   ├── services/        # Axios API client modules
│   │   └── utils/           # Role utilities, formatters, validators
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
└── README.md
```
