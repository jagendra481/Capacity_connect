-- Create Skill Gaps Table
CREATE TABLE IF NOT EXISTS skill_gaps (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    skill_id INT REFERENCES skills(id) ON DELETE CASCADE,
    required_level INT NOT NULL,
    current_level INT NOT NULL,
    gap INT NOT NULL,
    severity VARCHAR(50) NOT NULL, -- No Gap, Low, Medium, Critical
    calculated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_skill_gaps_user ON skill_gaps(user_id);
