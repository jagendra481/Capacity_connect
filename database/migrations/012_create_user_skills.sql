-- Create User Skills Table (Current skill levels for users)
CREATE TABLE IF NOT EXISTS user_skills (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    skill_id INT REFERENCES skills(id) ON DELETE CASCADE,
    current_level INT NOT NULL DEFAULT 50, -- Scale 0-100
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_user_skill UNIQUE(user_id, skill_id)
);

CREATE INDEX IF NOT EXISTS idx_user_skills_user ON user_skills(user_id);
