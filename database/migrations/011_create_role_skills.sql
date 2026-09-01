-- Create Role Skills Table (Required skill levels for roles)
CREATE TABLE IF NOT EXISTS role_skills (
    id SERIAL PRIMARY KEY,
    role VARCHAR(50) NOT NULL,
    skill_id INT REFERENCES skills(id) ON DELETE CASCADE,
    required_level INT NOT NULL, -- Scale 0-100
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_role_skills_role ON role_skills(role);
