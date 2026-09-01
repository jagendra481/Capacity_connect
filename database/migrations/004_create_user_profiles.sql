-- Create User Profiles Table
CREATE TABLE IF NOT EXISTS user_profiles (
    user_id INT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    designation VARCHAR(150),
    bio TEXT,
    avatar_url TEXT,
    xp INT DEFAULT 0,
    streak_days INT DEFAULT 0,
    competency_score INT DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
