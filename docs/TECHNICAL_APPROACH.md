# Technical Approach & Architecture Reference

This document provides the verified technical approach, architecture breakdown, and exact source file traceability for the **Capacity Connect** digital capacity-building and learning platform. It is formatted for direct presentation in project slide decks (PPTs), technical reviews, and system documentation.

---

## 1. Presentation Slide: Technical Approach

### Slide Visual Layout

```
+-----------------------------------------------------------------------------------------------------------------------------------------------------+
|                                                                 TECHNICAL APPROACH                                                                  |
+------------------------------------+------------------------------------+------------------------------------+--------------------------------------+
|             AI / RAG               |              Backend               |              Frontend              |         Database & Security          |
+------------------------------------+------------------------------------+------------------------------------+--------------------------------------+
| • Google Gemini (1.5 / 2.0 Flash)  | • Node.js (v18+) + Express.js      | • React.js 18 + Vite               | • PostgreSQL (28 Migrations)         |
| • Grounded RAG Retrieval Engine    | • Layered MVC / Service Arch       | • Tailwind CSS + PostCSS           | • JWT + Role-Based Access (RBAC)     |
| • Course Lesson & Module Grounding | • RESTful JSON APIs                | • Recharts Data Visualization      | • Bcryptjs Password Hashing          |
| • Multi-Intent Detection Engine    | • Nodemailer / Gmail SMTP Service  | • Lucide React Icon Library        | • SHA-256 OTP & Hash Verification    |
| • Persistent AI Memory & Chat DB   | • Multer File Upload System        | • Axios Client + JWT Interceptors  | • Google OAuth 2.0 Verification      |
| • Resilient Local Fallback Engine  | • Morgan Logging + Custom Logger   | • React Router DOM v6 (Prot Routes)| • Verifiable Cryptographic Certs     |
+------------------------------------+------------------------------------+------------------------------------+--------------------------------------+
|  Workflow: Authentication (JWT/OAuth/OTP) -> Competency Mapping & Gap Analysis -> RAG Learning -> Assessment & Quiz -> Cryptographic Certification -> Capacity Radar  |
+-----------------------------------------------------------------------------------------------------------------------------------------------------+
```

---

## 2. Pillar-by-Pillar Technical Specifications & File Mapping

### Pillar 1: AI / RAG (Retrieval-Augmented Generation)

| Feature / Technology | Implementation Details | Verified Source File(s) |
| :--- | :--- | :--- |
| **Google Gemini API** | Connects to Google Generative Language REST endpoints using `gemini-2.0-flash` and `gemini-1.5-flash` with fallback to OpenAI API. | [`backend/src/services/ai/aiProvider.js`](../backend/src/services/ai/aiProvider.js), [`backend/src/config/env.js`](../backend/src/config/env.js) |
| **Grounded RAG Retrieval** | Extracts relevant course curriculum passages, lesson text chunks, and module summaries prior to building LLM prompts to eliminate hallucinations. | [`backend/src/services/ragService.js`](../backend/src/services/ragService.js), [`backend/src/services/ai/contextService.js`](../backend/src/services/ai/contextService.js) |
| **Course Grounding** | Queries active course modules, enrolled lessons, and user competency profiles to construct context-rich system prompts. | [`backend/src/services/ai/promptService.js`](../backend/src/services/ai/promptService.js) |
| **Intent Detection** | Classifies user queries into discrete intent modes (`EXPLANATION`, `SUMMARY`, `SIMPLIFY`, `FLASHCARDS`, `PRACTICE`, `MISTAKE_EXPLANATION`, `RECOMMENDATION`). | [`backend/src/services/ai/promptService.js`](../backend/src/services/ai/promptService.js) |
| **Persistent AI Memory** | Persists conversation sessions and message turns in PostgreSQL (`ai_conversations`, `ai_messages`) with tenant ownership isolation. | [`backend/src/services/aiService.js`](../backend/src/services/aiService.js), [`database/migrations/028_create_ai_conversations.sql`](../database/migrations/028_create_ai_conversations.sql) |
| **Resilient Local Fallback** | Multi-domain rule-based intelligence engine providing offline capability for identity queries, technical Q&A, and study cards. | [`backend/src/services/ai/aiProvider.js`](../backend/src/services/ai/aiProvider.js) |

---

### Pillar 2: Backend Architecture

| Feature / Technology | Implementation Details | Verified Source File(s) |
| :--- | :--- | :--- |
| **Node.js + Express.js** | Asynchronous, non-blocking REST API server orchestrating 15+ sub-routers with centralized error middleware. | [`backend/src/server.js`](../backend/src/server.js), [`backend/package.json`](../backend/package.json) |
| **Layered MVC Architecture** | Clean architectural separation: Controllers manage HTTP requests/responses, Services execute domain logic, Models interact with the database. | [`backend/src/controllers/`](../backend/src/controllers/), [`backend/src/services/`](../backend/src/services/), [`backend/src/models/`](../backend/src/models/) |
| **RESTful JSON APIs** | Standardized JSON payload wrappers (`success`, `data`, `message`, HTTP status codes) and input validation. | [`backend/src/utils/response.js`](../backend/src/utils/response.js), [`backend/src/utils/validators.js`](../backend/src/utils/validators.js) |
| **Nodemailer SMTP Service** | Sends automated HTML verification emails and password reset OTPs via STARTTLS (port 587) with 30s rate-limiting. | [`backend/src/services/emailService.js`](../backend/src/services/emailService.js) |
| **Multer File Uploads** | Multipart form data parsing for resource attachments, avatar profile images, and certificates. | [`backend/src/middleware/uploadMiddleware.js`](../backend/src/middleware/uploadMiddleware.js) |
| **Morgan & Custom Logger** | Dev/prod HTTP request tracing and structured timestamped application event logging. | [`backend/src/utils/logger.js`](../backend/src/utils/logger.js) |

