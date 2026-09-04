# Capacity Connect Database Architecture & Migrations

Capacity Connect operates on a relational **PostgreSQL** schema managed through 28 sequential migration scripts. The application also includes an automated, resilient in-memory fallback datastore for zero-downtime offline execution.

---

## 1. Migration Map (28 Production Migrations)

```
database/migrations/
├── 001_create_users.sql                   -> Core user accounts, auth hashes, roles, status
├── 002_create_roles.sql                   -> Role taxonomy (trainee, trainer, administrator)
├── 003_create_departments.sql             -> Department organization (ENG, DS, SEC, HR, PM)
├── 004_create_user_profiles.sql          -> Profile metadata, avatar, XP, streak, competency score
├── 005_create_courses.sql                -> Course catalogue, level, category, creator
├── 006_create_course_modules.sql         -> Syllabus module ordering and structure
├── 007_create_lessons.sql                -> Granular lesson text, summaries, video URLs, order
├── 008_create_resources.sql              -> File attachments, PDF references, syllabus assets
├── 009_create_course_progress.sql        -> User progress tracking and lesson completion status
├── 010_create_skills.sql                 -> Enterprise skill library with categories
├── 011_create_role_skills.sql            -> Role benchmark proficiency mappings
├── 012_create_user_skills.sql            -> User demonstrated skill scores
├── 013_create_skill_gaps.sql             -> Computed skill deficit scores (Required - Current)
├── 014_create_assessments.sql            -> Quizzes, evaluation criteria, passing thresholds
├── 015_create_questions.sql              -> Multiple-choice questions, options, explanations
├── 016_create_assessment_attempts.sql    -> User exam attempts, score, pass/fail status
├── 017_create_competencies.sql           -> Competency definitions and rubric mapping
├── 018_create_recommendations.sql        -> Automated course and skill recommendations
├── 019_create_learning_paths.sql         -> Personalized step-by-step training paths
├── 020_create_knowledge.sql              -> Knowledge hub posts, comments, likes
├── 021_create_gamification.sql           -> Badges, user awards, XP transactions ledger
├── 022_create_calendar.sql               -> Training events and webinar schedules
├── 022_create_training_sessions.sql      -> Live sessions and trainee RSVP registrations
├── 023_create_certificates.sql           -> Cryptographic certificate hashes & validation URLs
├── 024_create_notifications.sql          -> In-app system alerts and notification settings
├── 025_create_capacity_radar.sql         -> Organizational capacity index and department risks
├── 026_add_google_id_to_users.sql        -> Google OAuth 2.0 account identifier
├── 027_auth_security_enhancements.sql    -> Email verification OTPs table with SHA-256 hashes
└── 028_create_ai_conversations.sql       -> Multi-turn AI chat threads and message memory
```

---

## 2. Core Relational Entities & Schemas

### User Management & Authentication
- **`users`**: `id`, `email`, `password_hash`, `role`, `department_id`, `full_name`, `designation`, `employee_student_id`, `email_verified`, `google_id`, `status`, `last_login`, `created_at`, `updated_at`.
- **`email_verification_otps`**: `id`, `user_id`, `email`, `otp_hash` (SHA-256), `purpose`, `attempts`, `expires_at`, `verified_at`, `created_at`.
- **`user_profiles`**: `user_id` (PK/FK), `designation`, `bio`, `avatar_url`, `xp`, `streak_days`, `competency_score`, `updated_at`.

### Course & Content Architecture
- **`courses`**: `id`, `title`, `description`, `category`, `level`, `duration`, `thumbnail_url`, `created_by` (FK to users).
- **`course_modules`**: `id`, `course_id` (FK to courses), `title`, `module_order`, `description`.
- **`lessons`**: `id`, `module_id` (FK to course_modules), `title`, `content`, `summary`, `lesson_order`, `video_url`, `duration`.
- **`course_progress`**: `id`, `user_id`, `course_id`, `lesson_id`, `completed`, `completed_at`.

### Skills & Competency Matrix
- **`skills`**: `id`, `name`, `category`, `description`.
- **`role_skills`**: `id`, `role_id`, `skill_id`, `required_level` (1–5 scale).
- **`user_skills`**: `id`, `user_id`, `skill_id`, `current_level` (1–5 scale), `assessed_at`.
- **`skill_gaps`**: `id`, `user_id`, `skill_id`, `required_score`, `current_score`, `gap_score` ($Required - Current$).

### Evaluation & Cryptographic Certification
- **`assessments`**: `id`, `course_id`, `title`, `passing_score` (default 70%), `time_limit_minutes`, `difficulty`.
- **`questions`**: `id`, `assessment_id`, `question_text`, `options` (JSON), `correct_option`, `explanation`.
- **`assessment_attempts`**: `id`, `user_id`, `assessment_id`, `score`, `passed`, `completed_at`.
- **`certificates`**: `id`, `certificate_hash` (`CC-CERT-XXXXXX`), `user_id`, `course_id`, `assessment_id`, `title`, `issued_date`, `verification_url`.

### Grounded AI & Conversation Memory
- **`ai_conversations`**: `id`, `user_id`, `course_id`, `title`, `created_at`, `updated_at`.
- **`ai_messages`**: `id`, `conversation_id` (FK), `sender` (`user` or `assistant`), `content`, `sources` (JSONB citations), `intent`, `created_at`.
