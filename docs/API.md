# Capacity Connect REST API Specification

All backend endpoints are prefixed with `/api`. Protected endpoints require an `Authorization: Bearer <JWT_TOKEN>` header.

---

## 1. Authentication Endpoints (`/api/auth`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register a new trainee account and trigger email verification OTP. |
| `POST` | `/api/auth/login` | Public | Authenticate user via email/password and issue JWT token. |
| `POST` | `/api/auth/verify-email` | Public | Verify newly registered account using 6-digit email OTP. |
| `POST` | `/api/auth/resend-otp` | Public | Resend verification OTP (enforces 30s rate-limit cooldown). |
| `POST` | `/api/auth/send-otp` | Public | Request a 6-digit one-time password (OTP) for passwordless login. |
| `POST` | `/api/auth/verify-otp` | Public | Verify OTP code and authenticate user. |
| `POST` | `/api/auth/google` | Public | Verify Google ID token and link/create user account. |
| `POST` | `/api/auth/forgot-password` | Public | Trigger password reset OTP email. |
| `POST` | `/api/auth/reset-password` | Public | Confirm reset OTP and update account password. |
| `GET` | `/api/auth/me` | Authenticated | Retrieve authenticated user profile, stats, and role. |

---

## 2. AI & Grounded RAG Endpoints (`/api/ai`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/ai/chat` | Authenticated | Grounded multi-turn conversational AI with course RAG retrieval and intent detection. |
| `GET` | `/api/ai/practice-questions` | Authenticated | Generates topic-specific multiple-choice practice quiz questions. |
| `GET` | `/api/ai/flashcards` | Authenticated | Generates interactive concept study flashcards with front/back cues. |

---

## 3. Course & Lesson Endpoints (`/api/courses`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/courses` | Authenticated | List all active courses with filtering and pagination. |
| `GET` | `/api/courses/:id` | Authenticated | Retrieve course details including module and lesson breakdown. |
| `GET` | `/api/courses/:id/progress` | Authenticated | Get current user's lesson completion progress. |
| `POST` | `/api/courses/:id/lessons/:lessonId/complete` | Authenticated | Mark a lesson as completed and award XP. |
| `POST` | `/api/courses` | Trainer / Admin | Create a new course with syllabus structure. |
| `PUT` | `/api/courses/:id` | Trainer / Admin | Update course metadata and module curriculum. |

---

## 4. Assessment & Quiz Endpoints (`/api/assessments`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/assessments` | Authenticated | List assigned competency evaluations and quizzes. |
| `GET` | `/api/assessments/:id` | Authenticated | Fetch assessment questions and time limit. |
| `POST` | `/api/assessments/:id/submit` | Authenticated | Submit quiz answers, compute score, evaluate pass threshold (70%), and issue certificate if passed. |
| `GET` | `/api/assessments/history` | Authenticated | View historical assessment attempts and detailed score breakdowns. |

---

## 5. Skills, Competency & Capacity Radar Endpoints

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/skills/gap` | Authenticated | Calculate user-specific numeric skill gaps ($Required - Current$). |
| `GET` | `/api/competency/matrix` | Authenticated | Retrieve organization and department competency matrices. |
| `GET` | `/api/capacity-radar/overview` | Admin / Trainer | Retrieve organizational capacity index, high-risk skill gaps, and department comparison. |
| `GET` | `/api/capacity-radar/roi` | Admin | Compute training ROI metric based on cost savings and productivity gains. |

---

## 6. Certificate Verification Endpoints (`/api/certificates`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/certificates` | Authenticated | List all cryptographic certificates earned by the user. |
| `GET` | `/api/certificates/verify/:hash` | Public | Publicly verify certificate authenticity using SHA-256 hash `CC-CERT-XXXXXX`. |

---

## 7. Gamification & Knowledge Hub Endpoints

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/gamification/leaderboard` | Authenticated | Fetch department and global learner XP leaderboards. |
| `GET` | `/api/gamification/achievements`| Authenticated | List earned and locked achievement badges with streak data. |
| `GET` | `/api/knowledge/posts` | Authenticated | List peer knowledge-sharing posts with like/comment counts. |
| `POST` | `/api/knowledge/posts` | Authenticated | Publish a new technical article or question. |
