-- Create Assessments Table
CREATE TABLE IF NOT EXISTS assessments (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    passing_score INT DEFAULT 70,
    time_limit_minutes INT DEFAULT 30,
    difficulty VARCHAR(50) DEFAULT 'Intermediate', -- Beginner, Intermediate, Advanced
    skill_id INT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_assessments_category ON assessments(category);
