-- Create Gamification Tables (Badges, User Badges, XP Transactions)
CREATE TABLE IF NOT EXISTS badges (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    icon VARCHAR(100) DEFAULT 'Award',
    category VARCHAR(50) DEFAULT 'Achievement',
    xp_bonus INT DEFAULT 100
);

CREATE TABLE IF NOT EXISTS user_badges (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    badge_id INT REFERENCES badges(id) ON DELETE CASCADE,
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_user_badge UNIQUE(user_id, badge_id)
);

CREATE TABLE IF NOT EXISTS xp_transactions (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    amount INT NOT NULL,
    activity_type VARCHAR(100) NOT NULL, -- LessonCompletion, QuizPass, DailyStreak, CourseMastery
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_xp_transactions_user ON xp_transactions(user_id);