---

### Pillar 3: Frontend Architecture

| Feature / Technology | Implementation Details | Verified Source File(s) |
| :--- | :--- | :--- |
| **React.js 18 + Vite** | Single Page Application (SPA) with component-driven architecture and Vite for ultra-fast HMR and optimized asset bundling. | [`frontend/src/App.jsx`](../frontend/src/App.jsx), [`frontend/package.json`](../frontend/package.json), [`frontend/vite.config.js`](../frontend/vite.config.js) |
| **Tailwind CSS & Dark Theme** | Utility-first responsive styling with dark-mode color tokens, backdrop blur Glassmorphism, and custom brand gradients. | [`frontend/tailwind.config.js`](../frontend/tailwind.config.js), [`frontend/src/index.css`](../frontend/src/index.css) |
| **Recharts Data Visualization** | Interactive Capacity Radar charts, Skill Gap spider charts, Bar graphs, and Competency heatmaps. | [`frontend/src/components/capacity/CapacityRadarChart.jsx`](../frontend/src/components/capacity/CapacityRadarChart.jsx), [`frontend/src/components/dashboard/SkillChart.jsx`](../frontend/src/components/dashboard/SkillChart.jsx) |
| **Lucide React Icons** | Lightweight, tree-shakable SVG icon library across Trainee, Trainer, and Admin portals. | [`frontend/package.json`](../frontend/package.json) |
| **Axios HTTP Client** | Centralized Axios instance with request interceptors for Bearer JWT injection and 401 unauthenticated redirect handlers. | [`frontend/src/services/api.js`](../frontend/src/services/api.js) |
| **React Router DOM v6** | Declarative client routing with role-guarded `ProtectedRoute` wrapper (`trainee`, `trainer`, `administrator`). | [`frontend/src/routes/AppRoutes.jsx`](../frontend/src/routes/AppRoutes.jsx), [`frontend/src/components/common/ProtectedRoute.jsx`](../frontend/src/components/common/ProtectedRoute.jsx) |

---

### Pillar 4: Database & Security

| Feature / Technology | Implementation Details | Verified Source File(s) |
| :--- | :--- | :--- |
| **PostgreSQL + Resilient Datastore** | 28 production SQL migration files with connection pooling (`pg` Pool) and an automated zero-crash in-memory fallback. | [`database/migrations/`](../database/migrations/), [`backend/src/config/database.js`](../backend/src/config/database.js) |
| **JWT Authentication** | Signed JSON Web Tokens with secret key validation and expiration middleware (`authMiddleware.js`). | [`backend/src/utils/jwt.js`](../backend/src/utils/jwt.js), [`backend/src/middleware/authMiddleware.js`](../backend/src/middleware/authMiddleware.js) |
| **Role-Based Access Control (RBAC)** | Strict endpoint and route guards across 3 distinct tiers: `Trainee`, `Trainer`, and `Administrator`. | [`backend/src/middleware/roleMiddleware.js`](../backend/src/middleware/roleMiddleware.js), [`frontend/src/utils/roleUtils.js`](../frontend/src/utils/roleUtils.js) |
| **Bcryptjs Password Hashing** | Salted cryptographic password hashing with 10 salt rounds for secure credential storage. | [`backend/src/utils/password.js`](../backend/src/utils/password.js) |
| **SHA-256 Hashing for OTP Security** | 6-digit email OTPs stored only as SHA-256 hashes (`email_verification_otps`) with 5 max attempts and 10-min expiration. | [`backend/src/models/OTP.js`](../backend/src/models/OTP.js), [`database/migrations/027_auth_security_enhancements.sql`](../database/migrations/027_auth_security_enhancements.sql) |
| **Google OAuth 2.0** | Server-side identity verification via Google's `oauth2.googleapis.com/tokeninfo` API with automatic account linking. | [`backend/src/services/authService.js`](../backend/src/services/authService.js), [`frontend/src/pages/auth/Login.jsx`](../frontend/src/pages/auth/Login.jsx) |
| **Cryptographic Certificates** | Generates tamper-proof verification hashes (`CC-CERT-XXXXXX`) for public validation without requiring login. | [`backend/src/models/Certificate.js`](../backend/src/models/Certificate.js), [`frontend/src/pages/certificates/CertificateVerify.jsx`](../frontend/src/pages/certificates/CertificateVerify.jsx) |

---

## 3. End-to-End Value Stream Flowchart

$$\text{Authentication (JWT / OAuth / OTP)} \longrightarrow \text{Competency Mapping \& Skill Gaps} \longrightarrow \text{Grounded RAG Learning} \longrightarrow \text{Assessment \& Quiz Evaluations} \longrightarrow \text{Cryptographic Certification} \longrightarrow \text{Capacity Radar Analytics}$$

1. **Authentication**: Users sign in via password, email OTP, or Google OAuth into dedicated Trainee, Trainer, or Admin portals.
2. **Competency Mapping**: Compares user benchmark proficiency with role requirements to compute numeric skill gaps:
   $$\text{Skill Gap} = \text{Required Role Level} - \text{Current Assessed Level}$$
3. **Grounded RAG Learning**: Trainees consume structured lessons and interact with the AI assistant grounded in course curriculum chunks.
4. **Assessment & Evaluation**: Dynamic quiz assessments evaluate comprehension and enforce passing thresholds ($\ge 70\%$).
5. **Cryptographic Certification**: Passing assessments generates a verifiable completion certificate with an immutable SHA-256 hash.
6. **Capacity Radar Analytics**: Aggregates organizational skill distributions, department competencies, and ROI analytics for leadership.
